import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, ChevronRight, AlertTriangle, Layers, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translateBmkgText } from '../services/bmkgService';

export default function RiwayatGempaPage({ quakes, onSelectQuake }) {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [magFilter, setMagFilter] = useState('all');

  const filteredQuakes = quakes.filter(q => {
    const matchesQuery = q.Wilayah.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.Tanggal.toLowerCase().includes(searchQuery.toLowerCase());
    
    const mag = parseFloat(q.Magnitude) || 0;
    let matchesMag = true;
    if (magFilter === '5') matchesMag = mag >= 5.0 && mag < 6.0;
    if (magFilter === '6') matchesMag = mag >= 6.0;

    return matchesQuery && matchesMag;
  });

  return (
    <article className="space-y-6 max-w-7xl mx-auto">
      {/* Header Copywriting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            {t('history_title')}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {t('history_sub')}
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" aria-label="Filter Kategori Magnitudo">
          <button
            onClick={() => setMagFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              magFilter === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-surface-border'
            }`}
          >
            {t('filter_all_mag')} ({quakes.length})
          </button>
          <button
            onClick={() => setMagFilter('5')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              magFilter === '5'
                ? 'bg-warning-amber text-white shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-surface-border'
            }`}
          >
            {t('filter_mag_below_6')}
          </button>
          <button
            onClick={() => setMagFilter('6')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              magFilter === '6'
                ? 'bg-alert-rose text-white shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-surface-border'
            }`}
          >
            {t('filter_mag_above_6')}
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-text-muted shrink-0" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search_quake_placeholder')}
          className="w-full bg-transparent text-sm text-on-surface focus:outline-none placeholder:text-text-muted font-medium"
        />
      </div>

      {/* Quake Grid Archive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuakes.map((quake, idx) => {
          const mag = parseFloat(quake.Magnitude) || 5.0;
          let magBg = 'bg-warning-amber';
          if (mag >= 6.0) magBg = 'bg-alert-rose';
          if (mag < 5.0) magBg = 'bg-safety-emerald';

          return (
            <div 
              key={idx}
              onClick={() => onSelectQuake(quake)}
              className="bg-surface-container-lowest border border-surface-border hover:border-primary/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className={`px-3 py-1 rounded-xl text-white font-extrabold text-sm ${magBg} shadow-xs`}>
                    M {quake.Magnitude}
                  </div>
                  <span className="text-[11px] text-text-muted font-semibold bg-surface-container-low px-2.5 py-1 rounded-full border border-surface-border flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" /> {quake.Jam}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-on-surface group-hover:text-primary transition-colors leading-snug">
                  {translateBmkgText(quake.Wilayah, language)}
                </h3>
                <p className="text-xs text-text-muted font-medium mt-1">
                  {quake.Tanggal}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="text-[11px] text-text-muted font-medium">
                    {t('depth')}: <span className="font-bold text-on-surface">{quake.Kedalaman}</span>
                  </div>
                  <div className="text-[11px] text-text-muted font-medium">
                    {t('coordinates')}: <span className="font-bold text-on-surface">{quake.Coordinates}</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-surface-container-low group-hover:bg-primary group-hover:text-white text-text-muted flex items-center justify-center transition-all shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
