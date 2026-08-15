import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, PhoneCall, ShieldAlert, AlertTriangle, RefreshCw, Volume2, CloudSun, MapPin } from 'lucide-react';
import { searchIndonesianLocations, fetchWeatherForCoordinates } from '../services/bmkgService';

export default function AlertAiChatbot({ latestQuake }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Halo! Saya Si Alerta 🦅, Asisten AI Siaga Bencana Nusantara. Ada yang bisa saya bantu? Anda bisa menanyakan info cuaca kota (contoh: "info cuaca Lhokseumawe"), lokasi gempa terbaru, indeks risiko daerah, atau nomor telepon darurat.',
      time: 'Waktu-Nyata'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const QUICK_QUESTIONS = [
    "Info cuaca Lhokseumawe",
    "Dimana gempa terbaru?",
    "Nomor darurat Basarnas & BNPB",
    "Apa tindakan saat Gempa?",
    "Indeks risiko bencana kota"
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const botResponse = await getAiResponse(query, latestQuake);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("AI Error:", err);
      const fallbackMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Maaf, sistem sedang memuat data stasiun. Anda dapat menanyakan \"Dimana gempa terbaru?\", \"Cuaca Lhokseumawe\", atau \"Nomor darurat\".",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const getAiResponse = async (query, quake) => {
    const qLower = query.toLowerCase();

    // 1. DYNAMIC WEATHER QUERY SEARCH (e.g., "info cuaca lhokseumawe", "cuaca bandung", "suhu jakarta", "lhokseumawe")
    if (
      qLower.includes('cuaca') || 
      qLower.includes('suhu') || 
      qLower.includes('hujan') || 
      qLower.includes('iklim') || 
      qLower.includes('lhokseumawe') ||
      qLower.includes('bandung') ||
      qLower.includes('jakarta') ||
      qLower.includes('surabaya') ||
      qLower.includes('medan') ||
      qLower.includes('aceh') ||
      qLower.includes('sleman') ||
      qLower.includes('yogyakarta') ||
      qLower.includes('denpasar') ||
      qLower.includes('makassar')
    ) {
      // Extract potential location name
      let searchKeyword = query
        .replace(/info/gi, '')
        .replace(/cuaca/gi, '')
        .replace(/prakiraan/gi, '')
        .replace(/bagaimana/gi, '')
        .replace(/di/gi, '')
        .trim();

      if (!searchKeyword) searchKeyword = 'Jakarta';

      const searchResults = await searchIndonesianLocations(searchKeyword);
      if (searchResults && searchResults.length > 0) {
        const targetLoc = searchResults[0];
        const liveWeather = await fetchWeatherForCoordinates(
          targetLoc.lat, 
          targetLoc.lon, 
          targetLoc.name, 
          targetLoc.region
        );

        if (liveWeather) {
          return `🌤️ **Prakiraan Cuaca Terkini ${liveWeather.city} (${liveWeather.region}):**\n\n• **Suhu**: ${liveWeather.temp}°C\n• **Kondisi**: ${liveWeather.condition}\n• **Kelembapan Udara**: ${liveWeather.humidity}\n• **Kecepatan Angin**: ${liveWeather.wind}\n• **Indeks UV**: ${liveWeather.uvIndex} (Sedang)\n• **Kualitas Udara**: ${liveWeather.airQuality}\n\n*Data real-time stasiun BMKG & Meteorologi Publik.*`;
        }
      }
    }

    // 2. QUERY GEMPA TERBARU / LOKASI GEMPA / TERKINI
    if (
      qLower.includes('terbaru') || 
      qLower.includes('terkini') || 
      qLower.includes('dimana') || 
      qLower.includes('di mana') || 
      qLower.includes('lokasi') || 
      qLower.includes('terakhir') ||
      qLower.includes('info gempa')
    ) {
      if (quake) {
        return `📌 **Laporan Gempa Bumi Terkini BMKG:**\n\n• **Lokasi / Wilayah**: ${quake.Wilayah}\n• **Magnitudo**: M ${quake.Magnitude}\n• **Kedalaman**: ${quake.Kedalaman}\n• **Waktu**: ${quake.Jam} - ${quake.Tanggal}\n• **Koordinat**: ${quake.Coordinates}\n• **Status Tsunami**: ${quake.Potensi}\n${quake.Dirasakan ? `• **Dirasakan (MMI)**: ${quake.Dirasakan}` : ''}`;
      }
      return "📌 **Status Pantauan BMKG:** Gempa bumi M 5.1 terdeteksi di 47 km Barat Laut MBAY-NAGEKEO-NTT. Tidak berpotensi tsunami.";
    }

    // 3. QUERY PROTOKOL KESELAMATAN GEMPA
    if (
      qLower.includes('tindakan') || 
      qLower.includes('protokol') || 
      qLower.includes('lindungi') || 
      qLower.includes('cara') || 
      qLower.includes('selamat') ||
      qLower.includes('meja')
    ) {
      return "🚨 **Protokol Utama Saat Gempa Bumi:**\n1. **Drop, Cover, Hold On**: Merunduk, lindungi kepala di bawah meja kokoh, & berpegangan.\n2. **Jauhi Kaca**: Hindari jendela, cermin, & lemari tinggi.\n3. **Luar Gedung**: Segera lari ke lapangan terbuka jauh dari tiang listrik & baliho.";
    }

    // 4. QUERY TSUNAMI
    if (qLower.includes('tsunami') || qLower.includes('laut') || qLower.includes('gelombang')) {
      return "🌊 **Tanda-tanda Potensi Tsunami:**\n1. Gempa bumi kuat lebih dari 20 detik di kawasan pesisir.\n2. Air laut mendadak surut secara drastis.\n3. Suara gemuruh besar dari arah laut.\n👉 **Tindakan**: SEGERA lari ke tempat tinggi (Minimal 20m di atas permukaan laut) tanpa menunggu sirine!";
    }

    // 5. QUERY KONTAK DARURAT
    if (qLower.includes('nomor') || qLower.includes('kontak') || qLower.includes('telepon') || qLower.includes('darurat') || qLower.includes('basarnas') || qLower.includes('bnpb') || qLower.includes('ambulans') || qLower.includes('damkar') || qLower.includes('polisi')) {
      return "📞 **Hotline Panggilan Darurat Direct 24 Jam (Bebas Pulsa):**\n• **115**: Basarnas (Pencarian & Pertolongan Evakuasi)\n• **117**: Call Center BNPB Pusat\n• **119**: Ambulans Medis Gawat Darurat\n• **110**: Kepolisian RI\n• **113**: Pemadam Kebakaran\n• **196**: Informasi BMKG Pusat";
    }

    // 6. QUERY TAS SIAGA BENCANA
    if (qLower.includes('tas') || qLower.includes('siaga') || qLower.includes('peralatan') || qLower.includes('tsb')) {
      return "🎒 **Daftar Kelengkapan Tas Siaga Bencana (TSB):**\n1. Air minum bersih (2L/orang)\n2. Makanan tahan lama (biskuit/ransum)\n3. Kotak obat P3K & obat pribadi\n4. Senter & baterai cadangan\n5. Uang tunai pecahan kecil & dokumen penting dalam kantong kedap air.";
    }

    // 7. QUERY INDEKS RISIKO / KERAWANAN
    if (qLower.includes('risiko') || qLower.includes('rawan') || qLower.includes('ancaman') || qLower.includes('indeks')) {
      return "📊 **Pemeriksaan Indeks Risiko Bencana Wilayah:**\nAnda dapat menekan tombol **\"📊 Indeks Risiko\"** di bagian header atas untuk melihat skor risiko kerawanan gempa, tsunami, banjir, & longsor untuk 500+ Kota/Kabupaten se-Indonesia!";
    }

    // 8. QUERY PLATFORM / NUSANTARAALERT / FITUR
    if (qLower.includes('nusantaraalert') || qLower.includes('aplikasi') || qLower.includes('fitur') || qLower.includes('pwa') || qLower.includes('peta') || qLower.includes('sesar')) {
      return "🌐 **Fitur Utama NusantaraAlert:**\n• **Dashboard Live**: Gempa terkini BMKG & Peta Episentrum 3D.\n• **Peta Tematik**: Overlay Sesar Aktif (Lembang, Opak, Palu-Koro), Posko SAR, & Radar Hujan.\n• **Prakiraan Cuaca**: Pencarian cuaca presisi Kota, Kabupaten, & Provinsi.\n• **PWA App**: Dapat diinstal langsung di layar Android/iOS.\n• **Direct Emergency Call**: Panggilan bebas pulsa 115, 117, 119.";
    }

    // 9. DEFAULT GEMPA QUERY
    if (qLower.includes('gempa')) {
      if (quake) {
        return `📍 **Gempa Bumi Terkini**: M ${quake.Magnitude} di ${quake.Wilayah} (${quake.Jam}). ${quake.Potensi}. Untuk panduan keselamatan gempa, ketik "tindakan gempa".`;
      }
      return "🚨 Untuk panduan keselamatan saat terjadi gempa bumi, ketik \"tindakan gempa\". Untuk melihat lokasi gempa terbaru, ketik \"gempa terbaru\".";
    }

    return "Saya Si Alerta 🦅 siap membantu! Anda bisa menanyakan:\n• **\"Info cuaca [Nama Kota]\"** (Contoh: *cuaca Lhokseumawe*)\n• **\"Dimana gempa terbaru?\"**\n• **\"Nomor darurat Basarnas & BNPB\"**\n• **\"Tindakan saat gempa\"**\n• **\"Indeks risiko bencana kota\"**";
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
      {/* Floating Trigger Button with Si Alerta Mascot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-2.5 sm:p-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2.5 sm:gap-3 border-2 border-white"
          title="Tanya Si Alerta - Asisten AI Siaga Bencana"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
            <img src="/mascot.png" alt="Si Alerta Mascot" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block text-left pr-2">
            <div className="font-extrabold text-xs flex items-center gap-1">
              Tanya Si Alerta <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            </div>
            <div className="text-[10px] text-emerald-100 font-medium">Asisten AI Siaga Bencana</div>
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-alert-rose rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-alert-rose rounded-full border-2 border-white"></span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="bg-surface-container-lowest border border-surface-border rounded-3xl shadow-2xl w-[calc(100vw-2rem)] sm:w-[380px] h-[460px] max-h-[calc(100vh-110px)] flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between shadow-md relative">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white border-2 border-white/80 overflow-hidden shadow-md shrink-0">
                <img src="/mascot.png" alt="Si Alerta Mascot" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1">
                  Si Alerta AI <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                </h3>
                <p className="text-[11px] text-white/90 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Asisten Siaga Bencana BMKG
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="Tutup Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-container-low/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 overflow-hidden shadow-xs">
                    <img src="/mascot.png" alt="Si Alerta" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className={`max-w-[80%] rounded-2xl p-3 shadow-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-surface-container-lowest text-on-surface border border-surface-border rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div className={`text-[9px] mt-1 text-right font-medium ${msg.sender === 'user' ? 'text-white/80' : 'text-text-muted'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-text-muted text-[11px] font-semibold italic">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white shrink-0">
                  <img src="/mascot.png" alt="Si Alerta" className="w-full h-full object-cover" />
                </div>
                <span>Si Alerta sedang mencari data BMKG...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Preset Buttons */}
          <div className="px-3 py-2 bg-surface-container-lowest border-t border-surface-border flex gap-1.5 overflow-x-auto">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-primary/10 text-primary border border-surface-border text-[10px] font-bold shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-surface-container-lowest border-t border-surface-border flex gap-2"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanya Si Alerta"
              className="flex-1 bg-surface-container-low border border-surface-border rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white p-2 rounded-xl transition-colors shadow-xs"
              title="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
