import React from 'react';
import { ShieldCheck, Radio, Clock, Layers, MapPin, ArrowRight, CloudSun, Wind, Droplets, Activity } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import { useLanguage } from '../context/LanguageContext';
import { translateBmkgText } from '../services/bmkgService';

const renderWeatherIcon = (iconStr) => {
  if (!iconStr || typeof iconStr !== 'string') return '🌤️';
  if (iconStr.includes('sun') || iconStr.includes('clear')) return '☀️';
  if (iconStr.includes('cloud') && iconStr.includes('partly')) return '⛅';
  if (iconStr.includes('partly')) return '⛅';
  if (iconStr.includes('cloud')) return '☁️';
  if (iconStr.includes('rain')) return '🌧️';
  if (iconStr.includes('thunder') || iconStr.includes('storm')) return '🌩️';
  return '🌤️';
};

export default function DashboardPage({ latestQuake, quakes, weatherList, onSelectQuake, onNavigate }) {
  const { language, t } = useLanguage();
  const currentQuake = latestQuake || quakes[0];
  const mag = parseFloat(currentQuake?.Magnitude) || 5.6;

  let pulseClass = 'pulse-ring-amber';
  let magBg = 'bg-warning-amber';

  if (mag >= 6.0) {
    pulseClass = 'pulse-ring-rose';
    magBg = 'bg-alert-rose';
  } else if (mag < 5.0) {
    pulseClass = 'pulse-ring-emerald';
    magBg = 'bg-safety-emerald';
  }

  return (
    <article className="space-y-6 max-w-[1440px] mx-auto">
      {/* Hidden SEO H1 */}
      <h1 className="sr-only">NusantaraAlert - {t('dashboard_hero_title')}</h1>

      {/* Dynamic Status Alert Banner */}
      <section className="w-full bg-safety-emerald/10 border-l-4 border-safety-emerald rounded-r-2xl p-4 flex items-start sm:items-center justify-between gap-3 shadow-xs" aria-label="Status Peringatan Dini Tsunami BMKG">
        <div className="flex items-start sm:items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-safety-emerald shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <h2 className="font-bold text-sm text-on-surface">{t('alert_status_normal')}</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {t('dashboard_hero_sub')}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-surface-border text-xs font-semibold text-text-muted">
          <Activity className="w-4 h-4 text-safety-emerald animate-pulse" />
          <span>842 BMKG Stations Live Feed</span>
        </div>
      </section>

      {/* Main Grid Layout: Map & Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map (8 Cols) */}
        <section className="lg:col-span-8 h-[460px] lg:h-[620px]" aria-label="Peta Episentrum Gempa Bumi Interaktif Indonesia">
          <InteractiveMap 
            quakes={quakes} 
            selectedQuake={currentQuake} 
            onSelectQuake={onSelectQuake} 
          />
        </section>

        {/* Right Column: Latest Quake Card & Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Latest Quake Hero Card */}
          <section className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 shadow-sm relative overflow-hidden flex-1" aria-label="Informasi Gempa Bumi Terbaru BMKG">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-alert-rose animate-pulse" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-text-muted">{t('latest_quake_title')}</h3>
              </div>
              <span className="text-[11px] font-semibold text-text-muted bg-surface-container-low px-2.5 py-1 rounded-full border border-surface-border">
                TEWS BMKG Live
              </span>
            </div>

            {currentQuake ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl ${magBg} text-white flex flex-col items-center justify-center ${pulseClass} shrink-0 shadow-md`}>
                    <span className="text-[10px] font-bold uppercase opacity-85">{t('magnitude')}</span>
                    <span className="text-2xl font-black leading-none">M {currentQuake.Magnitude}</span>
                  </div>

                  <div>
                    <h4 className="text-lg font-extrabold text-on-surface leading-tight">
                      {translateBmkgText(currentQuake.Wilayah, language)}
                    </h4>
                    <p className="text-xs text-text-muted font-medium mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {currentQuake.Jam} &bull; {currentQuake.Tanggal}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="bg-surface-container-low p-3 rounded-2xl border border-surface-border">
                    <span className="text-text-muted font-medium text-[11px] block">{t('depth')}</span>
                    <span className="font-bold text-on-surface">{currentQuake.Kedalaman}</span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-2xl border border-surface-border">
                    <span className="text-text-muted font-medium text-[11px] block">{t('coordinates')}</span>
                    <span className="font-bold text-on-surface">{currentQuake.Coordinates}</span>
                  </div>
                </div>

                <div className="bg-safety-emerald/10 border border-safety-emerald/30 p-3 rounded-2xl flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-safety-emerald animate-pulse"></span>
                  <span className="font-bold text-safety-emerald">
                    {translateBmkgText(currentQuake.Potensi || t('no_tsunami'), language)}
                  </span>
                </div>

                <button 
                  onClick={() => onSelectQuake(currentQuake)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs"
                >
                  <span>{t('view_detail_btn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-text-muted text-xs font-semibold">
                Memuat data seismologi BMKG Live...
              </div>
            )}
          </section>

          {/* Quick Weather Snapshot Card */}
          <section className="bg-surface-container-lowest border border-surface-border rounded-3xl p-5 shadow-sm" aria-label="Ringkasan Prakiraan Cuaca Kota Utama">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-text-muted flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-weather-sky" /> {t('nav_weather')}
              </h3>
              <button 
                onClick={() => onNavigate('weather')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {weatherList.slice(0, 2).map((city, idx) => (
                <div key={idx} className="bg-surface-container-low p-3 rounded-2xl border border-surface-border flex items-center gap-3">
                  <div className="text-2xl shrink-0">{renderWeatherIcon(city.icon)}</div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-on-surface truncate">{city.city}</div>
                    <div className="text-text-muted font-medium text-[11px] truncate">
                      {city.temp}°C &bull; {translateBmkgText(city.condition, language)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
