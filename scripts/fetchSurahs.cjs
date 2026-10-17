const fs = require('fs');

async function run() {
  try {
    const res = await fetch('https://equran.id/api/v2/surat');
    const json = await res.json();
    if (json.code === 200 && json.data) {
      const simplified = json.data.map(s => ({
        nomor: s.nomor,
        nama: s.nama,
        namaLatin: s.namaLatin,
        jumlahAyat: s.jumlahAyat,
        tempatTurun: s.tempatTurun,
        arti: s.arti,
        deskripsi: s.deskripsi,
        audioFull: s.audioFull
      }));

      const content = `import type { SurahSummary } from '../types/quran';\n\nexport const STATIC_SURAH_LIST: SurahSummary[] = ${JSON.stringify(simplified, null, 2)};\n`;
      fs.writeFileSync('src/data/surahListStatic.ts', content, 'utf-8');
      console.log('Successfully wrote', simplified.length, 'surahs to src/data/surahListStatic.ts');
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

run();
