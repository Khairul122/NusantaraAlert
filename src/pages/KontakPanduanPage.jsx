import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, HeartPulse, Shield, Radio, CheckSquare, Square, BookOpen, AlertOctagon, Flame } from 'lucide-react';

export default function KontakPanduanPage() {
  const [activeGuideTab, setActiveGuideTab] = useState('gempa');
  const [checklist, setChecklist] = useState({
    air: true,
    makanan: true,
    p3k: false,
    senter: false,
    dokumen: false,
    uang: false,
    pakaian: false
  });

  const emergencyContacts = [
    {
      name: "Basarnas (SAR)",
      number: "115",
      rawNumber: "115",
      desc: "Pencarian, Pertolongan & Evakuasi Darurat Bencana",
      color: "bg-alert-rose text-white border-alert-rose"
    },
    {
      name: "Ambulans Medis (NCC)",
      number: "119",
      rawNumber: "119",
      desc: "Layanan Kesehatan & Pertolongan Medis Gawat Darurat",
      color: "bg-warning-amber text-white border-warning-amber"
    },
    {
      name: "Kepolisian RI",
      number: "110",
      rawNumber: "110",
      desc: "Pengamanan, Keamanan & Penanggulangan Darurat",
      color: "bg-secondary text-white border-secondary"
    },
    {
      name: "Call Center BNPB",
      number: "117",
      rawNumber: "117",
      desc: "Pusat Pengendalian Operasi Penanggulangan Bencana",
      color: "bg-primary text-white border-primary"
    },
    {
      name: "Pusat Informasi BMKG",
      number: "196",
      rawNumber: "196",
      desc: "Informasi Gempa Bumi, Tsunami & Perubahan Cuaca",
      color: "bg-safety-emerald text-white border-safety-emerald"
    },
    {
      name: "Pemadam Kebakaran",
      number: "113",
      rawNumber: "113",
      desc: "Pemadaman Kebakaran & Penyelamatan Darurat",
      color: "bg-red-600 text-white border-red-600"
    }
  ];

  const guides = {
    gempa: {
      title: "Panduan Keselamatan Bencana Gempa Bumi",
      icon: AlertOctagon,
      emergencyCall: { name: "Basarnas (115)", number: "115" },
      steps: [
        "JANGAN PANIK: Lakukan prinsip Merunduk, Lindungi Kepala di bawah meja kokoh, dan Berpegangan (Drop, Cover, and Hold On).",
        "Jauhi cermin, jendela kaca, dan benda-benda tinggi yang berisiko roboh.",
        "Jika berada di luar ruangan: Hindari tiang listrik, papan reklame, dan bangunan tinggi. Segera lari menuju area terbuka.",
        "Jika sedang mengendarai kendaraan: Segera pinggirkan kendaraan di tempat aman dan matikan mesin.",
        "Hubungi Basarnas 115 jika terdapat korban tertimbun reruntuhan atau membutuhkan pertolongan evakuasi darurat."
      ]
    },
    tsunami: {
      title: "Panduan Evakuasi Darurat Tsunami",
      icon: ShieldAlert,
      emergencyCall: { name: "BNPB (117)", number: "117" },
      steps: [
        "Jika terjadi gempa kuat & air laut mendadak surut, SEGERA lari ke tempat tinggi (Minimal 20 meter di atas permukaan laut).",
        "Jangan menunggu sirine peringatan dini berbunyi apabila tanda-tanda alam tsunami telah terlihat jelas.",
        "Gunakan jalur evakuasi tsunami resmi menuju Tempat Evakuasi Sementara (TES).",
        "Jauhi area muara sungai karena gelombang tsunami dapat merambat cepat masuk ke daratan melalui aliran sungai.",
        "Hubungi Call Center BNPB 117 untuk koordinasi evakuasi & bantuan logistik darurat."
      ]
    },
    banjir: {
      title: "Panduan Tanggap Darurat Banjir",
      icon: Radio,
      emergencyCall: { name: "Ambulans / Tim Medis (119)", number: "119" },
      steps: [
        "Matikan sakelar utama aliran listrik dan gas di rumah untuk mencegah risiko bahaya sengatan listrik.",
        "Pindahkan barang berharga & dokumen penting ke tempat yang lebih tinggi.",
        "Hindari berjalan atau menerobos arus air deras karena air setinggi 15 cm mampu merobohkan keseimbangan tubuh.",
        "Pantau pembaruan tinggi muka air sungai melalui saluran penanggulangan bencana daerah setempat.",
        "Hubungi Layanan Medis 119 apabila memerlukan pertolongan lansia, anak-anak, atau pertolongan pertama pada kecelakaan."
      ]
    }
  };

  const handleDirectDial = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const toggleChecklist = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <article className="space-y-8 max-w-7xl mx-auto">
      {/* Header Copywriting */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
          Kontak Panggilan Darurat Direct & Panduan Mitigasi Bencana
        </h1>
        <p className="text-sm text-text-muted">
          Layanan panggilan bebas pulsa 24 jam untuk Basarnas, BNPB, BMKG, Kepolisian, Pemadam Kebakaran & Ambulans Medis Indonesia.
        </p>
      </div>

      {/* Direct Emergency Call Cards Grid */}
      <section aria-label="Layanan Panggilan Darurat Direct 24 Jam">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-alert-rose animate-bounce" /> Layanan Panggilan Darurat Direct (Bebas Pulsa)
          </h2>
          <span className="text-xs font-semibold text-safety-emerald bg-safety-emerald/10 px-3 py-1 rounded-full border border-safety-emerald/30">
            Layanan Siaga 24 Jam
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyContacts.map((c, i) => (
            <div 
              key={i}
              onClick={() => handleDirectDial(c.rawNumber)}
              className="bg-surface-container-lowest rounded-3xl p-5 border border-surface-border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-between group border-hover hover:border-primary"
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${c.color} flex items-center justify-center font-black text-2xl shadow-md group-hover:scale-110 transition-transform shrink-0`} title={`Panggil ${c.name} ${c.rawNumber}`}>
                  {c.rawNumber}
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {c.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-1 leading-snug">{c.desc}</p>
                </div>
              </div>

              <a
                href={`tel:${c.rawNumber}`}
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full flex items-center justify-center transition-colors shrink-0 shadow-xs ml-2"
                title={`Panggil Langsung ${c.name} ${c.rawNumber}`}
                aria-label={`Panggil Nomor Telepon ${c.name}`}
              >
                <PhoneCall className="w-5 h-5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Disaster Guide & Tas Siaga Bencana Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Panduan (8 Cols) */}
        <section className="lg:col-span-8 bg-surface-container-lowest rounded-3xl border border-surface-border p-6 shadow-xs space-y-6" aria-label="Panduan Keselamatan & Evakuasi Bencana Alam">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Panduan Keselamatan & Evakuasi Bencana Alam
            </h2>

            <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl" aria-label="Pilih Jenis Bencana">
              <button 
                onClick={() => setActiveGuideTab('gempa')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${activeGuideTab === 'gempa' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-text-muted'}`}
              >
                Gempa Bumi
              </button>
              <button 
                onClick={() => setActiveGuideTab('tsunami')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${activeGuideTab === 'tsunami' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-text-muted'}`}
              >
                Tsunami
              </button>
              <button 
                onClick={() => setActiveGuideTab('banjir')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${activeGuideTab === 'banjir' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-text-muted'}`}
              >
                Banjir
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-4 rounded-2xl border border-surface-border">
              <div>
                <h3 className="text-lg font-extrabold text-on-surface">
                  {guides[activeGuideTab].title}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Langkah mitigasi & pertolongan darurat di lapangan.</p>
              </div>

              {/* Direct Call Button inside Guide */}
              <button
                onClick={() => handleDirectDial(guides[activeGuideTab].emergencyCall.number)}
                className="bg-alert-rose hover:bg-alert-rose/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 shrink-0 transition-colors"
                title={`Panggil Langsung ${guides[activeGuideTab].emergencyCall.name}`}
              >
                <PhoneCall className="w-4 h-4 animate-pulse" /> Panggil {guides[activeGuideTab].emergencyCall.name}
              </button>
            </div>

            <div className="space-y-3">
              {guides[activeGuideTab].steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl border border-surface-border/60">
                  <span className="w-6 h-6 rounded-full bg-primary text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-on-surface font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right: Tas Siaga Bencana Interactive Checklist (4 Cols) */}
        <section className="lg:col-span-4 bg-surface-container-lowest rounded-3xl border border-surface-border p-6 shadow-xs space-y-4 flex flex-col justify-between" aria-label="Daftar Kelengkapan Tas Siaga Bencana">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-safety-emerald" />
              <h2 className="text-base font-bold text-on-surface">Tas Siaga Bencana (TSB)</h2>
            </div>
            <p className="text-xs text-text-muted mb-4">
              Persiapkan 1 ransel darurat per keluarga yang siap dibawa kapan saja saat terjadi evakuasi.
            </p>

            <div className="space-y-2.5">
              {[
                { key: 'air', label: 'Air Minum Bersih (Minimal 2 Liter per orang)' },
                { key: 'makanan', label: 'Makanan Tahan Lama (Biskuit / Roti / Ransum)' },
                { key: 'p3k', label: 'Kotak P3K & Obat-obatan Pribadi' },
                { key: 'senter', label: 'Senter / Lampu Darurat & Baterai Cadangan' },
                { key: 'dokumen', label: 'Dokumen Penting (KTP, KK, Surat Tanah)' },
                { key: 'uang', label: 'Uang Tunai Pecahan Kecil' },
                { key: 'pakaian', label: 'Pakaian Ganti (Baju, Celana, Jaket)' },
              ].map((item) => {
                const isChecked = checklist[item.key];
                return (
                  <div 
                    key={item.key}
                    onClick={() => toggleChecklist(item.key)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      isChecked 
                        ? 'bg-safety-emerald/10 border-safety-emerald/40 text-on-surface'
                        : 'bg-surface-container-low border-surface-border text-text-muted hover:border-surface-border/80'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-safety-emerald shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-text-muted shrink-0" />
                    )}
                    <span className={`text-xs font-semibold ${isChecked ? 'line-through opacity-80' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-surface-border text-center">
            <span className="text-xs font-bold text-safety-emerald bg-safety-emerald/10 px-3 py-1.5 rounded-full inline-block">
              {Object.values(checklist).filter(Boolean).length} dari {Object.keys(checklist).length} Peralatan Siap
            </span>
          </div>
        </section>
      </div>
    </article>
  );
}
