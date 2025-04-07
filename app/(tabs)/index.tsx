// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import { useRecipe } from './useRecipe';
import { useFavorites } from './useFavorites';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.API_URL || 'http://127.0.0.1:5000';

export default function HomeScreen() {
  const { 
    ingredients, setIngredients,
    diet, setDiet,
    time, setTime,
    style, setStyle,
    category, setCategory,
    language, setLanguage,
    fetchRecipe, toggleLanguage, clearInput,
    recipe, isLoading
  } = useRecipe();

  const { saveFavorite } = useFavorites();

  const handleGenerate = () => fetchRecipe(false);
  const handleRandom = () => fetchRecipe(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Generator</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ingredients (e.g., chicken, rice)"
        value={ingredients}
        onChangeText={setIngredients}
      />
      <Picker
        selectedValue={diet}
        style={styles.picker}
        onValueChange={(value) => setDiet(value)}
      >
        <Picker.Item label="No Diet" value="" />
        <Picker.Item label="Vegetarian" value="vegetarian" />
        <Picker.Item label="Gluten-Free" value="gluten-free" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Max Cooking Time (minutes)"
        value={time}
        onChangeText={setTime}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={style}
        style={styles.picker}
        onValueChange={(value) => setStyle(value)}
      >
        <Picker.Item label="Any Style" value="" />
        <Picker.Item label="Italian" value="italian" />
        <Picker.Item label="Mexican" value="mexican" />
      </Picker>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(value) => setCategory(value)}
      >
        <Picker.Item label="Any Category" value="" />
        <Picker.Item label="Main" value="main" />
        <Picker.Item label="Dessert" value="dessert" />
      </Picker>
      <Button 
        title={language === 'english' ? 'Switch to Spanish' : 'Switch to English'} 
        onPress={toggleLanguage} 
      />
      <View style={styles.buttonRow}>
        <Button title="Generate Recipe" onPress={handleGenerate} disabled={isLoading} />
        <Button title="Random Recipe" onPress={handleRandom} disabled={isLoading} />
        <Button title="Clear" onPress={clearInput} />
      </View>

      {recipe && (
        <View style={styles.recipe}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text style={styles.section}>Ingredients:</Text>
          {recipe.ingredients?.map((item, index) => (
            <Text key={index} style={styles.item}>- {item}</Text>
          ))}
          <Text style={styles.section}>Steps:</Text>
          {recipe.steps?.map((step, index) => (
            <Text key={index} style={styles.item}>{index + 1}. {step}</Text>
          ))}
          <Text style={styles.section}>Details:</Text>
          <Text>Cooking Time: {recipe.cooking_time} minutes</Text>
          <Text>Difficulty: {recipe.difficulty}</Text>
          <Text>Servings: {recipe.servings}</Text>
          <Text style={styles.section}>Nutrition:</Text>
          <Text>Calories: {recipe.nutrition?.calories} kcal</Text>
          <Text>Fat: {recipe.nutrition?.fat}g</Text>
          <Text>Protein: {recipe.nutrition?.protein}g</Text>
          <Text style={styles.section}>Tips:</Text>
          <Text>{recipe.tips}</Text>
          <Button 
            title={language === 'english' ? "Save to Favorites" : "Guardar en Favoritos"} 
            onPress={() => saveFavorite(recipe)} 
            color="#FF3B30"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, borderColor: '#ccc' },
  picker: { height: 50, marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  recipe: { marginTop: 20 },
  recipeTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  section: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  item: { marginLeft: 10, marginBottom: 5 },
});