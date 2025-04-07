// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.API_URL || 'http://127.0.0.1:5000';

export default function HomeScreen() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState(null);

  const fetchRecipe = async () => {
    const url = `${API_URL}/generate_recipe`;
    console.log("Fetching recipe from:", url);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map(item => item.trim()),
          preferences: { language: 'english' },
        }),
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log("Response data:", data);
      if (data.error) {
        console.error("Recipe error:", data.error);
        setRecipe({ title: 'Error', steps: [data.error] });
      } else {
        setRecipe(data);
      }
    } catch (error) {
      console.error("Fetch error details:", error.message);
      setRecipe({ title: 'Error', steps: [error.message] });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate a Recipe</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter ingredients (e.g., chicken, rice)"
        value={ingredients}
        onChangeText={setIngredients}
      />
      <Button title="Generate Recipe" onPress={fetchRecipe} />
      {recipe && (
        <View style={styles.recipe}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text>Ingredients:</Text>
          {recipe.ingredients?.map((item, index) => (
            <Text key={index}>- {item}</Text>
          ))}
          <Text>Steps:</Text>
          {recipe.steps?.map((step, index) => (
            <Text key={index}>{index + 1}. {step}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  recipe: { marginTop: 20 },
  recipeTitle: { fontSize: 20, fontWeight: 'bold' },
});