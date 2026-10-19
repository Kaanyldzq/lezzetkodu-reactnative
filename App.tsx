import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, ActivityIndicator,
  TextInput, Button, Image, TouchableOpacity,
} from 'react-native';

// Backend adresi — tek yerde tutuyoruz
const BASE_URL = 'https://lezzetkodu-backend-production.up.railway.app';

// Bir tarifin ihtiyacımız olan alanları
type Recipe = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  username: string;
};

// ============ UYGULAMA KÖKÜ ============
// Token yoksa giriş ekranı, varsa tarif listesi gösteriyoruz
export default function App() {
  const [token, setToken] = useState<string | null>(null);

  if (!token) {
    return <LoginScreen onLoggedIn={setToken} />;
  }
  return <RecipeListScreen token={token} onLogout={() => setToken(null)} />;
}

// ============ GİRİŞ EKRANI ============
function LoginScreen({ onLoggedIn }: { onLoggedIn: (token: string) => void }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function girisYap() {
    try {
      setLoading(true);
      setError(null);

      // POST isteği: gövdeye JSON koyuyoruz
      const cevap = await fetch(BASE_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      if (!cevap.ok) {
        throw new Error('Giriş başarısız (' + cevap.status + ')');
      }

      // Cevap AuthResponse: içinden token'ı alıyoruz
      const veri = await cevap.json();
      onLoggedIn(veri.token);
    } catch (e: any) {
      setError(e.message ?? 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginBaslik}>LezzetKodu 🍅</Text>
      <Text style={styles.loginAlt}>Giriş Yap</Text>

      <TextInput
        style={styles.input}
        placeholder="E-posta veya kullanıcı adı"
        autoCapitalize="none"
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.hata}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 16 }} />
      ) : (
        <Button title="Giriş Yap" onPress={girisYap} />
      )}
    </View>
  );
}

// ============ TARİF LİSTESİ EKRANI ============
function RecipeListScreen({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function feedGetir() {
      try {
        setLoading(true);
        setError(null);

        // Korumalı GET: Authorization başlığına token'ı koyuyoruz
        const cevap = await fetch(BASE_URL + '/api/recipes?page=0&size=20', {
          headers: { Authorization: 'Bearer ' + token },
        });

        if (!cevap.ok) {
          throw new Error('Tarifler alınamadı (' + cevap.status + ')');
        }

        // PageResponse geldi: içindeki content listesini alıyoruz
        const veri = await cevap.json();
        setRecipes(veri.content);
      } catch (e: any) {
        setError(e.message ?? 'Bilinmeyen hata');
      } finally {
        setLoading(false);
      }
    }
    feedGetir();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.merkez}>
        <ActivityIndicator size="large" />
        <Text style={styles.bilgi}>Tarifler yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.merkez}>
        <Text style={styles.hata}>{error}</Text>
        <Button title="Çıkış Yap" onPress={onLogout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.baslik}>LezzetKodu 🍅</Text>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.cikis}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
            )}
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardUser}>@{item.username}</Text>
              {item.description && (
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
              )}
            </View>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 32 },
  loginBaslik: { fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  loginAlt: { fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 32 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 14 },
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 16 },
  merkez: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  baslik: { fontSize: 26, fontWeight: 'bold' },
  cikis: { color: '#e53935', fontSize: 16, fontWeight: '600' },
  bilgi: { marginTop: 12, color: '#666' },
  hata: { color: 'red', fontSize: 15, textAlign: 'center', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: '#eee', overflow: 'hidden' },
  cardImage: { width: '100%', height: 180, backgroundColor: '#f2f2f2' },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  cardUser: { fontSize: 13, color: '#e53935', marginBottom: 6 },
  cardDesc: { fontSize: 14, color: '#666' },
});