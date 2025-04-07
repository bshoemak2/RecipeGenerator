// app/(tabs)/FavoritesList.tsx
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'; // Ensure View is imported

interface FavoritesListProps {
  favorites: any[];
  setFavorites: (favorites: any[]) => void;
  language: string;
  search: string;
  setSearch: (search: string) => void;
  setSelectedFavorite: (favorite: any) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  setFavorites,
  language,
  search,
  setSearch,
  setSelectedFavorite,
}) => {
  const removeFavorite = async (title: string) => {
    if (confirm(language === 'english' ? `Remove ${title} from favorites?` : `¿Eliminar ${title} de favoritos?`)) {
      const newFavorites = favorites.filter(fav => fav.title !== title);
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setSelectedFavorite(null);
    }
  };

  const onView = (fav) => setSelectedFavorite(fav);

  const clearSearch = () => setSearch('');

  const filteredFavorites = favorites.filter(fav => fav.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.favorites}>
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
      {filteredFavorites.length > 0 ? (
        filteredFavorites.map((fav, index) => (
          <View key={index} style={styles.favItemContainer}>
            <Text
              style={styles.favItem}
              onPress={() => onView(fav)}
            >
              🌟 {fav.title}
            </Text>
            <Button
              title={language === 'english' ? "Remove ❌" : "Eliminar ❌"}
              onPress={() => removeFavorite(fav.title)}
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
  subtitle: {
    fontSize: 24,
    fontFamily: 'Arial',
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#4ECDC4',
    paddingBottom: 6,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
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
  noFavorites: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});