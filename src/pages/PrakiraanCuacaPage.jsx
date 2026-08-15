import React, { useState, useEffect } from 'react';
import { Search, MapPin, Droplets, Wind, Sun, ShieldCheck, RefreshCw, Navigation } from 'lucide-react';
import AnimatedWeatherVisual from '../components/AnimatedWeatherVisual';
import { searchIndonesianLocations, fetchWeatherForCoordinates } from '../services/bmkgService';
import { useLanguage } from '../context/LanguageContext';

export default function PrakiraanCuacaPage({ weatherList = [] }) {
  const { t } = useLanguage();
  const [activeWeatherList, setActiveWeatherList] = useState(weatherList);
  const [selectedCityState, setSelectedCityState] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSelected, setIsLoadingSelected] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState('ALL');

  useEffect(() => {
    if (weatherList.length > 0 && activeWeatherList.length === 0) {
      setActiveWeatherList(weatherList);
    }
  }, [weatherList]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchIndonesianLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectLocation = async (loc) => {
    setIsLoadingSelected(true);
    setSearchQuery('');
    setSearchResults([]);

    const existing = activeWeatherList.find(w => 
      w.city.toLowerCase() === loc.name.toLowerCase() || 
      (w.lat === loc.lat && w.lon === loc.lon)
    );

    if (existing) {
      setSelectedCityState(existing);
      setIsLoadingSelected(false);
      return;
    }

    const newWeatherData = await fetchWeatherForCoordinates(
      loc.lat, 
      loc.lon, 
      loc.name, 
      loc.region || loc.admin1 || 'Indonesia'
    );

    if (newWeatherData) {
      newWeatherData.type = loc.type || 'Kota/Kabupaten';
      setActiveWeatherList(prev => [newWeatherData, ...prev]);
      setSelectedCityState(newWeatherData);
    }
    setIsLoadingSelected(false);
  };

  const selectedCity = selectedCityState || activeWeatherList[0] || {
    city: 'Jakarta Pusat',
    region: 'DKI Jakarta',
    temp: 32,
    condition: 'Cerah Berawan',
    humidity: '72%',
    wind: '14 km/jam',
    uvIndex: 7,
    airQuality: 'Baik',
    hourly: [
      { time: '13:00', temp: 32, icon: 'partly_cloudy_day' },
      { time: '16:00', temp: 30, icon: 'cloudy' },
      { time: '19:00', temp: 28, icon: 'rainy' },
      { time: '22:00', temp: 26, icon: 'cloudy' },
      { time: '01:00', temp: 25, icon: 'partly_cloudy_day' }
    ]
  };

  const filteredLocations = activeWeatherList.filter(item => {
    if (activeFilterType === 'KOTA') return item.type === 'Kota' || !item.type;
    if (activeFilterType === 'KABUPATEN') return item.type === 'Kabupaten' || item.city.toLowerCase().includes('kab.');
    if (activeFilterType === 'PROVINSI') return item.type === 'Provinsi';
    return true;
  });

  return (
    <article className="space-y-6 max-w-7xl mx-auto">
      {/* Header SEO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-weather-sky animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-weather-sky">Real-Time Stasiun BMKG</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            Prakiraan Cuaca Kota, Kabupaten & Provinsi Indonesia
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Analisis kondisi cuaca terkini, indeks UV, kelembapan udara, serta kecepatan angin seluruh wilayah Indonesia.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative max-w-sm w-full z-30">
          <label htmlFor="weather-location-search" className="sr-only">Cari Lokasi Cuaca Kota, Kabupaten atau Provinsi</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              id="weather-location-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Kota, Kabupaten, atau Provinsi (contoh: Sleman, Bandung)..."
              className="w-full bg-surface-container-lowest border border-surface-border rounded-2xl pl-10 pr-10 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-weather-sky shadow-xs"
            />
            {isSearching && (
              <RefreshCw className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-weather-sky animate-spin" />
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-surface-border rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-surface-border">
              {searchResults.map((item) => (
                <div
                  key={`${item.id}-${item.lat}-${item.lon}`}
                  onClick={() => handleSelectLocation(item)}
                  className="p-3 hover:bg-surface-container-low cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-weather-sky shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-on-surface">{item.name}</div>
                      <div className="text-[11px] text-text-muted">{item.region}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-weather-sky/10 text-weather-sky rounded-full">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Featured Hero City Card (8 Cols) */}
        <section className="md:col-span-8 bg-gradient-to-br from-sky-500/10 via-emerald-500/5 to-surface-container-lowest rounded-3xl border border-surface-border p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[480px]" aria-label="Informasi Cuaca Terpilih">
          {isLoadingSelected && (
            <div className="absolute inset-0 z-20 bg-surface-container-lowest/80 backdrop-blur-xs flex items-center justify-center gap-2 text-xs font-bold text-weather-sky">
              <RefreshCw className="w-5 h-5 animate-spin" /> Memuat Data Stasiun Seismologi & Meteorologi...
            </div>
          )}

          {/* Top Info Bar */}
          <div className="flex justify-between items-start z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-weather-sky/15 text-weather-sky rounded-full text-xs font-extrabold uppercase tracking-wider">
                  Wilayah Terpilih
                </span>
                {selectedCity.type && (
                  <span className="px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-full text-[11px] font-bold">
                    {selectedCity.type}
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-extrabold text-on-surface mt-2 tracking-tight">{selectedCity.city || 'Jakarta'}</h2>
              <p className="text-xs text-text-muted font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-weather-sky" /> {selectedCity.region || 'DKI Jakarta'} &bull; Stasiun Radar BMKG Real-Time
              </p>
            </div>

            <div className="text-right">
              <div className="text-5xl font-black text-on-surface tracking-tight">{selectedCity.temp || 29}&deg;C</div>
              <div className="text-sm font-extrabold text-weather-sky mt-1">{selectedCity.condition || 'Cerah Berawan'}</div>
            </div>
          </div>

          {/* CENTER ANIMATED WEATHER VISUAL */}
          <div className="my-6 flex justify-center items-center z-10 py-2">
            <AnimatedWeatherVisual 
              condition={selectedCity.condition || 'Cerah Berawan'} 
              icon={selectedCity.icon || 'partly_cloudy_day'}
              size="xl"
            />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 z-10 mb-4">
            <div className="bg-surface-container-lowest/90 backdrop-blur-sm p-3.5 rounded-2xl border border-surface-border shadow-xs">
              <div className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                <Droplets className="w-3.5 h-3.5 text-weather-sky" /> Kelembapan Udara
              </div>
              <div className="text-base font-bold text-on-surface mt-0.5">{selectedCity.humidity || '70%'}</div>
            </div>

            <div className="bg-surface-container-lowest/90 backdrop-blur-sm p-3.5 rounded-2xl border border-surface-border shadow-xs">
              <div className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                <Wind className="w-3.5 h-3.5 text-weather-sky" /> Kecepatan Angin
              </div>
              <div className="text-base font-bold text-on-surface mt-0.5">{selectedCity.wind || '12 km/jam'}</div>
            </div>

            <div className="bg-surface-container-lowest/90 backdrop-blur-sm p-3.5 rounded-2xl border border-surface-border shadow-xs">
              <div className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                <Sun className="w-3.5 h-3.5 text-warning-amber" /> Indeks Radiasi UV
              </div>
              <div className="text-base font-bold text-on-surface mt-0.5">{selectedCity.uvIndex || 5} (Sedang)</div>
            </div>

            <div className="bg-surface-container-lowest/90 backdrop-blur-sm p-3.5 rounded-2xl border border-surface-border shadow-xs">
              <div className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-safety-emerald" /> Kualitas Udara
              </div>
              <div className="text-xs font-bold text-safety-emerald mt-0.5">{selectedCity.airQuality || 'Baik'}</div>
            </div>
          </div>

          {/* Hourly Forecast Slider */}
          <div className="z-10 pt-4 border-t border-surface-border/60">
            <h3 className="text-xs font-bold text-on-surface mb-3 uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-weather-sky" /> Prakiraan 5 Jam Mendatang
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {selectedCity.hourly?.map((h, i) => (
                <div key={i} className="bg-surface-container-lowest/90 border border-surface-border rounded-2xl p-3 text-center min-w-[80px] shrink-0 shadow-xs flex flex-col items-center">
                  <div className="text-[11px] text-text-muted font-semibold">{h.time}</div>
                  <div className="my-1">
                    <AnimatedWeatherVisual condition={h.icon} icon={h.icon} size="sm" />
                  </div>
                  <div className="text-xs font-extrabold text-on-surface">{h.temp}&deg;C</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Locations Column (4 Cols) */}
        <section className="md:col-span-4 space-y-4" aria-label="Daftar Wilayah Indonesia">
          {/* Location Category Filters */}
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-on-surface">Daftar Wilayah Utama</h2>

            <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-border text-[11px] font-bold">
              <button 
                onClick={() => setActiveFilterType('ALL')}
                className={`px-2.5 py-1 rounded-lg transition-all ${activeFilterType === 'ALL' ? 'bg-surface-container-lowest text-weather-sky shadow-xs' : 'text-text-muted'}`}
              >
                Semua
              </button>
              <button 
                onClick={() => setActiveFilterType('KOTA')}
                className={`px-2.5 py-1 rounded-lg transition-all ${activeFilterType === 'KOTA' ? 'bg-surface-container-lowest text-weather-sky shadow-xs' : 'text-text-muted'}`}
              >
                Kota
              </button>
              <button 
                onClick={() => setActiveFilterType('KABUPATEN')}
                className={`px-2.5 py-1 rounded-lg transition-all ${activeFilterType === 'KABUPATEN' ? 'bg-surface-container-lowest text-weather-sky shadow-xs' : 'text-text-muted'}`}
              >
                Kabupaten
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredLocations.map((cityData, idx) => (
              <div
                key={`${cityData.city}-${idx}`}
                onClick={() => setSelectedCityState(cityData)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedCity.city === cityData.city
                    ? 'bg-surface-container-lowest border-weather-sky shadow-md ring-2 ring-weather-sky/20'
                    : 'bg-surface-container-lowest border-surface-border hover:border-weather-sky/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AnimatedWeatherVisual 
                    condition={cityData.condition} 
                    icon={cityData.icon} 
                    size="md" 
                  />
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">{cityData.city}</h3>
                    <p className="text-xs text-text-muted font-medium">{cityData.region}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-on-surface">{cityData.temp}&deg;</span>
                  <p className="text-[11px] font-bold text-weather-sky mt-0.5">{cityData.condition}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
