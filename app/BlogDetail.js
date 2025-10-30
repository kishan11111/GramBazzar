import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import BlogDetailScreen from './screens/BlogDetailScreen';

export default function BlogDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Create navigation and route objects for compatibility
  const navigation = {
    navigate: (screen, params) => {
      router.push({
        pathname: `/${screen}`,
        params,
      });
    },
    push: (screen, params) => {
      router.push({
        pathname: `/${screen}`,
        params,
      });
    },
    goBack: () => router.back(),
  };

  const route = {
    params,
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BlogDetailScreen navigation={navigation} route={route} />
    </>
  );
}
