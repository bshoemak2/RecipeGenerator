// app/(tabs)/AffiliateSection.tsx
import React from 'react';
import { View, Text, Image, Linking } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Platform } from 'react-native';
import { styles } from './styles';

const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

export const AffiliateSection: React.FC = () => {
  const affiliateProducts = [
    {
      name: "Lodge Pre-Seasoned Cast Iron Skillet Set",
      link: "https://amzn.to/42zaZHa",
      images: [
        "https://m.media-amazon.com/images/I/91-bSlTybdL._AC_SX425_.jpg",
        "https://m.media-amazon.com/images/I/51w8oI1xRsL._AC_US100_.jpg"
      ]
    },
    {
      name: "Stellar Beef Tallow - 100% Grass-Fed",
      link: "https://amzn.to/4iXFCvN",
      images: [
        "https://m.media-amazon.com/images/I/715PHrGnHrL._SX522_.jpg",
        "https://m.media-amazon.com/images/I/81QJwKpXptL._SX522_.jpg"
      ]
    },
    {
      name: "Ninja 7-in-1 Outdoor Electric Grill & Smoker",
      link: "https://amzn.to/4i3DmBI",
      images: [
        "https://m.media-amazon.com/images/I/91Lm7+MY5aL._AC_SX425_.jpg",
        "https://m.media-amazon.com/images/I/91s8yBkMYDL._AC_SL1500_.jpg"
      ]
    },
    {
      name: "9 Piece Natural Teak Wooden Kitchen Utensil Set",
      link: "https://amzn.to/4ciEVum",
      images: [
        "https://m.media-amazon.com/images/I/91+rTbXu9fL._AC_SX425_.jpg",
        "https://m.media-amazon.com/images/I/81NI7w6hWiL._AC_SX425_.jpg"
      ]
    }
  ];

  return (
    <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.duration(800) : undefined} style={styles.affiliateSection}>
      <Text style={styles.affiliateHeader}>Recommended Products</Text>
      {affiliateProducts.map((product: any, index: number) => (
        <View key={index} style={styles.affiliateContainer}>
          <Text
            style={styles.affiliateLink}
            onPress={() => Linking.openURL(product.link)}
          >
            {product.name}
          </Text>
          <View style={styles.affiliateImages}>
            {product.images.map((img: string, imgIndex: number) => (
              <Image
                key={imgIndex}
                source={{ uri: img }}
                style={styles.affiliateImage}
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