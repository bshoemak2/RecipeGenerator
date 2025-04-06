// C:\Users\bshoe\OneDrive\Desktop\game_theory\cooking\RecipeGenerator\app\(tabs)\index.tsx
import React, { useState } from 'react';
import { View, Text, Button, ScrollView, ActivityIndicator, Image } from 'react-native';
import Animated, { Easing, FadeIn, FadeInUp } from 'react-native-reanimated';
import { Platform, Linking } from 'react-native';
import { styles } from './styles.ts';
import { InputSection } from './InputSection.tsx';
import { RecipeCard } from './RecipeCard.tsx';
import { FavoritesList } from './FavoritesList.tsx';
import { AffiliateSection } from './AffiliateSection.tsx';
import { useRecipe } from './useRecipe.ts';
import { useFavorites } from './useFavorites.ts';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.API_URL || 'http://127.0.0.1:5000';

const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

export default function HomeScreen() {
    const [favoritesError, setFavoritesError] = useState(null);

    const {
        ingredients, setIngredients, diet, setDiet, time, setTime,
        style, setStyle, category, setCategory, language, setLanguage,
        recipe, setRecipe, isLoading, setIsLoading, lastRandom, setLastRandom,
        suggestion, setSuggestion, fetchRecipe, toggleLanguage, clearInput
    } = useRecipe();

    const {
        favorites, setFavorites, showFavorites, toggleFavorites,
        selectedFavorite, setSelectedFavorite, search, setSearch,
        saveFavorite, removeFavorite, shareRecipe, filteredFavorites
    } = useFavorites();

    const addSuggestion = () => {
        if (suggestion && !ingredients.includes(suggestion)) {
            const newIngredients = ingredients ? `${ingredients}, ${suggestion}` : suggestion;
            setIngredients(newIngredients);
            setSuggestion('');
            if (recipe) fetchRecipe();
        }
    };

    const fetchRandomRecipe = () => {
        fetchRecipe(true);
    };

    const clearSearch = () => {
        setSearch('');
    };

    const handleRatingSubmitted = () => {
        if (lastRandom) {
            fetchRandomRecipe();
        }
    };

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.duration(800).easing(Easing.out(Easing.exp)) : undefined} style={styles.container}>
                <Text style={styles.header}>Recipe Generator (Beta) 🍳✨</Text>
                <View style={styles.trustSection}>
                    <Text style={styles.trustText}>🔒 Secure & Safe</Text>
                    <Text style={styles.trustText}>🥗 Trusted by Foodies</Text>
                    <Text style={styles.trustText}>⭐ Chef-Approved Recipes</Text>
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
                        onShare={(platform) => shareRecipe(recipe, platform)}
                        onSave={() => saveFavorite(recipe)}
                        onRatingSubmitted={handleRatingSubmitted}
                    />
                )}
                {showFavorites && favorites.length > 0 && (
                    <FavoritesList
                        favorites={favorites}
                        filteredFavorites={filteredFavorites}
                        language={language}
                        search={search}
                        setSearch={setSearch}
                        onView={(fav) => setSelectedFavorite(fav)}
                        onRemove={(recipe_id) => removeFavorite(recipe_id, language)}
                        onClearSearch={clearSearch}
                    />
                )}
                {showFavorites && favorites.length === 0 && (
                    <Text style={styles.error}>No favorites found. Save some recipes to see them here!</Text>
                )}
                {favoritesError && (
                    <Text style={styles.error}>{favoritesError}</Text>
                )}
                {selectedFavorite && (
                    <RecipeCard
                        recipe={selectedFavorite}
                        language={language}
                        onShare={(platform) => shareRecipe(selectedFavorite, platform)}
                        onBack={() => setSelectedFavorite(null)}
                        onRatingSubmitted={handleRatingSubmitted}
                    />
                )}
                <AffiliateSection />
                <View style={styles.footer}>
                    <Image
                        source={require('../../assets/gt.png')}
                        style={{ width: 50, height: 50, marginRight: 10 }}
                    />
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