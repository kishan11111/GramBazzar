import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');

  // Categories data
  const categories = [
    { id: 1, name: 'વાહનો', icon: '🚗', color: '#FF6B6B' },
    { id: 2, name: 'પશુ-પક્ષી', icon: '🐄', color: '#4ECDC4' },
    { id: 3, name: 'એગ્રીકલ્ચર', icon: '🌾', color: '#FFE66D' },
    { id: 4, name: 'ઈલેકટ્રોનિક', icon: '📱', color: '#95E1D3' },
    { id: 5, name: 'પ્રોપર્ટી', icon: '🏠', color: '#F38181' },
    { id: 6, name: 'ફર્નિચર', icon: '🪑', color: '#AA96DA' },
    { id: 7, name: 'ફેશન', icon: '👕', color: '#FCBAD3' },
    { id: 8, name: 'ઓટોમોબાઈલ સાધન', icon: '🔧', color: '#A8D8EA' },
    { id: 9, name: 'નોકરી વ્યવસાય', icon: '💼', color: '#FFA07A' },
    { id: 10, name: 'ટ્રેક્ટર લેન્વેચ', icon: '🚜', color: '#98D8C8' },
    { id: 11, name: 'હોર્સ લેન્વેચ', icon: '🐴', color: '#F7B731' },
    { id: 12, name: 'બાઇક લેન્વેચ', icon: '🏍️', color: '#5F27CD' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ખરીદવેચાણ</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>▶️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="શોધો..."
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerText}>🌾 ખેડૂત મિત્રો!</Text>
            <Text style={styles.bannerSubtext}>
              તમારી જરૂરિયાત, અમારી સેવા
            </Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200' }}
            style={styles.bannerImage}
          />
        </View>

        {/* Categories Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>વિભાગ પસંદ કરો</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>બધા જુઓ →</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>ઝડપથી</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📝</Text>
              <Text style={styles.actionText}>જાહેરાત મૂકો</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>ભાવ જાણો</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>🌤️</Text>
              <Text style={styles.actionText}>હવામાન</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>વૈયાર્ગયું</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.featuredCard}>
                <View style={styles.featuredImage}>
                  <Text style={styles.featuredIcon}>🚜</Text>
                </View>
                <Text style={styles.featuredTitle}>ટ્રેક્ટર</Text>
                <Text style={styles.featuredPrice}>₹ 5,50,000</Text>
                <Text style={styles.featuredLocation}>📍 અમદાવાદ</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.navIcon, activeTab === 'home' && styles.navIconActive]}>
            🏠
          </Text>
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>
            હોમ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('post')}
        >
          <View style={styles.addButton}>
            <Text style={styles.addIcon}>+</Text>
          </View>
          <Text style={styles.navText}>જાહેરાત કરો</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.navIcon, activeTab === 'favorites' && styles.navIconActive]}>
            ❤️
          </Text>
          <Text style={[styles.navText, activeTab === 'favorites' && styles.navTextActive]}>
            સાચવેલું
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('account')}
        >
          <Text style={[styles.navIcon, activeTab === 'account' && styles.navIconActive]}>
            👤
          </Text>
          <Text style={[styles.navText, activeTab === 'account' && styles.navTextActive]}>
            એકાઉન્ટ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  iconText: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#FFF9C4',
    margin: 15,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#FBC02D',
  },
  bannerContent: {
    flex: 1,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 5,
  },
  bannerSubtext: {
    fontSize: 14,
    color: '#F57F17',
  },
  bannerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  viewAll: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  quickActions: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  featuredSection: {
    marginTop: 20,
    paddingLeft: 15,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 15,
    width: 150,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  featuredImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F1F8E9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredIcon: {
    fontSize: 50,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 12,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  navText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addIcon: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});