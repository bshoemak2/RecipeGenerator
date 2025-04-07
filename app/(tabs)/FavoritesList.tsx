// app/(tabs)/FavoritesList.tsx
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useFavorites } from './useFavorites';

export const FavoritesList = () => {
  const {
    favorites,
    filteredFavorites,
    language,
    search,
    setSearch,
    removeFavorite,
  } = useFavorites();

  const onView = (recipe) => {
    console.log("View recipe:", recipe); // Placeholder—expand later
  };

  const onClearSearch = () => setSearch('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {language === 'english' ? 'Favorites' : 'Favoritos'}
      </Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder={language === 'english' ? 'Search favorites...' : 'Buscar favoritos...'}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#A0A0A0"
        />
        <Button title="✖" onPress={onClearSearch} color="#FF3B30" />
      </View>
      {filteredFavorites.length > 0 ? (
        filteredFavorites.map((fav) => (
          <View key={fav.id} style={styles.favItemContainer}>
            <Text
              style={styles.favItem}
              onPress={() => onView(fav)}
            >
              {fav.title}
            </Text>
            <Button
              title={language === 'english' ? "Remove" : "Eliminar"}
              onPress={() => removeFavorite(fav.id, language)}
              color="#FF3B30"
            />
          </View>
        ))
      ) : (
        <Text style={styles.noFavorites}>
          {language === 'english' ? 'No favorites found' : 'No se encontraron favoritos'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, padding: 10, marginRight: 10, borderRadius: 5, borderColor: '#ccc' },
  favItemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  favItem: { fontSize: 16, color: '#333' },
  noFavorites: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
});

export default FavoritesList;