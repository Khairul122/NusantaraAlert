import React from 'react';
import { Bell, Settings } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenNotifications, onOpenSettings, onOpenDisasterAlert, onOpenRiskIndex }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Utama' },
    { id: 'history', label: 'Riwayat Gempa' },
    { id: 'weather', label: 'Prakiraan Cuaca' },
    { id: 'contacts', label: 'Kontak & Panduan' }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-gutter h-16 bg-surface/95 backdrop-blur-md border-b border-surface-border">
      <div className="flex items-center gap-3">
        <a 
          href="#dashboard"
          className="flex items-center gap-2 cursor-pointer focus:outline-none"
          onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
          title="NusantaraAlert - Beranda Utama"
        >
          <img 
            src="/logo.png" 
            alt="NusantaraAlert Logo" 
            className="w-10 h-10 object-contain rounded-xl shadow-sm border border-surface-border/50" 
          />
          <div>
            <span className="text-xl font-headline-md font-extrabold text-primary tracking-tight">
              Nusantara<span className="text-safety-emerald">Alert</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              Pemantauan Publik BMKG
            </span>
          </div>
        </a>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-border" aria-label="Navigasi Utama NusantaraAlert">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenRiskIndex}
          className="hidden sm:flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface px-3 py-1.5 rounded-full font-bold text-xs border border-surface-border transition-colors cursor-pointer"
          title="Lihat Indeks Risiko Bencana Per Kabupaten/Kota"
        >
          <span>📊 Indeks Risiko</span>
        </button>

        <button 
          onClick={onOpenNotifications}
          className="relative p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
          title="Notifikasi Peringatan Dini Bencana"
          aria-label="Lihat Notifikasi Peringatan Dini Bencana"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-alert-rose rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-alert-rose rounded-full"></span>
        </button>

        <button 
          onClick={onOpenSettings}
          className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
          title="Pengaturan Sistem & Frekuensi Data"
          aria-label="Buka Pengaturan Sistem"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button 
          onClick={onOpenDisasterAlert}
          className="flex items-center gap-2 bg-safety-emerald/10 hover:bg-safety-emerald/20 text-safety-emerald px-3 py-1.5 rounded-full font-semibold text-xs border border-safety-emerald/20 transition-colors cursor-pointer"
          title="Buka Informasi Siaga Bencana Publik"
        >
          <span className="w-2 h-2 rounded-full bg-safety-emerald animate-pulse"></span>
          <span className="font-bold tracking-wide uppercase">Siaga Bencana</span>
        </button>
      </div>
    </header>
  );
}
