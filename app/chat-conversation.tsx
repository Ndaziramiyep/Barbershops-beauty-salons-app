import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../src/theme/colors';

interface Message {
  id: number;
  text?: string;
  time: string;
  isMe: boolean;
  type: 'text' | 'voice' | 'image';
  duration?: string;
}

export default function ChatConversationScreen() {
  const router = useRouter();
  const { contactName, contactId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        type: 'text'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleVoiceCall = () => {
    router.push(`/voice-call?contactName=${encodeURIComponent(contactName as string || 'Angela Young')}`);
  };

  const handleVideoCall = () => {
    router.push(`/video-call?contactName=${encodeURIComponent(contactName as string || 'Angela Young')}`);
  };

  const handleImagePicker = () => {
    Alert.alert('Select Image', 'Choose image source', [
      { text: 'Camera', onPress: () => console.log('Camera selected') },
      { text: 'Gallery', onPress: () => console.log('Gallery selected') },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const handleFilePicker = () => {
    Alert.alert('File Picker', 'Select file to share', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Select', onPress: () => console.log('File picker opened') }
    ]);
  };

  const handleVoiceRecord = () => {
    Alert.alert('Voice Recording', 'Hold to record voice message', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Record', onPress: () => console.log('Voice recording started') }
    ]);
  };

  const handleLocation = () => {
    Alert.alert('Share Location', 'Share your current location?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: () => console.log('Location shared') }
    ]);
  };

  const renderMessage = (msg: Message) => {
    if (msg.type === 'voice') {
      return (
        <View key={msg.id} style={[styles.messageContainer, msg.isMe ? styles.myMessage : styles.otherMessage]}>
          {!msg.isMe && (
            <Image 
              source={require('../assets/images/specialist-profile1.jpg')} 
              style={styles.messageAvatar} 
            />
          )}
          <View style={[styles.messageBubble, msg.isMe ? styles.myBubble : styles.otherBubble]}>
            <View style={styles.voiceMessage}>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={16} color="#fff" />
              </TouchableOpacity>
              <View style={styles.waveform}>
                {[...Array(20)].map((_, i) => (
                  <View key={i} style={[styles.waveBar, { height: Math.random() * 20 + 5 }]} />
                ))}
              </View>
              <Text style={[styles.voiceDuration, { color: '#666' }]}>
                {msg.duration}
              </Text>
            </View>
            <Text style={[styles.messageTime, msg.isMe ? styles.myMessageTime : styles.otherMessageTime]}>
              {msg.time}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View key={msg.id} style={[styles.messageContainer, msg.isMe ? styles.myMessage : styles.otherMessage]}>
        {!msg.isMe && (
          <Image 
            source={require('../assets/images/specialist-profile1.jpg')} 
            style={styles.messageAvatar} 
          />
        )}
        <View style={[styles.messageBubble, msg.isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, msg.isMe ? styles.myMessageText : styles.otherMessageText]}>
            {msg.text}
          </Text>
          <Text style={[styles.messageTime, msg.isMe ? styles.myMessageTime : styles.otherMessageTime]}>
            {msg.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.contactName}>{contactName || 'Angela Young'}</Text>
          <Text style={styles.onlineStatus}>Online</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleVoiceCall} style={styles.headerButton}>
            <Ionicons name="call" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleVideoCall} style={styles.headerButton}>
            <Ionicons name="videocam" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer} 
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIcon}>
              <Ionicons name="chatbubble-outline" size={60} color="#e0e0e0" />
            </View>
            <Text style={styles.emptyStateText}>No Messages yet</Text>
          </View>
        ) : (
          messages.map(renderMessage)
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={() => setMessage('')} style={styles.inputButton}>
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Write a message"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={handleImagePicker} style={styles.actionButton}>
            <Ionicons name="image" size={24} color="#666" />
            <Text style={styles.actionText}>Image</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleFilePicker} style={styles.actionButton}>
            <Ionicons name="document" size={24} color="#666" />
            <Text style={styles.actionText}>File</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleVoiceRecord} style={styles.actionButton}>
            <Ionicons name="mic" size={24} color="#666" />
            <Text style={styles.actionText}>Record</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleLocation} style={styles.actionButton}>
            <Ionicons name="location" size={24} color="#666" />
            <Text style={styles.actionText}>Location</Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  onlineStatus: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 2,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 8,
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#999',
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 150,
  },
  playButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 20,
  },
  waveBar: {
    width: 2,
    backgroundColor: '#6366f1',
    marginHorizontal: 1,
    borderRadius: 1,
  },
  voiceDuration: {
    fontSize: 12,
    marginLeft: 8,
  },
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  inputButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    padding: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
  },
});