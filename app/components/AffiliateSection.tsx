// app/components/AffiliateSection.tsx
import React from 'react';
import { View, Text, Image, Linking } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Platform } from 'react-native';
import { styles } from '../_styles';
import { affiliateProducts } from '../_data';

const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

export const AffiliateSection: React.FC = () => {
  return (
    <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.duration(800) : undefined} style={styles.affiliateSection}>
      <Text style={styles.affiliateHeader}>Recommended Products</Text>
      {affiliateProducts.map((product: any, index: number) => (
        <View key={index} style={styles.affiliateContainer}>
          <Text
            style={styles.affiliateLinkLarge}
            onPress={() => Linking.openURL(product.link)}
          >
            {product.name}
          </Text>
          <View style={styles.affiliateImages}>
            {product.images.map((img: string, imgIndex: number) => (
              <Image
                key={imgIndex}
                source={{ uri: img }}
                resizeMode="contain"
                style={styles.affiliateImageLarge}
              />
            ))}
          </View>
        </View>
      ))}
      <Text style={styles.affiliateDisclaimer}>
        As an Amazon Associate, I earn from qualifying purchases.
      </Text>
    </AnimatedView>
  );
};

export default AffiliateSection;