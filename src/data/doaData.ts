import type { DoaItem } from '../types/doa';

export interface DailyFeaturedDoa {
  dayIndex: number; // 0 = Ahad/Minggu, 1 = Senin, ..., 6 = Sabtu
  dayName: string;
  theme: string;
  fadhilahRezeki: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  fawaid: string;
  targetCount: number;
}

export const DAILY_FEATURED_DOA: DailyFeaturedDoa[] = [
  // 0: Ahad / Minggu
  {
    dayIndex: 0,
    dayName: 'Ahad (Minggu)',
    theme: 'Doa Syukur & Pembuka Keran Rezeki',
    fadhilahRezeki: 'Barangsiapa membaca doa syukur ini di hari Ahad dengan tulus, niscaya Allah akan menambah nikmat dan melipatgandakan rezeki di pekan yang baru.',
    title: 'Doa Mensyukuri Nikmat & Memohon Kelapangan Rezeki',
    arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ',
    latin: 'Rabbi awzi‘nii an asykura ni‘matakal-latii an‘amta ‘alayya wa ‘alaa waalidayya wa an a‘mala shaalihan tardhaahu wa adkhilnii birahmatika fii ‘ibaadikas-shaalihiin.',
    translation: 'Ya Rabbku, anugerahkanlah kepadaku ilham untuk tetap mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku dan kepada kedua orang tuaku dan agar aku mengerjakan kebajikan yang Engkau ridhai; dan masukkanlah aku dengan rahmat-Mu ke dalam golongan hamba-hamba-Mu yang saleh.',
    fawaid: 'QS. An-Naml: 19. Mengundang bertambahnya karunia dan rezeki berkah yang tak terputus.',
    targetCount: 3,
  },
  // 1: Senin
  {
    dayIndex: 1,
    dayName: 'Senin',
    theme: 'Doa Pembuka Pintu Rezeki & Berkah Usaha',
    fadhilahRezeki: 'Barangsiapa membaca doa ini di awal pekan (Senin), Allah akan melapangkan pintu rezekinya dari segala arah dan mencukupkan segala kebutuhannya.',
    title: 'Doa Memohon Rezeki yang Halal, Thayyib & Berlimpah',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    latin: 'Allahumma innii as-aluka ‘ilman naafi‘an, wa rizqan thayyiban, wa ‘amalan mutaqabbalan.',
    translation: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang halal lagi baik, dan amalan yang diterima di sisi-Mu.',
    fawaid: 'HR. Ibnu Majah no. 925 & Ahmad 6/305. Dibaca di awal hari agar seluruh usaha bernilai ibadah dan mendatangkan rezeki berkah.',
    targetCount: 7,
  },
  // 2: Selasa
  {
    dayIndex: 2,
    dayName: 'Selasa',
    theme: 'Doa Kelapangan Rezeki & Pembebas Beban',
    fadhilahRezeki: 'Barangsiapa merutinkan doa ini di hari Selasa, Allah akan menghilangkan kecemasan hidup, melunasi hutang-hutangnya, dan melimpahkan ketenangan rezeki.',
    title: 'Doa Pelindung dari Lilitan Hutang & Kesempitan Hidup',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
    latin: 'Allahumma innii a‘uudzu bika minal-hammi wal-hazani, wa a‘uudzu bika minal-‘ajzi wal-kasali, wa a‘uudzu bika minal-jubni wal-bukhli, wa a‘uudzu bika min ghalabatid-daini wa qahrir-rijaal.',
    translation: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari rasa gelisah dan sedih, aku berlindung kepada-Mu dari kelemahan dan kemalasan, aku berlindung kepada-Mu dari sifat pengecut dan kikir, serta aku berlindung kepada-Mu dari lilitan hutang dan kesewenang-wenangan orang lain.',
    fawaid: 'HR. Abu Daud no. 1555. Doa masyhur Rasulullah shallallahu ‘alaihi wa sallam untuk membuka kelapangan finansial.',
    targetCount: 3,
  },
  // 3: Rabu
  {
    dayIndex: 3,
    dayName: 'Rabu',
    theme: 'Doa Rezeki Tanpa Hisab & Kecukupan',
    fadhilahRezeki: 'Barangsiapa membaca doa ini di hari Rabu, Allah akan mencukupkannya dengan yang halal dan menjadikannya kaya hati serta berkecukupan harta.',
    title: 'Doa Kecukupan dengan Rezeki yang Halal',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    latin: 'Allahummak-finii bihalaalika ‘an haraamika, wa aghninii bifadhlika ‘amman siwaaka.',
    translation: 'Ya Allah, cukupkanlah aku dengan rezeki-Mu yang halal dari yang haram, dan kayakanlah aku dengan karunia-Mu dari bergantung kepada selain-Mu.',
    fawaid: 'HR. Tirmidzi no. 3563. Diriwayatkan bahwa meskipun seseorang memiliki hutang sebesar gunung, Allah akan membantunya melunasinya.',
    targetCount: 7,
  },
  // 4: Kamis
  {
    dayIndex: 4,
    dayName: 'Kamis',
    theme: 'Doa Perlindungan Harta & Keberkahan Nikmat',
    fadhilahRezeki: 'Barangsiapa memanjatkan doa ini di hari Kamis, Allah akan melindunginya dari kemiskinan harta dan menganugerahkan rezeki yang melimpah berkah.',
    title: 'Doa Perlindungan dari Kefakiran & Siksa Kubur',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ',
    latin: 'Allahumma innii a‘uudzu bika minal-kufri wal-faqri, Allahumma innii a‘uudzu bika min ‘adzaabil-qabri, laa ilaaha illaa anta.',
    translation: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari kekafiran dan kefakiran (kemiskinan). Ya Allah, sesungguhnya aku berlindung kepada-Mu dari siksa kubur. Tiada Tuhan yang berhak disembah selain Engkau.',
    fawaid: 'HR. Abu Daud no. 5090 & Ahmad 5/42. Membentengi diri dan keluarga dari jerat kefakiran hidup.',
    targetCount: 3,
  },
  // 5: Jumat
  {
    dayIndex: 5,
    dayName: 'Jumat (Sayyidul Ayyam)',
    theme: 'Doa Kemuliaan Hari Jumat — Pintu Rezeki Terbuka Lebar',
    fadhilahRezeki: 'Hari Jumat adalah Sayyidul Ayyam di mana terdapat waktu mustajab. Membaca doa ini insyaAllah mengalirkan rezeki berlipat ganda, ampunan dosa, dan terkabulnya segala hajat.',
    title: 'Doa Keberkahan Hari Jumat & Shalawat Penarik Rahmat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    latin: 'Allahumma shalli ‘alaa Muhammadin wa ‘alaa aali Muhammad, kamaa shallaita ‘alaa Ibraahiima wa ‘alaa aali Ibraahiim, innaka hamiidum-majiid. Allahumma baarik ‘alaa Muhammadin wa ‘alaa aali Muhammad, kamaa baarakta ‘alaa Ibraahiima wa ‘alaa aali Ibraahiim, innaka hamiidum-majiid.',
    translation: 'Ya Allah, berilah rahmat kepada Muhammad dan keluarga Muhammad sebagaimana Engkau telah memberi rahmat kepada Ibrahim dan keluarga Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, berilah keberkahan kepada Muhammad dan keluarga Muhammad sebagaimana Engkau telah memberi keberkahan kepada Ibrahim dan keluarga Ibrahim. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.',
    fawaid: 'HR. Bukhari no. 3370 & Muslim no. 405. Memperbanyak shalawat di hari Jumat menjamin kemudahan rezeki dan syafaat Nabi.',
    targetCount: 10,
  },
  // 6: Sabtu
  {
    dayIndex: 6,
    dayName: 'Sabtu',
    theme: 'Doa Rezeki dari Arah Tak Terduga (Ayat Seribu Dinar)',
    fadhilahRezeki: 'Barangsiapa membaca ayat seribu dinar ini di hari Sabtu dengan penuh takwa, Allah akan memberikan jalan keluar dari setiap kebuntuan dan memberinya rezeki dari arah yang tidak disangka-sangka.',
    title: 'Doa Ayat Seribu Dinar (Jalan Keluar & Rezeki Tak Terduga)',
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا',
    latin: 'Wa may-yattaqillaaha yaj‘al lahuu makhrajaa, wa yarzuq-hu min haitsu laa yahtasib, wa may-yatawakkal ‘alallaahi fahuwa hasbuh, innallaaha baalighu amrih, qad ja‘alallaahu likulli syai-in qadraa.',
    translation: 'Barangsiapa bertakwa kepada Allah niscaya Dia akan mengadakan baginya jalan keluar, dan memberinya rezeki dari arah yang tiada disangka-sangkanya. Dan barangsiapa yang bertawakal kepada Allah niscaya Allah akan mencukupkan (keperluan)nya. Sesungguhnya Allah melaksanakan urusan yang (dikehendaki)-Nya. Sesungguhnya Allah telah mengadakan ketentuan bagi tiap-tiap sesuatu.',
    fawaid: 'QS. At-Talaq: 2-3. Ayat penarik rezeki paling mustajab dan penenang hati dari kesulitan finansial.',
    targetCount: 7,
  },
];

export function getTodayFeaturedDoa(date: Date = new Date()): DailyFeaturedDoa {
  const day = date.getDay(); // 0 - 6
  return DAILY_FEATURED_DOA.find((d) => d.dayIndex === day) || DAILY_FEATURED_DOA[1];
}

export const DOA_LIST: DoaItem[] = [
  // DZIKIR SETELAH SHALAT
  {
    id: 'shalat-istighfar',
    title: 'Istighfar Setelah Shalat',
    arabic: 'أَسْتَغْفِرُ اللهَ (٣×) اللَّهُمَّ أَنْتَ السَّلاَمُ، وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
    latin: 'Astaghfirullah (3x). Allahumma antas-salaam wa minkas-salaam, tabaarakta yaa dzal-jalaali wal-ikraam.',
    translation: 'Aku memohon ampun kepada Allah (3x). Ya Allah, Engkau Mahasejahtera dan dari-Mu lah kesejahteraan, Mahasuci Engkau wahai Rabb Pemilik keagungan dan kemuliaan.',
    fawaid: 'HR. Muslim no. 591. Dibaca segera setelah salam.',
    repeatCount: 1,
    category: 'shalat',
  },
  {
    id: 'shalat-tahlil',
    title: 'Tahlil & Pujian Kesempurnaan Kerajaan Allah',
    arabic: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    latin: 'Laa ilaaha illallaahu wahdahu laa syariika lahu, lahul mulku wa lahul hamdu wa huwa ‘ala kulli syai-in qadiir. Allahumma laa maani‘a limaa a‘thaita, wa laa mu‘thiya limaa mana‘ta, wa laa yanfa‘u dzal jaddi minkal jaddu.',
    translation: 'Tiada Ilah yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan segala pujian, dan Dia Mahakuasa atas segala sesuatu. Ya Allah, tidak ada yang dapat mencegah apa yang Engkau beri, dan tidak ada yang dapat memberi apa yang Engkau cegah, dan tiada bermanfaat kekayaan orang yang kaya dari siksa-Mu.',
    fawaid: 'HR. Bukhari no. 844 & Muslim no. 593.',
    repeatCount: 1,
    category: 'shalat',
  },
  {
    id: 'shalat-tasbih',
    title: 'Tasbih, Tahmid, & Takbir (33x)',
    arabic: 'سُبْحَانَ اللهِ (٣٣×) ، الْحَمْدُ لِلّٰهِ (٣٣×) ، اللهُ أَكْبَرُ (٣٣×)',
    latin: 'Subhanallah (33x), Alhamdulillah (33x), Allahu Akbar (33x).',
    translation: 'Mahasuci Allah (33x), Segala puji bagi Allah (33x), Allah Mahabesar (33x).',
    fawaid: 'HR. Muslim no. 597. Diampuni dosa-dosanya meskipun sebanyak buih di lautan.',
    repeatCount: 33,
    category: 'shalat',
  },
  {
    id: 'shalat-ayat-kursi',
    title: 'Ayat Kursi Setelah Shalat Fardhu',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    latin: 'Allahu laa ilaaha illaa huwal hayyul qayyuum, laa ta’khudzuhuu sinatuw wa laa nawm, lahu maa fis-samaawaati wa maa fil ardh, man dzalladzii yasyfa‘u ‘indahuu illaa bi-idznih, ya‘lamu maa baina aidiihim wa maa khalfahum, wa laa yuhiithuuna bi-syai-im min ‘ilmihii illaa bimaa syaa-a, wasi‘a kursiyyuhus-samaawaati wal-ardh, wa laa ya-uuduhuu hifzhuhumaa wa huwal ‘aliyyul ‘azhiim.',
    translation: 'Allah, tidak ada Tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus makhluk-Nya, tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan apa yang di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Mahatinggi, Mahabesar.',
    fawaid: 'HR. An-Nasa’i dalam Sunan al-Kubra (9848). Barangsiapa membacanya setiap selesai shalat fardhu, tidak ada yang menghalanginya masuk surga selain kematian.',
    repeatCount: 1,
    category: 'shalat',
  },

  // DZIKIR PAGI
  {
    id: 'pagi-sayyidul-istighfar',
    title: 'Sayyidul Istighfar (Penghulu Istighfar)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء لك بذنبي فاغفر لي، فإنه لا يغفر الذنوب إلا أنت',
    latin: 'Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa anaa ‘abduka, wa anaa ‘alaa ‘ahdika wa wa‘dika mastatha‘tu, a‘uudzu bika min syarri maa shana‘tu, abuu-u laka bini‘matika ‘alayya, wa abuu-u laka bidzanbii faghfir lii, fainnahuu laa yaghfirudz-dzunuuba illaa anta.',
    translation: 'Ya Allah, Engkau adalah Rabbku, tiada Ilah yang berhak disembah selain Engkau. Engkau yang menciptakan aku dan aku adalah hamba-Mu. Aku berusaha menepati ikrar dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan yang telah kuperbuat. Aku mengakui nikmat-Mu atasku dan mengakui dosaku kepada-Mu, maka ampunilah dosaku, karena tidak ada yang mengampuni dosa selain Engkau.',
    fawaid: 'HR. Bukhari no. 6306. Siapa yang membacanya di pagi hari dengan yakin lalu meninggal sebelum sore hari, maka ia termasuk penghuni surga.',
    repeatCount: 1,
    category: 'pagi',
  },
  {
    id: 'pagi-perlindungan',
    title: 'Perlindungan dari Segala Mara Bahaya',
    arabic: 'بِسْمِ اللّٰهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ (٣×)',
    latin: 'Bismillahilladzii laa yadhurru ma‘asmihii syai-un fil ardhi wa laa fis-samaa-i wa huwas-samii‘ul ‘aliim (3x).',
    translation: 'Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat membahayakan, dan Dia Maha Mendengar lagi Maha Mengetahui.',
    fawaid: 'HR. Abu Daud no. 5088 & Tirmidzi no. 3388. Tidak akan ada bahaya yang menimpanya hingga sore hari.',
    repeatCount: 3,
    category: 'pagi',
  },
  {
    id: 'pagi-ridha',
    title: 'Keridhaan kepada Allah, Islam, dan Rasulullah',
    arabic: 'رَضِيتُ بِاللّٰهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا (٣×)',
    latin: 'Radhiitu billaahi rabbaa, wa bil-islaami diinaa, wa bi-Muhammadin shallallaahu ‘alaihi wa sallama nabiyyaa (3x).',
    translation: 'Aku rela Allah sebagai Rabbku, Islam sebagai agamaku, dan Muhammad shallallahu ‘alaihi wa sallam sebagai Nabiku.',
    fawaid: 'HR. Abu Daud no. 5072. Wajib bagi Allah untuk meridhai dirinya pada hari kiamat.',
    repeatCount: 3,
    category: 'pagi',
  },

  // DZIKIR PETANG
  {
    id: 'petang-amsayna',
    title: 'Doa Memasuki Waktu Sore (Amsayna)',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلّٰهِ، وَالْحَمْدُ لِلّٰهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    latin: 'Amsaynaa wa amsal-mulku lillaah, wal-hamdu lillaah, laa ilaaha illallaahu wahdahu laa syariika lahu, lahul-mulku wa lahul-hamdu wa huwa ‘ala kulli syai-in qadiir.',
    translation: 'Kami telah memasuki waktu sore dan kerajaan milik Allah, segala puji bagi Allah. Tiada Ilah yang berhak disembah selain Allah semata tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan puji, dan Dia Mahakuasa atas segala sesuatu.',
    fawaid: 'HR. Muslim no. 2723.',
    repeatCount: 1,
    category: 'petang',
  },
  {
    id: 'petang-kalimat-tammah',
    title: 'Perlindungan Kalimat Allah yang Sempurna',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (٣×)',
    latin: 'A‘uudzu bi-kalimaatillaahit-taammaati min syarri maa khalaq (3x).',
    translation: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk yang Dia ciptakan.',
    fawaid: 'HR. Muslim no. 2709. Tidak akan ada racun/sengatan hewan berbisa yang membahayakannya malam itu.',
    repeatCount: 3,
    category: 'petang',
  },

  // DOA HARIAN
  {
    id: 'harian-sapujagad',
    title: 'Doa Kebaikan Dunia dan Akhirat (Sapu Jagad)',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Rabbanaa aatinaa fid-dunyaa hasanah wa fil-aakhirati hasanah wa qinaa ‘adzaaban-naar.',
    translation: 'Ya Rabb kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa neraka.',
    fawaid: 'QS. Al-Baqarah: 201. Doa yang paling sering dibaca oleh Rasulullah shallallahu ‘alaihi wa sallam.',
    repeatCount: 3,
    category: 'harian',
  },
  {
    id: 'harian-orangtua',
    title: 'Doa untuk Kedua Orang Tua',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    latin: 'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.',
    translation: 'Wahai Rabbku, ampunilah aku dan kedua orang tuaku, dan sayangilah keduanya sebagaimana mereka telah menyayangiku di waktu kecil.',
    fawaid: 'QS. Al-Isra: 24.',
    repeatCount: 3,
    category: 'harian',
  },
  {
    id: 'harian-masuk-masjid',
    title: 'Doa Masuk Masjid',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin: 'Allahummaftah lii abwaaba rahmatik.',
    translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
    fawaid: 'HR. Muslim no. 713. Didahului melangkah kaki kanan.',
    repeatCount: 1,
    category: 'harian',
  },
  {
    id: 'harian-keluar-masjid',
    title: 'Doa Keluar Masjid',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    latin: 'Allahumma innii as-aluka min fadhlik.',
    translation: 'Ya Allah, sesungguhnya aku memohon sebagian dari karunia-Mu.',
    fawaid: 'HR. Muslim no. 713. Didahului melangkah kaki kiri.',
    repeatCount: 1,
    category: 'harian',
  },
];
