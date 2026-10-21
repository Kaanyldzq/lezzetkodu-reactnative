# LezzetKodu Mobile 🍅

React Native (Expo) ile geliştirilmiş, kendi Spring Boot REST API'me bağlanan sosyal yemek tarifi uygulaması. Mevcut **LezzetKodu** (Android / Google Play) projemin mobil, çapraz platform sürümü.

> Kullanıcılar tarif paylaşır, birbirini takip eder, mesajlaşır, tarifleri dener ve puanlar. Tüm veri hazır bir servisten değil, baştan sona kendi kurduğum backend + veritabanından gelir.

---

## 🧱 Mimari

```
[ React Native (Expo) ]  ──HTTPS/JSON──►  [ Spring Boot REST API ]  ──►  [ PostgreSQL ]
        Mobil                                  (Railway'de canlı)            (veritabanı)
```

- **Mobil (bu repo):** React Native + Expo + TypeScript
- **Backend:** Java / Spring Boot — JWT auth, BCrypt, çok katmanlı REST API (ayrı repo)
- **Veritabanı:** PostgreSQL
- **Barındırma:** Railway (backend + DB)

---

## ✨ Özellikler

**Hesap & Güvenlik**
- Kayıt / giriş / şifremi unuttum (e-posta ile kod)
- JWT tabanlı kimlik doğrulama; token cihazda `expo-secure-store` ile şifreli saklanır
- Oturum süresi dolunca (401) otomatik çıkış

**Tarifler**
- Tarif ekleme (fotoğraf yükleme + AI ile içerik iyileştirme)
- Düzenleme / silme
- Keşfet: kategori, arama, **Popüler / En Beğenilen / Elimdeki Malzemeler** filtreleri
- Sonsuz kaydırma (sayfalı yükleme)
- Favoriler
- Yorumlar; yıldızla **puanlama** ve fotoğraflı **"denemeler"**

**Sosyal**
- Kullanıcı profilleri + profil düzenleme (avatar & bio)
- Takip / takip istekleri (kabul-reddet), gizli hesap
- Kullanıcı arama
- Mesajlaşma (okunmamış rozeti, saat/tarih ayracı, mesaj düzenle-sil)
- Engelleme & şikayet

**Yönetim**
- Admin paneli (yalnızca admin rolünde görünür): istatistikler, şikayet yönetimi, kullanıcı banlama, içerik silme

**Diğer**
- Açık / koyu tema
- Türkçe / İngilizce dil desteği

---

## 🔌 Teknik Detaylar (HTTP tarafı)

- Tüm istekler `fetch` ile atılır; korumalı uçlara `Authorization: Bearer <token>` header'ı eklenir.
- **GET / POST / PUT / DELETE** metodlarının tamamı kullanılır.
- Fotoğraf yükleme **multipart/form-data** ile yapılır (`expo-file-system` `uploadAsync`): dosya `image` parçası, tarif bilgisi JSON parçası olarak aynı istekte gönderilir.
- Listeler backend'in `Page` yapısıyla sayfalanır (`page`, `size`, `last`).
- Mesajlaşmada basit **polling** ile canlıya yakın güncelleme sağlanır.

---

## 🛠️ Kullanılan Başlıca Paketler

- `expo`, `react-native`, `typescript`
- `expo-secure-store` — token saklama
- `expo-image-picker` — galeri/fotoğraf seçimi
- `expo-file-system` — multipart dosya yükleme
- `react-native-safe-area-context` — güvenli alan (çentik/gezinme çubuğu)

---

## 🚀 Çalıştırma

Gereksinimler: Node.js, `npx`, telefonda **Expo Go** uygulaması.

```bash
# bağımlılıkları kur
npm install

# geliştirme sunucusunu başlat
npx expo start            # aynı Wi-Fi'daysan (LAN)
# veya farklı ağ / kısıtlı ağ için:
npx expo start --tunnel
```

Ardından Expo Go ile terminaldeki **QR kodu** okut. Uygulama canlı backend'e bağlıdır; internet bağlantısı yeterlidir.

> Not: Backend Railway'de 7/24 çalışır; ayrıca sunucu kurmana gerek yoktur.

---

## 📸 Ekran Görüntüleri

> (Buraya birkaç ekran görüntüsü eklenecek: Keşfet, Tarif Detay, Profil, Mesajlaşma, Admin.)

| Keşfet | Tarif Detay | Profil |
|---|---|---|
| _görsel_ | _görsel_ | _görsel_ |

---

## 👤 Geliştirici

**Kaan Yıldız** — Android / Full-stack Developer
Bilgisayar Mühendisliği, Süleyman Demirel Üniversitesi

---

_Bu proje React Native öğrenme sürecinde, mevcut LezzetKodu backend'ime bağlı çalışan bir mobil istemci olarak bir hafta içinde geliştirilmiştir._
