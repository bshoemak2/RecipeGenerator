// C:\Users\bshoe\OneDrive\Desktop\game_theory\cooking\RecipeGenerator\app\(tabs)\useFavorites.ts
import { useState, useEffect } from 'react';
import { Platform, Share, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.API_URL || 'http://127.0.0.1:5000';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [selectedFavorite, setSelectedFavorite] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const saved = await AsyncStorage.getItem('favorites');
                if (saved) {
                    const parsedFavorites = JSON.parse(saved);
                    console.log("Loaded favorites from AsyncStorage:", parsedFavorites);
                    setFavorites(parsedFavorites);
                } else {
                    console.log("No favorites found in AsyncStorage");
                }
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };
        loadFavorites();
    }, []);

    const saveFavorite = async (recipe) => {
        if (!recipe) return;
        const recipeWithId = { ...recipe, id: recipe.id || Date.now() };
        if (!favorites.some(fav => fav.title === recipeWithId.title)) {
            const newFavorites = [...favorites, recipeWithId];
            setFavorites(newFavorites);
            try {
                await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
                console.log("Saved to AsyncStorage:", newFavorites);
                Alert.alert("Success", "Recipe saved to favorites!");
            } catch (error) {
                console.error('Error saving favorites:', error);
                Alert.alert("Error", "Failed to save favorite.");
            }
        } else {
            Alert.alert("Info", "Recipe already in favorites!");
        }
    };

    const removeFavorite = async (recipe_id, language) => {
        console.log("RemoveFavorite called with ID:", recipe_id, "Language:", language, "Current favorites:", favorites);
        const confirmRemoval = await new Promise((resolve) => {
            Alert.alert(
                language === 'english' ? "Remove Favorite" : "Eliminar Favorito",
                language === 'english' ? "Are you sure you want to remove this recipe?" : "¿Seguro que quieres eliminar esta receta?",
                [
                    { 
                        text: language === 'english' ? "Cancel" : "Cancelar", 
                        style: "cancel", 
                        onPress: () => {
                            console.log("Removal canceled");
                            resolve(false);
                        } 
                    },
                    { 
                        text: language === 'english' ? "Remove" : "Eliminar", 
                        onPress: () => resolve(true) 
                    }
                ],
                { cancelable: true }
            );
        });

        if (confirmRemoval) {
            try {
                const newFavorites = favorites.filter((fav) => fav.id !== recipe_id);
                console.log("New favorites after filter:", newFavorites);
                setFavorites([...newFavorites]);  // Force state update
                if (selectedFavorite && selectedFavorite.id === recipe_id) {
                    setSelectedFavorite(null);
                    console.log("Cleared selectedFavorite");
                }
                await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
                console.log("Saved to AsyncStorage after removal:", newFavorites);
                Alert.alert("Success", language === 'english' ? "Recipe removed from favorites" : "Receta eliminada de favoritos");
            } catch (error) {
                console.error('Error removing favorite:', error);
                Alert.alert("Error", "Failed to remove favorite.");
            }
        }
    };

    const shareRecipe = async (recipe, platform = 'default') => {
        if (!recipe) return;

        const shareText = recipe.shareText;
        const url = 'https://recipegenerator-ort9.onrender.com/';
        const fullMessage = `${shareText}\nCheck out my app: ${url}`;

        try {
            if (platform === 'facebook') {
                const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&e=${encodeURIComponent(shareText)}`;
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

    const toggleFavorites = () => {
        setShowFavorites(!showFavorites);
        setSelectedFavorite(null);
        setSearch('');
    };

    const filteredFavorites = favorites.filter((fav) => fav.title.toLowerCase().includes(search.toLowerCase()));

    return {
        favorites,
        setFavorites,
        showFavorites,
        toggleFavorites,
        selectedFavorite,
        setSelectedFavorite,
        search,
        setSearch,
        saveFavorite,
        removeFavorite,
        shareRecipe,
        filteredFavorites
    };
};

export default useFavorites;