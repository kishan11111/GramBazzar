import { Stack, useRouter } from 'expo-router';
import BlogListScreen from './screens/BlogListScreen';

export default function BlogList() {
  const router = useRouter();

  // Create navigation object for compatibility
  const navigation = {
    navigate: (screen, params) => {
      router.push({
        pathname: `/${screen}`,
        params,
      });
    },
    goBack: () => router.back(),
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BlogListScreen navigation={navigation} />
    </>
  );
}
