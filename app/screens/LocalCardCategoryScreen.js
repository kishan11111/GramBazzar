import { useState } from 'react';
import {
    FlatList,
    Linking,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function LocalCardCategoryScreen({ navigation, route }) {
  const { category } = route.params;
  const [selectedSubCategory, setSelectedSubCategory] = useState('બધા');
  const [showFilters, setShowFilters] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedTaluka, setSelectedTaluka] = useState('');
  
  // Sample subcategories based on category
  const getSubCategories = () => {
    switch(category.key) {
      case 'labor':
        return ['બધા', 'મિસ્ત્રી', 'વેલ્ડીંગ', 'લોહાર', 'રંગકામ', 'પ્લમ્બર'];
      case 'vehicle':
        return ['બધા', 'ટ્રેક્ટર', 'ટ્રક', 'કાર', 'ઓટો', 'બસ'];
      case 'event':
        return ['બધા', 'ડીજે', 'કેટરિંગ', 'ડેકોરેશન', 'ફોટોગ્રાફી', 'બેન્ડ'];
      default:
        return ['બધા'];
    }
  };

  const subCategories = getSubCategories();

  // Sample cards data
  const [cards, setCards] = useState([
    {
      id: 1,
      name: 'લાલજીભાઈ મિસ્ત્રી',
      category: 'મિસ્ત્રી કામ',
      location: 'ઉંઝા, ધોળકા',
      distance: '1.2 km',
      phone: '9876543210',
      timing: 'સવારે 9 થી સાંજે 7',
      verified: true,
      image: '👷',
    },
    {
      id: 2,
      name: 'રમેશ ટ્રેક્ટર સેવા',
      category: 'ટ્રેક્ટર ભાડે',
      location: 'ખેડા, ધોળકા',
      distance: '3.5 km',
      phone: '9898765432',
      timing: '24 કલાક ઉપલબ્ધ',
      verified: false,
      image: '🚜',
    },
    {
      id: 3,
      name: 'મહેશ વેલ્ડીંગ વર્ક્સ',
      category: 'વેલ્ડીંગ કામ',
      location: 'મોટા ગામ, ધોળકા',
      distance: '5.2 km',
      phone: '9825123456',
      timing: 'સવારે 8 થી રાત્રે 8',
      verified: true,
      image: '⚡',
    },
    {
      id: 4,
      name: 'કિશન કારપેન્ટર',
      category: 'ફર્નિચર કામ',
      location: 'નવા ગામ, ધોળકા',
      distance: '2.8 km',
      phone: '9712345678',
      timing: 'સવારે 9 થી સાંજે 6',
      verified: true,
      image: '🪵',
    },
  ]);

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone) => {
    Linking.openURL(`https://wa.me/91${phone}`);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('LocalCardDetail', { card: item })}
      activeOpacity={0.9}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <View style={styles.cardImage}>
            <Text style={styles.cardImageIcon}>{item.image}</Text>
          </View>
        </View>
        
        <View style={styles.cardMiddle}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardName}>{item.name}</Text>
            {item.verified && <Text style={styles.verifiedBadge}>✓</Text>}
          </View>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardLocation}>📍 {item.location} ({item.distance})</Text>
          <Text style={styles.cardTiming}>⏰ {item.timing}</Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <Text style={styles.phoneNumber}>📞 {item.phone.substring(0, 5)}-XXXXX</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => handleCall(item.phone)}
          >
            <Text style={styles.callButtonText}>📞 કોલ</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.whatsappButton}
            onPress={() => handleWhatsApp(item.phone)}
          >
            <Text style={styles.whatsappButtonText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>ફિલ્ટર</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.filterSectionTitle}>📍 સ્થળ</Text>
          <View style={styles.filterOptions}>
            {['બધા', 'ધોળકા', 'ધંધુકા', 'વિરમગામ', 'સાણંદ'].map(taluka => (
              <TouchableOpacity
                key={taluka}
                style={[
                  styles.filterOption,
                  selectedTaluka === taluka && styles.filterOptionActive
                ]}
                onPress={() => setSelectedTaluka(taluka)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedTaluka === taluka && styles.filterOptionTextActive
                ]}>
                  {taluka}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterSectionTitle}>📏 અંતર</Text>
          <View style={styles.filterOptions}>
            {['5 km', '10 km', '25 km', 'બધા'].map(distance => (
              <TouchableOpacity
                key={distance}
                style={styles.filterOption}
              >
                <Text style={styles.filterOptionText}>{distance}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterSectionTitle}>✓ અન્ય</Text>
          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => setOnlyVerified(!onlyVerified)}
          >
            <View style={[styles.checkbox, onlyVerified && styles.checkboxChecked]}>
              {onlyVerified && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>ફક્ત વેરિફાઇડ કાર્ડ જ</Text>
          </TouchableOpacity>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setSelectedTaluka('');
                setOnlyVerified(false);
              }}
            >
              <Text style={styles.resetButtonText}>રીસેટ કરો</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>લાગુ કરો</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => navigation.navigate('LocalCardSearch')}
          >
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.filterIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SubCategory Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.subCategoryContainer}
      >
        {subCategories.map((subCat) => (
          <TouchableOpacity
            key={subCat}
            style={[
              styles.subCategoryTab,
              selectedSubCategory === subCat && styles.subCategoryTabActive
            ]}
            onPress={() => setSelectedSubCategory(subCat)}
          >
            <Text style={[
              styles.subCategoryText,
              selectedSubCategory === subCat && styles.subCategoryTextActive
            ]}>
              {subCat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>📍 તાલુકો ▼</Text>
        </TouchableOpacity>
        {onlyVerified && (
          <TouchableOpacity 
            style={[styles.filterChip, styles.filterChipActive]}
            onPress={() => setOnlyVerified(false)}
          >
            <Text style={styles.filterChipText}>✓ વેરિફાઇડ જ</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.filterChip}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterChipText}>⚙️ વધુ</Text>
        </TouchableOpacity>
      </View>

      {/* Cards List */}
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <FilterModal />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  searchButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
  },
  filterButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subCategoryContainer: {
    backgroundColor: '#FFFFFF',
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  subCategoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  subCategoryTabActive: {
    borderBottomColor: '#4CAF50',
  },
  subCategoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  subCategoryTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterChip: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: 12,
    color: '#333',
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cardLeft: {
    marginRight: 12,
  },
  cardImage: {
    width: 60,
    height: 60,
    backgroundColor: '#F1F8E9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageIcon: {
    fontSize: 30,
  },
  cardMiddle: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  verifiedBadge: {
    backgroundColor: '#2196F3',
    color: '#FFFFFF',
    borderRadius: 10,
    width: 18,
    height: 18,
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardCategory: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  cardTiming: {
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  phoneNumber: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 15,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#666',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filterOption: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterOptionActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 25,
    justifyContent: 'space-between',
  },
  resetButton: {
    flex: 0.45,
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 0.45,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});