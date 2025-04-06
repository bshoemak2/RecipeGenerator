// C:\Users\bshoe\OneDrive\Desktop\game_theory\cooking\RecipeGenerator\app\(tabs)\InputSection.tsx
import React from 'react';
import { View, Text, TextInput, Button, Picker } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Platform } from 'react-native';
import { styles } from './styles.ts';
import { commonIngredients, cookingStyles, foodCategories } from './data.ts';

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
                <AnimatedView entering={Platform.OS !== 'web' ? FadeInDown.delay(400).duration(600) : undefined}>
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