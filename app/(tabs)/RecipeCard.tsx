// C:\Users\bshoe\OneDrive\Desktop\game_theory\cooking\RecipeGenerator\app\(tabs)\RecipeCard.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const RecipeCard = ({ recipe, language, onShare, onSave, onBack, onRatingSubmitted }) => {
    return (
        <Animated.View entering={FadeInDown.duration(800)} style={styles.container}>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.subtitle}>{language === 'english' ? 'Ingredients' : 'Ingredientes'}</Text>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                    <Text key={index} style={styles.listItem}>{ingredient}</Text>
                ))
            ) : (
                <Text style={styles.listItem}>{language === 'english' ? 'No ingredients listed' : 'Sin ingredientes listados'}</Text>
            )}
            <Text style={styles.subtitle}>{language === 'english' ? 'Steps' : 'Pasos'}</Text>
            {recipe.steps && recipe.steps.length > 0 ? (
                recipe.steps.map((step, index) => (
                    <Text key={index} style={styles.listItem}>{index + 1}. {step}</Text>
                ))
            ) : (
                <Text style={styles.listItem}>{language === 'english' ? 'No steps provided' : 'Sin pasos proporcionados'}</Text>
            )}
            <Text style={styles.subtitle}>{language === 'english' ? 'Nutrition' : 'Nutrición'}</Text>
            <Text style={styles.nutrition}>Calories: {recipe.nutrition?.calories || 0} kcal</Text>
            <Text style={styles.nutrition}>Protein: {recipe.nutrition?.protein || 0}g</Text>
            <Text style={styles.nutrition}>Fat: {recipe.nutrition?.fat || 0}g</Text>
            <Text style={styles.subtitle}>{language === 'english' ? 'Details' : 'Detalles'}</Text>
            <Text style={styles.detail}>Cooking Time: {recipe.cooking_time || 'N/A'} min</Text>
            <Text style={styles.detail}>Difficulty: {recipe.difficulty || 'N/A'}</Text>
            <Text style={styles.detail}>Servings: {recipe.servings || 'N/A'}</Text>
            <Text style={styles.detail}>Equipment: {recipe.equipment ? recipe.equipment.join(', ') : 'N/A'}</Text>
            <Text style={styles.detail}>Tip: {recipe.tips || 'No tips available'}</Text>
            <View style={styles.buttonRow}>
                {onSave && <Button title={language === 'english' ? "Save" : "Guardar"} onPress={onSave} color="#FFD93D" />}
                <Button title={language === 'english' ? "Share" : "Compartir"} onPress={() => onShare('default')} color="#6AB04C" />
                {onBack && <Button title={language === 'english' ? "Back" : "Volver"} onPress={onBack} color="#4ECDC4" />}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#FFF', borderRadius: 10, marginTop: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#D32F2F' },
    subtitle: { fontSize: 18, fontWeight: '600', marginTop: 10 },
    listItem: { fontSize: 16, marginVertical: 5 },
    nutrition: { fontSize: 14, color: '#777' },
    detail: { fontSize: 14, color: '#555', marginVertical: 2 },
    buttonRow: { flexDirection: 'row', gap: 10, marginTop: 10 }
});