import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  StyleSheet, Text, View, FlatList, ActivityIndicator,
  TextInput, Image, TouchableOpacity, ScrollView, BackHandler, Alert,
  KeyboardAvoidingView, Platform, Switch,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

const BASE_URL = 'https://lezzetkodu-backend-production.up.railway.app';

const lightColors = {
  bg: '#f7f7f9', card: '#ffffff', text: '#1a1a1a', sub: '#777', border: '#ececec',
  accent: '#e53935', accentText: '#fff', chipBg: '#efefef', chipText: '#333',
  header: '#e53935', barBg: '#ffffff', barBorder: '#eee', inputBg: '#fff', inputBorder: '#ddd', meta: '#f5f5f5',
  bubbleMine: '#e53935', bubbleMineText: '#fff', bubbleOther: '#ececec', bubbleOtherText: '#1a1a1a',
};
const darkColors = {
  bg: '#0f0f12', card: '#1b1b20', text: '#f5f5f5', sub: '#9a9aa2', border: '#2a2a30',
  accent: '#ff5a5f', accentText: '#fff', chipBg: '#26262c', chipText: '#ddd',
  header: '#b0282b', barBg: '#17171b', barBorder: '#2a2a30', inputBg: '#1b1b20', inputBorder: '#2f2f36', meta: '#1f1f25',
  bubbleMine: '#b0282b', bubbleMineText: '#fff', bubbleOther: '#26262c', bubbleOtherText: '#f5f5f5',
};

const STR: any = {
  tr: {
    explore: 'Keşfet', favorites: 'Favoriler', settings: 'Ayarlar', add: 'Ekle',
    messages: 'Mesajlar', profile: 'Profil',
    search: 'Tarif ara...', all: 'Tümü', loading: 'Yükleniyor...',
    noResults: 'Sonuç bulunamadı.', noneCat: 'Bu kategoride tarif yok.',
    favEmpty: 'Henüz favori tarifin yok.', login: 'Giriş Yap',
    emailOrUsername: 'E-posta veya kullanıcı adı', password: 'Şifre',
    loginFail: 'Giriş başarısız', logout: 'Çıkış Yap', theme: 'Tema',
    light: 'Açık', dark: 'Koyu', language: 'Dil', about: 'Hakkında',
    aboutText: 'LezzetKodu Mobile — React Native (Expo) ile geliştirildi. Kendi Spring Boot backend API\'sine bağlanır.\n\nGeliştirici: Kaan Yıldız',
    back: 'Geri', ingredients: 'Malzemeler', howto: 'Yapılışı',
    time: 'Süre', servings: 'Porsiyon', difficulty: 'Zorluk', calories: 'Kalori',
    fetchFail: 'Veri alınamadı', min: 'dk',
    register: 'Kayıt Ol', forgotTitle: 'Şifremi Unuttum',
    noAccount: 'Hesabın yok mu? Kayıt ol', forgotLink: 'Şifreni mi unuttun?',
    haveAccount: 'Zaten hesabın var mı? Giriş yap',
    username: 'Kullanıcı adı', email: 'E-posta', newPassword: 'Yeni şifre',
    resetCode: 'E-postana gelen kod', sendCode: 'Kod Gönder', resetPassword: 'Şifreyi Sıfırla',
    codeSent: 'Kod e-postana gönderildi.', registerFail: 'Kayıt başarısız',
    resetFail: 'Sıfırlama başarısız', resetDone: 'Şifren güncellendi, giriş yapabilirsin.',
    backToLogin: '‹ Girişe dön', info: 'Bilgi', ok: 'Tamam',
    newRecipe: 'Yeni Tarif', rTitle: 'Başlık', rDesc: 'Açıklama', rCategory: 'Kategori',
    easy: 'Kolay', medium: 'Orta', hard: 'Zor', rPrep: 'Hazırlık (dk)', rCook: 'Pişirme (dk)',
    rServings: 'Porsiyon', rSteps: 'Yapılış adımları', rIngredients: 'Malzemeler (virgülle ayır)',
    rCalories: 'Kalori', pickImage: '📷 Fotoğraf Seç', photoRequired: 'Lütfen bir fotoğraf seç',
    titleRequired: 'Başlık gerekli', stepsRequired: 'Yapılış gerekli', categoryRequired: 'Kategori seç',
    publish: 'Yayınla', publishing: 'Yayınlanıyor...', published: 'Tarif yayınlandı!', publishFail: 'Yayınlama başarısız',
    follow: 'Takip Et', unfollow: 'Takibi Bırak', requested: 'İstek Gönderildi', message: 'Mesaj',
    followers: 'Takipçi', following: 'Takip', recipesCount: 'Tarif',
    followRequests: 'Takip İstekleri', accept: 'Kabul', reject: 'Reddet',
    noRequests: 'Bekleyen istek yok.', noConversations: 'Henüz mesajın yok.',
    searchUser: 'Kullanıcı ara...', typeMessage: 'Mesaj yaz...', send: 'Gönder',
    msgFail: 'Mesaj gönderilemedi (karşılıklı takip gerekebilir)', noBio: 'Henüz biyografi yok.',
    you: 'Sen', privateAccount: 'Bu hesap gizli. Paylaşımlarını ve takipçilerini görmek için takip et.', emptyList: 'Kimse yok.',
    myProfile: 'Profilim', emptyRecipes: 'Henüz tarif yok.',
    comments: 'Yorumlar', noComments: 'Henüz yorum yok. İlk yorumu sen yap!', writeComment: 'Yorum yaz...',
    myRecipes: 'Tariflerim', recipesTitle: 'Tarifler', deleteCommentQ: 'Yorum silinsin mi?', delete: 'Sil', cancel: 'Vazgeç',
    users: 'Kullanıcılar', searchUserHint: 'Aramak için en az 2 harf yaz', privacyLabel: 'Gizli Hesap', privacy: 'Gizlilik',
    edit: 'Düzenle', save: 'Kaydet', editProfile: 'Profili Düzenle', editRecipe: 'Tarifi Düzenle',
    deleteRecipeQ: 'Bu tarif silinsin mi?', updated: 'Güncellendi!', editingMsg: 'Mesaj düzenleniyor',
    editMessage: 'Düzenle', deleteMessageQ: 'Mesaj silinsin mi?', changePhoto: '📷 Fotoğrafı Değiştir',
    rating: 'Puan', bio: 'Biyografi', noRatingYet: 'Henüz puan yok',
    rateTitle: 'Bu tarifi puanla', rated: 'Puanın kaydedildi!', rateFail: 'Puan gönderilemedi',
  },
  en: {
    explore: 'Explore', favorites: 'Favorites', settings: 'Settings', add: 'Add',
    messages: 'Messages', profile: 'Profile',
    search: 'Search recipes...', all: 'All', loading: 'Loading...',
    noResults: 'No results found.', noneCat: 'No recipes in this category.',
    favEmpty: 'You have no favorite recipes yet.', login: 'Sign In',
    emailOrUsername: 'Email or username', password: 'Password',
    loginFail: 'Login failed', logout: 'Log Out', theme: 'Theme',
    light: 'Light', dark: 'Dark', language: 'Language', about: 'About',
    aboutText: 'LezzetKodu Mobile — built with React Native (Expo). Connects to its own Spring Boot backend API.\n\nDeveloper: Kaan Yildiz',
    back: 'Back', ingredients: 'Ingredients', howto: 'Instructions',
    time: 'Time', servings: 'Servings', difficulty: 'Difficulty', calories: 'Calories',
    fetchFail: 'Could not fetch data', min: 'min',
    register: 'Sign Up', forgotTitle: 'Forgot Password',
    noAccount: "Don't have an account? Sign up", forgotLink: 'Forgot your password?',
    haveAccount: 'Already have an account? Sign in',
    username: 'Username', email: 'Email', newPassword: 'New password',
    resetCode: 'Code from your email', sendCode: 'Send Code', resetPassword: 'Reset Password',
    codeSent: 'Code sent to your email.', registerFail: 'Registration failed',
    resetFail: 'Reset failed', resetDone: 'Password updated, you can sign in.',
    backToLogin: '‹ Back to sign in', info: 'Info', ok: 'OK',
    newRecipe: 'New Recipe', rTitle: 'Title', rDesc: 'Description', rCategory: 'Category',
    easy: 'Easy', medium: 'Medium', hard: 'Hard', rPrep: 'Prep (min)', rCook: 'Cook (min)',
    rServings: 'Servings', rSteps: 'Steps', rIngredients: 'Ingredients (comma separated)',
    rCalories: 'Calories', pickImage: '📷 Pick Photo', photoRequired: 'Please pick a photo',
    titleRequired: 'Title required', stepsRequired: 'Steps required', categoryRequired: 'Select a category',
    publish: 'Publish', publishing: 'Publishing...', published: 'Recipe published!', publishFail: 'Publish failed',
    follow: 'Follow', unfollow: 'Unfollow', requested: 'Requested', message: 'Message',
    followers: 'Followers', following: 'Following', recipesCount: 'Recipes',
    followRequests: 'Follow Requests', accept: 'Accept', reject: 'Reject',
    noRequests: 'No pending requests.', noConversations: 'No conversations yet.',
    searchUser: 'Search users...', typeMessage: 'Type a message...', send: 'Send',
    msgFail: 'Message failed (mutual follow may be required)', noBio: 'No bio yet.',
    you: 'You', privateAccount: 'This account is private. Follow to see their posts and followers.', emptyList: 'Nobody here.',
    myProfile: 'My Profile', emptyRecipes: 'No recipes yet.',
    comments: 'Comments', noComments: 'No comments yet. Be the first!', writeComment: 'Write a comment...',
    myRecipes: 'My Recipes', recipesTitle: 'Recipes', deleteCommentQ: 'Delete this comment?', delete: 'Delete', cancel: 'Cancel',
    users: 'Users', searchUserHint: 'Type at least 2 letters to search', privacyLabel: 'Private Account', privacy: 'Privacy',
    edit: 'Edit', save: 'Save', editProfile: 'Edit Profile', editRecipe: 'Edit Recipe',
    deleteRecipeQ: 'Delete this recipe?', updated: 'Updated!', editingMsg: 'Editing message',
    editMessage: 'Edit', deleteMessageQ: 'Delete this message?', changePhoto: '📷 Change Photo',
    rating: 'Rating', bio: 'Bio', noRatingYet: 'No ratings yet',
    rateTitle: 'Rate this recipe', rated: 'Your rating is saved!', rateFail: 'Could not submit rating',
  },
};

const AppContext = createContext<any>(null);
const useApp = () => useContext(AppContext);

type Recipe = {
  id: number; title: string; description: string | null;
  imageUrl: string | null; username: string; isFavoritedByCurrentUser: boolean;
};
type Ingredient = { id: number; name: string; quantity: number; unit: string };
type RecipeDetail = Recipe & {
  prepTime: number; cookTime: number; totalTime: number; servings: number;
  steps: string; difficulty: string; totalCalories: number; ingredients: Ingredient[];
  userId: number; categoryId: number | null; averageRating: number | null;
  proteinAmount: number | null; carbAmount: number | null; fatAmount: number | null;
};
type Category = { id: number; name: string; emoji: string | null };
type Me = { id: number; username: string; profileImageUrl?: string | null } | null;
type PublicProfile = {
  id: number; username: string; bio: string | null; profileImageUrl: string | null;
  isPrivate: boolean; recipeCount: number; favoriteCount: number; trialCount: number;
  followerCount: number; followingCount: number;
  isFollowedByMe: boolean; isBlockedByMe: boolean;
  hasPendingRequest: boolean; hasIncomingRequest: boolean; incomingRequestId: number | null;
};
type Conversation = {
  userId: number; username: string; profileImageUrl: string | null;
  lastMessage: string | null; isLastMessageMine: boolean; unreadCount: number; lastMessageTime: string;
};
type Message = {
  id: number; senderId: number; senderUsername: string; receiverId: number;
  content: string; isRead: boolean; createdAt: string;
};
type Comment = {
  id: number; userId: number; username: string; userProfileImage: string | null;
  recipeId: number; content: string; createdAt: string;
};
type Nav =
  | { k: 'recipe'; id: number }
  | { k: 'user'; userId: number }
  | { k: 'chat'; userId: number; username: string }
  | { k: 'requests' }
  | { k: 'userlist'; mode: 'followers' | 'following'; userId: number; title: string };

const bearer = (token: string) => ({ Authorization: 'Bearer ' + token });

function fmtTime(iso: string) {
  try { const d = new Date(iso); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); } catch (e) { return ''; }
}
function fmtDate(iso: string) {
  try {
    const d = new Date(iso); const now = new Date();
    const sameY = d.getFullYear() === now.getFullYear();
    return d.toLocaleDateString(undefined, sameY ? { day: 'numeric', month: 'long' } : { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) { return ''; }
}
function sameDay(a: string, b: string) {
  try { const x = new Date(a), y = new Date(b); return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate(); } catch (e) { return true; }
}

// ============ KÖK ============
export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [mode, setModeState] = useState<'light' | 'dark'>('light');
  const [lang, setLangState] = useState<'tr' | 'en'>('tr');

  useEffect(() => {
    (async () => {
      try {
        const tk = await SecureStore.getItemAsync('token');
        const md = await SecureStore.getItemAsync('mode');
        const lg = await SecureStore.getItemAsync('lang');
        if (tk) setToken(tk);
        if (md === 'dark' || md === 'light') setModeState(md);
        if (lg === 'tr' || lg === 'en') setLangState(lg);
      } catch (e) {} finally { setChecking(false); }
    })();
  }, []);

  async function setMode(m: 'light' | 'dark') { setModeState(m); try { await SecureStore.setItemAsync('mode', m); } catch (e) {} }
  async function setLang(l: 'tr' | 'en') { setLangState(l); try { await SecureStore.setItemAsync('lang', l); } catch (e) {} }

  async function girisBasarili(yeniToken: string) { await SecureStore.setItemAsync('token', yeniToken); setToken(yeniToken); }
  async function cikisYap() { await SecureStore.deleteItemAsync('token'); setToken(null); }

  const colors = mode === 'dark' ? darkColors : lightColors;
  const t = (k: string) => STR[lang][k] ?? k;
  const ctx = { colors, mode, setMode, lang, setLang, t, dark: mode === 'dark' };

  let content;
  if (checking) {
    content = <View style={[styles.merkez, { backgroundColor: colors.bg }]}><ActivityIndicator size="large" color={colors.accent} /></View>;
  } else if (!token) {
    content = <AuthFlow onLoggedIn={girisBasarili} />;
  } else {
    content = <AuthedApp token={token} onLogout={cikisYap} />;
  }

  return (
    <SafeAreaProvider>
      <AppContext.Provider value={ctx}>
        {content}
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      </AppContext.Provider>
    </SafeAreaProvider>
  );
}

// ============ AUTH ============
function AuthFlow({ onLoggedIn }: { onLoggedIn: (token: string) => void }) {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  if (view === 'register') return <RegisterScreen onLoggedIn={onLoggedIn} onBack={() => setView('login')} />;
  if (view === 'forgot') return <ForgotScreen onBack={() => setView('login')} />;
  return <LoginScreen onLoggedIn={onLoggedIn} onRegister={() => setView('register')} onForgot={() => setView('forgot')} />;
}

function LoginScreen({ onLoggedIn, onRegister, onForgot }: { onLoggedIn: (t: string) => void; onRegister: () => void; onForgot: () => void }) {
  const { colors, t } = useApp();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function girisYap() {
    try {
      setLoading(true); setError(null);
      const cevap = await fetch(BASE_URL + '/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      if (!cevap.ok) throw new Error(t('loginFail') + ' (' + cevap.status + ')');
      const veri = await cevap.json();
      onLoggedIn(veri.token);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  return (
    <View style={[styles.loginContainer, { backgroundColor: colors.bg }]}>
      <Text style={[styles.logo, { color: colors.accent }]}>LezzetKodu 🍅</Text>
      <Text style={[styles.loginAlt, { color: colors.sub }]}>{t('login')}</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder={t('emailOrUsername')} placeholderTextColor={colors.sub} autoCapitalize="none" autoCorrect={false}
        value={emailOrUsername} onChangeText={setEmailOrUsername} />
      <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder={t('password')} placeholderTextColor={colors.sub} secureTextEntry autoCapitalize="none" autoCorrect={false}
        value={password} onChangeText={setPassword} />
      {error && <Text style={styles.hata}>{error}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 16 }} />
      ) : (
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={girisYap} activeOpacity={0.85}>
          <Text style={[styles.primaryBtnText, { color: colors.accentText }]}>{t('login')}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onForgot} style={{ marginTop: 18 }}><Text style={[styles.link, { color: colors.sub }]}>{t('forgotLink')}</Text></TouchableOpacity>
      <TouchableOpacity onPress={onRegister} style={{ marginTop: 10 }}><Text style={[styles.link, { color: colors.accent }]}>{t('noAccount')}</Text></TouchableOpacity>
    </View>
  );
}

function RegisterScreen({ onLoggedIn, onBack }: { onLoggedIn: (t: string) => void; onBack: () => void }) {
  const { colors, t } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function kayitOl() {
    try {
      setLoading(true); setError(null);
      const cevap = await fetch(BASE_URL + '/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!cevap.ok) throw new Error(t('registerFail') + ' (' + cevap.status + ')');
      const veri = await cevap.json();
      onLoggedIn(veri.token);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  return (
    <View style={[styles.loginContainer, { backgroundColor: colors.bg }]}>
      <Text style={[styles.logo, { color: colors.accent }]}>LezzetKodu 🍅</Text>
      <Text style={[styles.loginAlt, { color: colors.sub }]}>{t('register')}</Text>
      <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder={t('username')} placeholderTextColor={colors.sub} autoCapitalize="none" autoCorrect={false}
        value={username} onChangeText={setUsername} />
      <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder={t('email')} placeholderTextColor={colors.sub} autoCapitalize="none" autoCorrect={false} keyboardType="email-address"
        value={email} onChangeText={setEmail} />
      <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder={t('password')} placeholderTextColor={colors.sub} secureTextEntry autoCapitalize="none" autoCorrect={false}
        value={password} onChangeText={setPassword} />
      {error && <Text style={styles.hata}>{error}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 16 }} />
      ) : (
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={kayitOl} activeOpacity={0.85}>
          <Text style={[styles.primaryBtnText, { color: colors.accentText }]}>{t('register')}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onBack} style={{ marginTop: 18 }}><Text style={[styles.link, { color: colors.accent }]}>{t('haveAccount')}</Text></TouchableOpacity>
    </View>
  );
}

function ForgotScreen({ onBack }: { onBack: () => void }) {
  const { colors, t } = useApp();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function kodGonder() {
    try {
      setLoading(true); setError(null);
      const cevap = await fetch(BASE_URL + '/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!cevap.ok) throw new Error(t('resetFail') + ' (' + cevap.status + ')');
      Alert.alert(t('info'), t('codeSent'), [{ text: t('ok') }]);
      setStep('reset');
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  async function sifreSifirla() {
    try {
      setLoading(true); setError(null);
      const cevap = await fetch(BASE_URL + '/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode, newPassword }),
      });
      if (!cevap.ok) throw new Error(t('resetFail') + ' (' + cevap.status + ')');
      Alert.alert(t('info'), t('resetDone'), [{ text: t('ok'), onPress: onBack }]);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  return (
    <View style={[styles.loginContainer, { backgroundColor: colors.bg }]}>
      <Text style={[styles.logo, { color: colors.accent }]}>LezzetKodu 🍅</Text>
      <Text style={[styles.loginAlt, { color: colors.sub }]}>{t('forgotTitle')}</Text>
      {step === 'request' ? (
        <>
          <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
            placeholder={t('email')} placeholderTextColor={colors.sub} autoCapitalize="none" autoCorrect={false} keyboardType="email-address"
            value={email} onChangeText={setEmail} />
          {error && <Text style={styles.hata}>{error}</Text>}
          {loading ? <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 16 }} /> : (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={kodGonder} activeOpacity={0.85}>
              <Text style={[styles.primaryBtnText, { color: colors.accentText }]}>{t('sendCode')}</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
            placeholder={t('resetCode')} placeholderTextColor={colors.sub} autoCapitalize="none" autoCorrect={false}
            value={resetCode} onChangeText={setResetCode} />
          <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
            placeholder={t('newPassword')} placeholderTextColor={colors.sub} secureTextEntry autoCapitalize="none" autoCorrect={false}
            value={newPassword} onChangeText={setNewPassword} />
          {error && <Text style={styles.hata}>{error}</Text>}
          {loading ? <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 16 }} /> : (
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={sifreSifirla} activeOpacity={0.85}>
              <Text style={[styles.primaryBtnText, { color: colors.accentText }]}>{t('resetPassword')}</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <TouchableOpacity onPress={onBack} style={{ marginTop: 18 }}><Text style={[styles.link, { color: colors.accent }]}>{t('backToLogin')}</Text></TouchableOpacity>
    </View>
  );
}

// ============ ORTAK ============
function Avatar({ uri, size = 48, name }: { uri?: string | null; size?: number; name?: string }) {
  const { colors } = useApp();
  if (uri) return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.meta }} />;
  const initial = (name || '?').charAt(0).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.4 }}>{initial}</Text>
    </View>
  );
}

function Stars({ value, size = 16 }: { value: number | null; size?: number }) {
  const { colors } = useApp();
  const v = value || 0;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Text key={n} style={{ fontSize: size, color: n <= Math.round(v) ? '#f5a623' : colors.border }}>★</Text>
      ))}
    </View>
  );
}

function RateStars({ current, onRate }: { current: number; onRate: (v: number) => void }) {
  const { colors } = useApp();
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onRate(n)} activeOpacity={0.7}>
          <Text style={{ fontSize: 32, marginRight: 6, color: n <= current ? '#f5a623' : colors.border }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  const { colors, t } = useApp();
  return (
    <View style={[styles.detailTop, { backgroundColor: colors.header, flexDirection: 'row', alignItems: 'center' }]}>
      <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.detailBack}>‹ {t('back')}</Text>
      </TouchableOpacity>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 14 }} numberOfLines={1}>{title}</Text>
    </View>
  );
}

// ============ KABUK ============
function AuthedApp({ token, onLogout }: { token: string; onLogout: () => void }) {
  const { colors, t } = useApp();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'explore' | 'favorites' | 'add' | 'messages' | 'profile'>('explore');
  const [stack, setStack] = useState<Nav[]>([]);
  const [me, setMe] = useState<Me>(null);
  const [unread, setUnread] = useState(0);

  // Kendi kimliğim (id + kullanıcı adı)
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(BASE_URL + '/api/users/me', { headers: bearer(token) });
        if (r.ok) {
          const d = await r.json();
          setMe({ id: d.id ?? d.userId, username: d.username, profileImageUrl: d.profileImageUrl });
        }
      } catch (e) {}
    })();
  }, [token]);

  // Okunmamış mesaj sayısı (mesaj sekmesi rozeti)
  useEffect(() => {
    let on = true;
    const f = async () => {
      try {
        const r = await fetch(BASE_URL + '/api/messages/unread-count', { headers: bearer(token) });
        if (r.ok) { const d = await r.json(); if (on) setUnread(d.count || 0); }
      } catch (e) {}
    };
    f();
    const i = setInterval(f, 10000);
    return () => { on = false; clearInterval(i); };
  }, [token]);

  const push = (n: Nav) => setStack((s) => [...s, n]);
  const pop = () => setStack((s) => s.slice(0, -1));

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 0) { pop(); return true; }
      if (tab !== 'explore') { setTab('explore'); return true; }
      return false;
    });
    return () => sub.remove();
  }, [stack, tab]);

  // Kullanıcı adından profile git (tariflerde @kullanıcı'ya tıklanınca)
  async function openUsername(username: string) {
    if (me && username.toLowerCase() === me.username.toLowerCase()) { setStack([]); setTab('profile'); return; }
    try {
      const r = await fetch(BASE_URL + '/api/social/search/users?query=' + encodeURIComponent(username) + '&size=10', { headers: bearer(token) });
      if (!r.ok) return;
      const list: PublicProfile[] = await r.json();
      const hit = list.find((u) => u.username?.toLowerCase() === username.toLowerCase());
      if (hit) push({ k: 'user', userId: hit.id });
    } catch (e) {}
  }

  const top = stack[stack.length - 1];

  if (top) {
    if (top.k === 'recipe') return <RecipeDetailScreen token={token} me={me} recipeId={top.id} onBack={pop} onUser={openUsername} />;
    if (top.k === 'user') return <UserProfileScreen token={token} userId={top.userId} onBack={pop} push={push} />;
    if (top.k === 'chat') return <ChatScreen token={token} me={me} userId={top.userId} username={top.username} onBack={pop} onOpenProfile={() => push({ k: 'user', userId: top.userId })} />;
    if (top.k === 'requests') return <RequestsScreen token={token} onBack={pop} push={push} />;
    if (top.k === 'userlist') return <UserListScreen token={token} mode={top.mode} userId={top.userId} title={top.title} onBack={pop} push={push} />;
  }

  const tabs: [typeof tab, string][] = [
    ['explore', '🍽️'], ['favorites', '❤️'], ['add', '➕'], ['messages', '💬'], ['profile', '👤'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1 }}>
        {tab === 'explore' && <ExploreScreen token={token} onOpen={(id) => push({ k: 'recipe', id })} onUser={openUsername} onOpenUserId={(id) => push({ k: 'user', userId: id })} />}
        {tab === 'favorites' && <FavoritesScreen token={token} onOpen={(id) => push({ k: 'recipe', id })} onUser={openUsername} />}
        {tab === 'add' && <AddRecipeScreen token={token} onDone={() => setTab('explore')} />}
        {tab === 'messages' && <ConversationsScreen token={token} push={push} />}
        {tab === 'profile' && <MyProfileScreen token={token} me={me} onLogout={onLogout} push={push} />}
      </View>
      <View style={[styles.bar, { backgroundColor: colors.barBg, borderTopColor: colors.barBorder, paddingBottom: insets.bottom + 8 }]}>
        {tabs.map(([key, icon]) => (
          <TouchableOpacity key={key} style={styles.barItem} onPress={() => setTab(key)} activeOpacity={0.7}>
            <View>
              <Text style={[styles.barIcon, { opacity: tab === key ? 1 : 0.45 }]}>{icon}</Text>
              {key === 'messages' && unread > 0 && (
                <View style={styles.badge}><Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text></View>
              )}
            </View>
            <Text style={[styles.barLabel, { color: tab === key ? colors.accent : colors.sub }]}>{t(key)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function Header() {
  const { colors } = useApp();
  return (
    <View style={[styles.headerBand, { backgroundColor: colors.header }]}>
      <Text style={styles.headerTitle}>LezzetKodu 🍅</Text>
    </View>
  );
}

function RecipeCard({ item, onOpen, onToggleFav, onUser }: { item: Recipe; onOpen: () => void; onToggleFav: () => void; onUser: (u: string) => void }) {
  const { colors } = useApp();
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onOpen}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View>
        {item.imageUrl
          ? <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
          : <View style={[styles.cardImage, { backgroundColor: colors.meta }]} />}
        <TouchableOpacity style={styles.heartBtn} onPress={onToggleFav} activeOpacity={0.7}>
          <Text style={styles.heartIcon}>{item.isFavoritedByCurrentUser ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
        <TouchableOpacity onPress={() => onUser(item.username)} activeOpacity={0.7}>
          <Text style={[styles.cardUser, { color: colors.accent }]}>@{item.username}</Text>
        </TouchableOpacity>
        {item.description ? <Text style={[styles.cardDesc, { color: colors.sub }]} numberOfLines={2}>{item.description}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useApp();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}
      style={[styles.chip, { backgroundColor: active ? colors.accent : colors.chipBg }]}>
      <Text style={{ fontSize: 14, fontWeight: active ? '700' : '400', color: active ? colors.accentText : colors.chipText }}>{label}</Text>
    </TouchableOpacity>
  );
}

async function toggleFavorite(token: string, id: number) {
  await fetch(BASE_URL + '/api/favorites/toggle/' + id, { method: 'POST', headers: bearer(token) });
}

function ExploreScreen({ token, onOpen, onUser, onOpenUserId }: { token: string; onOpen: (id: number) => void; onUser: (u: string) => void; onOpenUserId: (id: number) => void }) {
  const { colors, t } = useApp();
  const [mode, setMode] = useState<'recipes' | 'users'>('recipes');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<PublicProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const c = await fetch(BASE_URL + '/api/categories', { headers: bearer(token) });
        if (c.ok) setCategories(await c.json());
      } catch (e) {}
    })();
  }, [token]);

  useEffect(() => {
    const z = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 400);
    return () => clearTimeout(z);
  }, [searchQuery]);

  async function getir(silent = false) {
    try {
      if (!silent) setLoading(true);
      setError(null);
      let url: string;
      if (debouncedQuery.length >= 2) url = BASE_URL + '/api/recipes/search?keyword=' + encodeURIComponent(debouncedQuery) + '&page=0&size=20';
      else if (selectedCategoryId == null) url = BASE_URL + '/api/recipes?page=0&size=20';
      else url = BASE_URL + '/api/recipes/category/' + selectedCategoryId + '?page=0&size=20';
      const cevap = await fetch(url, { headers: bearer(token) });
      if (!cevap.ok) throw new Error(t('fetchFail') + ' (' + cevap.status + ')');
      const veri = await cevap.json();
      setRecipes(veri.content);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); setRefreshing(false); }
  }
  useEffect(() => { if (mode === 'recipes') getir(); }, [token, selectedCategoryId, debouncedQuery, mode]);

  useEffect(() => {
    if (mode !== 'users') return;
    (async () => {
      const q = debouncedQuery;
      if (q.length < 2) { setUsers([]); return; }
      try {
        setUsersLoading(true);
        const r = await fetch(BASE_URL + '/api/social/search/users?query=' + encodeURIComponent(q) + '&size=30', { headers: bearer(token) });
        if (r.ok) setUsers(await r.json());
      } catch (e) {} finally { setUsersLoading(false); }
    })();
  }, [debouncedQuery, mode]);

  function flipFav(id: number) {
    setRecipes((prev) => prev.map((r) => r.id === id ? { ...r, isFavoritedByCurrentUser: !r.isFavoritedByCurrentUser } : r));
    toggleFavorite(token, id).catch(() => {});
  }

  const Seg = ({ active, label, onPress }: any) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}
      style={[styles.seg, { backgroundColor: active ? colors.accent : colors.chipBg }]}>
      <Text style={{ color: active ? colors.accentText : colors.chipText, fontWeight: active ? '700' : '400' }}>{label}</Text>
    </TouchableOpacity>
  );

  const aramaAktif = debouncedQuery.length >= 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.segRow}>
          <Seg active={mode === 'recipes'} label={'🍽️ ' + t('explore')} onPress={() => setMode('recipes')} />
          <Seg active={mode === 'users'} label={'👥 ' + t('users')} onPress={() => setMode('users')} />
        </View>
        <TextInput style={[styles.search, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
          placeholder={mode === 'users' ? t('searchUser') : t('search')} placeholderTextColor={colors.sub} autoCapitalize="none"
          value={searchQuery} onChangeText={setSearchQuery} />
        {mode === 'recipes' && !aramaAktif && (
          <View style={{ flexGrow: 0 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              <Chip label={'🍽️ ' + t('all')} active={selectedCategoryId == null} onPress={() => setSelectedCategoryId(null)} />
              {categories.map((c) => (
                <Chip key={c.id} label={`${c.emoji ?? ''} ${c.name}`} active={selectedCategoryId === c.id} onPress={() => setSelectedCategoryId(c.id)} />
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {mode === 'users' ? (
        !aramaAktif ? (
          <View style={styles.merkez}><Text style={{ color: colors.sub, textAlign: 'center' }}>{t('searchUserHint')}</Text></View>
        ) : usersLoading ? (
          <View style={styles.merkez}><ActivityIndicator size="large" color={colors.accent} /></View>
        ) : users.length === 0 ? (
          <View style={styles.merkez}><Text style={{ color: colors.sub }}>{t('noResults')}</Text></View>
        ) : (
          <FlatList data={users} keyExtractor={(i) => i.id.toString()}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.listRow, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.7}
                onPress={() => onOpenUserId(item.id)}>
                <Avatar uri={item.profileImageUrl} name={item.username} size={46} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: '700' }} numberOfLines={1}>@{item.username}</Text>
                  {item.bio ? <Text style={{ color: colors.sub, fontSize: 13 }} numberOfLines={1}>{item.bio}</Text> : null}
                </View>
                {item.isPrivate && <Text style={{ fontSize: 14 }}>🔒</Text>}
              </TouchableOpacity>
            )} />
        )
      ) : loading ? (
        <View style={styles.merkez}><ActivityIndicator size="large" color={colors.accent} /><Text style={{ color: colors.sub, marginTop: 12 }}>{t('loading')}</Text></View>
      ) : error ? (
        <View style={styles.merkez}><Text style={styles.hata}>{error}</Text></View>
      ) : recipes.length === 0 ? (
        <View style={styles.merkez}><Text style={{ color: colors.sub }}>{aramaAktif ? t('noResults') : t('noneCat')}</Text></View>
      ) : (
        <FlatList data={recipes} keyExtractor={(i) => i.id.toString()}
          refreshing={refreshing} onRefresh={() => { setRefreshing(true); getir(true); }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          renderItem={({ item }) => <RecipeCard item={item} onOpen={() => onOpen(item.id)} onToggleFav={() => flipFav(item.id)} onUser={onUser} />} />
      )}
    </View>
  );
}

function FavoritesScreen({ token, onOpen, onUser }: { token: string; onOpen: (id: number) => void; onUser: (u: string) => void }) {
  const { colors, t } = useApp();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getir(silent = false) {
    try {
      if (!silent) setLoading(true);
      setError(null);
      const cevap = await fetch(BASE_URL + '/api/favorites?page=0&size=50', { headers: bearer(token) });
      if (!cevap.ok) throw new Error(t('fetchFail') + ' (' + cevap.status + ')');
      const veri = await cevap.json();
      setRecipes(veri.content);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); setRefreshing(false); }
  }
  useEffect(() => { getir(); }, [token]);

  function flipFav(id: number) {
    setRecipes((prev) => prev.map((r) => r.id === id ? { ...r, isFavoritedByCurrentUser: !r.isFavoritedByCurrentUser } : r));
    toggleFavorite(token, id).catch(() => {});
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header />
      {loading ? (
        <View style={styles.merkez}><ActivityIndicator size="large" color={colors.accent} /></View>
      ) : error ? (
        <View style={styles.merkez}><Text style={styles.hata}>{error}</Text></View>
      ) : recipes.length === 0 ? (
        <View style={styles.merkez}><Text style={{ color: colors.sub }}>{t('favEmpty')}</Text></View>
      ) : (
        <FlatList data={recipes} keyExtractor={(i) => i.id.toString()}
          refreshing={refreshing} onRefresh={() => { setRefreshing(true); getir(true); }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 }}
          renderItem={({ item }) => <RecipeCard item={item} onOpen={() => onOpen(item.id)} onToggleFav={() => flipFav(item.id)} onUser={onUser} />} />
      )}
    </View>
  );
}

// ============ TARİF FORMU (EKLE + DÜZENLE ORTAK) ============
function RecipeForm({ token, recipeId, initial, onDone }: { token: string; recipeId?: number; initial?: any; onDone: () => void }) {
  const { colors, t } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [categoryId, setCategoryId] = useState<number | null>(initial?.categoryId ?? null);
  const [difficulty, setDifficulty] = useState<'KOLAY' | 'ORTA' | 'ZOR'>((initial?.difficulty as any) ?? 'ORTA');
  const [prepTime, setPrepTime] = useState(initial?.prepTime != null ? String(initial.prepTime) : '');
  const [cookTime, setCookTime] = useState(initial?.cookTime != null ? String(initial.cookTime) : '');
  const [servings, setServings] = useState(initial?.servings != null ? String(initial.servings) : '');
  const [calories, setCalories] = useState(initial?.totalCalories != null ? String(initial.totalCalories) : '');
  const [ingredientsText, setIngredientsText] = useState(initial?.ingredients ? initial.ingredients.map((i: any) => i.name).join(', ') : '');
  const [steps, setSteps] = useState(initial?.steps ?? '');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const existingImage: string | null = initial?.imageUrl ?? null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = recipeId != null;

  useEffect(() => {
    (async () => {
      try {
        const c = await fetch(BASE_URL + '/api/categories', { headers: bearer(token) });
        if (c.ok) setCategories(await c.json());
      } catch (e) {}
    })();
  }, [token]);

  async function fotografSec() {
    const sonuc = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });
    if (!sonuc.canceled) setImageUri(sonuc.assets[0].uri);
  }

  async function yayinla() {
    if (!title.trim()) { setError(t('titleRequired')); return; }
    if (!categoryId) { setError(t('categoryRequired')); return; }
    if (!steps.trim()) { setError(t('stepsRequired')); return; }
    if (!isEdit && !imageUri) { setError(t('photoRequired')); return; }

    try {
      setLoading(true); setError(null);

      const ingredients = ingredientsText
        .split(',').map((s) => s.trim()).filter((s) => s.length > 0)
        .map((name) => ({ name, quantity: 1, unit: 'adet' }));
      if (ingredients.length === 0) ingredients.push({ name: 'Malzeme', quantity: 1, unit: 'adet' });

      const recipeObj = {
        title: title.trim(),
        description: description.trim() || null,
        prepTime: parseInt(prepTime) || 10,
        cookTime: parseInt(cookTime) || 20,
        servings: parseInt(servings) || 4,
        steps: steps.trim(),
        difficulty,
        categoryId,
        ingredients,
        totalCalories: parseInt(calories) || 0,
        proteinAmount: 0, carbAmount: 0, fatAmount: 0,
      };

      const url = isEdit ? BASE_URL + '/api/recipes/' + recipeId : BASE_URL + '/api/recipes';

      if (imageUri) {
        // Yeni foto var → uploadAsync (POST veya PUT)
        const sonuc = await FileSystem.uploadAsync(url, imageUri, {
          httpMethod: isEdit ? 'PUT' : 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'image',
          mimeType: 'image/jpeg',
          parameters: { recipe: JSON.stringify(recipeObj) },
          headers: bearer(token),
        });
        if (sonuc.status < 200 || sonuc.status >= 300) {
          throw new Error(t('publishFail') + ' (' + sonuc.status + ') ' + (sonuc.body || '').slice(0, 150));
        }
      } else {
        // Sadece düzenleme, yeni foto yok → fotoğrafsız multipart PUT
        const fd = new FormData();
        fd.append('recipe', JSON.stringify(recipeObj));
        const r = await fetch(url, { method: 'PUT', headers: bearer(token), body: fd as any });
        if (!r.ok) throw new Error(t('publishFail') + ' (' + r.status + ')');
      }

      Alert.alert(t('info'), isEdit ? t('updated') : t('published'), [{ text: t('ok'), onPress: onDone }]);
      if (!isEdit) {
        setTitle(''); setDescription(''); setCategoryId(null); setDifficulty('ORTA');
        setPrepTime(''); setCookTime(''); setServings(''); setCalories('');
        setIngredientsText(''); setSteps(''); setImageUri(null);
      }
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  const Seg = ({ active, label, onPress }: any) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}
      style={[styles.seg, { backgroundColor: active ? colors.accent : colors.chipBg }]}>
      <Text style={{ color: active ? colors.accentText : colors.chipText, fontWeight: active ? '700' : '400' }}>{label}</Text>
    </TouchableOpacity>
  );
  const inputStyle = [styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }];
  const previewUri = imageUri || existingImage;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Text style={[styles.settingLabel, { color: colors.text }]}>{isEdit ? t('editRecipe') : t('newRecipe')}</Text>

      <TouchableOpacity onPress={fotografSec} activeOpacity={0.85}
        style={[styles.photoPick, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
        {previewUri
          ? <Image source={{ uri: previewUri }} style={styles.photoPreview} />
          : <Text style={{ color: colors.sub, fontSize: 16 }}>{t('pickImage')}</Text>}
      </TouchableOpacity>
      {isEdit && <Text style={{ color: colors.sub, fontSize: 12, marginBottom: 10, textAlign: 'center' }}>{t('changePhoto')}</Text>}

      <TextInput style={inputStyle} placeholder={t('rTitle')} placeholderTextColor={colors.sub} value={title} onChangeText={setTitle} />
      <TextInput style={inputStyle} placeholder={t('rDesc')} placeholderTextColor={colors.sub} value={description} onChangeText={setDescription} />

      <Text style={[styles.smallLabel, { color: colors.sub }]}>{t('rCategory')}</Text>
      <View style={{ flexGrow: 0 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {categories.map((c) => (
            <Chip key={c.id} label={`${c.emoji ?? ''} ${c.name}`} active={categoryId === c.id} onPress={() => setCategoryId(c.id)} />
          ))}
        </ScrollView>
      </View>

      <Text style={[styles.smallLabel, { color: colors.sub }]}>{t('difficulty')}</Text>
      <View style={styles.segRow}>
        <Seg active={difficulty === 'KOLAY'} label={t('easy')} onPress={() => setDifficulty('KOLAY')} />
        <Seg active={difficulty === 'ORTA'} label={t('medium')} onPress={() => setDifficulty('ORTA')} />
        <Seg active={difficulty === 'ZOR'} label={t('hard')} onPress={() => setDifficulty('ZOR')} />
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput style={[inputStyle, { flex: 1 }]} placeholder={t('rPrep')} placeholderTextColor={colors.sub} keyboardType="numeric" value={prepTime} onChangeText={setPrepTime} />
        <TextInput style={[inputStyle, { flex: 1 }]} placeholder={t('rCook')} placeholderTextColor={colors.sub} keyboardType="numeric" value={cookTime} onChangeText={setCookTime} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput style={[inputStyle, { flex: 1 }]} placeholder={t('rServings')} placeholderTextColor={colors.sub} keyboardType="numeric" value={servings} onChangeText={setServings} />
        <TextInput style={[inputStyle, { flex: 1 }]} placeholder={t('rCalories')} placeholderTextColor={colors.sub} keyboardType="numeric" value={calories} onChangeText={setCalories} />
      </View>

      <TextInput style={inputStyle} placeholder={t('rIngredients')} placeholderTextColor={colors.sub} value={ingredientsText} onChangeText={setIngredientsText} />
      <TextInput style={[inputStyle, { height: 120, textAlignVertical: 'top' }]} placeholder={t('rSteps')} placeholderTextColor={colors.sub} multiline value={steps} onChangeText={setSteps} />

      {error && <Text style={styles.hata}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 12 }} />
      ) : (
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={yayinla} activeOpacity={0.85}>
          <Text style={[styles.primaryBtnText, { color: colors.accentText }]}>{isEdit ? t('save') : t('publish')}</Text>
        </TouchableOpacity>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ============ TARİF EKLE ============
function AddRecipeScreen({ token, onDone }: { token: string; onDone: () => void }) {
  const { colors } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header />
      <RecipeForm token={token} onDone={onDone} />
    </View>
  );
}

// ============ PROFİL (BENİM) ============
function SettingsBlock({ onLogout }: { onLogout: () => void }) {
  const { colors, t, mode, setMode, lang, setLang } = useApp();
  const Seg = ({ active, label, onPress }: any) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}
      style={[styles.seg, { backgroundColor: active ? colors.accent : colors.chipBg }]}>
      <Text style={{ color: active ? colors.accentText : colors.chipText, fontWeight: active ? '700' : '400' }}>{label}</Text>
    </TouchableOpacity>
  );
  return (
    <>
      <Text style={[styles.settingLabel, { color: colors.text }]}>{t('theme')}</Text>
      <View style={styles.segRow}>
        <Seg active={mode === 'light'} label={t('light')} onPress={() => setMode('light')} />
        <Seg active={mode === 'dark'} label={t('dark')} onPress={() => setMode('dark')} />
      </View>
      <Text style={[styles.settingLabel, { color: colors.text }]}>{t('language')}</Text>
      <View style={styles.segRow}>
        <Seg active={lang === 'tr'} label="Türkçe" onPress={() => setLang('tr')} />
        <Seg active={lang === 'en'} label="English" onPress={() => setLang('en')} />
      </View>
      <Text style={[styles.settingLabel, { color: colors.text }]}>{t('about')}</Text>
      <Text style={{ color: colors.sub, lineHeight: 22, marginBottom: 24 }}>{t('aboutText')}</Text>
      <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={onLogout} activeOpacity={0.85}>
        <Text style={[styles.primaryBtnText, { color: colors.accentText }]}>{t('logout')}</Text>
      </TouchableOpacity>
    </>
  );
}

function StatBox({ value, label, onPress }: { value: number | string; label: string; onPress?: () => void }) {
  const { colors } = useApp();
  const inner = (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.sub }]}>{label}</Text>
    </View>
  );
  return onPress ? <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.7} onPress={onPress}>{inner}</TouchableOpacity> : <View style={{ flex: 1 }}>{inner}</View>;
}

function ProfileRecipes({ token, userId, onOpen }: { token: string; userId: number; onOpen: (id: number) => void }) {
  const { colors, t } = useApp();
  const [list, setList] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(BASE_URL + '/api/recipes/user/' + userId + '?page=0&size=50', { headers: bearer(token) });
        if (r.ok) { const d = await r.json(); setList(d.content || []); }
      } catch (e) {} finally { setLoading(false); }
    })();
  }, [userId]);
  if (loading) return <ActivityIndicator color={colors.accent} style={{ marginTop: 16 }} />;
  if (list.length === 0) return <Text style={{ color: colors.sub, textAlign: 'center', marginTop: 12, marginBottom: 12 }}>{t('emptyRecipes')}</Text>;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {list.map((r) => (
        <TouchableOpacity key={r.id} style={{ width: '48.5%', marginBottom: 12 }} activeOpacity={0.85} onPress={() => onOpen(r.id)}>
          {r.imageUrl
            ? <Image source={{ uri: r.imageUrl }} style={{ width: '100%', height: 120, borderRadius: 12, backgroundColor: colors.meta }} />
            : <View style={{ width: '100%', height: 120, borderRadius: 12, backgroundColor: colors.meta }} />}
          <Text style={{ color: colors.text, fontWeight: '600', marginTop: 6 }} numberOfLines={1}>{r.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function MyProfileScreen({ token, me, onLogout, push }: { token: string; me: Me; onLogout: () => void; push: (n: Nav) => void }) {
  const { colors, t } = useApp();
  const [p, setP] = useState<PublicProfile | null>(null);
  const [reqCount, setReqCount] = useState(0);

  async function load() {
    if (!me) return;
    try {
      const r = await fetch(BASE_URL + '/api/social/profile/' + me.id, { headers: bearer(token) });
      if (r.ok) setP(await r.json());
      const rr = await fetch(BASE_URL + '/api/social/follow-requests', { headers: bearer(token) });
      if (rr.ok) { const d = await rr.json(); setReqCount(Array.isArray(d) ? d.length : 0); }
    } catch (e) {}
  }
  useEffect(() => { load(); }, [me]);

  async function togglePrivacy() {
    setP((prev) => prev ? { ...prev, isPrivate: !prev.isPrivate } : prev);
    try { await fetch(BASE_URL + '/api/social/privacy/toggle', { method: 'POST', headers: bearer(token) }); } catch (e) {}
  }

  const [editing, setEditing] = useState(false);
  const [eUsername, setEUsername] = useState('');
  const [eBio, setEBio] = useState('');
  const [ePhoto, setEPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEdit() { if (!p) return; setEUsername(p.username); setEBio(p.bio || ''); setEPhoto(null); setEditing(true); }
  async function pickPhoto() {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6 });
    if (!r.canceled) setEPhoto(r.assets[0].uri);
  }
  async function saveProfile() {
    setSaving(true);
    try {
      await fetch(BASE_URL + '/api/users/me', {
        method: 'PUT', headers: { ...bearer(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: eUsername.trim(), bio: eBio.trim() }),
      });
      if (ePhoto) {
        await FileSystem.uploadAsync(BASE_URL + '/api/users/me/profile-image', ePhoto, {
          httpMethod: 'PUT', uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'image', mimeType: 'image/jpeg', headers: bearer(token),
        });
      }
      setEditing(false);
      await load();
    } catch (e) {} finally { setSaving(false); }
  }

  if (!me || !p) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <Header />
        <View style={styles.merkez}><ActivityIndicator size="large" color={colors.accent} /></View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        {editing ? (
          <View style={{ marginBottom: 8 }}>
            <TouchableOpacity onPress={pickPhoto} activeOpacity={0.8} style={{ alignItems: 'center', marginBottom: 12 }}>
              <Avatar uri={ePhoto || p.profileImageUrl} name={p.username} size={92} />
              <Text style={{ color: colors.accent, marginTop: 6, fontWeight: '600' }}>{t('changePhoto')}</Text>
            </TouchableOpacity>
            <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder={t('username')} placeholderTextColor={colors.sub} autoCapitalize="none" value={eUsername} onChangeText={setEUsername} />
            <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, height: 90, textAlignVertical: 'top' }]}
              placeholder={t('bio')} placeholderTextColor={colors.sub} multiline value={eBio} onChangeText={setEBio} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={[styles.primaryBtn, { flex: 1, backgroundColor: colors.chipBg }]} onPress={() => setEditing(false)} disabled={saving}>
                <Text style={[styles.primaryBtnText, { color: colors.text }]}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, { flex: 1, backgroundColor: colors.accent }]} onPress={saveProfile} disabled={saving}>
                {saving ? <ActivityIndicator color={colors.accentText} /> : <Text style={[styles.primaryBtnText, { color: colors.accentText }]}>{t('save')}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <Avatar uri={p.profileImageUrl} name={p.username} size={92} />
            <Text style={[styles.profileName, { color: colors.text }]}>@{p.username}</Text>
            <Text style={{ color: colors.sub, textAlign: 'center', marginTop: 4, lineHeight: 20 }}>{p.bio || t('noBio')}</Text>
            <TouchableOpacity onPress={startEdit} activeOpacity={0.8} style={[styles.editProfileBtn, { borderColor: colors.border }]}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>✏️ {t('editProfile')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.statRow, { backgroundColor: colors.meta }]}>
          <StatBox value={p.recipeCount} label={t('recipesCount')} />
          <StatBox value={p.followerCount} label={t('followers')} onPress={() => push({ k: 'userlist', mode: 'followers', userId: me.id, title: t('followers') })} />
          <StatBox value={p.followingCount} label={t('following')} onPress={() => push({ k: 'userlist', mode: 'following', userId: me.id, title: t('following') })} />
        </View>

        <TouchableOpacity style={[styles.rowBtn, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.8}
          onPress={() => push({ k: 'requests' })}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>📥 {t('followRequests')}</Text>
          {reqCount > 0 && <View style={styles.countPill}><Text style={styles.countPillText}>{reqCount}</Text></View>}
        </TouchableOpacity>

        <View style={[styles.rowBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>🔒 {t('privacyLabel')}</Text>
          <Switch value={!!p.isPrivate} onValueChange={togglePrivacy}
            trackColor={{ true: colors.accent, false: colors.border }} thumbColor="#fff" />
        </View>

        <Text style={[styles.settingLabel, { color: colors.text, marginTop: 10 }]}>{t('myRecipes')}</Text>
        <ProfileRecipes token={token} userId={me.id} onOpen={(id) => push({ k: 'recipe', id })} />

        <View style={{ height: 12 }} />
        <SettingsBlock onLogout={onLogout} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ============ BAŞKA KULLANICININ PROFİLİ ============
function UserProfileScreen({ token, userId, onBack, push }: { token: string; userId: number; onBack: () => void; push: (n: Nav) => void }) {
  const { colors, t } = useApp();
  const [p, setP] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const r = await fetch(BASE_URL + '/api/social/profile/' + userId, { headers: bearer(token) });
      if (r.ok) setP(await r.json());
    } catch (e) {} finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [userId]);

  async function toggleFollow() {
    setBusy(true);
    try {
      await fetch(BASE_URL + '/api/social/follow/' + userId, { method: 'POST', headers: bearer(token) });
      await load();
    } catch (e) {} finally { setBusy(false); }
  }

  const followLabel = p ? (p.isFollowedByMe ? t('unfollow') : p.hasPendingRequest ? t('requested') : t('follow')) : '';
  const followActive = p ? (p.isFollowedByMe || p.hasPendingRequest) : false;
  const locked = !!p && p.isPrivate && !p.isFollowedByMe;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar title={p ? '@' + p.username : t('profile')} onBack={onBack} />
      {loading || !p ? (
        <View style={styles.merkez}><ActivityIndicator size="large" color={colors.accent} /></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <Avatar uri={p.profileImageUrl} name={p.username} size={92} />
            <Text style={[styles.profileName, { color: colors.text }]}>@{p.username}</Text>
            <Text style={{ color: colors.sub, textAlign: 'center', marginTop: 4, lineHeight: 20 }}>{p.bio || t('noBio')}</Text>
          </View>

          <View style={[styles.statRow, { backgroundColor: colors.meta }]}>
            <StatBox value={p.recipeCount} label={t('recipesCount')} />
            <StatBox value={p.followerCount} label={t('followers')} onPress={locked ? undefined : () => push({ k: 'userlist', mode: 'followers', userId: p.id, title: t('followers') })} />
            <StatBox value={p.followingCount} label={t('following')} onPress={locked ? undefined : () => push({ k: 'userlist', mode: 'following', userId: p.id, title: t('following') })} />
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <TouchableOpacity activeOpacity={0.85} onPress={toggleFollow} disabled={busy}
              style={[styles.primaryBtn, { flex: 1, backgroundColor: followActive ? colors.chipBg : colors.accent }]}>
              {busy ? <ActivityIndicator color={followActive ? colors.text : colors.accentText} /> :
                <Text style={[styles.primaryBtnText, { color: followActive ? colors.text : colors.accentText }]}>{followLabel}</Text>}
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.85} onPress={() => push({ k: 'chat', userId: p.id, username: p.username })}
              style={[styles.primaryBtn, { flex: 1, backgroundColor: colors.chipBg }]}>
              <Text style={[styles.primaryBtnText, { color: colors.text }]}>💬 {t('message')}</Text>
            </TouchableOpacity>
          </View>

          {locked ? (
            <View style={{ alignItems: 'center', marginTop: 32 }}>
              <Text style={{ fontSize: 44 }}>🔒</Text>
              <Text style={{ color: colors.sub, textAlign: 'center', marginTop: 10, lineHeight: 20, paddingHorizontal: 20 }}>{t('privateAccount')}</Text>
            </View>
          ) : (
            <>
              <Text style={[styles.settingLabel, { color: colors.text, marginTop: 20 }]}>{t('recipesTitle')}</Text>
              <ProfileRecipes token={token} userId={p.id} onOpen={(id) => push({ k: 'recipe', id })} />
            </>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

// ============ TAKİP İSTEKLERİ ============
function RequestsScreen({ token, onBack, push }: { token: string; onBack: () => void; push: (n: Nav) => void }) {
  const { colors, t } = useApp();
  const [reqs, setReqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const r = await fetch(BASE_URL + '/api/social/follow-requests', { headers: bearer(token) });
      if (r.ok) setReqs(await r.json());
    } catch (e) {} finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function act(id: number, action: 'accept' | 'reject') {
    setReqs((prev) => prev.filter((x) => x.id !== id));
    try {
      await fetch(BASE_URL + '/api/social/follow-requests/' + id + '/' + action, { method: 'POST', headers: bearer(token) });
    } catch (e) {}
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar title={t('followRequests')} onBack={onBack} />
      {loading ? (
        <View style={styles.merkez}><ActivityIndicator size="large" color={colors.accent} /></View>
      ) : reqs.length === 0 ? (
        <View style={styles.merkez}><Text style={{ color: colors.sub }}>{t('noRequests')}</Text></View>
      ) : (
        <FlatList data={reqs} keyExtractor={(i) => i.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={[styles.listRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} activeOpacity={0.7}
                onPress={() => push({ k: 'user', userId: item.senderId })}>
                <Avatar uri={item.senderProfileImage} name={item.senderUsername} size={44} />
                <Text style={{ color: colors.text, fontWeight: '600', marginLeft: 12, flex: 1 }} numberOfLines={1}>@{item.senderUsername}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.miniBtn, { backgroundColor: colors.accent }]} activeOpacity={0.8} onPress={() => act(item.id, 'accept')}>
                <Text style={{ color: colors.accentText, fontWeight: '700', fontSize: 13 }}>{t('accept')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.miniBtn, { backgroundColor: colors.chipBg }]} activeOpacity={0.8} onPress={() => act(item.id, 'reject')}>
                <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13 }}>{t('reject')}</Text>
              </TouchableOpacity>
            </View>
          )} />
      )}
    </View>
  );
}

// ============ TAKİPÇİ / TAKİP LİSTESİ ============
function UserListScreen({ token, mode, userId, title, onBack, push }: { token: string; mode: 'followers' | 'following'; userId: number; title: string; onBack: () => void; push: (n: Nav) => void }) {
  const { colors, t } = useApp();
  const [users, setUsers] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(BASE_URL + '/api/social/' + mode + '/' + userId + '?page=0&size=100', { headers: bearer(token) });
        if (r.ok) setUsers(await r.json());
      } catch (e) {} finally { setLoading(false); }
    })();
  }, [mode, userId]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar title={title} onBack={onBack} />
      {loading ? (
        <View style={styles.merkez}><ActivityIndicator size="large" color={colors.accent} /></View>
      ) : users.length === 0 ? (
        <View style={styles.merkez}><Text style={{ color: colors.sub }}>{t('emptyList')}</Text></View>
      ) : (
        <FlatList data={users} keyExtractor={(i) => i.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.listRow, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.7}
              onPress={() => push({ k: 'user', userId: item.id })}>
              <Avatar uri={item.profileImageUrl} name={item.username} size={44} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: '600' }} numberOfLines={1}>@{item.username}</Text>
                {item.bio ? <Text style={{ color: colors.sub, fontSize: 13 }} numberOfLines={1}>{item.bio}</Text> : null}
              </View>
            </TouchableOpacity>
          )} />
      )}
    </View>
  );
}

// ============ SOHBET LİSTESİ + KULLANICI ARAMA ============
function ConversationsScreen({ token, push }: { token: string; push: (n: Nav) => void }) {
  const { colors, t } = useApp();
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<PublicProfile[] | null>(null);

  async function load() {
    try {
      const r = await fetch(BASE_URL + '/api/messages/conversations', { headers: bearer(token) });
      if (r.ok) setConvos(await r.json());
    } catch (e) {} finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [token]);
  useEffect(() => { const i = setInterval(load, 5000); return () => clearInterval(i); }, [token]);

  useEffect(() => {
    const z = setTimeout(async () => {
      const query = q.trim();
      if (query.length < 2) { setResults(null); return; }
      try {
        const r = await fetch(BASE_URL + '/api/social/search/users?query=' + encodeURIComponent(query) + '&size=20', { headers: bearer(token) });
        if (r.ok) setResults(await r.json());
      } catch (e) {}
    }, 400);
    return () => clearTimeout(z);
  }, [q]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header />
      <View style={{ paddingHorizontal: 16 }}>
        <TextInput style={[styles.search, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
          placeholder={t('searchUser')} placeholderTextColor={colors.sub} autoCapitalize="none"
          value={q} onChangeText={setQ} />
      </View>

      {results !== null ? (
        results.length === 0 ? (
          <View style={styles.merkez}><Text style={{ color: colors.sub }}>{t('noResults')}</Text></View>
        ) : (
          <FlatList data={results} keyExtractor={(i) => i.id.toString()}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.listRow, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.7}
                onPress={() => push({ k: 'user', userId: item.id })}>
                <Avatar uri={item.profileImageUrl} name={item.username} size={44} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: '600' }} numberOfLines={1}>@{item.username}</Text>
                  {item.bio ? <Text style={{ color: colors.sub, fontSize: 13 }} numberOfLines={1}>{item.bio}</Text> : null}
                </View>
              </TouchableOpacity>
            )} />
        )
      ) : loading ? (
        <View style={styles.merkez}><ActivityIndicator size="large" color={colors.accent} /></View>
      ) : convos.length === 0 ? (
        <View style={styles.merkez}><Text style={{ color: colors.sub }}>{t('noConversations')}</Text></View>
      ) : (
        <FlatList data={convos} keyExtractor={(i) => i.userId.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.listRow, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.7}
              onPress={() => push({ k: 'chat', userId: item.userId, username: item.username })}>
              <Avatar uri={item.profileImageUrl} name={item.username} size={48} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: '700' }} numberOfLines={1}>@{item.username}</Text>
                <Text style={{ color: item.unreadCount > 0 ? colors.text : colors.sub, fontSize: 13, fontWeight: item.unreadCount > 0 ? '600' : '400' }} numberOfLines={1}>
                  {item.isLastMessageMine ? t('you') + ': ' : ''}{item.lastMessage || ''}
                </Text>
              </View>
              {item.unreadCount > 0 && <View style={styles.countPill}><Text style={styles.countPillText}>{item.unreadCount}</Text></View>}
            </TouchableOpacity>
          )} />
      )}
    </View>
  );
}

// ============ SOHBET EKRANI ============
function ChatScreen({ token, me, userId, username, onBack, onOpenProfile }: { token: string; me: Me; userId: number; username: string; onBack: () => void; onOpenProfile: () => void }) {
  const { colors, t } = useApp();
  const insets = useSafeAreaInsets();
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(BASE_URL + '/api/social/profile/' + userId, { headers: bearer(token) });
        if (r.ok) { const d = await r.json(); setAvatar(d.profileImageUrl); }
      } catch (e) {}
    })();
  }, [userId]);

  async function load() {
    try {
      const r = await fetch(BASE_URL + '/api/messages/conversation/' + userId + '?page=0&size=50', { headers: bearer(token) });
      if (r.ok) {
        const d = await r.json();
        const content: Message[] = (d.content || []).slice().sort((a: Message, b: Message) => a.id - b.id);
        setMsgs(content);
      }
    } catch (e) {} finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [userId]);
  useEffect(() => { const i = setInterval(load, 3000); return () => clearInterval(i); }, [userId]);

  async function send() {
    const c = text.trim();
    if (!c) return;
    setText('');
    setSending(true);
    try {
      if (editingId != null) {
        const r = await fetch(BASE_URL + '/api/messages/' + editingId, {
          method: 'PUT', headers: { ...bearer(token), 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: c }),
        });
        if (!r.ok) { setText(c); Alert.alert(t('info'), '(' + r.status + ')'); }
        else { setEditingId(null); await load(); }
      } else {
        const r = await fetch(BASE_URL + '/api/messages/' + userId, {
          method: 'POST', headers: { ...bearer(token), 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: c }),
        });
        if (!r.ok) { setText(c); Alert.alert(t('info'), t('msgFail') + ' (' + r.status + ')'); }
        else { await load(); }
      }
    } catch (e) { setText(c); } finally { setSending(false); }
  }

  function onBubbleLongPress(m: Message) {
    if (!me || m.senderId !== me.id) return;
    Alert.alert('', m.content, [
      { text: t('editMessage'), onPress: () => { setEditingId(m.id); setText(m.content); } },
      { text: t('delete'), style: 'destructive', onPress: async () => {
        setMsgs((prev) => prev.filter((x) => x.id !== m.id));
        try { await fetch(BASE_URL + '/api/messages/' + m.id, { method: 'DELETE', headers: bearer(token) }); } catch (e) {}
      } },
      { text: t('cancel'), style: 'cancel' },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.detailTop, { backgroundColor: colors.header, flexDirection: 'row', alignItems: 'center' }]}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.detailBack}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }} activeOpacity={0.7} onPress={onOpenProfile}>
          <Avatar uri={avatar} name={username} size={34} />
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700', marginLeft: 10 }} numberOfLines={1}>@{username}</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {loading ? (
          <View style={styles.merkez}><ActivityIndicator size="large" color={colors.accent} /></View>
        ) : (
          <FlatList ref={listRef} data={msgs} keyExtractor={(i) => i.id.toString()}
            contentContainerStyle={{ padding: 12 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            renderItem={({ item, index }) => {
              const mine = me != null && item.senderId === me.id;
              const prev = index > 0 ? msgs[index - 1] : null;
              const showDate = !prev || !sameDay(prev.createdAt, item.createdAt);
              return (
                <>
                  {showDate && (
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                      <Text style={{ color: colors.sub, fontSize: 12, backgroundColor: colors.meta, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' }}>{fmtDate(item.createdAt)}</Text>
                    </View>
                  )}
                  <View style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '78%', marginVertical: 3 }}>
                    <TouchableOpacity activeOpacity={mine ? 0.7 : 1} onLongPress={() => onBubbleLongPress(item)}
                      style={{ backgroundColor: mine ? colors.bubbleMine : colors.bubbleOther, borderRadius: 16, paddingVertical: 9, paddingHorizontal: 13 }}>
                      <Text style={{ color: mine ? colors.bubbleMineText : colors.bubbleOtherText, fontSize: 15, lineHeight: 20 }}>{item.content}</Text>
                    </TouchableOpacity>
                    <Text style={{ color: colors.sub, fontSize: 10, marginTop: 2, alignSelf: mine ? 'flex-end' : 'flex-start' }}>{fmtTime(item.createdAt)}</Text>
                  </View>
                </>
              );
            }} />
        )}
        {editingId != null && (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.meta, paddingHorizontal: 14, paddingVertical: 6 }}>
            <Text style={{ color: colors.sub, flex: 1 }}>✏️ {t('editingMsg')}</Text>
            <TouchableOpacity onPress={() => { setEditingId(null); setText(''); }}><Text style={{ color: colors.accent, fontWeight: '700' }}>{t('cancel')}</Text></TouchableOpacity>
          </View>
        )}
        <View style={[styles.chatInputRow, { backgroundColor: colors.barBg, borderTopColor: colors.barBorder, paddingBottom: insets.bottom + 8 }]}>
          <TextInput style={[styles.chatInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
            placeholder={t('typeMessage')} placeholderTextColor={colors.sub} value={text} onChangeText={setText} multiline />
          <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.accent }]} onPress={send} disabled={sending} activeOpacity={0.8}>
            {sending ? <ActivityIndicator color={colors.accentText} /> : <Text style={{ color: colors.accentText, fontWeight: '700' }}>➤</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function CommentsSection({ token, me, recipeId }: { token: string; me: Me; recipeId: number }) {
  const { colors, t } = useApp();
  const [list, setList] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  async function load() {
    try {
      const r = await fetch(BASE_URL + '/api/comments/' + recipeId + '?page=0&size=50', { headers: bearer(token) });
      if (r.ok) { const d = await r.json(); setList(d.content || []); }
    } catch (e) {} finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [recipeId]);

  async function add() {
    const c = text.trim();
    if (!c) return;
    setSending(true);
    try {
      const r = await fetch(BASE_URL + '/api/comments/' + recipeId, {
        method: 'POST', headers: { ...bearer(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: c }),
      });
      if (r.ok) { setText(''); await load(); }
      else Alert.alert(t('info'), '(' + r.status + ')');
    } catch (e) {} finally { setSending(false); }
  }

  function confirmDelete(id: number) {
    Alert.alert(t('deleteCommentQ'), '', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: async () => {
        setList((prev) => prev.filter((x) => x.id !== id));
        try { await fetch(BASE_URL + '/api/comments/' + id, { method: 'DELETE', headers: bearer(token) }); } catch (e) {}
      } },
    ]);
  }

  return (
    <View style={{ marginTop: 18 }}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('comments')} {list.length > 0 ? '(' + list.length + ')' : ''}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 14 }}>
        <TextInput style={[styles.chatInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, flex: 1 }]}
          placeholder={t('writeComment')} placeholderTextColor={colors.sub} value={text} onChangeText={setText} multiline />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.accent }]} onPress={add} disabled={sending} activeOpacity={0.8}>
          {sending ? <ActivityIndicator color={colors.accentText} /> : <Text style={{ color: colors.accentText, fontWeight: '700' }}>➤</Text>}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : list.length === 0 ? (
        <Text style={{ color: colors.sub }}>{t('noComments')}</Text>
      ) : (
        list.map((c) => (
          <View key={c.id} style={{ flexDirection: 'row', marginBottom: 14 }}>
            <Avatar uri={c.userProfileImage} name={c.username} size={38} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13 }}>@{c.username}</Text>
                <Text style={{ color: colors.sub, fontSize: 11, marginLeft: 8 }}>{fmtDate(c.createdAt)} {fmtTime(c.createdAt)}</Text>
                {me != null && c.userId === me.id && (
                  <TouchableOpacity onPress={() => confirmDelete(c.id)} style={{ marginLeft: 'auto', paddingHorizontal: 6 }} activeOpacity={0.7}>
                    <Text style={{ fontSize: 14 }}>🗑️</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={{ color: colors.text, marginTop: 2, lineHeight: 20 }}>{c.content}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

function RecipeDetailScreen({ token, me, recipeId, onBack, onUser }: { token: string; me: Me; recipeId: number; onBack: () => void; onUser: (u: string) => void }) {
  const { colors, t } = useApp();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [myRate, setMyRate] = useState(0);
  const [myTrialId, setMyTrialId] = useState<number | null>(null);

  async function load() {
    try {
      setLoading(true); setError(null);
      const cevap = await fetch(BASE_URL + '/api/recipes/' + recipeId, { headers: bearer(token) });
      if (!cevap.ok) throw new Error(t('fetchFail') + ' (' + cevap.status + ')');
      setRecipe(await cevap.json());
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [token, recipeId]);

  async function loadMyRating() {
    if (!me) return;
    try {
      const r = await fetch(BASE_URL + '/api/trials/my?page=0&size=200', { headers: bearer(token) });
      if (r.ok) {
        const d = await r.json();
        const mine = (d.content || []).find((x: any) => x.recipeId === recipeId);
        if (mine) { setMyRate(mine.rating); setMyTrialId(mine.id); }
        else { setMyRate(0); setMyTrialId(null); }
      }
    } catch (e) {}
  }
  useEffect(() => { loadMyRating(); }, [token, recipeId, me]);

  async function rate(value: number) {
    const prev = myRate;
    setMyRate(value);
    try {
      // Önceki puanı (denemeyi) sil, yenisini gönder
      if (myTrialId != null) {
        await fetch(BASE_URL + '/api/trials/' + myTrialId, { method: 'DELETE', headers: bearer(token) });
        setMyTrialId(null);
      }
      const fd = new FormData();
      fd.append('trial', JSON.stringify({ rating: value }));
      const r = await fetch(BASE_URL + '/api/trials/' + recipeId, { method: 'POST', headers: bearer(token), body: fd as any });
      if (r.ok) { await load(); await loadMyRating(); }
      else { setMyRate(prev); Alert.alert(t('info'), t('rateFail') + ' (' + r.status + ')'); }
    } catch (e) { setMyRate(prev); }
  }

  function confirmDeleteRecipe() {
    Alert.alert(t('deleteRecipeQ'), '', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: async () => {
        try { await fetch(BASE_URL + '/api/recipes/' + recipeId, { method: 'DELETE', headers: bearer(token) }); } catch (e) {}
        onBack();
      } },
    ]);
  }

  if (editing && recipe) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <TopBar title={t('editRecipe')} onBack={() => setEditing(false)} />
        <RecipeForm token={token} recipeId={recipe.id} initial={recipe} onDone={() => { setEditing(false); load(); }} />
      </View>
    );
  }

  const isOwner = !!me && !!recipe && recipe.userId === me.id;

  const Meta = ({ value, label }: any) => (
    <View style={styles.metaBox}>
      <Text style={[styles.metaValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.metaLabel, { color: colors.sub }]}>{label}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.detailTop, { backgroundColor: colors.header }]}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.detailBack}>‹ {t('back')}</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.merkez}><ActivityIndicator size="large" color={colors.accent} /></View>
      ) : error ? (
        <View style={styles.merkez}><Text style={styles.hata}>{error}</Text></View>
      ) : recipe ? (
        <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {recipe.imageUrl && <Image source={{ uri: recipe.imageUrl }} style={styles.detailImage} />}
          <Text style={[styles.detailTitle, { color: colors.text }]}>{recipe.title}</Text>
          <TouchableOpacity onPress={() => onUser(recipe.username)} activeOpacity={0.7}>
            <Text style={[styles.cardUser, { color: colors.accent }]}>@{recipe.username}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Stars value={recipe.averageRating} />
            <Text style={{ color: colors.sub, marginLeft: 8, fontSize: 13 }}>
              {recipe.averageRating ? recipe.averageRating.toFixed(1) : t('noRatingYet')}
            </Text>
          </View>
          {!isOwner && (
            <View style={{ marginTop: 14, padding: 14, borderRadius: 14, backgroundColor: colors.meta }}>
              <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 8 }}>{t('rateTitle')}</Text>
              <RateStars current={myRate} onRate={rate} />
            </View>
          )}
          {isOwner && (
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity style={[styles.primaryBtn, { flex: 1, backgroundColor: colors.chipBg, marginTop: 0 }]} onPress={() => setEditing(true)} activeOpacity={0.85}>
                <Text style={[styles.primaryBtnText, { color: colors.text }]}>✏️ {t('edit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, { flex: 1, backgroundColor: colors.chipBg, marginTop: 0 }]} onPress={confirmDeleteRecipe} activeOpacity={0.85}>
                <Text style={[styles.primaryBtnText, { color: colors.accent }]}>🗑️ {t('delete')}</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={[styles.metaRow, { backgroundColor: colors.meta }]}>
            <Meta value={recipe.totalTime + t('min')} label={t('time')} />
            <Meta value={recipe.servings} label={t('servings')} />
            <Meta value={recipe.difficulty} label={t('difficulty')} />
            <Meta value={recipe.totalCalories} label={t('calories')} />
          </View>
          {recipe.description ? <Text style={{ color: colors.sub, lineHeight: 22, marginBottom: 8 }}>{recipe.description}</Text> : null}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('ingredients')}</Text>
          {recipe.ingredients.map((ing) => (
            <Text key={ing.id} style={{ color: colors.sub, marginBottom: 4, lineHeight: 22 }}>• {ing.quantity} {ing.unit} {ing.name}</Text>
          ))}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('howto')}</Text>
          <Text style={{ color: colors.sub, lineHeight: 24 }}>{recipe.steps}</Text>
          <CommentsSection token={token} me={me} recipeId={recipe.id} />
          <View style={{ height: 40 }} />
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logo: { fontSize: 38, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  loginAlt: { fontSize: 18, textAlign: 'center', marginBottom: 32 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 14 },
  primaryBtn: { borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  primaryBtnText: { fontSize: 16, fontWeight: '700' },
  link: { fontSize: 14, textAlign: 'center', fontWeight: '600' },
  merkez: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  hata: { color: '#e53935', fontSize: 15, textAlign: 'center', marginBottom: 8 },
  headerBand: { paddingTop: 54, paddingBottom: 14, paddingHorizontal: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 12 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  search: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, marginBottom: 8 },
  chipRow: { paddingVertical: 6, paddingRight: 16, alignItems: 'center' },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22, marginRight: 8 },
  card: { borderRadius: 16, marginBottom: 16, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  cardImage: { width: '100%', height: 190 },
  heartBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.35)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  heartIcon: { fontSize: 20 },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  cardUser: { fontSize: 13, marginBottom: 6, fontWeight: '600' },
  cardDesc: { fontSize: 14 },
  bar: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 10 },
  barItem: { flex: 1, alignItems: 'center' },
  barIcon: { fontSize: 22 },
  barLabel: { fontSize: 11, marginTop: 2, fontWeight: '600' },
  badge: { position: 'absolute', top: -4, right: -10, backgroundColor: '#e53935', minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  seg: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginRight: 10 },
  segRow: { flexDirection: 'row', marginBottom: 14 },
  settingLabel: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  smallLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 2 },
  photoPick: { height: 170, borderWidth: 1, borderRadius: 12, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 14, overflow: 'hidden' },
  photoPreview: { width: '100%', height: '100%' },
  detailTop: { paddingTop: 50, paddingBottom: 12, paddingHorizontal: 16 },
  detailBack: { color: '#fff', fontSize: 18, fontWeight: '700' },
  detailImage: { width: '100%', height: 230, borderRadius: 16, marginBottom: 12 },
  detailTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16, borderRadius: 14, padding: 14 },
  metaBox: { alignItems: 'center', flex: 1 },
  metaValue: { fontSize: 16, fontWeight: 'bold' },
  metaLabel: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  profileName: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  editProfileBtn: { marginTop: 12, borderWidth: 1, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8 },
  statRow: { flexDirection: 'row', borderRadius: 14, padding: 16, marginVertical: 16 },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 2 },
  rowBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 8 },
  countPill: { backgroundColor: '#e53935', minWidth: 24, height: 24, borderRadius: 12, paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' },
  countPillText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  listRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10 },
  miniBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginLeft: 8 },
  chatInputRow: { flexDirection: 'row', alignItems: 'flex-end', borderTopWidth: 1, paddingHorizontal: 10, paddingTop: 8 },
  chatInput: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, maxHeight: 110 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
});
