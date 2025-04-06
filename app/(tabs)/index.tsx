import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Share, ActivityIndicator, Picker, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { Easing, FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

// Use View on web, Animated.View on native
const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

export default function HomeScreen() {
  const [ingredients, setIngredients] = useState('');
  const [diet, setDiet] = useState('');
  const [time, setTime] = useState('');
  const [style, setStyle] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('english');
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    const loadFavorites = async () => {
      const saved = await AsyncStorage.getItem('favorites');
      if (saved) setFavorites(JSON.parse(saved));
    };
    loadFavorites();
  }, []);

  const fetchRecipe = async (isRandom = false) => {
    setIsLoading(true);
    setRecipe(null);
    try {
      const response = await fetch('https://recipegenerator-api.onrender.com/generate_recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map(item => item.trim()).filter(Boolean),
          preferences: { diet, time, style, category, language, isRandom }
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Recipe received:', data);
      setRecipe(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setRecipe({ title: "Error", steps: ["Something went wrong—try again! 😓"], nutrition: { calories: 0 } });
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorite = async () => {
    if (recipe && !favorites.some(fav => fav.title === recipe.title)) {
      const newFavorites = [...favorites, recipe];
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };

  const shareRecipe = async () => {
    if (recipe) {
      try {
        const result = await Share.share({
          message: recipe.shareText,
        });
        if (result.action !== Share.sharedAction) console.log('Share dismissed');
      } catch (error) {
        console.error('Share error:', error);
      }
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'english' ? 'spanish' : 'english';
    setLanguage(newLanguage);
    if (ingredients || recipe) fetchRecipe();
  };

  const clearInput = () => {
    setIngredients('');
    setDiet('');
    setTime('');
    setStyle('');
    setCategory('');
    setRecipe(null);
  };

  const fetchRandomRecipe = () => {
    fetchRecipe(true);
  };

  const commonIngredients = [
    'arugula', 'avocado', 'bacon', 'basil', 'beans', 'beef', 'black-eyed peas', 'broccoli', 'butternut squash',
    'capers', 'carrots', 'cauliflower', 'cheese', 'chicken', 'chickpeas', 'coconut milk', 'collard greens', 'corn',
    'curry', 'dill', 'egg', 'eggplant', 'feta', 'fish', 'garlic', 'ginger', 'ham', 'honey', 'kale', 'lamb',
    'lemon', 'lentils', 'mushrooms', 'okra', 'olives', 'onion', 'parmesan', 'pasta', 'pepper', 'pork',
    'potatoes', 'quinoa', 'rice', 'rosemary', 'salmon', 'sausage', 'shrimp', 'soy sauce', 'spinach',
    'sweet potato', 'tahini', 'thyme', 'tofu', 'tomatoes', 'zucchini'
  ];

  const cookingStyles = ['asian', 'cajun', 'french', 'indian', 'latin', 'mediterranean', 'southern'];
  const foodCategories = ['dinner', 'dessert', 'breakfast', 'lunch'];

  const addSuggestion = () => {
    if (suggestion && !ingredients.includes(suggestion)) {
      const newIngredients = ingredients ? `${ingredients}, ${suggestion}` : suggestion;
      setIngredients(newIngredients);
      setSuggestion('');
      if (recipe) fetchRecipe();
    }
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.duration(800).easing(Easing.out(Easing.exp)) : undefined} style={styles.container}>
        <Text style={styles.header}>Recipe Generator (Beta) 🍳✨</Text>
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
            onValueChange={(itemValue) => { setStyle(itemValue); if (recipe) fetchRecipe(); }}
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
            onValueChange={(itemValue) => { setCategory(itemValue); if (recipe) fetchRecipe(); }}
            style={styles.picker}
          >
            <Picker.Item label={language === 'english' ? "Select category 🌟" : "Selecciona categoría 🌟"} value="" />
            {foodCategories.map((c) => (
              <Picker.Item key={c} label={c.charAt(0).toUpperCase() + c.slice(1)} value={c} />
            ))}
          </Picker>
        </AnimatedView>
        {isLoading && <ActivityIndicator size="large" color="#FF6B6B" style={styles.spinner} />}
        <AnimatedView entering={Platform.OS !== 'web' ? FadeInUp.delay(600).duration(600) : undefined} style={styles.buttonRow}>
          <Button
            title={isLoading ? (language === 'english' ? "Cooking... 🍳🔥" : "Cocinando... 🍳🔥") : (language === 'english' ? "Generate Recipe 🎉" : "Generar Receta 🎉")}
            onPress={() => fetchRecipe(false)}
            disabled={isLoading}
            color="#FF3D00"
          />
          <Button
            title={language === 'english' ? "Random Recipe 🎲✨" : "Receta Aleatoria 🎲✨"}
            onPress={fetchRandomRecipe}
            disabled={isLoading}
            color="#FF00A0"
          />
          <Button title={language === 'english' ? "Clear 🧹" : "Limpiar 🧹"} onPress={clearInput} color="#4ECDC4" />
          <Button title={language === 'english' ? "Spanish 🌍" : "English 🌍"} onPress={toggleLanguage} color="#FFD93D" />
        </AnimatedView>
        {recipe && recipe.title === "Error" && (
          <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.duration(800) : undefined}>
            <Text style={styles.error}>{recipe.steps[0]}</Text>
          </AnimatedView>
        )}
        {recipe && recipe.title !== "Error" && (
          <AnimatedView entering={Platform.OS !== 'web' ? FadeInDown.duration(800) : undefined} style={styles.recipeContainer}>
            <Text style={styles.title}>🎉 {recipe.title} 🎉</Text>
            <Text style={styles.subtitle}>🥕 {language === 'english' ? 'Ingredients 🌟' : 'Ingredientes 🌟'}</Text>
            {recipe.ingredients.map((item, index) => (
              <Text key={index} style={styles.listItem}>🍴 {item}</Text>
            ))}
            <Text style={styles.subtitle}>📝 {language === 'english' ? 'Steps 🍳' : 'Pasos 🍳'}</Text>
            {recipe.steps.map((step, index) => (
              <Text key={index} style={styles.listItem}>🔹 {index + 1}. {step}</Text>
            ))}
            <Text style={styles.subtitle}>🍎 {language === 'english' ? 'Nutrition (per serving) 🥗' : 'Nutrición (por porción) 🥗'}</Text>
            <Text style={styles.nutrition}>⚡ {language === 'english' ? 'Calories' : 'Calorías'}: {recipe.nutrition.calories} kcal</Text>
            <Text style={styles.nutrition}>💪 {language === 'english' ? 'Protein' : 'Proteína'}: {recipe.nutrition.protein}g</Text>
            <Text style={styles.nutrition}>🧀 {language === 'english' ? 'Fat' : 'Grasa'}: {recipe.nutrition.fat}g</Text>
            <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.delay(200).duration(600) : undefined} style={styles.recipeButtons}>
              <Button title={language === 'english' ? "Save to Favorites ⭐" : "Guardar en Favoritos ⭐"} onPress={saveFavorite} color="#FFD93D" />
              <Button title={language === 'english' ? "Share Recipe 📤" : "Compartir Receta 📤"} onPress={shareRecipe} color="#6AB04C" />
            </AnimatedView>
          </AnimatedView>
        )}
        {favorites.length > 0 && (
          <AnimatedView entering={Platform.OS !== 'web' ? FadeInDown.duration(800) : undefined} style={styles.favorites}>
            <Text style={styles.subtitle}>⭐ {language === 'english' ? 'Favorites 💖' : 'Favoritos 💖'}</Text>
            {favorites.map((fav, index) => (
              <Text key={index} style={styles.favItem}>🌟 {fav.title}</Text>
            ))}
          </AnimatedView>
        )}
      </AnimatedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', // Soft pink gradient
    flexGrow: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    padding: 35,
    gap: 25,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    marginVertical: 25,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 40,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 15,
  },
  inputSection: {
    gap: 20,
    backgroundColor: '#FFF7F7',
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
  spinner: {
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  recipeContainer: {
    marginTop: 30,
    padding: 30,
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#FF6B6B',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Georgia',
    fontWeight: '700',
    color: '#D32F2F',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Arial',
    fontWeight: '600',
    color: '#4A4A4A',
    marginTop: 20,
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B6B',
    paddingBottom: 6,
  },
  listItem: {
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#555',
    lineHeight: 28,
    marginVertical: 5,
  },
  nutrition: {
    fontSize: 15,
    fontFamily: 'Arial',
    color: '#777',
    lineHeight: 26,
    fontStyle: 'italic',
    marginVertical: 3,
  },
  recipeButtons: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    marginTop: 25,
    flexWrap: 'wrap',
  },
  favorites: {
    marginTop: 30,
    padding: 30,
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#4ECDC4',
  },
  favItem: {
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#555',
    lineHeight: 28,
    marginVertical: 5,
  },
  error: {
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
});