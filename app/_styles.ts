// app/_styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContainer: { 
    flex: 1, 
    backgroundColor: '#FFFACD' // Lemon Chiffon
  },
  scrollContent: { 
    paddingBottom: 20 
  },
  container: { 
    padding: 15 
  },
  header: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#FF4500', // Orange Red
    textAlign: 'center' as const, 
    marginVertical: 10, 
    textShadowColor: '#FFD700', // Yellow shadow
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 5 
  },
  subheader: { 
    fontSize: 18, 
    color: '#FF00A0', // Hot Pink
    textAlign: 'center' as const, 
    marginBottom: 10, 
    fontStyle: 'italic' 
  },
  trustSection: { 
    flexDirection: 'row' as const, 
    justifyContent: 'space-around' as const, 
    marginVertical: 10 
  },
  trustText: { 
    fontSize: 14, 
    color: '#32CD32', // Lime Green
    fontWeight: 'bold' // Fixed: Added missing comma after this line in previous version
  },
  inputSection: { 
    marginVertical: 15, 
    backgroundColor: '#F0E68C', // Khaki
    padding: 10, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#FF69B4' // Hot Pink
  },
  inputLabel: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center' as const, 
    padding: 5, 
    borderRadius: 5, 
    marginBottom: 5 
  },
  picker: { 
    height: 50, 
    width: '100%', 
    borderWidth: 2, 
    borderRadius: 10, 
    marginBottom: 10 
  },
  spinnerContainer: { 
    alignItems: 'center' as const, 
    marginVertical: 20 
  },
  spinnerText: { 
    fontSize: 16 
  },
  buttonRow: { 
    flexDirection: 'row' as const, 
    flexWrap: 'wrap' as const, 
    justifyContent: 'space-around' as const, 
    marginVertical: 10 
  },
  errorContainer: { 
    alignItems: 'center' as const, 
    marginVertical: 10 
  },
  error: { 
    fontSize: 16 
  },
  recipeCard: { 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 10, 
    marginVertical: 10, 
    borderWidth: 2, 
    borderColor: '#FF6B6B' // Tomato
  },
  recipeTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#FF00A0', // Hot Pink
    marginBottom: 10 
  },
  recipeSection: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#4ECDC4', // Turquoise
    marginTop: 10 
  },
  recipeStep: { 
    fontSize: 14, 
    color: '#333', 
    marginLeft: 10, 
    marginTop: 5 
  },
  copyButton: { 
    backgroundColor: '#FF69B4', // Hot Pink
    padding: 10, 
    borderRadius: 5, 
    marginVertical: 10, 
    borderWidth: 2, 
    borderColor: '#FFD700' // Yellow
  },
  copyButtonText: { 
    color: '#FFF', 
    textAlign: 'center' as const, 
    fontWeight: 'bold' 
  },
  favoriteItem: { 
    fontSize: 16, 
    color: '#FFD93D', // Gold
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc' 
  },
  affiliateSection: { 
    marginVertical: 20, 
    padding: 15, 
    backgroundColor: '#FF1493', // Deep Pink
    borderRadius: 15, 
    borderWidth: 3, 
    borderColor: '#FFD700', // Yellow
    alignItems: 'center' as const 
  },
  affiliateHeader: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFD700', // Yellow
    textAlign: 'center' as const, 
    marginBottom: 10, 
    textShadowColor: '#FF4500', // Orange Red shadow
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 5 
  },
  affiliateButton: { 
    flexDirection: 'row' as const, 
    alignItems: 'center' as const, 
    backgroundColor: '#32CD32', // Lime Green
    padding: 10, 
    borderRadius: 10, 
    marginVertical: 5, 
    borderWidth: 2, 
    borderColor: '#FF00A0', // Hot Pink
    width: '100%' 
  },
  affiliateImage: { 
    width: 60, 
    height: 60, 
    marginRight: 10, 
    borderRadius: 5, 
    borderWidth: 2, 
    borderColor: '#FFD700' // Yellow
  },
  affiliateText: { 
    fontSize: 16, 
    color: '#FFF', 
    fontWeight: 'bold', 
    flexShrink: 1 
  },
  affiliateDisclaimer: { 
    fontSize: 12, 
    color: '#FFFF00', // Bright Yellow
    textAlign: 'center' as const, 
    marginTop: 10 
  },
  footer: { 
    flexDirection: 'row' as const, 
    alignItems: 'center' as const, 
    padding: 10, 
    marginTop: 20, 
    backgroundColor: '#FFD700', // Gold
    borderTopWidth: 3, 
    borderTopColor: '#FF4500' // Orange Red
  },
  footerText: { 
    fontSize: 12, 
    color: '#FF4500', // Orange Red
    fontWeight: 'bold' 
  },
  footerLink: { 
    color: '#FF00A0', // Hot Pink
    textDecorationLine: 'underline' 
  }
});