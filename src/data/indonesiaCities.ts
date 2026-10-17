import type { CityData } from '../types/prayer';

export const INDONESIA_CITIES: CityData[] = [
  // DKI Jakarta
  { id: 'jkt-pusat', name: 'Jakarta Pusat', province: 'DKI Jakarta', latitude: -6.1818, longitude: 106.8223, timezone: 'WIB' },
  { id: 'jkt-selatan', name: 'Jakarta Selatan', province: 'DKI Jakarta', latitude: -6.2615, longitude: 106.8106, timezone: 'WIB' },
  { id: 'jkt-barat', name: 'Jakarta Barat', province: 'DKI Jakarta', latitude: -6.1683, longitude: 106.7588, timezone: 'WIB' },
  { id: 'jkt-timur', name: 'Jakarta Timur', province: 'DKI Jakarta', latitude: -6.2250, longitude: 106.9004, timezone: 'WIB' },
  { id: 'jkt-utara', name: 'Jakarta Utara', province: 'DKI Jakarta', latitude: -6.1384, longitude: 106.8640, timezone: 'WIB' },
  
  // Jawa Barat
  { id: 'bandung', name: 'Kota Bandung', province: 'Jawa Barat', latitude: -6.9175, longitude: 107.6191, timezone: 'WIB' },
  { id: 'bogor', name: 'Kota Bogor', province: 'Jawa Barat', latitude: -6.5971, longitude: 106.8060, timezone: 'WIB' },
  { id: 'bekasi', name: 'Kota Bekasi', province: 'Jawa Barat', latitude: -6.2383, longitude: 106.9756, timezone: 'WIB' },
  { id: 'depok', name: 'Kota Depok', province: 'Jawa Barat', latitude: -6.4025, longitude: 106.7942, timezone: 'WIB' },
  { id: 'cirebon', name: 'Kota Cirebon', province: 'Jawa Barat', latitude: -6.7320, longitude: 108.5523, timezone: 'WIB' },
  { id: 'tasikmalaya', name: 'Kota Tasikmalaya', province: 'Jawa Barat', latitude: -7.3274, longitude: 108.2207, timezone: 'WIB' },
  { id: 'sukabumi', name: 'Kota Sukabumi', province: 'Jawa Barat', latitude: -6.9277, longitude: 106.9300, timezone: 'WIB' },
  { id: 'cimahi', name: 'Kota Cimahi', province: 'Jawa Barat', latitude: -6.8723, longitude: 107.5422, timezone: 'WIB' },
  
  // Banten
  { id: 'tangerang', name: 'Kota Tangerang', province: 'Banten', latitude: -6.1783, longitude: 106.6319, timezone: 'WIB' },
  { id: 'tangerang-selatan', name: 'Tangerang Selatan', province: 'Banten', latitude: -6.2952, longitude: 106.7081, timezone: 'WIB' },
  { id: 'serang', name: 'Kota Serang', province: 'Banten', latitude: -6.1104, longitude: 106.1640, timezone: 'WIB' },
  { id: 'cilegon', name: 'Kota Cilegon', province: 'Banten', latitude: -6.0024, longitude: 106.0123, timezone: 'WIB' },
  
  // Jawa Tengah
  { id: 'semarang', name: 'Kota Semarang', province: 'Jawa Tengah', latitude: -6.9667, longitude: 110.4167, timezone: 'WIB' },
  { id: 'surakarta', name: 'Kota Surakarta (Solo)', province: 'Jawa Tengah', latitude: -7.5755, longitude: 110.8243, timezone: 'WIB' },
  { id: 'magelang', name: 'Kota Magelang', province: 'Jawa Tengah', latitude: -7.4706, longitude: 110.2178, timezone: 'WIB' },
  { id: 'pekalongan', name: 'Kota Pekalongan', province: 'Jawa Tengah', latitude: -6.8886, longitude: 109.6753, timezone: 'WIB' },
  { id: 'tegal', name: 'Kota Tegal', province: 'Jawa Tengah', latitude: -6.8694, longitude: 109.1402, timezone: 'WIB' },
  { id: 'purwokerto', name: 'Purwokerto (Banyumas)', province: 'Jawa Tengah', latitude: -7.4243, longitude: 109.2302, timezone: 'WIB' },
  { id: 'kudus', name: 'Kabupaten Kudus', province: 'Jawa Tengah', latitude: -6.8048, longitude: 110.8405, timezone: 'WIB' },
  
  // DI Yogyakarta
  { id: 'yogyakarta', name: 'Kota Yogyakarta', province: 'DI Yogyakarta', latitude: -7.7956, longitude: 110.3695, timezone: 'WIB' },
  { id: 'sleman', name: 'Kabupaten Sleman', province: 'DI Yogyakarta', latitude: -7.7167, longitude: 110.3556, timezone: 'WIB' },
  { id: 'bantul', name: 'Kabupaten Bantul', province: 'DI Yogyakarta', latitude: -7.8880, longitude: 110.3298, timezone: 'WIB' },
  
  // Jawa Timur
  { id: 'surabaya', name: 'Kota Surabaya', province: 'Jawa Timur', latitude: -7.2575, longitude: 112.7521, timezone: 'WIB' },
  { id: 'malang', name: 'Kota Malang', province: 'Jawa Timur', latitude: -7.9797, longitude: 112.6304, timezone: 'WIB' },
  { id: 'sidoarjo', name: 'Kabupaten Sidoarjo', province: 'Jawa Timur', latitude: -7.4478, longitude: 112.7183, timezone: 'WIB' },
  { id: 'gresik', name: 'Kabupaten Gresik', province: 'Jawa Timur', latitude: -7.1566, longitude: 112.6555, timezone: 'WIB' },
  { id: 'kediri', name: 'Kota Kediri', province: 'Jawa Timur', latitude: -7.8480, longitude: 112.0178, timezone: 'WIB' },
  { id: 'jember', name: 'Kabupaten Jember', province: 'Jawa Timur', latitude: -8.1845, longitude: 113.6681, timezone: 'WIB' },
  { id: 'banyuwangi', name: 'Kabupaten Banyuwangi', province: 'Jawa Timur', latitude: -8.2192, longitude: 114.3692, timezone: 'WIB' },
  { id: 'madiun', name: 'Kota Madiun', province: 'Jawa Timur', latitude: -7.6298, longitude: 111.5239, timezone: 'WIB' },
  
  // Aceh & Sumatera Utara
  { id: 'banda-aceh', name: 'Banda Aceh', province: 'Aceh', latitude: 5.5483, longitude: 95.3238, timezone: 'WIB' },
  { id: 'lhokseumawe', name: 'Kota Lhokseumawe', province: 'Aceh', latitude: 5.1801, longitude: 97.1408, timezone: 'WIB' },
  { id: 'medan', name: 'Kota Medan', province: 'Sumatera Utara', latitude: 3.5952, longitude: 98.6722, timezone: 'WIB' },
  { id: 'binjai', name: 'Kota Binjai', province: 'Sumatera Utara', latitude: 3.6006, longitude: 98.4854, timezone: 'WIB' },
  { id: 'pematangsiantar', name: 'Kota Pematangsiantar', province: 'Sumatera Utara', latitude: 2.9599, longitude: 99.0687, timezone: 'WIB' },
  
  // Sumatera Barat, Riau, Kepri
  { id: 'padang', name: 'Kota Padang', province: 'Sumatera Barat', latitude: -0.9471, longitude: 100.4172, timezone: 'WIB' },
  { id: 'bukittinggi', name: 'Kota Bukittinggi', province: 'Sumatera Barat', latitude: -0.3055, longitude: 100.3692, timezone: 'WIB' },
  { id: 'pekanbaru', name: 'Kota Pekanbaru', province: 'Riau', latitude: 0.5071, longitude: 101.4478, timezone: 'WIB' },
  { id: 'dumai', name: 'Kota Dumai', province: 'Riau', latitude: 1.6667, longitude: 101.4500, timezone: 'WIB' },
  { id: 'batam', name: 'Kota Batam', province: 'Kepulauan Riau', latitude: 1.1301, longitude: 104.0529, timezone: 'WIB' },
  { id: 'tanjungpinang', name: 'Kota Tanjungpinang', province: 'Kepulauan Riau', latitude: 0.9167, longitude: 104.4500, timezone: 'WIB' },
  
  // Jambi, Sumsel, Bengkulu, Lampung, Babel
  { id: 'jambi', name: 'Kota Jambi', province: 'Jambi', latitude: -1.6101, longitude: 103.6131, timezone: 'WIB' },
  { id: 'palembang', name: 'Kota Palembang', province: 'Sumatera Selatan', latitude: -2.9761, longitude: 104.7754, timezone: 'WIB' },
  { id: 'bengkulu', name: 'Kota Bengkulu', province: 'Bengkulu', latitude: -3.8004, longitude: 102.2655, timezone: 'WIB' },
  { id: 'bandar-lampung', name: 'Kota Bandar Lampung', province: 'Lampung', latitude: -5.3971, longitude: 105.2668, timezone: 'WIB' },
  { id: 'pangkalpinang', name: 'Kota Pangkalpinang', province: 'Bangka Belitung', latitude: -2.1333, longitude: 106.1167, timezone: 'WIB' },
  
  // Bali & Nusa Tenggara
  { id: 'denpasar', name: 'Kota Denpasar', province: 'Bali', latitude: -8.6705, longitude: 115.2126, timezone: 'WITA' },
  { id: 'singaraja', name: 'Singaraja (Buleleng)', province: 'Bali', latitude: -8.1120, longitude: 115.0882, timezone: 'WITA' },
  { id: 'mataram', name: 'Kota Mataram (Lombok)', province: 'Nusa Tenggara Barat', latitude: -8.5833, longitude: 116.1167, timezone: 'WITA' },
  { id: 'bima', name: 'Kota Bima (Sumbawa)', province: 'Nusa Tenggara Barat', latitude: -8.4608, longitude: 118.7267, timezone: 'WITA' },
  { id: 'kupang', name: 'Kota Kupang', province: 'Nusa Tenggara Timur', latitude: -10.1772, longitude: 123.6070, timezone: 'WITA' },
  
  // Kalimantan
  { id: 'pontianak', name: 'Kota Pontianak', province: 'Kalimantan Barat', latitude: -0.0263, longitude: 109.3425, timezone: 'WIB' },
  { id: 'singkawang', name: 'Kota Singkawang', province: 'Kalimantan Barat', latitude: 0.9080, longitude: 108.9866, timezone: 'WIB' },
  { id: 'banjarmasin', name: 'Kota Banjarmasin', province: 'Kalimantan Selatan', latitude: -3.3194, longitude: 114.5908, timezone: 'WITA' },
  { id: 'banjarbaru', name: 'Kota Banjarbaru', province: 'Kalimantan Selatan', latitude: -3.4402, longitude: 114.8300, timezone: 'WITA' },
  { id: 'palangkaraya', name: 'Kota Palangkaraya', province: 'Kalimantan Tengah', latitude: -2.2161, longitude: 113.9139, timezone: 'WIB' },
  { id: 'samarinda', name: 'Kota Samarinda', province: 'Kalimantan Timur', latitude: -0.5022, longitude: 117.1536, timezone: 'WITA' },
  { id: 'balikpapan', name: 'Kota Balikpapan', province: 'Kalimantan Timur', latitude: -1.2379, longitude: 116.8289, timezone: 'WITA' },
  { id: 'ikn-nusantara', name: 'IKN Nusantara', province: 'Kalimantan Timur', latitude: -0.9700, longitude: 116.7100, timezone: 'WITA' },
  { id: 'tarakan', name: 'Kota Tarakan', province: 'Kalimantan Utara', latitude: 3.3270, longitude: 117.5950, timezone: 'WITA' },
  
  // Sulawesi
  { id: 'makassar', name: 'Kota Makassar', province: 'Sulawesi Selatan', latitude: -5.1477, longitude: 119.4327, timezone: 'WITA' },
  { id: 'parepare', name: 'Kota Parepare', province: 'Sulawesi Selatan', latitude: -4.0135, longitude: 119.6258, timezone: 'WITA' },
  { id: 'palopo', name: 'Kota Palopo', province: 'Sulawesi Selatan', latitude: -2.9928, longitude: 120.1970, timezone: 'WITA' },
  { id: 'manado', name: 'Kota Manado', province: 'Sulawesi Utara', latitude: 1.4748, longitude: 124.8421, timezone: 'WITA' },
  { id: 'kotamobagu', name: 'Kota Kotamobagu', province: 'Sulawesi Utara', latitude: 0.7306, longitude: 124.3140, timezone: 'WITA' },
  { id: 'palu', name: 'Kota Palu', province: 'Sulawesi Tengah', latitude: -0.9003, longitude: 119.8779, timezone: 'WITA' },
  { id: 'kendari', name: 'Kota Kendari', province: 'Sulawesi Tenggara', latitude: -3.9985, longitude: 122.5126, timezone: 'WITA' },
  { id: 'gorontalo', name: 'Kota Gorontalo', province: 'Gorontalo', latitude: 0.5401, longitude: 123.0600, timezone: 'WITA' },
  { id: 'mamuju', name: 'Kota Mamuju', province: 'Sulawesi Barat', latitude: -2.6775, longitude: 118.8919, timezone: 'WITA' },
  
  // Maluku & Papua
  { id: 'ambon', name: 'Kota Ambon', province: 'Maluku', latitude: -3.6554, longitude: 128.1908, timezone: 'WIT' },
  { id: 'ternate', name: 'Kota Ternate', province: 'Maluku Utara', latitude: 0.7904, longitude: 127.3820, timezone: 'WIT' },
  { id: 'tidore', name: 'Kota Tidore', province: 'Maluku Utara', latitude: 0.6908, longitude: 127.4389, timezone: 'WIT' },
  { id: 'jayapura', name: 'Kota Jayapura', province: 'Papua', latitude: -2.5916, longitude: 140.6690, timezone: 'WIT' },
  { id: 'sorong', name: 'Kota Sorong', province: 'Papua Barat Daya', latitude: -0.8762, longitude: 131.2558, timezone: 'WIT' },
  { id: 'manokwari', name: 'Kota Manokwari', province: 'Papua Barat', latitude: -0.8615, longitude: 134.0620, timezone: 'WIT' },
  { id: 'merauke', name: 'Kabupaten Merauke', province: 'Papua Selatan', latitude: -8.4991, longitude: 140.4019, timezone: 'WIT' },
  { id: 'timika', name: 'Kota Timika (Mimika)', province: 'Papua Tengah', latitude: -4.5447, longitude: 136.8837, timezone: 'WIT' },
  { id: 'wamena', name: 'Kota Wamena (Jayawijaya)', province: 'Papua Pegunungan', latitude: -4.0950, longitude: 138.9460, timezone: 'WIT' }
];

export const DEFAULT_CITY = INDONESIA_CITIES[0]; // Jakarta Pusat

export function searchCities(query: string): CityData[] {
  if (!query || !query.trim()) return INDONESIA_CITIES.slice(0, 20);
  const q = query.toLowerCase().trim();
  return INDONESIA_CITIES.filter(
    city =>
      city.name.toLowerCase().includes(q) ||
      city.province.toLowerCase().includes(q)
  );
}
