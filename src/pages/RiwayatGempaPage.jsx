import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, ChevronRight, AlertTriangle, Layers, Clock } from 'lucide-react';

export default function RiwayatGempaPage({ quakes, onSelectQuake }) {
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
            Riwayat Aktivitas Gempa Bumi BMKG Indonesia
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Arsip data seismik resmi dari jaringan stasiun pemantau BMKG di seluruh kawasan Nusantara.
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
            Semua Peristiwa ({quakes.length})
          </button>
          <button
            onClick={() => setMagFilter('5')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              magFilter === '5'
                ? 'bg-warning-amber text-white shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-surface-border'
            }`}
          >
            M 5.0 - 5.9 (Signifikan)
          </button>
          <button
            onClick={() => setMagFilter('6')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              magFilter === '6'
                ? 'bg-alert-rose text-white shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-surface-border'
            }`}
          >
            M 6.0+ (Risiko Tinggi)
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <label htmlFor="search-quake-input" className="sr-only">Cari Wilayah atau Tanggal Peristiwa Gempa Bumi</label>
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input 
          id="search-quake-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama wilayah atau tanggal gempa (contoh: Cianjur, Mentawai, Aceh)..."
          className="w-full bg-surface-container-lowest border border-surface-border rounded-2xl pl-12 pr-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
        />
      </div>

      {/* Quake Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Daftar Laporan Gempa Bumi">
        {filteredQuakes.map((q) => {
          const mag = parseFloat(q.Magnitude) || 5.0;
          let severityBg = 'bg-warning-amber text-white';
          let borderHighlight = 'border-surface-border hover:border-warning-amber';

          if (mag >= 6.0) {
            severityBg = 'bg-alert-rose text-white';
            borderHighlight = 'border-alert-rose/40 hover:border-alert-rose';
          } else if (mag < 5.0) {
            severityBg = 'bg-safety-emerald text-white';
            borderHighlight = 'border-surface-border hover:border-safety-emerald';
          }

          return (
            <div 
              key={q.id}
              onClick={() => onSelectQuake(q)}
              className={`bg-surface-container-lowest rounded-2xl border p-5 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${borderHighlight} flex flex-col justify-between group`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div 
                    className={`w-14 h-14 rounded-2xl ${severityBg} flex items-center justify-center font-extrabold text-xl shadow-sm shrink-0 group-hover:scale-105 transition-transform`}
                    title={`Magnitudo ${q.Magnitude}`}
                  >
                    {q.Magnitude}
                  </div>

                  <span className="text-[11px] font-semibold px-2.5 py-1 bg-surface-container-low rounded-full text-text-muted border border-surface-border flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {q.Jam}
                  </span>
                </div>

                <h2 className="font-bold text-base text-on-surface leading-snug group-hover:text-primary transition-colors">
                  {q.Wilayah}
                </h2>
                <div className="text-xs text-text-muted mt-1 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {q.Tanggal}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-border/60 flex items-center justify-between text-xs text-text-muted">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium" title="Kedalaman Episentrum">
                    <Layers className="w-3.5 h-3.5" /> Kedalaman: {q.Kedalaman}
                  </span>
                  <span className="flex items-center gap-1 font-medium" title="Koordinat Episentrum">
                    <MapPin className="w-3.5 h-3.5" /> {q.Coordinates}
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </section>

      {filteredQuakes.length === 0 && (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-surface-border">
          <AlertTriangle className="w-12 h-12 text-warning-amber mx-auto mb-3" />
          <h2 className="text-lg font-bold text-on-surface">Data Seismik Tidak Ditemukan</h2>
          <p className="text-sm text-text-muted mt-1">Silakan sesuaikan kata kunci pencarian atau kriteria filter magnitudo Anda.</p>
        </div>
      )}
    </article>
  );
}
