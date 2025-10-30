import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TermsAndConditionsScreen({ navigation }) {
  const [language, setLanguage] = useState('gujarati'); // Default to Gujarati

  const toggleLanguage = () => {
    setLanguage(language === 'gujarati' ? 'english' : 'gujarati');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'gujarati' ? 'નિયમો અને શરતો' : 'Terms and Conditions'}
        </Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={toggleLanguage}
        >
          <Text style={styles.languageText}>
            {language === 'gujarati' ? 'English' : 'ગુજરાતી'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {language === 'gujarati' ? <GujaratiContent /> : <EnglishContent />}
      </ScrollView>
    </View>
  );
}

// Gujarati Content Component
const GujaratiContent = () => (
  <View>
    <Text style={styles.welcomeText}>
      લોકબજાર માં આપનું સ્વાગત છે! આ નિયમો અને શરતો અમારી એપ્લિકેશન અને સેવાઓના તમારા ઉપયોગને નિયંત્રિત કરે છે. લોકબજાર નો ઉપયોગ કરીને, તમે નીચે દર્શાવેલ શરતોનું પાલન કરવા અને તેનાથી બંધાયેલા રહેવા સંમત થાઓ છો. કૃપા કરીને તેને ધ્યાનપૂર્વક વાંચો.
    </Text>

    <Text style={styles.sectionTitle}>1. વપરાશકર્તાની જવાબદારીઓ</Text>

    <Text style={styles.subTitle}>1.1 એકાઉન્ટ અને માહિતીની ચોકસાઈ</Text>
    <Text style={styles.paragraph}>
      • નોંધણી દરમિયાન અને સામગ્રી પોસ્ટ કરતી વખતે વપરાશકર્તાઓએ સચોટ અને સંપૂર્ણ માહિતી પ્રદાન કરવી આવશ્યક છે.{'\n'}
      • વપરાશકર્તાઓ દ્વારા અપલોડ કરવામાં આવતી કોઈપણ માહિતી, સમાચાર, વિગતો અથવા જાહેરાતો સત્ય હોવી જોઈએ અને ભ્રામક ન હોવી જોઈએ.{'\n'}
      • વપરાશકર્તાઓ તેમના દ્વારા અપલોડ કરવામાં આવેલી સામગ્રીની ચોકસાઈ માટે સંપૂર્ણ રીતે જવાબદાર છે.
    </Text>

    <Text style={styles.subTitle}>1.2 સામગ્રીની માલિકી અને અધિકારો</Text>
    <Text style={styles.paragraph}>
      • સામગ્રી અપલોડ કરીને (ટેક્સ્ટ, છબીઓ, લોગો અને અન્ય સામગ્રી સહિત), વપરાશકર્તાઓ લોકબજાર ને પ્લેટફોર્મ પર આવી સામગ્રી પ્રકાશિત કરવાનો અધિકાર આપે છે.{'\n'}
      • વપરાશકર્તાઓએ ખાતરી કરવી જોઈએ કે અપલોડ કરવામાં આવેલી કોઈપણ સામગ્રી બૌદ્ધિક સંપત્તિ અધિકારો, ટ્રેડમાર્ક અથવા અન્યના ગોપનીયતા અધિકારોનું ઉલ્લંઘન કરતી નથી.
    </Text>

    <Text style={styles.subTitle}>1.3 સ્પામ, હાનિકારક અથવા ખોટી માહિતી</Text>
    <Text style={styles.paragraph}>
      • વપરાશકર્તાઓને સ્પામ, હાનિકારક, અપમાનજનક અથવા અયોગ્ય માહિતી અપલોડ કરવાની મનાઈ છે.{'\n'}
      • લોકબજાર આ શરતોનું ઉલ્લંઘન કરતા કોઈપણ વપરાશકર્તા એકાઉન્ટને બ્લોક અથવા સસ્પેન્ડ કરવાનો અધિકાર અનામત રાખે છે.{'\n'}
      • પ્રભાવિત પક્ષો દ્વારા ઉલ્લંઘન કરનાર વપરાશકર્તા સામે કાનૂની કાર્યવાહી પણ કરી શકાય છે.
    </Text>

    <Text style={styles.sectionTitle}>2. ગોપનીયતા અને ડેટા ઉપયોગ</Text>

    <Text style={styles.subTitle}>2.1 વ્યક્તિગત માહિતી સંગ્રહ</Text>
    <Text style={styles.paragraph}>
      • અમે વ્યક્તિગત માહિતી માત્ર ત્યારે જ એકત્રિત કરીએ છીએ જ્યારે વપરાશકર્તાઓ સ્વેચ્છાએ તે પ્રદાન કરે છે, જેમ કે નોંધણી દરમિયાન અથવા પ્લેટફોર્મ સુવિધાઓ સાથે ક્રિયાપ્રતિક્રિયા દરમિયાન.{'\n'}
      • વપરાશકર્તાઓ પ્લેટફોર્મની મુલાકાત અનામી રીતે લેવાનું પસંદ કરી શકે છે; જો કે, કેટલીક સુવિધાઓ માટે ઓળખ ચકાસણી જરૂરી હોઈ શકે છે.
    </Text>

    <Text style={styles.subTitle}>2.2 ડેટા શેરિંગ અને પ્રકાશન</Text>
    <Text style={styles.paragraph}>
      • નામ, સંપર્ક વિગતો અને સ્થાનો જેવી માહિતી તમારી પોસ્ટિંગના ભાગ રૂપે અન્ય વપરાશકર્તાઓને દૃશ્યમાન હોઈ શકે છે.{'\n'}
      • અમે વ્યક્તિગત ડેટા વેચતા, વેપાર કરતા અથવા ભાડે આપતા નથી.{'\n'}
      • વ્યક્તિગત રૂપે ઓળખી શકાય તેવી વિગતો વિના સામાન્ય વસ્તી વિષયક ડેટા વિશ્લેષણાત્મક હેતુઓ માટે વિશ્વસનીય સહયોગીઓ અને જાહેરાતકર્તાઓ સાથે શેર કરી શકાય છે.
    </Text>

    <Text style={styles.subTitle}>2.3 અપલોડ કરેલી સામગ્રી માટે જવાબદારી</Text>
    <Text style={styles.paragraph}>
      • એપ્લિકેશન વપરાશકર્તાઓ માટે માહિતી શેર કરવા માટેના માધ્યમ તરીકે કાર્ય કરે છે.{'\n'}
      • ખોટી, હાનિકારક અથવા છેતરપિંડીયુક્ત સામગ્રી અંગેના કોઈપણ વિવાદ અથવા દાવાઓ સામગ્રી અપલોડ કરનાર વપરાશકર્તાની સંપૂર્ણ જવાબદારી છે.{'\n'}
      • લોકબજાર આવા મુદ્દાઓ માટે જવાબદાર નથી.{'\n'}
      • જો વપરાશકર્તાઓ ખોટી અથવા હાનિકારક માહિતી ઓળખે છે, તો તેઓ પોસ્ટની જાણ કરી શકે છે અથવા ઈમેલ અથવા ફોન દ્વારા અમારી સહાયતા ટીમનો સંપર્ક કરીને તેને દૂર કરવા વિનંતી કરી શકે છે.
    </Text>

    <Text style={styles.subTitle}>2.4 ફી અને ચુકવણી</Text>
    <Text style={styles.paragraph}>
      • લોકબજાર વ્યવહારો, પ્રીમિયમ લિસ્ટિંગ્સ અથવા પ્લેટફોર્મ દ્વારા ઓફર કરવામાં આવતી અન્ય સેવાઓ માટે ફી વસૂલ કરી શકે છે.{'\n'}
      • તમામ લાગુ ફી સ્પષ્ટપણે જાહેર કરવામાં આવશે અને કોઈપણ વ્યવહાર પ્રક્રિયા કરતા પહેલા વપરાશકર્તા દ્વારા સંમતિ આપવી આવશ્યક છે.
    </Text>

    <Text style={styles.sectionTitle}>3. પ્લેટફોર્મ નિયંત્રણ અને સામગ્રી દૂર કરવી</Text>

    <Text style={styles.subTitle}>3.1 માહિતીની ચકાસણી</Text>
    <Text style={styles.paragraph}>
      • જ્યારે અમે વપરાશકર્તા-અપલોડ કરેલી સામગ્રીની સમીક્ષા અને ચકાસણી કરવાનો પ્રયાસ કરીએ છીએ, ઉચ્ચ ટ્રાફિક અથવા ઓપરેશનલ મર્યાદાઓને કારણે, કેટલીક સામગ્રીની સંપૂર્ણ સમીક્ષા ન થઈ શકે.{'\n'}
      • વપરાશકર્તાઓએ તેના પર કાર્યવાહી કરતા પહેલા માહિતીની અધિકૃતતાની સ્વતંત્ર રીતે ચકાસણી કરવી જોઈએ.
    </Text>

    <Text style={styles.subTitle}>3.2 પોસ્ટ દૂર કરવાની વિનંતીઓ</Text>
    <Text style={styles.paragraph}>
      • વપરાશકર્તાઓ એપ્લિકેશનના "મારી પોસ્ટ્સ" વિભાગમાં તેમની સક્રિય પોસ્ટ્સનું સંચાલન અને સમીક્ષા કરી શકે છે.{'\n'}
      • લોકબજાર વિનંતી પર પોસ્ટ્સ દૂર કરવામાં સહાયતા કરી શકે છે, અમારી ગ્રાહક સહાયતા ટીમની ઉપલબ્ધતાને આધીન.{'\n'}
      • આ વિનંતીઓ પૂર્ણ કરવામાં વિલંબ અથવા ભૂલો માટે લોકબજાર જવાબદાર નથી, કારણ કે આ સેવા મફત સૌજન્ય તરીકે પ્રદાન કરવામાં આવે છે.
    </Text>

    <Text style={styles.subTitle}>3.3 લિસ્ટિંગ્સ દૂર કરવાનો અધિકાર</Text>
    <Text style={styles.paragraph}>
      • લોકબજાર તેની નીતિઓનું ઉલ્લંઘન કરતી કોઈપણ લિસ્ટિંગ્સ દૂર કરવાનો અધિકાર અનામત રાખે છે.{'\n'}
      • આમાં ભ્રામક, અયોગ્ય અથવા ઉપયોગની શરતોનો ભંગ કરતી સામગ્રીનો સમાવેશ થાય છે, પરંતુ તે પૂરતો મર્યાદિત નથી.{'\n'}
      • વપરાશકર્તાઓને તેમની લિસ્ટિંગ્સ સક્રિય રહે તે સુનિશ્ચિત કરવા માટે તમામ માર્ગદર્શિકાઓની સમીક્ષા કરવા અને તેનું પાલન કરવા પ્રોત્સાહિત કરવામાં આવે છે.
    </Text>

    <Text style={styles.sectionTitle}>4. વપરાશકર્તા વર્તન અને કાનૂની જવાબદારી</Text>

    <Text style={styles.subTitle}>4.1 પ્રતિબંધિત આચરણ</Text>
    <Text style={styles.paragraph}>
      • વપરાશકર્તાઓએ સ્પામ, ગેરકાયદેસર, હાનિકારક, બદનક્ષીકારક અથવા અન્યને નુકસાન પહોંચાડે તેવી સામગ્રી અપલોડ અથવા શેર ન કરવી જોઈએ.{'\n'}
      • ઉલ્લંઘનને પરિણામે એકાઉન્ટ સસ્પેન્શન અથવા સમાપ્તિ થઈ શકે છે.{'\n'}
      • વપરાશકર્તાઓ પ્રભાવિત પક્ષો દ્વારા શરૂ કરાયેલી કાનૂની કાર્યવાહીનો સામનો કરી શકે છે.
    </Text>

    <Text style={styles.subTitle}>4.2 વિવાદ જવાબદારી</Text>
    <Text style={styles.paragraph}>
      • વપરાશકર્તા-અપલોડ કરેલી સામગ્રીથી ઉદ્ભવતા કોઈપણ વિવાદ અથવા નુકસાન ઉલ્લંઘન કરનાર વપરાશકર્તાની સંપૂર્ણ જવાબદારી છે.{'\n'}
      • લોકબજાર આવી કોઈપણ ઘટના માટે જવાબદારી અસ્વીકાર કરે છે.
    </Text>

    <Text style={styles.sectionTitle}>5. સંચાર</Text>
    <Text style={styles.paragraph}>
      લોકબજાર એકાઉન્ટ પ્રવૃત્તિ, અપડેટ્સ અને સેવાઓ અંગે ઈમેલ, SMS અથવા એપ્લિકેશન સૂચનાઓ દ્વારા વપરાશકર્તાઓ સાથે સંચાર કરી શકે છે. આ સંચારો આવશ્યક છે અને તેમાંથી બહાર નીકળી શકાતું નથી.
    </Text>

    <Text style={styles.sectionTitle}>6. નિયમો અને શરતોમાં ફેરફારો</Text>
    <Text style={styles.paragraph}>
      • લોકબજાર કોઈપણ સમયે આ નિયમો અને શરતોમાં ફેરફાર કરવાનો અધિકાર અનામત રાખે છે.{'\n'}
      • અપડેટ્સ પ્લેટફોર્મ પર પ્રકાશિત થયા પછી અસરકારક થશે.{'\n'}
      • એપ્લિકેશનનો ચાલુ ઉપયોગ સુધારેલી શરતોની સ્વીકૃતિ દર્શાવે છે.
    </Text>

    <Text style={styles.sectionTitle}>7. સંપર્ક માહિતી</Text>
    <Text style={styles.paragraph}>
      આ નિયમો અને શરતો અંગે કોઈપણ પ્રશ્નો અથવા ચિંતાઓ માટે, કૃપા કરીને અમારો સંપર્ક કરો:{'\n\n'}
      એપ્લિકેશન: લોકબજાર{'\n'}
      ઈમેલ: support@lokbazaar.com{'\n'}
      ફોન: +91-XXXXXXXXXX
    </Text>

    <Text style={styles.lastUpdated}>
      છેલ્લે અપડેટ કર્યું: {new Date().toLocaleDateString('en-GB')}
    </Text>
  </View>
);

// English Content Component
const EnglishContent = () => (
  <View>
    <Text style={styles.welcomeText}>
      Welcome to LokBazar! These Terms and Conditions govern your access to and use of our application and services. By using LokBazar, you agree to comply with and be bound by the terms outlined below. Please read them carefully.
    </Text>

    <Text style={styles.sectionTitle}>1. User Responsibilities</Text>

    <Text style={styles.subTitle}>1.1 Account and Information Accuracy</Text>
    <Text style={styles.paragraph}>
      • Users must provide accurate and complete information during registration and while posting content.{'\n'}
      • Any information uploaded by users, including news, details, or listings, must be truthful and not misleading.{'\n'}
      • Users are solely responsible for the accuracy of the content they upload.
    </Text>

    <Text style={styles.subTitle}>1.2 Content Ownership and Rights</Text>
    <Text style={styles.paragraph}>
      • By uploading content (including text, images, logos, and other materials), users grant LokBazar the right to publish such content on the platform.{'\n'}
      • Users must ensure that any content uploaded does not infringe upon the intellectual property rights, trademarks, or privacy rights of others.
    </Text>

    <Text style={styles.subTitle}>1.3 Spam, Harmful, or Incorrect Information</Text>
    <Text style={styles.paragraph}>
      • Users are prohibited from uploading spam, harmful, offensive, or inappropriate information.{'\n'}
      • LokBazar reserves the right to block or suspend any user account found violating these terms.{'\n'}
      • Legal action may also be pursued by affected parties against the offending user.
    </Text>

    <Text style={styles.sectionTitle}>2. Privacy and Data Use</Text>

    <Text style={styles.subTitle}>2.1 Personal Information Collection</Text>
    <Text style={styles.paragraph}>
      • We collect personal information only when users voluntarily provide it, such as during registration or interaction with platform features.{'\n'}
      • Users may choose to visit the platform anonymously; however, certain features may require identity verification.
    </Text>

    <Text style={styles.subTitle}>2.2 Data Sharing and Publication</Text>
    <Text style={styles.paragraph}>
      • Information such as names, contact details, and locations may be visible to other users as part of your postings.{'\n'}
      • We do not sell, trade, or rent personal data.{'\n'}
      • Generic demographic data, without personally identifiable details, may be shared with trusted affiliates and advertisers for analytical purposes.
    </Text>

    <Text style={styles.subTitle}>2.3 Liability for Uploaded Content</Text>
    <Text style={styles.paragraph}>
      • The application acts as a medium for users to share information.{'\n'}
      • Any disputes or claims regarding incorrect, harmful, or fraudulent content are the sole responsibility of the user who uploaded the content.{'\n'}
      • LokBazar is not liable for such issues.{'\n'}
      • If users identify incorrect or harmful information, they can report the post or request its removal by contacting our support team via email or phone.
    </Text>

    <Text style={styles.subTitle}>2.4 Fees and Payments</Text>
    <Text style={styles.paragraph}>
      • LokBazar may charge fees for transactions, premium listings, or other services offered through the platform.{'\n'}
      • All applicable fees will be clearly disclosed and must be agreed upon by the user before any transaction is processed.
    </Text>

    <Text style={styles.sectionTitle}>3. Platform Moderation and Content Removal</Text>

    <Text style={styles.subTitle}>3.1 Verification of Information</Text>
    <Text style={styles.paragraph}>
      • While we strive to review and verify user-uploaded content, due to high traffic or operational constraints, some content may not be thoroughly reviewed.{'\n'}
      • Users should independently verify the authenticity of the information before acting on it.
    </Text>

    <Text style={styles.subTitle}>3.2 Post Removal Requests</Text>
    <Text style={styles.paragraph}>
      • Users can manage and review their active posts in the "My Posts" section of the app.{'\n'}
      • LokBazar may assist in removing posts upon request, subject to the availability of our customer support team.{'\n'}
      • Delays or errors in fulfilling these requests are not the responsibility of LokBazar, as this service is provided as a free courtesy.
    </Text>

    <Text style={styles.subTitle}>3.3 Right to Remove Listings</Text>
    <Text style={styles.paragraph}>
      • LokBazar reserves the right to remove any listings that violate its policies.{'\n'}
      • This includes, but is not limited to, content that is misleading, inappropriate, or breaches any terms of use.{'\n'}
      • Users are encouraged to review and comply with all guidelines to ensure their listings remain active and in good standing.
    </Text>

    <Text style={styles.sectionTitle}>4. User Behavior and Legal Accountability</Text>

    <Text style={styles.subTitle}>4.1 Prohibited Conduct</Text>
    <Text style={styles.paragraph}>
      • Users must not upload or share content that is spam, illegal, harmful, defamatory, or likely to harm others.{'\n'}
      • Violations may result in account suspension or termination.{'\n'}
      • Users may face legal action initiated by affected parties.
    </Text>

    <Text style={styles.subTitle}>4.2 Dispute Responsibility</Text>
    <Text style={styles.paragraph}>
      • Any disputes or harm arising from user-uploaded content are solely the responsibility of the offending user.{'\n'}
      • LokBazar disclaims liability for any such incidents.
    </Text>

    <Text style={styles.sectionTitle}>5. Communication</Text>
    <Text style={styles.paragraph}>
      LokBazar may communicate with users via email, SMS, or app notifications regarding account activity, updates, and services. These communications are essential and cannot be opted out of.
    </Text>

    <Text style={styles.sectionTitle}>6. Changes to Terms and Conditions</Text>
    <Text style={styles.paragraph}>
      • LokBazar reserves the right to modify these Terms and Conditions at any time.{'\n'}
      • Updates will be effective once published on the platform.{'\n'}
      • Continued use of the app constitutes acceptance of the revised terms.
    </Text>

    <Text style={styles.sectionTitle}>7. Contact Information</Text>
    <Text style={styles.paragraph}>
      For any queries or concerns regarding these Terms and Conditions, please contact us:{'\n\n'}
      Application: LokBazar{'\n'}
      Email: support@lokbazaar.com{'\n'}
      Phone: +91-XXXXXXXXXX
    </Text>

    <Text style={styles.lastUpdated}>
      Last Updated: {new Date().toLocaleDateString('en-GB')}
    </Text>
  </View>
);

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
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    marginBottom: 25,
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 20,
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#388E3C',
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 10,
    textAlign: 'justify',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 30,
    textAlign: 'center',
  },
});
