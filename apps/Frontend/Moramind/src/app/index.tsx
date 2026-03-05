import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: replace with auth state check from authStore
  const isAuthenticated = false;
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}
