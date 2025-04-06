// C:\Users\bshoe\OneDrive\Desktop\game_theory\cooking\RecipeGenerator\app\(tabs)\styles.ts
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
        flexGrow: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    container: {
        padding: 35,
        gap: 25,
        maxWidth: 900,
        alignSelf: 'center',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        marginVertical: 25,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.15)',  // Replaced shadow props
        ...(Platform.OS === 'android' ? { elevation: 5 } : {}),  // Keep elevation for Android
    },
    header: {
        fontSize: 40,
        fontFamily: 'Georgia',
        fontWeight: 'bold',
        color: '#D32F2F',
        textAlign: 'center',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',  // Replaced textShadow props
        marginBottom: 10,
    },
    trustSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    trustText: {
        fontSize: 14,
        fontFamily: 'Arial',
        color: '#4A4A4A',
        fontWeight: '500',
    },
    inputSection: {
        gap: 20,
        backgroundColor: 'rgba(255, 247, 247, 0.95)',
        padding: 25,
        borderRadius: 15,
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',  // Replaced shadow props
    },
    label: {
        fontSize: 20,
        fontFamily: 'Arial',
        color: '#4A4A4A',
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 5,
    },
    input: {
        borderWidth: 0,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontFamily: 'Arial',
        backgroundColor: '#FFFFFF',
        color: '#333',
        boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',  // Replaced shadow props
        ...(Platform.OS === 'android' ? { elevation: 2 } : {}),
    },
    suggestionRow: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    searchRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    picker: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        fontFamily: 'Arial',
    },
    spinner: {
        marginVertical: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'center',
        marginTop: 20,
        flexWrap: 'wrap',
    },
    recipeContainer: {
        marginTop: 30,
        padding: 30,
        backgroundColor: '#FFF',
        borderRadius: 15,
        boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',  // Replaced shadow props
        borderLeftWidth: 5,
        borderLeftColor: '#FF6B6B',
    },
    recipeCard: {
        borderWidth: 2,
        borderColor: '#FF6B6B',
        backgroundColor: '#FFF5F5',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',  // Replaced shadow props
    },
    errorContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#FFF5F5',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FF3B30',
        alignItems: 'center',
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',  // Replaced shadow props
    },
    title: {
        fontSize: 32,
        fontFamily: 'Georgia',
        fontWeight: '700',
        color: '#D32F2F',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 24,
        fontFamily: 'Arial',
        fontWeight: '600',
        color: '#4A4A4A',
        marginTop: 20,
        marginBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#FF6B6B',
        paddingBottom: 6,
    },
    listItem: {
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#555',
        lineHeight: 28,
        marginVertical: 5,
    },
    nutrition: {
        fontSize: 15,
        fontFamily: 'Arial',
        color: '#777',
        lineHeight: 26,
        fontStyle: 'italic',
        marginVertical: 3,
    },
    recipeButtons: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        marginTop: 25,
        flexWrap: 'wrap',
    },
    favorites: {
        marginTop: 30,
        padding: 30,
        backgroundColor: '#FFF',
        borderRadius: 15,
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',  // Replaced shadow props
        borderLeftWidth: 5,
        borderLeftColor: '#4ECDC4',
    },
    favItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        ...(Platform.OS === 'web' ? { transition: 'background-color 0.2s' } : {}),
        ':hover': { backgroundColor: '#F5F5F5' },
    },
    favItem: {
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#555',
        lineHeight: 28,
        marginVertical: 5,
    },
    favItemHover: {
        cursor: 'pointer',
    },
    error: {
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '500',
    },
    affiliateSection: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 15,
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',  // Replaced shadow props
    },
    affiliateHeader: {
        fontSize: 20,
        fontFamily: 'Arial',
        fontWeight: '600',
        color: '#4A4A4A',
        marginBottom: 10,
        textAlign: 'center',
    },
    affiliateContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    affiliateLink: {
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#1DA1F2',
        textDecorationLine: 'underline',
        marginBottom: 5,
    },
    affiliateImages: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
    affiliateImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    affiliateDisclaimer: {
        fontSize: 12,
        fontFamily: 'Arial',
        color: '#777',
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
    footer: {
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        fontFamily: 'Arial',
        color: '#777',
    },
    footerLink: {
        color: '#1DA1F2',
        textDecorationLine: 'underline',
    },
});