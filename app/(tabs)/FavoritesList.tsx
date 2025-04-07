// C:\Users\bshoe\OneDrive\Desktop\game_theory\cooking\RecipeGenerator\app\(tabs)\FavoritesList.tsx
import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { styles } from './styles';

export const FavoritesList = ({ favorites, filteredFavorites, language, search, setSearch, onView, onRemove, onClearSearch }) => {
    return (
        <View style={styles.favorites}>
            <Text style={styles.subtitle}>{language === 'english' ? 'Favorites' : 'Favoritos'}</Text>
            <View style={styles.searchRow}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder={language === 'english' ? 'Search favorites...' : 'Buscar favoritos...'}
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#A0A0A0"
                />
                <Button title="✖" onPress={onClearSearch} color="#FF3B30" />
            </View>
            {filteredFavorites.length > 0 ? (
                <>
                    {console.log("Filtered favorites:", filteredFavorites)}
                    {filteredFavorites.map((fav) => (
                        <View key={fav.id} style={styles.favItemContainer}>
                            <Text
                                style={[styles.favItem, styles.favItemHover]}
                                onPress={() => onView(fav)}
                            >
                                {fav.title}
                            </Text>
                            <Button
                                title={language === 'english' ? "Remove" : "Eliminar"}
                                onPress={() => {
                                    console.log("Removing favorite with ID:", fav.id);
                                    onRemove(fav.id, language);
                                }}
                                color="#FF3B30"
                            />
                        </View>
                    ))}
                </>
            ) : (
                <Text>{language === 'english' ? 'No favorites found' : 'No se encontraron favoritos'}</Text>
            )}
        </View>
    );
};

export default FavoritesList;