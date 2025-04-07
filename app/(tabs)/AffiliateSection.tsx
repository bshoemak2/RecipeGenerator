// C:\Users\bshoe\OneDrive\Desktop\game_theory\cooking\RecipeGenerator\app\(tabs)\AffiliateSection.tsx
// app/(tabs)/InputSection.tsx
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'; // Ensure View is imported
import { Picker } from '@react-native-picker/picker';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Platform } from 'react-native';

const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

// ... rest of the code

export const AffiliateSection: React.FC = () => {
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