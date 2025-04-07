// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import Animated, { Easing, FadeIn, FadeInUp } from 'react-native-reanimated';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InputSection } from './InputSection';
import { RecipeCard } from './RecipeCard';
import { AffiliateSection } from './AffiliateSection';
import { FavoritesList } from './FavoritesList';
import { styles } from './styles';

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
  const [lastRandom, setLastRandom] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [search, setSearch] = useState('');

  const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.API_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    const loadFavorites = async () => {
      const saved = await AsyncStorage.getItem('favorites');
      if (saved) setFavorites(JSON.parse(saved));
    };
    loadFavorites();
  }, []);

  const fetchRecipe = async (isRandom = false) => {
    if (!ingredients.trim() && !isRandom) {
      setRecipe({ title: "Error", steps: ["Please enter ingredients or use Random Recipe!"], nutrition: { calories: 0 } });
      setIsLoading(false);
      setLastRandom(isRandom);
      return;
    }

    setIsLoading(true);
    setRecipe(null);
    setLastRandom(isRandom);
    const url = `${API_URL}/generate_recipe`;
    const requestBody = JSON.stringify({
      ingredients: ingredients.split(',').map(item => item.trim()).filter(Boolean).slice(0, 10),
      preferences: { diet, time, style, category, language, isRandom }
    });
    console.log("Sending request to:", url, "Body:", requestBody);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });
      console.log("Response status:", response.status, "OK:", response.ok);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log("Response data:", data);
      setRecipe(data);
    } catch (error) {
      console.error("Fetch error:", error);
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
    setLastRandom(false);
    setSelectedFavorite(null);
    setSearch('');
  };

  const fetchRandomRecipe = () => fetchRecipe(true);

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
    setSelectedFavorite(null);
    setSearch('');
  };

  const viewFavorite = (fav) => setSelectedFavorite(fav);

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
        <View style={styles.trustSection}>
          <Text style={styles.trustText}>🔒 Secure & Safe</Text>
          <Text style={styles.trustText}>🥗 Trusted by Foodies</Text>
          <Text style={styles.trustText}>⭐ 100% Free to Use</Text>
        </View>
        <InputSection
          ingredients={ingredients}
          setIngredients={setIngredients}
          diet={diet}
          setDiet={setDiet}
          time={time}
          setTime={setTime}
          style={style}
          setStyle={setStyle}
          category={category}
          setCategory={setCategory}
          language={language}
          suggestion={suggestion}
          setSuggestion={setSuggestion}
          addSuggestion={addSuggestion}
          fetchRecipe={fetchRecipe}
        />
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
          <Button
            title={language === 'english' ? showFavorites ? "Hide Favorites ⭐" : "View Favorites ⭐" : showFavorites ? "Ocultar Favoritos ⭐" : "Ver Favoritos ⭐"}
            onPress={toggleFavorites}
            color="#4ECDC4"
          />
        </AnimatedView>
        {recipe && recipe.title === "Error" && (
          <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.duration(800) : undefined} style={styles.errorContainer}>
            <Text style={styles.error}>{recipe.steps[0]}</Text>
            <Button title={language === 'english' ? "Retry 🔄" : "Reintentar 🔄"} onPress={() => fetchRecipe(lastRandom)} color="#FF3D00" />
          </AnimatedView>
        )}
        {recipe && recipe.title !== "Error" && !selectedFavorite && (
          <RecipeCard
            recipe={recipe}
            language={language}
            onShare={shareRecipe}
            onSave={saveFavorite}
          />
        )}
        {showFavorites && favorites.length > 0 && (
          <FavoritesList
            favorites={favorites}
            setFavorites={setFavorites}
            language={language}
            search={search}
            setSearch={setSearch}
            setSelectedFavorite={setSelectedFavorite}
          />
        )}
        {selectedFavorite && (
          <RecipeCard
            recipe={selectedFavorite}
            language={language}
            onShare={shareRecipe}
            onBack={() => setSelectedFavorite(null)}
          />
        )}
        <AffiliateSection />
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Recipe Generator |{' '}
            <Text
              style={styles.footerLink}
              onPress={() => Linking.openURL('https://www.privacypolicygenerator.info/live.php?token=YOUR_TOKEN_HERE')}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
      </AnimatedView>
    </ScrollView>
  );
}