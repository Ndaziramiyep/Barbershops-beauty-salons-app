import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';
import io, { Socket } from 'socket.io-client';

export interface CallData {
  callId: string;
  callerId: string;
  receiverId: string;
  type: 'voice' | 'video';
  status: 'ringing' | 'connected' | 'ended';
}

class CallService {
  private socket: Socket | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  private readonly iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    this.socket = io('ws://10.0.2.2:5000', {
      transports: ['websocket'],
    });

    this.socket.on('incoming-call', this.handleIncomingCall);
    this.socket.on('call-answered', this.handleCallAnswered);
    this.socket.on('ice-candidate', this.handleIceCandidate);
    this.socket.on('call-ended', this.handleCallEnded);
  }

  async initializeCall(receiverId: string, type: 'voice' | 'video'): Promise<string> {
    const callId = `call_${Date.now()}`;
    
    await this.setupLocalStream(type === 'video');
    await this.createPeerConnection();
    
    const offer = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(offer);
    
    this.socket?.emit('initiate-call', {
      callId,
      receiverId,
      type,
      offer,
    });
    
    return callId;
  }

  async answerCall(callId: string, offer: RTCSessionDescription, type: 'voice' | 'video') {
    await this.setupLocalStream(type === 'video');
    await this.createPeerConnection();
    
    await this.peerConnection!.setRemoteDescription(offer);
    const answer = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(answer);
    
    this.socket?.emit('answer-call', { callId, answer });
  }

  private async setupLocalStream(includeVideo: boolean) {
    const constraints = {
      audio: true,
      video: includeVideo ? { facingMode: 'user' } : false,
    };
    
    this.localStream = await mediaDevices.getUserMedia(constraints);
  }

  private async createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });
    
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket?.emit('ice-candidate', event.candidate);
      }
    };
    
    this.peerConnection.onaddstream = (event) => {
      this.remoteStream = event.stream;
    };
    
    if (this.localStream) {
      this.peerConnection.addStream(this.localStream);
    }
  }

  private handleIncomingCall = (data: any) => {
    // Handle incoming call UI
  };

  private handleCallAnswered = async (data: any) => {
    await this.peerConnection?.setRemoteDescription(data.answer);
  };

  private handleIceCandidate = async (candidate: RTCIceCandidate) => {
    await this.peerConnection?.addIceCandidate(candidate);
  };

  private handleCallEnded = () => {
    this.endCall();
  };

  endCall() {
    this.localStream?.getTracks().forEach(track => track.stop());
    this.peerConnection?.close();
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream() {
    return this.remoteStream;
  }
}

export const callService = new CallService();