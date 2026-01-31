import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../src/theme/colors';
import { faqService, FAQ } from '../src/services/faqService';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function FAQsScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const data = await faqService.getAllFAQs();
      setFaqs(data);
      if (data.length > 1) {
        setExpandedId(data[1]._id); // Expand second FAQ by default
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
      // Fallback to static data if API fails
      const fallbackFAQs = [
        {
          _id: '1',
          question: "What is Flo Cutters?",
          answer: "Flo Cutters is a premium barbershop and beauty salon booking platform that connects you with top-rated professionals in your area.",
          order: 1,
          isActive: true
        },
        {
          _id: '2',
          question: "How much does this cost?",
          answer: "We provide highest services without the highest price. A moderate price allows us to provide the best services at a reasonable cost. Our lower price allows you to enjoy it more often! Prices for services are subject to consultation.",
          order: 2,
          isActive: true
        }
      ];
      setFaqs(fallbackFAQs);
      setExpandedId('2');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>FAQs</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          faqs.map((faq) => (
            <View key={faq._id} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.questionContainer}
                onPress={() => toggleExpanded(faq._id)}
              >
                <Text style={styles.question}>{faq.question}</Text>
                <Ionicons 
                  name={expandedId === faq._id ? "remove" : "add"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
              
              {expandedId === faq._id && (
                <Text style={styles.answer}>{faq.answer}</Text>
              )}
            </View>
          ))
        )}}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 16,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginRight: 12,
  },
  answer: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
});