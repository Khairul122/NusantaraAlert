import React from 'react';
import { LayoutDashboard, History, CloudSun, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileNav({ activeTab, setActiveTab }) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { id: 'history', label: t('nav_history'), icon: History },
    { id: 'weather', label: t('nav_weather'), icon: CloudSun },
    { id: 'contacts', label: t('nav_contacts'), icon: PhoneCall }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest border-t border-surface-border px-4 py-2 flex justify-around items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-primary font-bold bg-primary/10'
                : 'text-text-muted hover:text-on-surface'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[11px] leading-none font-medium truncate max-w-[70px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
