// app/(tabs)/InputSection.tsx
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'; // Ensure Button is imported
import { Picker } from '@react-native-picker/picker';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Platform } from 'react-native';

// ... rest of the code
const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

interface InputSectionProps {
  ingredients: string;
  setIngredients: (value: string) => void;
  diet: string;
  setDiet: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  style: string;
  setStyle: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  language: string;
  suggestion: string;
  setSuggestion: (value: string) => void;
  addSuggestion: () => void;
  fetchRecipe: () => void;
}

const commonIngredients = [
  'arugula', 'avocado', 'bacon', 'basil', 'beans', 'beef', 'black-eyed peas', 'broccoli', 'butternut squash',
  'capers', 'carrots', 'cauliflower', 'cheese', 'chicken', 'chickpeas', 'coconut milk', 'collard greens', 'corn',
  'curry', 'dill', 'egg', 'eggplant', 'feta', 'fish', 'garlic', 'ginger', 'ham', 'honey', 'kale', 'lamb',
  'lemon', 'lentils', 'mushrooms', 'okra', 'olives', 'onion', 'parmesan', 'pasta', 'pepper', 'pork',
  'potatoes', 'quinoa', 'rice', 'rosemary', 'salmon', 'sausage', 'shrimp', 'soy sauce', 'spinach',
  'sweet potato', 'tahini', 'thyme', 'tofu', 'tomatoes', 'zucchini', 'almonds', 'apple', 'asparagus',
  'banana', 'blueberries', 'bread', 'butter', 'cabbage', 'celery', 'chili', 'chocolate', 'cilantro',
  'cinnamon', 'cream', 'cucumber', 'flour', 'lime', 'milk', 'mint', 'nutmeg', 'oats', 'olive oil',
  'orange', 'paprika', 'parsley', 'peanuts', 'pear', 'peas', 'pineapple', 'pumpkin', 'sage', 'salt',
  'sugar', 'turmeric', 'vanilla', 'vinegar', 'walnuts', 'yogurt', 'broth', 'sesame oil', 'cumin',
  'red pepper flakes', 'sour cream', 'tortillas', 'baking powder', 'white wine', 'garam masala',
  'artichoke', 'barley', 'beets', 'black beans', 'brussels sprouts', 'cardamom', 'cashews', 'cheddar',
  'cloves', 'cod', 'cranberries', 'dates', 'duck', 'fennel', 'goat cheese', 'green beans', 'hazelnuts',
  'jalapeno', 'kiwi', 'mango', 'maple syrup', 'mozzarella', 'mustard', 'pecans', 'pesto', 'pinto beans',
  'plum', 'pomegranate', 'radish', 'red onion', 'red wine', 'ricotta', 'saffron', 'scallions', 'shallots',
  'squid', 'strawberries', 'sunflower seeds', 'swiss chard', 'tarragon', 'tilapia', 'trout', 'turnip',
  'watermelon', 'whole wheat flour', 'yeast', 'anchovies', 'apricot', 'balsamic vinegar', 'bay leaves',
  'bok choy', 'brown sugar', 'cantaloupe', 'caraway', 'caviar', 'cherry', 'chives', 'cocoa', 'coffee',
  'coriander', 'couscous', 'crab', 'cream cheese', 'edamame', 'fig', 'grapefruit', 'grapes', 'horseradish',
  'leek', 'lobster', 'macadamia nuts', 'mussels', 'oregano', 'oyster', 'passion fruit', 'persimmon',
  'pistachios', 'portobello', 'raspberries', 'rhubarb', 'rye', 'sesame seeds', 'sorrel', 'soybeans',
  'star anise', 'sweet corn', 'tamari', 'tangerine', 'tempeh', 'truffle', 'venison', 'wild rice'
];

const cookingStyles = ['asian', 'cajun', 'french', 'indian', 'latin', 'mediterranean', 'southern'];
const foodCategories = ['dinner', 'dessert', 'breakfast', 'lunch'];

export const InputSection: React.FC<InputSectionProps> = ({
  ingredients, setIngredients, diet, setDiet, time, setTime,
  style, setStyle, category, setCategory, language,
  suggestion, setSuggestion, addSuggestion, fetchRecipe
}) => {
  return (
    <AnimatedView entering={Platform.OS !== 'web' ? FadeInDown.delay(200).duration(600) : undefined} style={styles.inputSection}>
      <Text style={styles.label}>📋 {language === 'english' ? 'Ingredients 🥕' : 'Ingredientes 🥕'}</Text>
      <TextInput
        style={styles.input}
        placeholder={language === 'english' ? 'e.g., chicken, rice 🍗🍚' : 'p.ej., pollo, arroz 🍗🍚'}
        value={ingredients}
        onChangeText={setIngredients}
        placeholderTextColor="#A0A0A0"
      />
      <View style={styles.suggestionRow}>
        <Picker
          selectedValue={suggestion}
          onValueChange={(itemValue) => setSuggestion(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label={language === 'english' ? "Select ingredient 🌟" : "Selecciona ingrediente 🌟"} value="" />
          {commonIngredients.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
        <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.delay(400).duration(600) : undefined}>
          <Button title={language === 'english' ? "Add ➕" : "Añadir ➕"} onPress={addSuggestion} color="#FF6B6B" />
        </AnimatedView>
      </View>
      <Text style={styles.label}>🌿 {language === 'english' ? 'Diet 🍽️' : 'Dieta 🍽️'}</Text>
      <TextInput
        style={styles.input}
        placeholder={language === 'english' ? 'e.g., vegan, gluten-free 🌱' : 'p.ej., vegano, sin gluten 🌱'}
        value={diet}
        onChangeText={setDiet}
        placeholderTextColor="#A0A0A0"
      />
      <Text style={styles.label}>⏰ {language === 'english' ? 'Time ⏳' : 'Tiempo ⏳'}</Text>
      <TextInput
        style={styles.input}
        placeholder={language === 'english' ? 'e.g., quick ⚡' : 'p.ej., rápido ⚡'}
        value={time}
        onChangeText={setTime}
        placeholderTextColor="#A0A0A0"
      />
      <Text style={styles.label}>🌍 {language === 'english' ? 'Style 🌎' : 'Estilo 🌎'}</Text>
      <Picker
        selectedValue={style}
        onValueChange={(itemValue) => { setStyle(itemValue); if (ingredients) fetchRecipe(); }}
        style={styles.picker}
      >
        <Picker.Item label={language === 'english' ? "Select style 🌟" : "Selecciona estilo 🌟"} value="" />
        {cookingStyles.map((s) => (
          <Picker.Item key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} value={s} />
        ))}
      </Picker>
      <Text style={styles.label}>🍽️ {language === 'english' ? 'Category 🕒' : 'Categoría 🕒'}</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => { setCategory(itemValue); if (ingredients) fetchRecipe(); }}
        style={styles.picker}
      >
        <Picker.Item label={language === 'english' ? "Select category 🌟" : "Selecciona categoría 🌟"} value="" />
        {foodCategories.map((c) => (
          <Picker.Item key={c} label={c.charAt(0).toUpperCase() + c.slice(1)} value={c} />
        ))}
      </Picker>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  inputSection: {
    gap: 20,
    backgroundColor: 'rgba(255, 247, 247, 0.95)',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 20,
    fontFamily: 'Arial',
    color: '#4A4A4A',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  input: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Arial',
    backgroundColor: '#FFFFFF',
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionRow: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  picker: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    fontFamily: 'Arial',
  },
});