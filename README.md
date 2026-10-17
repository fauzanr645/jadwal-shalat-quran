# Aplikasi Jadwal Shalat, Al-Qur'an 30 Juz & Murottal (PWA)

Aplikasi web modern berbasis **React + TypeScript + Vite + Tailwind CSS** dengan standar UI/UX bebas *UI slop*, responsif penuh untuk PC (desktop) dan HP (mobile), serta mendukung **PWA (Progressive Web App)** yang dapat diinstal langsung dan digunakan secara offline.

---

## ✨ Fitur Utama

### 1. 🕌 Jadwal Shalat Akurat & Notifikasi Adzan
* **Standar Resmi Kemenag RI**:
  * Sudut Subuh: 20°
  * Sudut Isya: 18°
  * Buffer Ikhtiyat: +2 menit (standar BHR Kemenag RI)
  * Waktu Imsak: 10 menit sebelum Subuh
  * Waktu Dhuha: ~20 menit setelah Syuruq (Terbit)
* **Penentuan Wilayah Otomatis & Manual**:
  * Deteksi koordinat GPS otomatis (HTML5 Geolocation).
  * Database pencarian lengkap seluruh kota/kabupaten di Indonesia (DKI Jakarta, Jawa Barat, Jawa Timur, Aceh, Sumatera, Bali, Kalimantan, Sulawesi, Maluku, Papua, dsb.) dengan zona waktu WIB, WITA, dan WIT.
* **Hitung Mundur & Progress Bar Real-time**:
  * Timer hitung mundur jam:menit:detik menuju waktu shalat berikutnya.
  * Bar persentase waktu shalat yang sedang berjalan.
* **Bunyi Adzan & Notifikasi Browser**:
  * PWA Web Notification API untuk notifikasi popup.
  * Audio Adzan Subuh khusus (*Ash-shalatu khairum minan naum*).
  * Audio Adzan Reguler (Dzuhur, Ashar, Maghrib, Isya).
  * Pilihan suara per waktu shalat: *Adzan Lengkap*, *Bip Singkat*, *Hanya Teks*, atau *Mute*.
  * Tombol **Test Suara Adzan** & slider pengatur volume.
  * Banner visual saat adzan berkumandang dengan tombol **Hentikan Suara**.

### 2. 📖 Al-Qur'an 30 Juz & Audio Murottal
* **114 Surah Lengkap**:
  * Data resmi Kemenag RI (via equran.id v2 API) dengan bundled fallback offline.
  * Pencarian cepat (nama Latin, nama Arab, nomor surah, arti).
  * Filter Makkiyah (86 surah) dan Madaniyah (28 surah).
  * Fitur **Terakhir Dibaca (Bookmark)** yang tersimpan otomatis di localStorage.
* **Tampilan Baca Elegan**:
  * Font Arab *Amiri* dengan harakat tajam dan ukuran font yang dapat diatur (22px - 48px).
  * Toggle transliterasi Latin & terjemahan Bahasa Indonesia resmi Kemenag RI.
  * Modal Tafsir resmi Kemenag RI per ayat.
  * Tombol salin ayat dan bagikan.
* **Floating Murottal Audio Player**:
  * Audio player sticky di bagian bawah yang tetap berputar saat Anda berpindah halaman/tab.
  * **Sinkronisasi Ayat (Auto-scroll & Glowing Ayat)**: Ayat yang sedang dilantunkan otomatis bercahaya (*emerald glow*) dan layar bergulir mengikuti bacaan.
  * Pilihan Qari:
    1. Syeikh Misyari Rasyid Al-Afasy (Default)
    2. Syeikh Abdurrahman As-Sudais
    3. Syeikh Abdullah Al-Juhany
    4. Syeikh Yasser Al-Dosari
    5. Syeikh Abdul-Muhsin Al-Qasim
    6. Syeikh Ibrahim Al-Dossari
  * Kontrol pemutar: Play/Pause, Next/Prev ayat, Repeat ayat/surah, Pengatur kecepatan (0.75x, 1x, 1.25x, 1.5x).

### 3. 📿 Doa, Dzikir Harian & Tasbih Digital
* Dzikir Setelah Shalat Fardhu, Dzikir Pagi, Dzikir Petang, dan Doa Harian pilihan lengkap dengan riwayat hadits shahih.
* Tasbih Digital interaktif dengan getaran haptic feedback, counter target (33x, 100x, bebas), dan reset loop.
* Kompas Arah Kiblat interaktif menghitung azimuth derajat Ka'bah di Makkah dari koordinat wilayah pengguna.

### 4. 📱 Progressive Web App (PWA)
* Standalone app mode (tanpa address bar browser).
* Service worker precache untuk loading kilat & offline.
* Tombol "Install App" native banner.

---

## 🚀 Cara Menjalankan

### Mode Pengembangan (Development)
```bash
cd jadwal-shalat-quran
npm run dev
```
Buka browser di `http://localhost:5173`.

### Mode Produksi (Build & Preview)
```bash
npm run build
npm run preview
```
Buka browser di `http://localhost:4173`.
