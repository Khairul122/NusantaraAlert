import React from 'react';
import { ShieldCheck, Radio, Clock, Layers, MapPin, ArrowRight, CloudSun, Wind, Droplets, Activity } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';

export default function DashboardPage({ latestQuake, quakes, weatherList, onSelectQuake, onNavigate }) {
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
      <h1 className="sr-only">NusantaraAlert - Informasi Gempa Bumi Terkini BMKG & Peta Episentrum Indonesia</h1>

      {/* Dynamic Status Alert Banner */}
      <section className="w-full bg-safety-emerald/10 border-l-4 border-safety-emerald rounded-r-2xl p-4 flex items-start sm:items-center justify-between gap-3 shadow-xs" aria-label="Status Peringatan Dini Tsunami BMKG">
        <div className="flex items-start sm:items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-safety-emerald shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <h2 className="font-bold text-sm text-on-surface">Status Peringatan Dini Tsunami: Kondisi Aman & Normal</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Hasil analisis pemodelan seismik BMKG menunjukkan bahwa saat ini tidak terdapat ancaman tsunami di seluruh wilayah pesisir pantai Indonesia.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-surface-border text-xs font-semibold text-text-muted">
          <Activity className="w-4 h-4 text-safety-emerald animate-pulse" />
          <span>842 Stasiun Seismograf BMKG Aktif Memantau</span>
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

        {/* Right Column: Key Info & Widgets (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Gempa Terkini Hero Card */}
          <section className="bg-surface-container-lowest rounded-2xl border border-surface-border p-5 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] relative overflow-hidden" aria-label="Informasi Gempa Bumi Terkini">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-alert-rose animate-ping"></span>
                Laporan Gempa Bumi Terkini BMKG
              </h2>
              <span className="bg-warning-amber/10 text-warning-amber px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-warning-amber/20">
                <Radio className="w-3.5 h-3.5" /> Dirasakan MMI
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className={`w-20 h-20 rounded-full ${magBg} flex items-center justify-center text-white text-3xl font-extrabold shadow-lg relative ${pulseClass} shrink-0`} title={`Magnitudo ${currentQuake?.Magnitude || '5.6'}`}>
                {currentQuake?.Magnitude || '5.6'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface leading-tight">
                  {currentQuake?.Wilayah || 'Cianjur, Jawa Barat'}
                </h3>
                <div className="text-xs text-on-surface-variant flex items-center gap-1 mt-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-text-muted" /> 
                  {currentQuake?.Jam} &bull; {currentQuake?.Tanggal}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-surface-border text-xs">
              <div>
                <div className="text-text-muted font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> Kedalaman Seismik
                </div>
                <div className="text-sm font-bold text-on-surface mt-0.5">{currentQuake?.Kedalaman || '10 km'}</div>
              </div>

              <div>
                <div className="text-text-muted font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Koordinat Episentrum
                </div>
                <div className="text-sm font-bold text-on-surface mt-0.5">{currentQuake?.Coordinates || '6.84 LS, 107.05 BT'}</div>
              </div>
            </div>

            <button 
              onClick={() => onSelectQuake(currentQuake)}
              className="w-full mt-4 bg-surface-container hover:bg-surface-container-high text-primary font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm border border-surface-border"
              title="Lihat Rincian Selengkapnya"
            >
              Lihat Rincian Selengkapnya <ArrowRight className="w-4 h-4" />
            </button>
          </section>

          {/* Prakiraan Cuaca Bento Summary Widget */}
          <section className="bg-surface-container-lowest rounded-2xl border border-surface-border p-5 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] flex-1 flex flex-col justify-between" aria-label="Ringkasan Prakiraan Cuaca Indonesia">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-weather-sky" /> Prakiraan Cuaca Kota Utama
              </h2>
              <button 
                onClick={() => onNavigate('weather')}
                className="text-xs text-primary font-bold hover:underline"
                title="Lihat Selengkapnya Prakiraan Cuaca Seluruh Wilayah"
              >
                Lihat Selengkapnya
              </button>
            </div>

            <div className="space-y-2.5">
              {weatherList.slice(0, 3).map((w, idx) => (
                <div key={idx} className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between border border-surface-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-weather-sky/10 text-weather-sky rounded-full flex items-center justify-center font-bold text-sm">
                      {w.temp}&deg;
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-on-surface">{w.city}</h3>
                      <div className="text-[11px] text-text-muted">{w.condition} &bull; {w.region}</div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-text-muted font-medium space-y-0.5">
                    <div className="flex items-center gap-1 justify-end">
                      <Droplets className="w-3 h-3 text-weather-sky" /> {w.humidity}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Wind className="w-3 h-3 text-text-muted" /> {w.wind}
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
