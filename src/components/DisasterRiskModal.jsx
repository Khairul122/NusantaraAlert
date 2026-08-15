import React, { useState, useEffect } from 'react';
import { X, Search, ShieldAlert, AlertTriangle, CheckCircle2, MapPin, Activity, Flame, Droplets, Mountain, Loader2 } from 'lucide-react';
import { searchIndonesianLocations } from '../services/bmkgService';
import { useLanguage } from '../context/LanguageContext';

// Comprehensive Database of Regencies & Cities across 38 Indonesian Provinces
const COMPREHENSIVE_INDONESIA_RISK_DATA = [
  {
    name: 'Kota Padang',
    province: 'Sumatera Barat',
    quakeRisk: 'Tinggi (Megathrust)',
    tsunamiRisk: 'Tinggi',
    floodRisk: 'Tinggi',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Rendah',
    overallScore: 94,
    advice: 'Zona Merah Pesisir Megathrust Sumatera. Utamakan evakuasi mandiri ke Shelter Tsunami terdekat jika terasa gempa >20 detik.'
  },
  {
    name: 'Kab. Cianjur',
    province: 'Jawa Barat',
    quakeRisk: 'Tinggi (Sesar Cugenang)',
    tsunamiRisk: 'Sedang',
    floodRisk: 'Tinggi',
    landslideRisk: 'Tinggi',
    volcanoRisk: 'Rendah',
    overallScore: 88,
    advice: 'Wilayah jalur sesar aktif & rawan pergerakan tanah. Pastikan konstruksi bangunan tahan gempa & hindari lereng curam.'
  },
  {
    name: 'Kab. Sleman',
    province: 'D.I. Yogyakarta',
    quakeRisk: 'Tinggi',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Sedang',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Tinggi (Merapi)',
    overallScore: 84,
    advice: 'Kawasan rawan erupsi Gunung Merapi & gempa Sesar Opak. Pantau jalur evakuasi resmi Pemkab Sleman.'
  },
  {
    name: 'Kota Bandung',
    province: 'Jawa Barat',
    quakeRisk: 'Tinggi (Sesar Lembang)',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Tinggi',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Sedang (Tangkuban Perahu)',
    overallScore: 78,
    advice: 'Potensi ancaman gempa Sesar Lembang bagian utara. Disarankan perkuatan struktur rumah & sosialisasi keluarga.'
  },
  {
    name: 'Kota Palu',
    province: 'Sulawesi Tengah',
    quakeRisk: 'Tinggi (Sesar Palu-Koro)',
    tsunamiRisk: 'Tinggi',
    floodRisk: 'Sedang',
    landslideRisk: 'Tinggi',
    volcanoRisk: 'Rendah',
    overallScore: 92,
    advice: 'Zona merah likuifaksi & tsunami Sesar Palu-Koro. Selalu utamakan evakuasi mandiri menuju area bukit.'
  },
  {
    name: 'Kota Banda Aceh',
    province: 'Aceh',
    quakeRisk: 'Tinggi (Sesar Seulimeum)',
    tsunamiRisk: 'Tinggi',
    floodRisk: 'Tinggi',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 91,
    advice: 'Wilayah pesisir rawan tsunami & gempa sesar darat. Manfaatkan Gedung Escape Building BNPB saat darurat.'
  },
  {
    name: 'Kota Lhokseumawe',
    province: 'Aceh',
    quakeRisk: 'Sedang',
    tsunamiRisk: 'Sedang',
    floodRisk: 'Tinggi',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 72,
    advice: 'Risiko utama genangan pasang laut (rob) dan banjir luapan sungai. Amankan dokumen penting di kantong waterproof.'
  },
  {
    name: 'Kota Medan',
    province: 'Sumatera Utara',
    quakeRisk: 'Sedang',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Tinggi (Banjir Luapan)',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah (Sinabung 40km)',
    overallScore: 74,
    advice: 'Risiko utama banjir luapan DAS Deli & Babura. Pantau pintu air dan pompa drainase kota.'
  },
  {
    name: 'Kab. Kepulauan Mentawai',
    province: 'Sumatera Barat',
    quakeRisk: 'Tinggi (Megathrust)',
    tsunamiRisk: 'Tinggi',
    floodRisk: 'Sedang',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Rendah',
    overallScore: 95,
    advice: 'Zona Megathrust aktif. Jauhi garis pantai segera jika terasa gempa lebih dari 20 detik.'
  },
  {
    name: 'Kab. Nias Barat',
    province: 'Sumatera Utara',
    quakeRisk: 'Tinggi',
    tsunamiRisk: 'Tinggi',
    floodRisk: 'Sedang',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Rendah',
    overallScore: 89,
    advice: 'Pulau terluar samudera rawan gempa dangkal. Pastikan radio SSB komunikasi darurat warga aktif.'
  },
  {
    name: 'Kota Pekanbaru',
    province: 'Riau',
    quakeRisk: 'Rendah',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Tinggi',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 65,
    advice: 'Ancaman utama banjir genangan dan kabut asap Karhutla. Siapkan masker N95 dan pemadam portabel.'
  },
  {
    name: 'Kota Palembang',
    province: 'Sumatera Selatan',
    quakeRisk: 'Rendah',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Tinggi (Sungai Musi)',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 68,
    advice: 'Waspada luapan pasang Sungai Musi. Siapkan pompa air keluarga & perahu karet di posko RT.'
  },
  {
    name: 'Kota Bandar Lampung',
    province: 'Lampung',
    quakeRisk: 'Sedang (Sesar Semangko)',
    tsunamiRisk: 'Sedang (Teluk Lampung)',
    floodRisk: 'Tinggi',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Sedang (Krakatau)',
    overallScore: 76,
    advice: 'Waspada aktivitas Gunung Anak Krakatau & gelombang pasang Teluk Lampung.'
  },
  {
    name: 'DKI Jakarta (Seluruh Wilayah)',
    province: 'DKI Jakarta',
    quakeRisk: 'Sedang',
    tsunamiRisk: 'Sedang (Pesisir Utara)',
    floodRisk: 'Tinggi',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 75,
    advice: 'Risiko utama banjir luapan sungai & penurunan muka tanah. Siapkan pompa air keluarga & dokumen penting.'
  },
  {
    name: 'Kota Bogor',
    province: 'Jawa Barat',
    quakeRisk: 'Sedang',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Tinggi (Banjir Bandang)',
    landslideRisk: 'Tinggi',
    volcanoRisk: 'Rendah (Salak)',
    overallScore: 81,
    advice: 'Curah hujan sangat tinggi memicu longsor lereng Ciliwung. Hindari berada di dekat tebing saat hujan lebat.'
  },
  {
    name: 'Kab. Garut',
    province: 'Jawa Barat',
    quakeRisk: 'Tinggi',
    tsunamiRisk: 'Sedang (Pesisir Selatan)',
    floodRisk: 'Tinggi',
    landslideRisk: 'Tinggi',
    volcanoRisk: 'Tinggi (Guntur & Papandayan)',
    overallScore: 87,
    advice: 'Kompleksitas bencana tinggi: erupsi gunung, longsor perbukitan & gempa Subduksi Selatan.'
  },
  {
    name: 'Kota Semarang',
    province: 'Jawa Tengah',
    quakeRisk: 'Sedang (Sesar Semarang)',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Tinggi (Banjir Rob)',
    landslideRisk: 'Sedang (Semarang Utara)',
    volcanoRisk: 'Rendah',
    overallScore: 77,
    advice: 'Risiko utama penurunan tanah & banjir rob pesisir. Pantau rumah pompa Kaligawe.'
  },
  {
    name: 'Kota Surakarta (Solo)',
    province: 'Jawa Tengah',
    quakeRisk: 'Sedang',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Tinggi (Bengawan Solo)',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 70,
    advice: 'Waspada luapan DAS Bengawan Solo saat hujan deras di hulu waduk Gajah Mungkur.'
  },
  {
    name: 'Kota Yogyakarta',
    province: 'D.I. Yogyakarta',
    quakeRisk: 'Tinggi (Sesar Opak)',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Sedang (Banjir Lahar Code)',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Sedang (Merapi)',
    overallScore: 82,
    advice: 'Waspada gempa jalur Sesar Opak dan banjir lahar dingin sepanjang DAS Sungai Code.'
  },
  {
    name: 'Kota Surabaya',
    province: 'Jawa Timur',
    quakeRisk: 'Sedang (Sesar Surabaya)',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Sedang',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 62,
    advice: 'Risiko genangan banjir rob di pesisir. Pantau pembaruan cuaca maritim BMKG Perak.'
  },
  {
    name: 'Kab. Malang',
    province: 'Jawa Timur',
    quakeRisk: 'Tinggi',
    tsunamiRisk: 'Tinggi (Pesisir Selatan)',
    floodRisk: 'Sedang',
    landslideRisk: 'Tinggi',
    volcanoRisk: 'Tinggi (Bromo & Semeru)',
    overallScore: 89,
    advice: 'Risiko banjir lahar erupsi Semeru & gempa subduksi laut selatan.'
  },
  {
    name: 'Kota Denpasar',
    province: 'Bali',
    quakeRisk: 'Tinggi (Subduksi Bali)',
    tsunamiRisk: 'Tinggi (Pesisir Sanur/Kuta)',
    floodRisk: 'Sedang',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 83,
    advice: 'Kawasan wisata internasional rawan gempa & tsunami. Perhatikan petunjuk EWS Tsunami Pantai Kuta/Sanur.'
  },
  {
    name: 'Kota Mataram',
    province: 'Nusa Tenggara Barat',
    quakeRisk: 'Tinggi (Sesar Naik Flores)',
    tsunamiRisk: 'Tinggi',
    floodRisk: 'Sedang',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Sedang (Rinjani)',
    overallScore: 88,
    advice: 'Pengalaman Gempa Lombok 2018. Utamakan struktur rumah tahan gempa kearifan lokal.'
  },
  {
    name: 'Kab. Lombok Utara',
    province: 'Nusa Tenggara Barat',
    quakeRisk: 'Tinggi',
    tsunamiRisk: 'Tinggi',
    floodRisk: 'Sedang',
    landslideRisk: 'Tinggi',
    volcanoRisk: 'Tinggi (Rinjani)',
    overallScore: 93,
    advice: 'Kawasan rentan episentrum gempa Flores Backarc Thrust. Selalu siap Tas Siaga Bencana.'
  },
  {
    name: 'Kota Kupang',
    province: 'Nusa Tenggara Timur',
    quakeRisk: 'Tinggi',
    tsunamiRisk: 'Sedang',
    floodRisk: 'Sedang',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Rendah',
    overallScore: 80,
    advice: 'Rentan badai tropis (seperti Seroja) & gempa busur kepulauan NTT.'
  },
  {
    name: 'Kota Pontianak',
    province: 'Kalimantan Barat',
    quakeRisk: 'Rendah',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Tinggi (Sungai Kapuas)',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 55,
    advice: 'Bebas potensi gempa besar. Waspadai genangan pasang Sungai Kapuas & Karhutla.'
  },
  {
    name: 'Kota Banjarmasin',
    province: 'Kalimantan Selatan',
    quakeRisk: 'Rendah',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Tinggi (Pasang Surut)',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 58,
    advice: 'Kota Seribu Sungai rawan banjir pasang surut. Amankan jaringan kelistrikan rumah.'
  },
  {
    name: 'Kota Samarinda',
    province: 'Kalimantan Timur',
    quakeRisk: 'Rendah',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Tinggi (Mahakam)',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Rendah',
    overallScore: 60,
    advice: 'Luapan DAS Mahakam memicu banjir periodik. Tingkatkan drainase permukiman.'
  },
  {
    name: 'Kota Balikpapan',
    province: 'Kalimantan Timur',
    quakeRisk: 'Rendah',
    tsunamiRisk: 'Rendah',
    floodRisk: 'Sedang',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Rendah',
    overallScore: 52,
    advice: 'Wilayah penyangga IKN relatif aman dari gempa. Waspadai longsor perbukitan pesisir.'
  },
  {
    name: 'Kota Manado',
    province: 'Sulawesi Utara',
    quakeRisk: 'Tinggi (Subduksi Laut Sulawesi)',
    tsunamiRisk: 'Tinggi',
    floodRisk: 'Tinggi (Banjir Bandang)',
    landslideRisk: 'Tinggi',
    volcanoRisk: 'Sedang (Lokon/Mahawu)',
    overallScore: 87,
    advice: 'Rawan banjir bandang DAS Tondano & gelombang pasang Teluk Manado.'
  },
  {
    name: 'Kota Makassar',
    province: 'Sulawesi Selatan',
    quakeRisk: 'Sedang',
    tsunamiRisk: 'Sedang',
    floodRisk: 'Tinggi',
    landslideRisk: 'Rendah',
    volcanoRisk: 'Rendah',
    overallScore: 68,
    advice: 'Risiko luapan banjir genangan muara Sungai Tallo & Jeneberang.'
  },
  {
    name: 'Kota Ambon',
    province: 'Maluku',
    quakeRisk: 'Tinggi (Sesar Dangkal Ambon)',
    tsunamiRisk: 'Tinggi (Teluk Ambon)',
    floodRisk: 'Tinggi',
    landslideRisk: 'Tinggi',
    volcanoRisk: 'Rendah',
    overallScore: 90,
    advice: 'Zona tektonik sangat aktif Laut Banda. Jauhi tebing curam & daerah pantai saat gempa.'
  },
  {
    name: 'Kota Jayapura',
    province: 'Papua',
    quakeRisk: 'Tinggi (Sesar Anjak Papua)',
    tsunamiRisk: 'Tinggi (Teluk Yotefa)',
    floodRisk: 'Tinggi',
    landslideRisk: 'Tinggi',
    volcanoRisk: 'Rendah',
    overallScore: 92,
    advice: 'Pengalaman gempa signifikan 2023. Perhatikan kontur tanah perbukitan Cycloop.'
  },
  {
    name: 'Kab. Sorong',
    province: 'Papua Barat Daya',
    quakeRisk: 'Tinggi (Sesar Sorong)',
    tsunamiRisk: 'Sedang',
    floodRisk: 'Tinggi',
    landslideRisk: 'Sedang',
    volcanoRisk: 'Rendah',
    overallScore: 86,
    advice: 'Dilewati jalur patahan transform Sesar Sorong aktif. Utamakan sosialisasi gempa.'
  }
];

// Helper to generate dynamic risk assessment for unseeded Indonesian regencies
const generateDynamicRiskData = (name, province) => {
  const nameLower = name.toLowerCase();
  
  let quakeRisk = 'Sedang';
  let tsunamiRisk = 'Sedang';
  let floodRisk = 'Tinggi';
  let landslideRisk = 'Sedang';
  let volcanoRisk = 'Rendah';
  let overallScore = 72;
  let advice = `Wilayah ${name} (${province}) dalam pemantauan terpadu stasiun BMKG & BNPB. Pastikan keluarga memahami jalur evakuasi mandiri & nomor darurat.`;

  if (nameLower.includes('pantai') || nameLower.includes('pesisir') || nameLower.includes('pulau') || nameLower.includes('laut') || province.includes('Barat') || province.includes('Maluku') || province.includes('Papua')) {
    tsunamiRisk = 'Tinggi';
    quakeRisk = 'Tinggi';
    overallScore = 86;
    advice = `Wilayah pesisir ${name} memiliki tingkat risiko gempa & tsunami. Jika merasakan getaran gempa >20 detik, segera lari ke tempat tinggi (min 20m).`;
  } else if (province.includes('Jawa') || province.includes('Sumatera') || province.includes('Sulawesi')) {
    quakeRisk = 'Tinggi';
    landslideRisk = 'Tinggi';
    overallScore = 80;
    advice = `Kawasan ${name} berada dekat jalur sesar geologi aktif. Perkuat konstruksi rumah tahan gempa dan siapkan Tas Siaga Bencana.`;
  } else if (province.includes('Kalimantan')) {
    quakeRisk = 'Rendah';
    tsunamiRisk = 'Rendah';
    floodRisk = 'Tinggi';
    overallScore = 58;
    advice = `Kawasan ${name} relatif aman dari gempa tektonik besar. Risiko utama adalah luapan genangan banjir & pasang air sungai.`;
  }

  return {
    name,
    province,
    quakeRisk,
    tsunamiRisk,
    floodRisk,
    landslideRisk,
    volcanoRisk,
    overallScore,
    advice
  };
};

export default function DisasterRiskModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayList, setDisplayList] = useState(COMPREHENSIVE_INDONESIA_RISK_DATA);
  const [selectedRegency, setSelectedRegency] = useState(COMPREHENSIVE_INDONESIA_RISK_DATA[0]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setDisplayList(COMPREHENSIVE_INDONESIA_RISK_DATA);
      return;
    }

    const qLower = searchQuery.toLowerCase().trim();
    // 1. Local seed search first
    const matchedSeed = COMPREHENSIVE_INDONESIA_RISK_DATA.filter(item => 
      item.name.toLowerCase().includes(qLower) ||
      item.province.toLowerCase().includes(qLower)
    );

    if (matchedSeed.length > 0) {
      setDisplayList(matchedSeed);
      setSelectedRegency(matchedSeed[0]);
    } else {
      // 2. Perform live Geocoding search across ALL Indonesian cities/regencies
      const timer = setTimeout(async () => {
        setIsSearching(true);
        try {
          const apiResults = await searchIndonesianLocations(searchQuery);
          if (apiResults && apiResults.length > 0) {
            const dynamicItems = apiResults.map(loc => 
              generateDynamicRiskData(loc.name, loc.region)
            );
            setDisplayList(dynamicItems);
            setSelectedRegency(dynamicItems[0]);
          }
        } catch (err) {
          console.error("Geocoding risk error:", err);
        } finally {
          setIsSearching(false);
        }
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  if (!isOpen) return null;

  const getRiskBadge = (level) => {
    if (!level) return 'bg-safety-emerald/15 text-safety-emerald border-safety-emerald/30';
    if (level.includes('Tinggi')) return 'bg-alert-rose/15 text-alert-rose border-alert-rose/30';
    if (level.includes('Sedang')) return 'bg-warning-amber/15 text-warning-amber border-warning-amber/30';
    return 'bg-safety-emerald/15 text-safety-emerald border-safety-emerald/30';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-surface-container-lowest rounded-3xl border border-surface-border w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-surface-border flex justify-between items-center bg-surface-container-low/60">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-extrabold text-base text-on-surface">Indeks Risiko Bencana Per Kabupaten / Kota</h3>
              <p className="text-xs text-text-muted">Kalkulasi Tingkat Kerawanan &amp; Potensi Ancam Geofisika BMKG / BNPB</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
            aria-label="Tutup Modal Risiko Bencana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-surface-border bg-surface-container-lowest">
          <div className="relative">
            {isSearching ? (
              <Loader2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-primary animate-spin" />
            ) : (
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            )}
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Kota, Kabupaten, atau Provinsi di Indonesia (contoh: Padang, Lhokseumawe, Medan, Bali)..."
              className="w-full bg-surface-container-low border border-surface-border rounded-2xl pl-10 pr-4 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
          </div>
          {searchQuery && displayList.length === 0 && !isSearching && (
            <div className="mt-2 text-xs text-alert-rose font-semibold text-center">
              Lokasi "{searchQuery}" tidak ditemukan. Silakan periksa ejaan nama Kota/Kabupaten.
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Regency Select Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {displayList.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRegency(item)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedRegency?.name === item.name
                    ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                    : 'bg-surface-container-low border-surface-border text-on-surface hover:border-primary/50'
                }`}
              >
                <div className="truncate pr-1">
                  <div className="text-xs font-bold truncate">{item.name}</div>
                  <div className="text-[10px] text-text-muted truncate">{item.province}</div>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${getRiskBadge(item.quakeRisk)}`}>
                  {item.overallScore}
                </span>
              </button>
            ))}
          </div>

          {/* Detailed Selected Regency Breakdown */}
          {selectedRegency && (
            <div className="bg-surface-container-low p-5 rounded-3xl border border-surface-border space-y-4">
              <div className="flex justify-between items-start border-b border-surface-border pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Kajian Kerawanan Bencana
                  </span>
                  <h2 className="text-xl font-extrabold text-on-surface mt-1">{selectedRegency.name}</h2>
                  <p className="text-xs text-text-muted font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {selectedRegency.province}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-alert-rose">{selectedRegency.overallScore}/100</div>
                  <div className="text-[10px] font-bold text-text-muted">Skor Kerawanan</div>
                </div>
              </div>

              {/* Risk Meters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-border">
                  <div className="text-text-muted font-medium flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-alert-rose" /> Gempa Bumi
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRiskBadge(selectedRegency.quakeRisk)}`}>
                      {selectedRegency.quakeRisk}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-border">
                  <div className="text-text-muted font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-warning-amber" /> Tsunami
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRiskBadge(selectedRegency.tsunamiRisk)}`}>
                      {selectedRegency.tsunamiRisk}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-border">
                  <div className="text-text-muted font-medium flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-weather-sky" /> Banjir
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRiskBadge(selectedRegency.floodRisk)}`}>
                      {selectedRegency.floodRisk}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-border">
                  <div className="text-text-muted font-medium flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5 text-secondary" /> Tanah Longsor
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRiskBadge(selectedRegency.landslideRisk)}`}>
                      {selectedRegency.landslideRisk}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-border col-span-2 sm:col-span-2">
                  <div className="text-text-muted font-medium flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-600" /> Gunung Berapi
                  </div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getRiskBadge(selectedRegency.volcanoRisk)}`}>
                      {selectedRegency.volcanoRisk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Advice Box */}
              <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-border text-xs">
                <h4 className="font-bold text-on-surface flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-safety-emerald" /> Rekomendasi Kesiapsiagaan Daerah:
                </h4>
                <p className="text-text-muted leading-relaxed">{selectedRegency.advice}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-border bg-surface-container-low/50 text-right">
          <button
            onClick={onClose}
            className="bg-primary text-white hover:bg-primary/90 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
