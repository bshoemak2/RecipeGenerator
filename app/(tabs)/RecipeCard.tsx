// app/(tabs)/RecipeCard.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native'; // Ensure View is imported
import Animated, { FadeInDown } from 'react-native-reanimated';

interface RecipeCardProps {
  recipe: any;
  language: string;
  onShare: (platform: string) => void;
  onSave?: () => void;
  onBack?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, language, onShare, onSave, onBack }) => {
  return (
    <Animated.View entering={FadeInDown.duration(800)} style={[styles.container, styles.recipeCard]}>
      <Text style={styles.title}>🎉 {recipe.title} 🎉</Text>
      <Text style={styles.subtitle}>🥕 {language === 'english' ? 'Ingredients 🌟' : 'Ingredientes 🌟'}</Text>
      {recipe.ingredients && recipe.ingredients.length > 0 ? (
        recipe.ingredients.map((ingredient: string, index: number) => (
          <Text key={index} style={styles.listItem}>🍴 {ingredient}</Text>
        ))
      ) : (
        <Text style={styles.listItem}>{language === 'english' ? 'No ingredients listed' : 'Sin ingredientes listados'}</Text>
      )}
      <Text style={styles.subtitle}>📝 {language === 'english' ? 'Steps 🍳' : 'Pasos 🍳'}</Text>
      {recipe.steps && recipe.steps.length > 0 ? (
        recipe.steps.map((step: string, index: number) => (
          <Text key={index} style={styles.listItem}>🔹 {index + 1}. {step}</Text>
        ))
      ) : (
        <Text style={styles.listItem}>{language === 'english' ? 'No steps provided' : 'Sin pasos proporcionados'}</Text>
      )}
      <Text style={styles.subtitle}>🍎 {language === 'english' ? 'Nutrition (per serving) 🥗' : 'Nutrición (por porción) 🥗'}</Text>
      <Text style={styles.nutrition}>⚡ {language === 'english' ? 'Calories' : 'Calorías'}: {recipe.nutrition?.calories || 0} kcal</Text>
      <Text style={styles.nutrition}>💪 {language === 'english' ? 'Protein' : 'Proteína'}: {recipe.nutrition?.protein || 0}g</Text>
      <Text style={styles.nutrition}>🧀 {language === 'english' ? 'Fat' : 'Grasa'}: {recipe.nutrition?.fat || 0}g</Text>
      <Text style={styles.subtitle}>ℹ️ {language === 'english' ? 'Details' : 'Detalles'}</Text>
      <Text style={styles.detail}>⏰ Cooking Time: {recipe.cooking_time || 'N/A'} min</Text>
      <Text style={styles.detail}>🎯 Difficulty: {recipe.difficulty || 'N/A'}</Text>
      <Text style={styles.detail}>🍽️ Servings: {recipe.servings || 'N/A'}</Text>
      <Text style={styles.detail}>🛠️ Equipment: {recipe.equipment ? recipe.equipment.join(', ') : 'N/A'}</Text>
      <Text style={styles.detail}>💡 Tip: {recipe.tips || 'No tips available'}</Text>
      <View style={styles.buttonRow}>
        {onSave && <Button title={language === 'english' ? "Save ⭐" : "Guardar ⭐"} onPress={onSave} color="#FFD93D" />}
        <Button title={language === 'english' ? "Share 📤" : "Compartir 📤"} onPress={() => onShare('default')} color="#6AB04C" />
        <Button title="X" onPress={() => onShare('x')} color="#1DA1F2" />
        <Button title="FB" onPress={() => onShare('facebook')} color="#4267B2" />
        <Button title="WA" onPress={() => onShare('whatsapp')} color="#25D366" />
        <Button title="Email" onPress={() => onShare('email')} color="#666666" />
        {onBack && <Button title={language === 'english' ? "Back 🔙" : "Volver 🔙"} onPress={onBack} color="#4ECDC4" />}
      </View>
    </Animated.View>
  );
};