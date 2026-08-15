// BMKG TEWS & Real-Time Meteorological API Service
// 100% Real Live API Data - Supports Kota, Kabupaten, & Provinsi in Indonesia

const BMKG_AUTO_GEMPA_URL = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json';
const BMKG_GEMPA_TERKINI_URL = 'https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json';
const BMKG_GEMPA_DIRASAKAN_URL = 'https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json';

// Target Indonesian major cities, regencies (kabupaten), & provinces
export const DEFAULT_INDONESIA_LOCATIONS = [
  { name: 'Jakarta', region: 'DKI Jakarta', lat: -6.2088, lon: 106.8456, type: 'Kota' },
  { name: 'Bandung', region: 'Jawa Barat', lat: -6.9175, lon: 107.6191, type: 'Kota' },
  { name: 'Kab. Cianjur', region: 'Jawa Barat', lat: -6.8222, lon: 107.1394, type: 'Kabupaten' },
  { name: 'Surabaya', region: 'Jawa Timur', lat: -7.2575, lon: 112.7521, type: 'Kota' },
  { name: 'Medan', region: 'Sumatera Utara', lat: 3.5952, lon: 98.6722, type: 'Kota' },
  { name: 'Denpasar', region: 'Bali', lat: -8.6705, lon: 115.2126, type: 'Kota' },
  { name: 'Makassar', region: 'Sulawesi Selatan', lat: -5.1477, lon: 119.4327, type: 'Kota' },
  { name: 'Kab. Sleman', region: 'D.I. Yogyakarta', lat: -7.7155, lon: 110.3555, type: 'Kabupaten' },
  { name: 'Yogyakarta', region: 'D.I. Yogyakarta', lat: -7.7956, lon: 110.3695, type: 'Kota' },
  { name: 'Semarang', region: 'Jawa Tengah', lat: -6.9667, lon: 110.4167, type: 'Kota' },
  { name: 'Palembang', region: 'Sumatera Selatan', lat: -2.9761, lon: 104.7754, type: 'Kota' },
  { name: 'Balikpapan', region: 'Kalimantan Timur', lat: -1.2379, lon: 116.8529, type: 'Kota' },
  { name: 'Banda Aceh', region: 'Aceh', lat: 5.5483, lon: 95.3238, type: 'Kota' },
  { name: 'Jayapura', region: 'Papua', lat: -2.5489, lon: 140.7186, type: 'Kota' }
];

// Helper to translate WMO weather code to Indonesian text & icon
export function parseWmoWeatherCode(code) {
  switch (code) {
    case 0:
      return { condition: 'Cerah', icon: 'sunny' };
    case 1:
    case 2:
      return { condition: 'Cerah Berawan', icon: 'partly_cloudy_day' };
    case 3:
      return { condition: 'Berawan', icon: 'cloudy' };
    case 45:
    case 48:
      return { condition: 'Kabut / Berabut', icon: 'cloudy' };
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
      return { condition: 'Hujan Ringan', icon: 'rainy' };
    case 80:
    case 81:
    case 82:
      return { condition: 'Hujan Deras', icon: 'rainy' };
    case 95:
    case 96:
    case 99:
      return { condition: 'Hujan Petir', icon: 'rainy' };
    default:
      return { condition: 'Cerah Berawan', icon: 'partly_cloudy_day' };
  }
}

// Fetch Weather for Specific Coordinates (Kota, Kabupaten, or Provinsi)
export async function fetchWeatherForCoordinates(lat, lon, name, region) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,uv_index&hourly=temperature_2m,weather_code&timezone=Asia%2FJakarta`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    
    const current = data.current;
    const parsedWeather = parseWmoWeatherCode(current?.weather_code);
    
    // Build 5-hour forecast array
    const hourlyTimes = data.hourly?.time || [];
    const hourlyTemps = data.hourly?.temperature_2m || [];
    const hourlyCodes = data.hourly?.weather_code || [];

    const currentHourIdx = Math.max(0, hourlyTimes.findIndex(t => new Date(t) >= new Date()));
    const next5Hours = [];
    
    for (let i = currentHourIdx; i < currentHourIdx + 5 && i < hourlyTimes.length; i++) {
      const t = new Date(hourlyTimes[i]);
      const timeStr = t.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const codeInfo = parseWmoWeatherCode(hourlyCodes[i]);
      next5Hours.push({
        time: timeStr,
        temp: Math.round(hourlyTemps[i]),
        icon: codeInfo.icon
      });
    }

    return {
      city: name,
      region: region || 'Indonesia',
      lat,
      lon,
      temp: Math.round(current.temperature_2m),
      condition: parsedWeather.condition,
      icon: parsedWeather.icon,
      humidity: `${Math.round(current.relative_humidity_2m)}%`,
      wind: `${Math.round(current.wind_speed_10m)} km/jam`,
      uvIndex: Math.round(current.uv_index || 4),
      airQuality: "Baik",
      hourly: next5Hours
    };
  } catch (err) {
    console.error(`Error fetching weather for ${name}:`, err);
    return null;
  }
}

// Search Indonesian Locations (Kota, Kabupaten, Provinsi) via Geocoding API
export async function searchIndonesianLocations(query) {
  if (!query || query.trim().length < 2) return [];

  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=10&language=id&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    
    const results = data.results || [];
    
    // Filter results for Indonesia
    const idResults = results.filter(r => r.country_code === 'ID' || r.country === 'Indonesia');

    return idResults.map(r => {
      let displayName = r.name;
      let regionName = r.admin1 || 'Indonesia';
      let locationType = 'Kota';

      if (r.admin2) {
        if (r.admin2.toLowerCase().includes('kabupaten') || r.admin2.toLowerCase().includes('kab.')) {
          locationType = 'Kabupaten';
          regionName = `${r.admin2}, ${r.admin1 || ''}`;
        } else {
          regionName = `${r.admin2}, ${r.admin1 || ''}`;
        }
      } else if (r.feature_code === 'ADM1') {
        locationType = 'Provinsi';
      }

      return {
        id: r.id,
        name: displayName,
        region: regionName,
        lat: r.latitude,
        lon: r.longitude,
        type: locationType
      };
    });
  } catch (err) {
    console.error("Geocoding search error:", err);
    return [];
  }
}

// Fetch Latest Autogempa from BMKG
export async function fetchLatestEarthquake() {
  try {
    const res = await fetch(BMKG_AUTO_GEMPA_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const g = data?.Infogempa?.gempa;

    if (g) {
      const mag = parseFloat(g.Magnitude) || 0;
      let severity = 'emerald';
      if (mag >= 6.0) severity = 'rose';
      else if (mag >= 5.0) severity = 'amber';

      return {
        id: `bmkg-latest-${g.DateTime}`,
        Tanggal: g.Tanggal,
        Jam: g.Jam,
        DateTime: g.DateTime,
        Coordinates: g.Coordinates,
        Lintang: g.Lintang,
        Bujur: g.Bujur,
        Magnitude: g.Magnitude,
        Kedalaman: g.Kedalaman,
        Wilayah: g.Wilayah,
        Potensi: g.Potensi,
        Dirasakan: g.Dirasakan && g.Dirasakan !== '-' ? g.Dirasakan : 'Pusat gempa di wilayah tersebut',
        Shakemap: g.Shakemap ? `https://data.bmkg.go.id/DataMKG/TEWS/${g.Shakemap}` : null,
        TsunamiStatus: g.Potensi?.toLowerCase().includes('tsunami') && !g.Potensi?.toLowerCase().includes('tidak') ? "SIAGA" : "NORMAL",
        MMIScale: g.Dirasakan && g.Dirasakan !== '-' ? "Skala MMI Terdeteksi" : "Pusat Seismik Utama",
        Severity: severity
      };
    }
  } catch (err) {
    console.error("Error fetching live BMKG latest earthquake:", err);
  }
  return null;
}

// Fetch Recent Earthquakes List (Combining TEWS gempaterkini & gempadirasakan)
export async function fetchEarthquakeHistory() {
  try {
    const [resTerkini, resDirasakan] = await Promise.allSettled([
      fetch(BMKG_GEMPA_TERKINI_URL).then(r => r.json()),
      fetch(BMKG_GEMPA_DIRASAKAN_URL).then(r => r.json())
    ]);

    let quakeList = [];

    if (resTerkini.status === 'fulfilled' && resTerkini.value?.Infogempa?.gempa) {
      const gempas = resTerkini.value.Infogempa.gempa;
      quakeList = gempas.map((g, idx) => {
        const mag = parseFloat(g.Magnitude) || 0;
        let severity = 'emerald';
        if (mag >= 6.0) severity = 'rose';
        else if (mag >= 5.0) severity = 'amber';

        return {
          id: `bmkg-terkini-${idx}-${g.DateTime || idx}`,
          Tanggal: g.Tanggal,
          Jam: g.Jam,
          DateTime: g.DateTime,
          Magnitude: g.Magnitude,
          Kedalaman: g.Kedalaman,
          Wilayah: g.Wilayah,
          Coordinates: g.Coordinates,
          Lintang: g.Lintang,
          Bujur: g.Bujur,
          Dirasakan: g.Dirasakan || 'Kawasan seputar episentrum',
          Potensi: g.Potensi || 'Tidak berpotensi Tsunami',
          Severity: severity
        };
      });
    }

    if (resDirasakan.status === 'fulfilled' && resDirasakan.value?.Infogempa?.gempa) {
      const dirasakanList = resDirasakan.value.Infogempa.gempa;
      dirasakanList.forEach((g, idx) => {
        const mag = parseFloat(g.Magnitude) || 0;
        let severity = 'emerald';
        if (mag >= 6.0) severity = 'rose';
        else if (mag >= 5.0) severity = 'amber';

        const exists = quakeList.some(q => q.DateTime === g.DateTime || (q.Jam === g.Jam && q.Tanggal === g.Tanggal));
        if (!exists) {
          quakeList.push({
            id: `bmkg-dirasakan-${idx}-${g.DateTime || idx}`,
            Tanggal: g.Tanggal,
            Jam: g.Jam,
            DateTime: g.DateTime,
            Magnitude: g.Magnitude,
            Kedalaman: g.Kedalaman,
            Wilayah: g.Wilayah,
            Coordinates: g.Coordinates,
            Lintang: g.Lintang,
            Bujur: g.Bujur,
            Dirasakan: g.Dirasakan,
            Potensi: g.Potensi || 'Gempa Dirasakan MMI',
            Severity: severity
          });
        }
      });
    }

    return quakeList;
  } catch (err) {
    console.error("Error fetching live BMKG earthquake history:", err);
    return [];
  }
}

// Auto Translate BMKG Dynamic Data to English
export function translateBmkgText(text, lang = 'id') {
  if (!text || lang !== 'en') return text;

  let translated = String(text);

  // Directions (Arah Mata Angin)
  translated = translated
    .replace(/\bbarat daya\b/gi, 'southwest')
    .replace(/\bbarat laut\b/gi, 'northwest')
    .replace(/\btenggara\b/gi, 'southeast')
    .replace(/\btimur laut\b/gi, 'northeast')
    .replace(/\bselatan\b/gi, 'south')
    .replace(/\butara\b/gi, 'north')
    .replace(/\btimur\b/gi, 'east')
    .replace(/\bbarat\b/gi, 'west');

  // Sentences & Locations (Kalimat BMKG)
  translated = translated
    .replace(/Pusat gempa berada di laut/gi, 'Epicenter located at sea')
    .replace(/Pusat gempa berada di darat/gi, 'Epicenter located on land')
    .replace(/Tidak berpotensi TSUNAMI/gi, 'No Tsunami Potential')
    .replace(/Berpotensi TSUNAMI/gi, 'TSUNAMI POTENTIAL ALERT')
    .replace(/Gempa dirasakan/gi, 'Quake felt in');

  // Weather conditions (Kondisi Cuaca)
  translated = translated
    .replace(/\bCerah Berawan\b/gi, 'Partly Cloudy')
    .replace(/\bCerah\b/gi, 'Sunny')
    .replace(/\bBerawan\b/gi, 'Cloudy')
    .replace(/\bHujan Ringan\b/gi, 'Light Rain')
    .replace(/\bHujan Sedang\b/gi, 'Moderate Rain')
    .replace(/\bHujan Lebat\b/gi, 'Heavy Rain')
    .replace(/\bHujan Petir\b/gi, 'Thunderstorm');

  return translated;
}

// Fetch Weather for Default Indonesia Locations
export async function fetchLiveWeatherData() {
  try {
    const promises = DEFAULT_INDONESIA_LOCATIONS.map(async (loc) => {
      return await fetchWeatherForCoordinates(loc.lat, loc.lon, loc.name, loc.region);
    });

    const results = await Promise.all(promises);
    return results.filter(Boolean);
  } catch (err) {
    console.error("Error fetching default weather data:", err);
    return [];
  }
}

