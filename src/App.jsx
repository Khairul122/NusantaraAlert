import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import DashboardPage from './pages/DashboardPage';
import RiwayatGempaPage from './pages/RiwayatGempaPage';
import PrakiraanCuacaPage from './pages/PrakiraanCuacaPage';
import KontakPanduanPage from './pages/KontakPanduanPage';
import DetailGempaModal from './components/DetailGempaModal';
import NotificationDrawer from './components/NotificationDrawer';
import SettingsModal from './components/SettingsModal';
import DisasterAlertModal from './components/DisasterAlertModal';
import DisasterRiskModal from './components/DisasterRiskModal';
import AlertAiChatbot from './components/AlertAiChatbot';
import { 
  fetchLatestEarthquake, 
  fetchEarthquakeHistory, 
  fetchLiveWeatherData 
} from './services/bmkgService';
import { Shield, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [latestQuake, setLatestQuake] = useState(null);
  const [quakes, setQuakes] = useState([]);
  const [weatherList, setWeatherList] = useState([]);
  const [selectedQuakeForModal, setSelectedQuakeForModal] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDisasterModalOpen, setIsDisasterModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [latest, history, weather] = await Promise.all([
        fetchLatestEarthquake(),
        fetchEarthquakeHistory(),
        fetchLiveWeatherData()
      ]);

      if (latest) setLatestQuake(latest);
      if (history && history.length > 0) setQuakes(history);
      if (weather && weather.length > 0) setWeatherList(weather);
    } catch (err) {
      console.error("Error fetching live BMKG data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check if user has already seen disaster alert pop-up
    const hasSeenPopup = localStorage.getItem('nusantara_alert_popup_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsDisasterModalOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Auto refresh live BMKG data every 60 seconds
    const interval = setInterval(() => {
      loadData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col selection:bg-primary/20">
      {/* Header Bar */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDisasterAlert={() => setIsDisasterModalOpen(true)}
        onOpenRiskIndex={() => setIsRiskModalOpen(true)}
      />

      {/* Main Content View Container */}
      <main className="flex-grow pt-20 pb-28 md:pb-12 px-4 md:px-gutter max-w-[1440px] mx-auto w-full">
        {isLoading && quakes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-bold text-text-muted">Menghubungkan ke Stasiun Seismologi & Meteorologi BMKG Live...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardPage 
                latestQuake={latestQuake}
                quakes={quakes}
                weatherList={weatherList}
                onSelectQuake={(q) => setSelectedQuakeForModal(q)}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'history' && (
              <RiwayatGempaPage 
                quakes={quakes}
                onSelectQuake={(q) => setSelectedQuakeForModal(q)}
              />
            )}

            {activeTab === 'weather' && (
              <PrakiraanCuacaPage 
                weatherList={weatherList}
              />
            )}

            {activeTab === 'contacts' && (
              <KontakPanduanPage />
            )}
          </>
        )}
      </main>

      {/* Footer (Desktop) */}
      <footer className="hidden md:block bg-surface-container-lowest border-t border-surface-border py-6 px-gutter text-xs text-text-muted">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <Shield className="w-4 h-4 text-primary" />
            <span>NusantaraAlert &bull; Sistem Pantauan Bencana & Meteorologi Publik Indonesia</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <button 
              onClick={() => setIsRiskModalOpen(true)}
              className="text-primary font-bold hover:underline"
            >
              Indeks Risiko Wilayah
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => setIsDisasterModalOpen(true)}
              className="text-primary font-bold hover:underline"
            >
              Info Siaga Bencana
            </button>
            <span>&bull;</span>
            <span>Sumber Data Live: BMKG (TEWS) & Open Data Meteorologi</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Floating AI Mascot Chatbot */}
      <AlertAiChatbot 
        latestQuake={latestQuake}
      />

      {/* Disaster Risk Index Modal */}
      <DisasterRiskModal 
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
      />

      {/* Disaster Readiness Pop-Up Modal */}
      <DisasterAlertModal
        isOpen={isDisasterModalOpen}
        onClose={() => setIsDisasterModalOpen(false)}
        latestQuake={latestQuake}
      />

      {/* Detail Gempa Modal */}
      <DetailGempaModal 
        quake={selectedQuakeForModal}
        onClose={() => setSelectedQuakeForModal(null)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
