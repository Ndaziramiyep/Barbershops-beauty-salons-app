import { useState, useEffect, useCallback } from 'react';
import { callService, CallData } from '../services/callService';
import { Alert } from 'react-native';

export const useCall = () => {
  const [currentCall, setCurrentCall] = useState<CallData | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);

  const initiateCall = useCallback(async (
    receiverId: string, 
    type: 'voice' | 'video',
    receiverName: string
  ) => {
    try {
      const callId = await callService.initializeCall(receiverId, type);
      
      const callData: CallData = {
        callId,
        callerId: 'current_user_id', // Replace with actual user ID
        receiverId,
        type,
        status: 'ringing',
      };
      
      setCurrentCall(callData);
      setIsCallActive(true);
    } catch (error) {
      Alert.alert('Call Failed', 'Unable to initiate call');
    }
  }, []);

  const answerCall = useCallback(async (call: CallData, offer: any) => {
    try {
      await callService.answerCall(call.callId, offer, call.type);
      setCurrentCall({ ...call, status: 'connected' });
      setIsCallActive(true);
      setIncomingCall(null);
    } catch (error) {
      Alert.alert('Call Failed', 'Unable to answer call');
    }
  }, []);

  const endCall = useCallback(() => {
    callService.endCall();
    setCurrentCall(null);
    setIsCallActive(false);
    setIncomingCall(null);
  }, []);

  const rejectCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  return {
    currentCall,
    isCallActive,
    incomingCall,
    initiateCall,
    answerCall,
    endCall,
    rejectCall,
  };
};