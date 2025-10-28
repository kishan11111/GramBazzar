import { Stack } from 'expo-router';
import WeatherScreen from './screens/WeatherScreen';

export default function Weather() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <WeatherScreen />
    </>
  );
}
