// app/privacy-policy.tsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function PrivacyPolicy() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Privacy Policy</Text>
        <Text style={styles.section}>
          Last Updated: April 07, 2025
        </Text>
        <Text style={styles.paragraph}>
          Welcome to Recipe Generator! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our application.
        </Text>
        <Text style={styles.subheader}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          - **User-Provided Data**: We collect ingredients and preferences you enter to generate recipes.
          - **Favorites**: Recipes you save are stored locally on your device via AsyncStorage.
          - **Usage Data**: We may collect anonymized usage statistics to improve the app.
        </Text>
        <Text style={styles.subheader}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          - To generate personalized recipes based on your inputs.
          - To store your favorite recipes locally for easy access.
          - To enhance app functionality and user experience.
        </Text>
        <Text style={styles.subheader}>3. Data Sharing</Text>
        <Text style={styles.paragraph}>
          We do not share your personal data with third parties, except:
          - **Amazon Affiliate Links**: Clicking affiliate links may share referral data with Amazon, as noted in our Affiliate Section.
        </Text>
        <Text style={styles.subheader}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          Your data is stored locally on your device. We use reasonable measures to protect it, but no method is 100% secure.
        </Text>
        <Text style={styles.subheader}>5. Contact Us</Text>
        <Text style={styles.paragraph}>
          Questions? Email us at [bshoemak@mac.com].
        </Text>
        <Link href="/" style={styles.backLink}>
          Back to Home
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEE2E2',
  },
  content: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A4A4A',
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 10,
  },
  backLink: {
    fontSize: 16,
    color: '#1DA1F2',
    textAlign: 'center',
    marginTop: 20,
  },
});