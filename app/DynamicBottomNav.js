import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// components/BottomNavWrapper.js


export default function BottomNavWrapper({ navigation, activeTab: initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'home');

  const items = [
    { key: 'home', label: 'હોમ', icon: '🏠', type: 'navigate', screen: 'Dashboard' },
    { key: 'create', label: 'જાહેરાત કરો', icon: '+', isPrimary: true, type: 'navigate', screen: 'CreatePost' },
    { key: 'localcard', label: 'સ્થાનિક કાર્ડ', icon: '💼', type: 'navigate', screen: 'LocalCardHome' },
    { key: 'account', label: 'એકાઉન્ટ', icon: '👤', type: 'navigate', screen: 'Account' },
  ];

  return (
    <DynamicBottomNav
      navigation={navigation}
      items={items}
      initialActive={activeTab}
      onItemPress={setActiveTab}
    />
  );
}

export function DynamicBottomNav({
  navigation,
  items = [],
  initialActive = null,
  onItemPress,
}) {
  const [active, setActive] = useState(initialActive);

  const handlePress = (item) => {
    const { key, type, screen, params, onPress } = item;

    setActive(key);
    if (typeof onItemPress === 'function') {
      try { onItemPress(key); } catch (e) { /* swallow errors from parent */ }
    }

    if (typeof onPress === 'function') {
      onPress();
      return;
    }

    if (type === 'navigate' && navigation && screen) {
      navigation.navigate(screen, params);
      return;
    }

    // fallback: if item provides no navigation and no onPress, do nothing
  };

  // If no items passed, provide sane defaults
  const defaultItems = [
    { key: 'home', label: 'હોમ', icon: '🏠', type: 'navigate', screen: 'Dashboard' },
    { key: 'create', label: 'જાહેરાત', icon: '+', isPrimary: true, type: 'navigate', screen: 'CreatePost' },
    // replaced favorites with Local Card navigation
    { key: 'localcard', label: 'સ્થાનિક કાર્ડ', icon: '💼', type: 'navigate', screen: 'LocalCardHome' },
    { key: 'account', label: 'એકાઉન્ટ', icon: '👤', type: 'navigate', screen: 'Account' },
  ];

  const navItems = items.length > 0 ? items : defaultItems;

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = active === item.key;
        if (item.isPrimary) {
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.navItem}
              activeOpacity={0.9}
              onPress={() => handlePress(item)}
            >
              <View style={styles.primaryButton}>
                <Text style={styles.primaryIcon}>{item.icon}</Text>
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => handlePress(item)}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>{item.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
    color: '#666',
    opacity: 0.8,
  },
  iconActive: {
    color: '#4CAF50',
    transform: [{ scale: 1.05 }],
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  labelActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  primaryButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    elevation: 4,
  },
  primaryIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
});