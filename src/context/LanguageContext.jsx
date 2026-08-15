import React, { createContext, useContext, useState, useEffect } from 'react';

const TRANSLATIONS = {
  id: {
    // Header & Navigation
    app_subtitle: "Pemantauan Publik BMKG",
    nav_dashboard: "Dashboard",
    nav_history: "Riwayat Gempa",
    nav_weather: "Prakiraan Cuaca",
    nav_contacts: "Kontak & Panduan",
    risk_index_btn: "Indeks Risiko",
    alert_status_normal: "NORMAL & AMAN",
    alert_status_warning: "SIAGA GEMPA M 6.0+",
    lang_toggle_id: "ID",
    lang_toggle_en: "EN",
    settings_title: "Pengaturan Sistem",

    // Dashboard Page
    dashboard_hero_title: "Sistem Pantauan Geofisika & Meteorologi Indonesia",
    dashboard_hero_sub: "Data langsung terintegrasi dengan Stasiun Seismologi BMKG & TEWS Indonesia",
    latest_quake_title: "Gempa Bumi Terkini (M 5.0+)",
    magnitude: "Magnitudo",
    depth: "Kedalaman",
    time: "Waktu",
    coordinates: "Koordinat",
    location: "Wilayah / Episentrum",
    potency: "Potensi Tsunami",
    felt_intensity: "Skala Dirasakan (MMI)",
    no_tsunami: "Tidak Berpotensi Tsunami",
    tsunami_alert: "BERPOTENSI TSUNAMI",
    view_detail_btn: "Lihat Rincian Episentrum",
    live_map_title: "Peta Episentrum Interaktif 3D",
    layer_faults: "Jalur Sesar Aktif (Patahan)",
    layer_shelters: "Posko SAR & Rumah Sakit",
    layer_rain: "Radar Awan & Hujan Live",

    // Earthquake History Page
    history_title: "Arsip Seismograf & Riwayat Gempa BMKG",
    history_sub: "Daftar pemantauan gempa bumi signifikan di wilayah Indonesia",
    search_quake_placeholder: "Cari wilayah gempa (contoh: Cianjur, Mentawai, Palu)...",
    filter_all_mag: "Semua Magnitudo",
    filter_mag_above_6: "Gempa M 6.0+",
    filter_mag_below_6: "Gempa M 5.0 - 5.9",

    // Weather Forecast Page
    weather_title: "Prakiraan Cuaca Terpadu Nusantara",
    weather_sub: "Data meteorologi real-time untuk Kota, Kabupaten, & Provinsi se-Indonesia",
    search_weather_placeholder: "Cari nama Kota, Kabupaten, atau Provinsi (contoh: Lhokseumawe, Bandung, Padang)...",
    temperature: "Suhu Udara",
    humidity: "Kelembapan Udara",
    wind_speed: "Kecepatan Angin",
    uv_index: "Indeks Radiasi UV",
    air_quality: "Kualitas Udara",
    hourly_forecast: "Prakiraan Tiap Jam",

    // Emergency & Contacts Page
    contacts_title: "Nomor Panggilan Darurat & Panduan Mitigasi",
    contacts_sub: "Panggilan telepon langsung bebas pulsa (Click-to-Dial) ke instansi tanggap bencana",
    hotline_title: "Hotline Darurat Direct 24 Jam",
    tsb_title: "Daftar Kelengkapan Tas Siaga Bencana (TSB)",
    tsb_desc: "Perlengkapan dasar mandiri untuk bertahan hidup 3x24 jam saat bencana.",
    call_now: "Panggil",

    // Disaster Risk Index Modal
    risk_modal_title: "Indeks Risiko Bencana Per Kabupaten / Kota",
    risk_modal_sub: "Kalkulasi Tingkat Kerawanan & Potensi Ancaman Geofisika BMKG / BNPB",
    search_regency_placeholder: "Cari Kota, Kabupaten, atau Provinsi (contoh: Padang, Sleman, Medan)...",
    risk_score: "Skor Kerawanan",
    risk_high: "Tinggi",
    risk_medium: "Sedang",
    risk_low: "Rendah",
    risk_recommendation: "Rekomendasi Kesiapsiagaan Daerah:",
    btn_done: "Selesai",

    // Disaster Alert Modal
    disaster_alert_title: "Pusat Informasi & Kesiapsiagaan Bencana",
    disaster_alert_warning_title: "PERINGATAN SIAGA GEMPA BUMI M 6.0+",
    disaster_alert_badge: "Peringatan Siaga Bencana Publik",
    disaster_alert_btn: "Saya Mengerti & Siap Siaga",

    // AI Chatbot
    bot_greeting: "Halo! Saya Si Alerta 🦅, Asisten AI Siaga Bencana Nusantara. Ada yang bisa saya bantu terkait info cuaca, gempa terbaru, atau nomor darurat?",
    bot_typing: "Si Alerta sedang mencari data BMKG...",
    bot_placeholder: "Tanya Si Alerta seputar bencana & cuaca..."
  },
  en: {
    // Header & Navigation
    app_subtitle: "BMKG Public Monitoring",
    nav_dashboard: "Dashboard",
    nav_history: "Quake History",
    nav_weather: "Weather Forecast",
    nav_contacts: "Contacts & Guide",
    risk_index_btn: "Risk Index",
    alert_status_normal: "NORMAL & SAFE",
    alert_status_warning: "EARTHQUAKE ALERT M 6.0+",
    lang_toggle_id: "ID",
    lang_toggle_en: "EN",
    settings_title: "System Settings",

    // Dashboard Page
    dashboard_hero_title: "Indonesia Geophysics & Meteorology Live Monitoring",
    dashboard_hero_sub: "Real-time data feed integrated with BMKG Seismology Stations & TEWS Indonesia",
    latest_quake_title: "Latest Significant Earthquake (M 5.0+)",
    magnitude: "Magnitude",
    depth: "Depth",
    time: "Time",
    coordinates: "Coordinates",
    location: "Epicenter / Location",
    potency: "Tsunami Potential",
    felt_intensity: "Felt Intensity (MMI)",
    no_tsunami: "No Tsunami Potential",
    tsunami_alert: "TSUNAMI POTENTIAL ALERT",
    view_detail_btn: "View Epicenter Details",
    live_map_title: "3D Interactive Epicenter Map",
    layer_faults: "Active Fault Lines",
    layer_shelters: "SAR Shelters & Hospitals",
    layer_rain: "Live Cloud & Rain Radar",

    // Earthquake History Page
    history_title: "BMKG Seismograph Archive & History",
    history_sub: "List of significant earthquake activities recorded across Indonesia",
    search_quake_placeholder: "Search earthquake area (e.g., Cianjur, Mentawai, Palu)...",
    filter_all_mag: "All Magnitudes",
    filter_mag_above_6: "Earthquakes M 6.0+",
    filter_mag_below_6: "Earthquakes M 5.0 - 5.9",

    // Weather Forecast Page
    weather_title: "Integrated Nusantara Weather Forecast",
    weather_sub: "Real-time meteorological data for Cities, Regencies, & Provinces across Indonesia",
    search_weather_placeholder: "Search City, Regency, or Province (e.g., Lhokseumawe, Bandung, Padang)...",
    temperature: "Air Temperature",
    humidity: "Air Humidity",
    wind_speed: "Wind Speed",
    uv_index: "UV Index",
    air_quality: "Air Quality",
    hourly_forecast: "Hourly Forecast",

    // Emergency & Contacts Page
    contacts_title: "Emergency Hotline Numbers & Mitigation Guide",
    contacts_sub: "Toll-free direct call (Click-to-Dial) to disaster response agencies",
    hotline_title: "24-Hour Direct Emergency Hotlines",
    tsb_title: "Disaster Preparedness Emergency Bag Checklist",
    tsb_desc: "Essential self-survival items for 72 hours during disaster scenarios.",
    call_now: "Call",

    // Disaster Risk Index Modal
    risk_modal_title: "Disaster Risk Index by Regency / City",
    risk_modal_sub: "Vulnerability Calculation & Geophysical Hazard Potential BMKG / BNPB",
    search_regency_placeholder: "Search City, Regency, or Province (e.g., Padang, Sleman, Medan)...",
    risk_score: "Vulnerability Score",
    risk_high: "High",
    risk_medium: "Medium",
    risk_low: "Low",
    risk_recommendation: "Regional Preparedness Recommendation:",
    btn_done: "Done",

    // Disaster Alert Modal
    disaster_alert_title: "Disaster Information & Readiness Center",
    disaster_alert_warning_title: "EARTHQUAKE ALERT M 6.0+",
    disaster_alert_badge: "Public Disaster Readiness Alert",
    disaster_alert_btn: "I Understand & Ready",

    // AI Chatbot
    bot_greeting: "Hello! I am Si Alerta 🦅, your Nusantara Disaster AI Assistant. How can I help you with weather info, latest earthquakes, or emergency hotlines?",
    bot_typing: "Si Alerta is fetching BMKG data...",
    bot_placeholder: "Ask Si Alerta about disasters & weather..."
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('nusantara_lang') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('nusantara_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['id']?.[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'id' ? 'en' : 'id'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
