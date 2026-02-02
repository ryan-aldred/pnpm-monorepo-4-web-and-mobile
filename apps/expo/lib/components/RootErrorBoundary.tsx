import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useState } from 'react';

interface RootErrorBoundaryProps {
  error: Error;
  retry: () => Promise<void>;
}

export function RootErrorBoundary({ error, retry }: RootErrorBoundaryProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showDetails, setShowDetails] = useState(false);

  const handleTryAgain = () => {
    retry();
  };

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>!</Text>
        </View>

        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>
          An unexpected error occurred. Please try again.
        </Text>

        {__DEV__ && (
          <View style={styles.detailsContainer}>
            <Pressable
              onPress={() => setShowDetails(!showDetails)}
              style={styles.detailsButton}
            >
              <Text style={styles.detailsButtonText}>
                {showDetails ? '▲' : '▼'} Error Details
              </Text>
            </Pressable>

            {showDetails && (
              <ScrollView style={styles.detailsBox}>
                <Text style={styles.detailsText}>
                  {error.stack || error.message}
                </Text>
              </ScrollView>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Pressable style={styles.primaryButton} onPress={handleTryAgain}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: isDark ? '#1a1a2e' : '#f5f5f5',
    },
    card: {
      backgroundColor: isDark ? '#2d2d44' : '#ffffff',
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: isDark ? '#4a1c1c' : '#fee2e2',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    iconText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: isDark ? '#fca5a5' : '#dc2626',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#1a1a1a',
      textAlign: 'center',
      marginBottom: 8,
    },
    message: {
      fontSize: 16,
      color: isDark ? '#9ca3af' : '#6b7280',
      textAlign: 'center',
      marginBottom: 16,
    },
    detailsContainer: {
      width: '100%',
      marginBottom: 16,
    },
    detailsButton: {
      alignItems: 'center',
      padding: 8,
    },
    detailsButtonText: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    detailsBox: {
      marginTop: 12,
      padding: 12,
      backgroundColor: isDark ? '#1a1a2e' : '#f3f4f6',
      borderRadius: 8,
      maxHeight: 150,
    },
    detailsText: {
      fontSize: 12,
      fontFamily: 'monospace',
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    buttonContainer: {
      width: '100%',
      gap: 12,
    },
    primaryButton: {
      backgroundColor: '#f4511e',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
