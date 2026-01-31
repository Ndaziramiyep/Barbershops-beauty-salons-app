import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../src/theme/colors';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "What is Flo Cutters?",
    answer: "Flo Cutters is a premium barbershop and beauty salon booking platform that connects you with top-rated professionals in your area."
  },
  {
    id: 2,
    question: "How much does this cost?",
    answer: "We provide highest services without the highest price. A moderate price allows us to provide the best services at a reasonable cost. Our lower price allows you to enjoy it more often! Prices for services are subject to consultation."
  },
  {
    id: 3,
    question: "Do you accept paypal?",
    answer: "Yes, we accept PayPal along with all major credit cards and digital payment methods for your convenience."
  },
  {
    id: 4,
    question: "Where are you located?",
    answer: "We have multiple locations across the city. You can find our nearest salon using the location feature in the app."
  },
  {
    id: 5,
    question: "Can I just come in or do I have to make an appointment?",
    answer: "While walk-ins are welcome based on availability, we highly recommend booking an appointment through our app to guarantee your preferred time slot and stylist."
  }
];

export default function FAQsScreen() {
  const [expandedId, setExpandedId] = useState<number | null>(2);
  const router = useRouter();

  const toggleExpanded = (id: number) => {
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
        {faqs.map((faq) => (
          <View key={faq.id} style={styles.faqItem}>
            <TouchableOpacity 
              style={styles.questionContainer}
              onPress={() => toggleExpanded(faq.id)}
            >
              <Text style={styles.question}>{faq.question}</Text>
              <Ionicons 
                name={expandedId === faq.id ? "remove" : "add"} 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
            
            {expandedId === faq.id && (
              <Text style={styles.answer}>{faq.answer}</Text>
            )}
          </View>
        ))}
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
});