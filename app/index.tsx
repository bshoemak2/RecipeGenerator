// app/index.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, ActivityIndicator, Platform, Share, Linking, Image, TouchableOpacity } from 'react-native';
import Animated, { Easing, FadeIn, FadeInUp } from 'react-native-reanimated';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { InputSection } from './components/InputSection';
import { RecipeCard } from './components/RecipeCard';
import { AffiliateSection } from './components/AffiliateSection';
import { FavoritesList } from './FavoritesList';
import { styles } from './_styles';
import * as Clipboard from 'expo-clipboard';

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
  const [copied, setCopied] = useState(false);

  const API_URL = 'https://recipegenerator-api.onrender.com';

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem('favorites');
        if (saved) setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
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
    console.log('Starting fetch to:', url);
    console.log('Request body:', requestBody);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log('Raw response data:', data);
      // Ensure ingredients are a flat, sorted array
      if (data.ingredients && Array.isArray(data.ingredients)) {
        data.ingredients = data.ingredients.flat().sort((a, b) => a.localeCompare(b));
        console.log('Sorted ingredients:', data.ingredients);
      } else {
        console.warn('Ingredients not an array:', data.ingredients);
        data.ingredients = [];
      }
      setRecipe(data);
    } catch (error) {
      console.error('Fetch error:', error.message);
      setRecipe({ title: "Error", steps: [`Fetch failed: ${error.message}`], nutrition: { calories: 0 } });
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorite = async () => {
    if (recipe && !favorites.some(fav => fav.title === recipe.title)) {
      const newFavorites = [...favorites, recipe];
      setFavorites(newFavorites);
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  };

  const shareRecipe = async (platform = 'default') => {
    const currentRecipe = selectedFavorite || recipe;
    if (!currentRecipe) return;

    const shareText = currentRecipe.shareText || `${currentRecipe.title}\n${currentRecipe.ingredients.join('\n')}\n${currentRecipe.steps.join('\n')}`;
    const url = 'https://recipegenerator-frontend.onrender.com/';
    const fullMessage = `${shareText}\nCheck out my app: ${url}`;

    try {
      if (platform === 'facebook') {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}"e=${encodeURIComponent(shareText)}`;
        Platform.OS === 'web' ? window.open(fbUrl, '_blank') : await Linking.openURL(fbUrl);
      } else if (platform === 'x') {
        const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullMessage)}`;
        Platform.OS === 'web' ? window.open(xUrl, '_blank') : await Linking.openURL(xUrl);
      } else if (platform === 'whatsapp') {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
        Platform.OS === 'web' ? window.open(waUrl, '_blank') : await Linking.openURL(waUrl);
      } else if (platform === 'email') {
        const emailUrl = `mailto:?subject=${encodeURIComponent('Check out this recipe!')}&body=${encodeURIComponent(fullMessage)}`;
        Platform.OS === 'web' ? window.open(emailUrl, '_blank') : await Linking.openURL(emailUrl);
      } else {
        const result = await Share.share({ message: fullMessage });
        if (result.action !== Share.sharedAction) console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const copyToClipboard = async () => {
    const currentRecipe = selectedFavorite || recipe;
    if (!currentRecipe) return;

    const textToCopy = `${currentRecipe.title}\n\nIngredients:\n${currentRecipe.ingredients.join('\n')}\n\nSteps:\n${currentRecipe.steps.join('\n')}\n\nCalories: ${currentRecipe.nutrition.calories}`;
    try {
      await Clipboard.setStringAsync(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Clipboard error:', error);
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
        <Text style={styles.header}>Recipe Maker: Home-Cooked Comfort 🍳✨ (Beta) 🍳✨</Text>
        <View style={styles.trustSection}>
          <Text style={styles.trustText}>🔒 Secure & Safe</Text>
          <Text style={styles.trustText}>🥗 Trusted by Foodies</Text>
          <Text style={styles.trustText}>⭐ Crafted with Care</Text>
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
        {isLoading && (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.spinnerText}>Waking up the recipe generator with gentle spankings</Text>
          </View>
        )}
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
            extraButton={<TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Text style={styles.copyButtonText}>{copied ? 'Copied!' : 'Copy Recipe'}</Text>
            </TouchableOpacity>}
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
            extraButton={<TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Text style={styles.copyButtonText}>{copied ? 'Copied!' : 'Copy Recipe'}</Text>
            </TouchableOpacity>}
          />
        )}
        <AffiliateSection />
        <View style={styles.footer}>
          <Image source={require('../assets/gt.png')} style={{ width: 80, height: 80, marginRight: 10 }} />
          <Text style={styles.footerText}>
            © 2025 Recipe Generator |{' '}
            <Link href="/privacy-policy" style={styles.footerLink}>
              View Our Privacy Policy Here
            </Link>
            {'\n'}For issues and questions, contact us at{' '}
            <Text style={styles.footerLink} onPress={() => Linking.openURL('mailto:bshoemak@mac.com')}>
              bshoemak@mac.com
            </Text>
          </Text>
        </View>
      </AnimatedView>
    </ScrollView>
  );
}