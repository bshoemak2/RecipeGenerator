// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Share, ActivityIndicator, Platform, Linking, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { Easing, FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';

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

  const removeFavorite = async (title) => {
    if (confirm(language === 'english' ? `Remove ${title} from favorites?` : `¿Eliminar ${title} de favoritos?`)) {
      const newFavorites = favorites.filter(fav => fav.title !== title);
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      if (selectedFavorite && selectedFavorite.title === title) setSelectedFavorite(null);
    }
  };

  const shareRecipe = async (platform = 'default') => {
    const currentRecipe = selectedFavorite || recipe;
    if (!currentRecipe) return;

    const shareText = currentRecipe.shareText;
    const url = 'https://recipegenerator-ort9.onrender.com/';
    const fullMessage = `${shareText}\nCheck out my app: ${url}`;

    try {
      if (platform === 'facebook') {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`; // Fixed "e=" to "quote="
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
        const result = await Share.share({
          message: fullMessage,
        });
        if (result.action !== Share.sharedAction) console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Share error:', error);
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

  const fetchRandomRecipe = () => {
    fetchRecipe(true);
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
    setSelectedFavorite(null);
    setSearch('');
  };

  const viewFavorite = (fav) => {
    setSelectedFavorite(fav);
  };

  const clearSearch = () => {
    setSearch('');
  };

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

  const addSuggestion = () => {
    if (suggestion && !ingredients.includes(suggestion)) {
      const newIngredients = ingredients ? `${ingredients}, ${suggestion}` : suggestion;
      setIngredients(newIngredients);
      setSuggestion('');
      if (recipe) fetchRecipe();
    }
  };

  const filteredFavorites = favorites.filter(fav => fav.title.toLowerCase().includes(search.toLowerCase()));

  // Affiliate product data
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
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.duration(800).easing(Easing.out(Easing.exp)) : undefined} style={styles.container}>
        <Text style={styles.header}>Recipe Generator (Beta) 🍳✨</Text>
        <View style={styles.trustSection}>
          <Text style={styles.trustText}>🔒 Secure & Safe</Text>
          <Text style={styles.trustText}>🥗 Trusted by Foodies</Text>
          <Text style={styles.trustText}>⭐ 100% Free to Use</Text>
        </View>
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
          <AnimatedView entering={Platform.OS !== 'web' ? FadeInDown.duration(800) : undefined} style={[styles.recipeContainer, styles.recipeCard]}>
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
              <Button title={language === 'english' ? "Share 📤" : "Compartir 📤"} onPress={() => shareRecipe('default')} color="#6AB04C" />
              <Button title="X" onPress={() => shareRecipe('x')} color="#1DA1F2" />
              <Button title="FB" onPress={() => shareRecipe('facebook')} color="#4267B2" />
              <Button title="WA" onPress={() => shareRecipe('whatsapp')} color="#25D366" />
              <Button title="Email" onPress={() => shareRecipe('email')} color="#666666" />
            </AnimatedView>
          </AnimatedView>
        )}
        {showFavorites && favorites.length > 0 && (
          <AnimatedView entering={Platform.OS !== 'web' ? FadeInDown.duration(800).springify() : undefined} style={styles.favorites}>
            <Text style={styles.subtitle}>⭐ {language === 'english' ? 'Favorites 💖' : 'Favoritos 💖'}</Text>
            <View style={styles.searchRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={language === 'english' ? 'Search favorites...' : 'Buscar favoritos...'}
                value={search}
                onChangeText={setSearch}
                placeholderTextColor="#A0A0A0"
              />
              <Button title="✖" onPress={clearSearch} color="#FF3B30" />
            </View>
            {filteredFavorites.map((fav, index) => (
              <View key={index} style={styles.favItemContainer}>
                <Text
                  style={[styles.favItem, Platform.OS === 'web' ? styles.favItemHover : null]}
                  onPress={() => viewFavorite(fav)}
                >
                  🌟 {fav.title}
                </Text>
                <Button title={language === 'english' ? "Remove ❌" : "Eliminar ❌"} onPress={() => removeFavorite(fav.title)} color="#FF3B30" />
              </View>
            ))}
          </AnimatedView>
        )}
        {selectedFavorite && (
          <AnimatedView entering={Platform.OS !== 'web' ? FadeInDown.duration(800) : undefined} style={[styles.recipeContainer, styles.recipeCard]}>
            <Text style={styles.title}>🎉 {selectedFavorite.title} 🎉</Text>
            <Text style={styles.subtitle}>🥕 {language === 'english' ? 'Ingredients 🌟' : 'Ingredientes 🌟'}</Text>
            {selectedFavorite.ingredients.map((item, index) => (
              <Text key={index} style={styles.listItem}>🍴 {item}</Text>
            ))}
            <Text style={styles.subtitle}>📝 {language === 'english' ? 'Steps 🍳' : 'Pasos 🍳'}</Text>
            {selectedFavorite.steps.map((step, index) => (
              <Text key={index} style={styles.listItem}>🔹 {index + 1}. {step}</Text>
            ))}
            <Text style={styles.subtitle}>🍎 {language === 'english' ? 'Nutrition (per serving) 🥗' : 'Nutrición (por porción) 🥗'}</Text>
            <Text style={styles.nutrition}>⚡ {language === 'english' ? 'Calories' : 'Calorías'}: {selectedFavorite.nutrition.calories} kcal</Text>
            <Text style={styles.nutrition}>💪 {language === 'english' ? 'Protein' : 'Proteína'}: {selectedFavorite.nutrition.protein}g</Text>
            <Text style={styles.nutrition}>🧀 {language === 'english' ? 'Fat' : 'Grasa'}: {selectedFavorite.nutrition.fat}g</Text>
            <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.delay(200).duration(600) : undefined} style={styles.recipeButtons}>
              <Button title={language === 'english' ? "Share 📤" : "Compartir 📤"} onPress={() => shareRecipe('default')} color="#6AB04C" />
              <Button title="X" onPress={() => shareRecipe('x')} color="#1DA1F2" />
              <Button title="FB" onPress={() => shareRecipe('facebook')} color="#4267B2" />
              <Button title="WA" onPress={() => shareRecipe('whatsapp')} color="#25D366" />
              <Button title="Email" onPress={() => shareRecipe('email')} color="#666666" />
              <Button title={language === 'english' ? "Back to Favorites 🔙" : "Volver a Favoritos 🔙"} onPress={() => setSelectedFavorite(null)} color="#4ECDC4" />
            </AnimatedView>
          </AnimatedView>
        )}
        {/* Affiliate Products Section - Always at the bottom */}
        <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.duration(800) : undefined} style={styles.affiliateSection}>
          <Text style={styles.affiliateHeader}>Recommended Products</Text>
          {affiliateProducts.map((product, index) => (
            <View key={index} style={styles.affiliateContainer}>
              <Text
                style={styles.affiliateLink}
                onPress={() => Linking.openURL(product.link)}
              >
                {product.name}
              </Text>
              <View style={styles.affiliateImages}>
                {product.images.map((img, imgIndex) => (
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
        {/* Footer with Privacy Policy */}
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

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', // Note: Linear gradient not directly supported, use CSS on web
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
    marginBottom: 10,
  },
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  trustText: {
    fontSize: 14,
    fontFamily: 'Arial',
    color: '#4A4A4A',
    fontWeight: '500',
  },
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
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
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
  recipeCard: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  errorContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF3B30',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
    gap: 10,
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
  favItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  favItem: {
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#555',
    lineHeight: 28,
    marginVertical: 5,
  },
  favItemHover: {
    cursor: 'pointer', // Web-only hover effect
  },
  error: {
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  affiliateSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  affiliateHeader: {
    fontSize: 20,
    fontFamily: 'Arial',
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 10,
    textAlign: 'center',
  },
  affiliateContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  affiliateLink: {
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#1DA1F2',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  affiliateImages: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  affiliateImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  affiliateDisclaimer: {
    fontSize: 12,
    fontFamily: 'Arial',
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Arial',
    color: '#777',
  },
  footerLink: {
    color: '#1DA1F2',
    textDecorationLine: 'underline',
  },
});