import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ENDPOINTS, useData } from '@monorepo/core';
import { User } from '@monorepo/types';

export default function HomeScreen() {
  const { data, loading, error } = useData<User[]>(ENDPOINTS.USERS);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      <StatusBar style="auto" />
      <View className="p-6">
        <View className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Expo!
          </Text>
          <Text className="text-base text-gray-600 mb-4">
            This is your Expo React Native app. It shares components and logic
            with the React Router 7 web app.
          </Text>

          <View className="bg-blue-50 rounded-lg p-4">
            <Text className="text-lg font-semibold text-blue-900 mb-2">
              Features:
            </Text>
            <Text className="text-blue-800 mb-1">• Expo Router navigation</Text>
            <Text className="text-blue-800 mb-1">
              • NativeWind (Tailwind CSS)
            </Text>
            <Text className="text-blue-800 mb-1">• TypeScript strict mode</Text>
            <Text className="text-blue-800 mb-1">
              • Shared components via @monorepo/ui
            </Text>
            <Text className="text-blue-800">
              • API client for React Router 7
            </Text>
          </View>
        </View>
        <View>
          <Text>Users that are</Text>
          {data &&
            data.map((user) => (
              <Text key={user.id}>
                {user.name} - {user.email}
              </Text>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}
