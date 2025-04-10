// app/index.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, ActivityIndicator, Platform, Share, Linking, Image, TouchableOpacity, Picker } from 'react-native';
import Animated, { Easing, FadeIn, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import { FavoritesList } from './FavoritesList';
import { styles } from './_styles';
import * as Clipboard from 'expo-clipboard';

const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

export default function HomeScreen() {
  const [meat, setMeat] = useState('');
  const [vegetable, setVegetable] = useState('');
  const [fruit, setFruit] = useState('');
  const [seafood, setSeafood] = useState('');
  const [dairy, setDairy] = useState('');
  const [carb, setCarb] = useState('');
  const [devilWater, setDevilWater] = useState('');
  const [style, setStyle] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('english');
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [lastRandom, setLastRandom] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const API_URL = 'https://recipegenerator-api.onrender.com';

  const INGREDIENT_CATEGORIES = {
    meat: ["ground beef", "chicken", "pork", "lamb", "pichana", "churrasco", "ribeye steaks"],
    vegetables: ["carrot", "broccoli", "onion", "potato"],
    fruits: ["apple", "banana", "lemon", "orange"],
    seafood: ["salmon", "shrimp", "cod", "tuna", "yellowtail snapper", "grouper", "red snapper", "oysters", "lobster"],
    dairy: ["cheese", "milk", "butter", "yogurt", "eggs"],
    carbs: ["bread", "pasta", "rice", "tortilla"],
    devilWater: ["beer", "moonshine", "whiskey", "vodka", "tequila"]
  };

  const AFFILIATE_LINKS = [
    {
      title: "🍔 Bubba’s Burger Smasher 🍔",
      url: "https://www.amazon.com/Burger-Press-Non-Stick-Hamburger-Griddle/dp/B08J4K9L2P?tag=yourtag-20",
      image: "https://m.media-amazon.com/images/I/71xK2jL2K2L._AC_SL1500_.jpg"
    },
    {
      title: "🥃 Hillbilly Moonshine Maker 🥃",
      url: "https://www.amazon.com/Moonshine-Still-Distillery-Distilling-Equipment/dp/B07Z8J9K7L?tag=yourtag-20",
      image: "https://m.media-amazon.com/images/I/61yP8N8P8NL._AC_SL1500_.jpg"
    },
    {
      title: "🔪 Granny’s Hog-Slicin’ Knife 🔪",
      url: "https://www.amazon.com/Kitchen-Knife-Set-Stainless-Steel/dp/B09J8K9M2P?tag=yourtag-20",
      image: "https://m.media-amazon.com/images/I/81zQ8N8N8NL._AC_SL1500_.jpg"
    },
    {
      title: "🍺 Redneck Beer Pong Kit 🍺",
      url: "https://www.amazon.com/Beer-Pong-Table-Portable-Drinking/dp/B07K9M8N2P?tag=yourtag-20",
      image: "https://m.media-amazon.com/images/I/71aP9N9P9NL._AC_SL1500_.jpg"
    }
  ];

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem('favorites');
        if (saved) setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favorites—blame the possum:', error);
      }
    };
    loadFavorites();
  }, []);

  const fetchRecipe = async (isRandom = false) => {
    const selectedIngredients = [meat, vegetable, fruit, seafood, dairy, carb, devilWater].filter(Boolean);
    if (!selectedIngredients.length && !isRandom) {
      setRecipe({ title: "Error 🤦‍♂️", steps: ["Pick somethin’, ya lazy bum! 😛"], nutrition: { calories: 0 } });
      setIsLoading(false);
      setLastRandom(isRandom);
      return;
    }
    setIsLoading(true);
    setRecipe(null);
    setLastRandom(isRandom);
    const url = `${API_URL}/generate_recipe`;
    const requestBody = JSON.stringify({
      ingredients: selectedIngredients,
      preferences: { style, category, language, isRandom }
    });
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });
      if (!response.ok) throw new Error(`API farted: ${response.status} 💨`);
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      setRecipe({ title: "Epic Fail 🚨", steps: [`Cookin’ crashed: ${error.message} 🤡`], nutrition: { calories: 0 } });
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
        console.error('Error hoardin’ yer stash:', error);
      }
    }
  };

  const shareRecipe = async (platform = 'default') => {
    const currentRecipe = selectedFavorite || recipe;
    if (!currentRecipe) return;
    const shareText = currentRecipe.shareText || `${currentRecipe.title}\n${currentRecipe.ingredients.join('\n')}\n${currentRecipe.steps.join('\n')}`;
    const url = 'https://recipegenerator-frontend.onrender.com/';
    const fullMessage = `Get a load of this hogwash: ${shareText}\nCheck out my app: ${url} 🤠`;
    try {
      if (platform === 'default') {
        await Share.share({ message: fullMessage });
      } else if (platform === 'twitter') {
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullMessage)}`;
        Linking.openURL(tweetUrl);
      } else if (platform === 'more') {
        await Share.share({ message: fullMessage });
      }
    } catch (error) {
      console.error('Share flopped—too spicy for the interwebs:', error);
    }
  };

  const copyToClipboard = async () => {
    const currentRecipe = selectedFavorite || recipe;
    if (!currentRecipe) return;
    const textToCopy = `${currentRecipe.title}\n\nIngredients:\n${currentRecipe.ingredients.join('\n')}\n\nSteps:\n${currentRecipe.steps.join('\n')}`;
    try {
      await Clipboard.setStringAsync(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Clipboard error—fingers too greasy:', error);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'english' ? 'spanish' : 'english';
    setLanguage(newLanguage);
    if (meat || vegetable || fruit || seafood || dairy || carb || devilWater || recipe) fetchRecipe();
  };

  const clearInput = () => {
    setMeat('');
    setVegetable('');
    setFruit('');
    setSeafood('');
    setDairy('');
    setCarb('');
    setDevilWater('');
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

  const AffiliateSection = () => (
    <View style={styles.affiliateSection}>
      <Text style={styles.affiliateHeader}>💰 Git Yer Loot Here, Y’all! 💸</Text>
      {AFFILIATE_LINKS.map((link, index) => (
        <TouchableOpacity key={index} style={styles.affiliateButton} onPress={() => Linking.openURL(link.url)}>
          <Image source={{ uri: link.image }} style={styles.affiliateImage} />
          <Text style={styles.affiliateText}>{link.title}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.affiliateDisclaimer}>As an Amazon Associate, I earn from qualifyin’ purchases, yeehaw!</Text>
    </View>
  );

  const RecipeCard = ({ recipe, language, onShare, onSave, onBack, extraButton }) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeTitle}>{recipe.title} 🎉</Text>
      <View style={styles.recipeSectionContainer}>
        <Text style={styles.recipeSection}>🥄 Gear Up, Y’all! 🛠️</Text>
        <Text style={styles.recipeContent}>{recipe.equipment.join(' | ')}</Text>
      </View>
      <View style={styles.recipeSectionContainer}>
        <Text style={styles.recipeSection}>🍖 Grub Pile 🍗</Text>
        {recipe.ingredients.map((item, index) => (
          <Text key={index} style={styles.recipeItem}>🔸 {item}</Text>
        ))}
      </View>
      <View style={styles.recipeSectionContainer}>
        <Text style={styles.recipeSection}>🍳 Cookin’ Chaos 🍲</Text>
        {recipe.steps.map((step, index) => (
          <Text key={index} style={styles.recipeItem}>🔹 {step}</Text>
        ))}
      </View>
      <View style={styles.recipeSectionContainer}>
        <Text style={styles.recipeSection}>🍎 Fuel Yer Gut 🥗</Text>
        <Text style={styles.recipeContent}>⚡ Calories: {recipe.nutrition.calories} kcal</Text>
        <Text style={styles.recipeContent}>💪 Protein: {recipe.nutrition.protein || 0}g</Text>
        <Text style={styles.recipeContent}>🧀 Fat: {recipe.nutrition.fat || 0}g</Text>
      </View>
      <View style={styles.recipeSectionContainer}>
        <Text style={styles.recipeSection}>ℹ️ Lowdown</Text>
        <Text style={styles.recipeContent}>⏰ Time: {recipe.cooking_time}</Text>
        <Text style={styles.recipeContent}>🎯 Difficulty: {recipe.difficulty}</Text>
        <Text style={styles.recipeContent}>🍽️ Servings: {recipe.servings}</Text>
        <Text style={styles.recipeContent}>💡 Tip: {recipe.tips}</Text>
      </View>
      <View style={styles.recipeActions}>
        <TouchableOpacity style={[styles.copyButton, { backgroundColor: '#FF69B4', borderColor: '#FFD700' }]} onPress={copyToClipboard}>
          <Text style={[styles.copyButtonText, { color: '#FFF' }]}>{copied ? 'Snagged It! 🎯' : 'Copy to Clipboard 📋'}</Text>
        </TouchableOpacity>
        <Button title="🐦 X Holler" onPress={() => onShare('twitter')} color="#1DA1F2" /> {/* Twitter Blue */}
        <Button title="📣 Share to Pals" onPress={() => onShare('default')} color="#FF6B6B" />
        <Button title="📲 More Ways to Brag" onPress={() => onShare('more')} color="#32CD32" />
        {onSave && <Button title="💾 Hoard This Gem" onPress={onSave} color="#4ECDC4" />}
        {onBack && <Button title="⬅️ Back to the Heap" onPress={onBack} color="#FFD93D" />}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.duration(800).easing(Easing.out(Easing.exp)) : undefined} style={styles.container}>
        <Text style={styles.header}>🤪 Chuckle & Chow: Recipe Rumble 🍔💥</Text>
        <Text style={styles.subheader}>Cookin’ Up Chaos for Rednecks, Rebels, and Rascals! 🎸🔥</Text>
        <View style={styles.trustSection}>
          <Text style={styles.trustText}>🌶️ Hotter than a jalapeño’s armpit</Text>
          <Text style={styles.trustText}>🍺 Best with a cold one, yeehaw!</Text>
          <Text style={styles.trustText}>🐷 Crazier than a hog on a hot tin roof</Text>
        </View>
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { backgroundColor: '#FF4500', color: '#FFD700' }]}>🥩 Meaty Madness 🍖</Text>
          <Picker
            selectedValue={meat}
            onValueChange={(itemValue) => setMeat(itemValue)}
            style={[styles.picker, { backgroundColor: '#FF6347', borderColor: '#FFD700' }]}
          >
            <Picker.Item label="None" value="" color="#FFF" />
            {INGREDIENT_CATEGORIES.meat.map(item => (
              <Picker.Item key={item} label={`${item === "ground beef" ? "Moo Mash" : item} 🐄`} value={item} color="#FFF" />
            ))}
          </Picker>
          <Text style={[styles.inputLabel, { backgroundColor: '#32CD32', color: '#FFF' }]}>🥕 Veggie Varmints 🌽</Text>
          <Picker
            selectedValue={vegetable}
            onValueChange={(itemValue) => setVegetable(itemValue)}
            style={[styles.picker, { backgroundColor: '#228B22', borderColor: '#ADFF2F' }]}
          >
            <Picker.Item label="None" value="" color="#FFF" />
            {INGREDIENT_CATEGORIES.vegetables.map(item => (
              <Picker.Item key={item} label={`${item} 🌿`} value={item} color="#FFF" />
            ))}
          </Picker>
          <Text style={[styles.inputLabel, { backgroundColor: '#FF69B4', color: '#FFF' }]}>🍎 Fruity Flingers 🍌</Text>
          <Picker
            selectedValue={fruit}
            onValueChange={(itemValue) => setFruit(itemValue)}
            style={[styles.picker, { backgroundColor: '#FF1493', borderColor: '#FFB6C1' }]}
          >
            <Picker.Item label="None" value="" color="#FFF" />
            {INGREDIENT_CATEGORIES.fruits.map(item => (
              <Picker.Item key={item} label={`${item} 🍊`} value={item} color="#FFF" />
            ))}
          </Picker>
          <Text style={[styles.inputLabel, { backgroundColor: '#00CED1', color: '#FFF' }]}>🦐 Ocean Eats 🐟</Text>
          <Picker
            selectedValue={seafood}
            onValueChange={(itemValue) => setSeafood(itemValue)}
            style={[styles.picker, { backgroundColor: '#20B2AA', borderColor: '#00FFFF' }]}
          >
            <Picker.Item label="None" value="" color="#FFF" />
            {INGREDIENT_CATEGORIES.seafood.map(item => (
              <Picker.Item key={item} label={`${item} 🦀`} value={item} color="#FFF" />
            ))}
          </Picker>
          <Text style={[styles.inputLabel, { backgroundColor: '#FFD700', color: '#FF4500' }]}>🧀 Dairy Disasters 🥛</Text>
          <Picker
            selectedValue={dairy}
            onValueChange={(itemValue) => setDairy(itemValue)}
            style={[styles.picker, { backgroundColor: '#FFA500', borderColor: '#FFFF00' }]}
          >
            <Picker.Item label="None" value="" color="#FFF" />
            {INGREDIENT_CATEGORIES.dairy.map(item => (
              <Picker.Item key={item} label={`${item} 🐮`} value={item} color="#FFF" />
            ))}
          </Picker>
          <Text style={[styles.inputLabel, { backgroundColor: '#8A2BE2', color: '#FFF' }]}>🍞 Carb Calamity 🥐</Text>
          <Picker
            selectedValue={carb}
            onValueChange={(itemValue) => setCarb(itemValue)}
            style={[styles.picker, { backgroundColor: '#9400D3', borderColor: '#DDA0DD' }]}
          >
            <Picker.Item label="None" value="" color="#FFF" />
            {INGREDIENT_CATEGORIES.carbs.map(item => (
              <Picker.Item key={item} label={`${item === "rice" ? "Paddy Pals" : item} 🌾`} value={item} color="#FFF" />
            ))}
          </Picker>
          <Text style={[styles.inputLabel, { backgroundColor: '#FF00FF', color: '#FFFF00' }]}>🥃 Devil’s Water 🍺</Text>
          <Picker
            selectedValue={devilWater}
            onValueChange={(itemValue) => setDevilWater(itemValue)}
            style={[styles.picker, { backgroundColor: '#8B008B', borderColor: '#FF00FF' }]}
          >
            <Picker.Item label="None" value="" color="#FFF" />
            {INGREDIENT_CATEGORIES.devilWater.map(item => (
              <Picker.Item key={item} label={`${item === "beer" ? "Bubba’s Brew" : item === "moonshine" ? "Hillbilly Juice" : item} 🔥`} value={item} color="#FFF" />
            ))}
          </Picker>
        </View>
        {isLoading && (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={[styles.spinnerText, { color: '#FF1493', fontWeight: 'bold' }]}>🔥 Whippin’ up somethin’ nuttier than squirrel turds... 🐿️</Text>
          </View>
        )}
        <AnimatedView entering={Platform.OS !== 'web' ? FadeInUp.delay(600).duration(600) : undefined} style={styles.buttonRow}>
          <Button title="🍳 Cook Me a Hoot! 🎉" on LOCKPress={() => fetchRecipe(false)} disabled={isLoading} color="#FF4500" />
          <Button title="🎲 Random Ruckus Recipe 🌩️" onPress={fetchRandomRecipe} disabled={isLoading} color="#FF00A0" />
          <Button title="🧹 Wipe the Slate, Bubba 🐴" onPress={clearInput} color="#4ECDC4" />
          <Button title={language === 'english' ? "🌮 Speak Español, Amigo" : "🇺🇸 Back to ‘Merican"} onPress={toggleLanguage} color="#FFD93D" />
          <Button title={showFavorites ? "🙈 Hide My Stash" : "💰 Show My Stash"} onPress={toggleFavorites} color="#4ECDC4" />
        </AnimatedView>
        {recipe && recipe.title === "Error" && (
          <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.duration(800) : undefined} style={styles.errorContainer}>
            <Text style={[styles.error, { color: '#FF1493', fontSize: 20 }]}>💥 Dang it! {recipe.steps[0]} 🤦‍♂️</Text>
            <Button title="🐴 Retry, Ya Mule!" onPress={() => fetchRecipe(lastRandom)} color="#FF3D00" />
          </AnimatedView>
        )}
        {recipe && recipe.title !== "Error" && !selectedFavorite && <RecipeCard recipe={recipe} language={language} onShare={shareRecipe} onSave={saveFavorite} extraButton={
          <TouchableOpacity style={[styles.copyButton, { backgroundColor: '#FF69B4', borderColor: '#FFD700' }]}>
            <Text style={[styles.copyButtonText, { color: '#FFF' }]}>{copied ? 'Snagged It! 🎯' : 'Copy to Clipboard 📋'}</Text>
          </TouchableOpacity>
        } />}
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
        {selectedFavorite && <RecipeCard recipe={selectedFavorite} language={language} onShare={shareRecipe} onBack={() => setSelectedFavorite(null)} extraButton={
          <TouchableOpacity style={[styles.copyButton, { backgroundColor: '#FF69B4', borderColor: '#FFD700' }]}>
            <Text style={[styles.copyButtonText, { color: '#FFF' }]}>{copied ? 'Snagged It! 🎯' : 'Copy to Clipboard 📋'}</Text>
          </TouchableOpacity>
        } />}
        <AffiliateSection />
        <View style={[styles.footer, { backgroundColor: '#FFD700', borderTopWidth: 3, borderTopColor: '#FF4500' }]}>
          <Image source={require('../assets/gt.png')} style={{ width: 80, height: 80, marginRight: 10, borderWidth: 2, borderColor: '#FF00A0' }} />
          <Text style={[styles.footerText, { color: '#FF4500', fontWeight: 'bold' }]}>
            © 2025 Chuckle & Chow 🌟 |{' '}
            <Link href="/privacy-policy" style={[styles.footerLink, { color: '#FF00A0' }]}>
              Privacy Policy (Y’all Ain’t Sneaky Enough) 🕵️‍♂️
            </Link>
            {'\n'}For issues and hollerin’, hit us at{' '}
            <Text style={[styles.footerLink, { color: '#FF00A0' }]} onPress={() => Linking.openURL('mailto:bshoemak@mac.com')}>
              bshoemak@mac.com 📧
            </Text>
          </Text>
        </View>
      </AnimatedView>
    </ScrollView>
  );
}