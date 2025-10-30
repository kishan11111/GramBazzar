import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Import all screens
import AccountScreen from '../screens/AccountScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import PhoneLoginScreen from '../screens/PhoneLoginScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import PostListingScreen from '../screens/PostListingScreen';
import SearchScreen from '../screens/SearchScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

import EditProfileScreen from '../screens/EditProfileScreen';

import LocalCardCategoryScreen from '../screens/LocalCardCategoryScreen';
import LocalCardDetailScreen from '../screens/LocalCardDetailScreen';
import LocalCardHomeScreen from '../screens/LocalCardHomeScreen';
import LocalCardSearchScreen from '../screens/LocalCardSearchScreen';
import CreateLocalCardScreen from '../screens/CreateLocalCardScreen';
import NotificationScreen from '../screens/NotificationScreen';
import WeatherScreen from '../screens/WeatherScreen';
import TermsAndConditionsScreen from '../screens/TermsAndConditionsScreen';
import BlogListScreen from '../screens/BlogListScreen';
import BlogDetailScreen from '../screens/BlogDetailScreen';
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
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="LocalCardHome" component={LocalCardHomeScreen} />

      <Stack.Screen name="EditProfile" component={EditProfileScreen} />

<Stack.Screen name="LocalCardCategory" component={LocalCardCategoryScreen} />
<Stack.Screen name="LocalCardDetail" component={LocalCardDetailScreen} />
<Stack.Screen name="LocalCardSearch" component={LocalCardSearchScreen} />
<Stack.Screen name="CreateLocalCard" component={CreateLocalCardScreen} />
<Stack.Screen name="Notifications" component={NotificationScreen} />
<Stack.Screen name="Weather" component={WeatherScreen} />
<Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
<Stack.Screen name="BlogList" component={BlogListScreen} />
<Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
    </Stack.Navigator>
  );
}