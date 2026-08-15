import React from 'react';
import { X, Bell, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: "Peringatan Dini BMKG",
      desc: "Status Laut Indonesia Normal. Tidak ada ancaman tsunami terdeteksi saat ini.",
      time: "5 Menit lalu",
      type: "success"
    },
    {
      id: 2,
      title: "Gempa M 5.6 Cianjur",
      desc: "Getaran dirasakan hingga wilayah Bandung & Jakarta. Kedalaman 10 km.",
      time: "10 Menit lalu",
      type: "warning"
    },
    {
      id: 3,
      title: "Prakiraan Cuaca Ekstrem",
      desc: "Potensi hujan lebat disertai angin kencang di Jawa Barat & Banten.",
      time: "1 Jam lalu",
      type: "info"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-surface-container-lowest h-full shadow-2xl border-l border-surface-border p-5 flex flex-col justify-between animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-on-surface">Notifikasi Pantauan</h3>
            </div>
            <button onClick={onClose} className="p-1 text-text-muted hover:text-on-surface rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-3.5 rounded-xl border border-surface-border bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-start gap-3">
                  {n.type === 'success' && <ShieldCheck className="w-5 h-5 text-safety-emerald shrink-0 mt-0.5" />}
                  {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-warning-amber shrink-0 mt-0.5" />}
                  {n.type === 'info' && <Info className="w-5 h-5 text-weather-sky shrink-0 mt-0.5" />}

                  <div>
                    <h4 className="font-bold text-sm text-on-surface">{n.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{n.desc}</p>
                    <span className="text-[10px] text-text-muted mt-2 block font-medium">{n.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-surface-container text-on-surface font-semibold text-sm rounded-xl border border-surface-border hover:bg-surface-container-high transition-colors"
        >
          Tutup Notifikasi
        </button>
      </div>
    </div>
  );
}
