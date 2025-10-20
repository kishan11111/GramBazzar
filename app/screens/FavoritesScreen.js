import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiService } from '../config/api';
import BottomNavWrapper from '../DynamicBottomNav';
export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  // Add focus listener to reload when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserFavorites(1, 20);
      
      if (response.success) {
        setFavorites(response.data.items || []);
      } else {
        Alert.alert('ભૂલ', 'ડેટા લોડ કરવામાં સમસ્યા');
      }
    } catch (error) {
      if (error.message.includes('લૉગિન')) {
        Alert.alert('સત્ર સમાપ્ત', error.message, [
          {
            text: 'ઠીક છે',
            onPress: () => {
              AsyncStorage.clear();
              navigation.navigate('Welcome');
            }
          }
        ]);
      } else {
        Alert.alert('ભૂલ', 'કનેક્શન સમસ્યા');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (postId) => {
    Alert.alert(
      'સાચવેલ પોસ્ટ દૂર કરો',
      'શું તમે આ પોસ્ટને સાચવેલમાંથી દૂર કરવા માંગો છો?',
      [
        {
          text: 'રદ કરો',
          style: 'cancel'
        },
        {
          text: 'દૂર કરો',
          onPress: async () => {
            try {
              const response = await apiService.toggleFavoritePost(postId);
              if (response.success) {
                // Remove from local state
                setFavorites(favorites.filter(item => item.postId !== postId));
                Alert.alert('સફળતા', 'સાચવેલમાંથી દૂર કર્યું');
              }
            } catch (error) {
              Alert.alert('ભૂલ', 'કંઈક ખોટું થયું');
            }
          }
        }
      ]
    );
  };

  const handlePostClick = (post) => {
    navigation.navigate('PostDetail', { post });
  };

  const renderFavoriteItem = ({ item }) => {
    const imageUrl = item.images && item.images.length > 0
      ? `http://lokbazzar.com/${item.images[0]}`
      : null;

    return (
      <TouchableOpacity
        style={styles.postCard}
        onPress={() => handlePostClick(item)}
        activeOpacity={0.7}
      >
        {/* Post Image */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.postImage, styles.noImage]}>
              <Text style={styles.noImageText}>📷</Text>
            </View>
          )}
          
          {/* Favorite Button on Image */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleRemoveFavorite(item.postId)}
          >
            <Text style={styles.favoriteIcon}>❤️</Text>
          </TouchableOpacity>
        </View>

        {/* Post Details */}
        <View style={styles.postContent}>
          <Text style={styles.postTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <Text style={styles.postPrice}>₹ {item.price?.toLocaleString('en-IN')}</Text>
          
          <View style={styles.postFooter}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {item.locationString}
              </Text>
            </View>
            
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.categoryName}</Text>
            </View>
          </View>

          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>👁️ {item.viewCount}</Text>
            <Text style={styles.metaText}>❤️ {item.favoriteCount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💔</Text>
      <Text style={styles.emptyTitle}>સાચવેલી પોસ્ટ નથી</Text>
      <Text style={styles.emptyText}>
        તમે હજુ સુધી કોઈ પોસ્ટ સાચવી નથી.{'\n'}
        તમને ગમતી પોસ્ટ પર ❤️ દબાવો.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.browseButtonText}>પોસ્ટ જુઓ</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.placeholder} />
          <Text style={styles.headerTitle}>સાચવેલું</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>લોડ થઈ રહ્યું છે...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.headerTitle}>સાચવેલું</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Favorites List */}
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.postId.toString()}
        contentContainerStyle={[
          styles.listContainer,
          favorites.length === 0 && styles.emptyListContainer
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      <BottomNavWrapper navigation={navigation} activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  emptyListContainer: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 60,
    opacity: 0.3,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  postContent: {
    padding: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  postPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 15,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
    elevation: 3,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});