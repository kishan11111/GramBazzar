import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Import all screens
import AccountScreen from '../screens/AccountScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import DashboardScreen from '../screens/DashboardScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import PhoneLoginScreen from '../screens/PhoneLoginScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import PostListingScreen from '../screens/PostListingScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="PostListing" component={PostListingScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
    </Stack.Navigator>
  );
}