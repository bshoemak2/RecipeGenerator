// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#FF3B30' }}>
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Home', headerShown: false }} 
      />
      <Tabs.Screen 
        name="FavoritesList" 
        options={{ title: 'Favorites', headerShown: false }} 
      />
    </Tabs>
  );
}