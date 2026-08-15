import React, { useState } from 'react';
import { X, Volume2, RefreshCw, Radio, Shield } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [minMagnitude, setMinMagnitude] = useState('5.0');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in" onClick={onClose}>
      <div 
        className="bg-surface-container-lowest rounded-3xl border border-surface-border w-full max-w-md p-6 shadow-2xl space-y-5 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b border-surface-border">
          <h3 className="font-bold text-lg text-on-surface">Pengaturan Sistem</h3>
          <button onClick={onClose} className="p-1 text-text-muted hover:text-on-surface rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-surface-border">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-primary" />
              <div>
                <div className="font-bold text-sm text-on-surface">Sirine / Suara Peringatan</div>
                <div className="text-xs text-text-muted">Bunyikan alarm saat terjadi gempa &gt; M 6.0</div>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={soundEnabled} 
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-surface-border">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-primary" />
              <div>
                <div className="font-bold text-sm text-on-surface">Auto-Refresh BMKG</div>
                <div className="text-xs text-text-muted">Pembaruan otomatis tiap 60 detik</div>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-on-surface">
              <Radio className="w-4 h-4 text-warning-amber" /> Filter Ambang Magnitudo Minimal
            </div>
            <select 
              value={minMagnitude}
              onChange={(e) => setMinMagnitude(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-border rounded-lg p-2 text-sm text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Semua Magnitudo (M 1.0+)</option>
              <option value="5.0">Hanya Magnitudo M 5.0+</option>
              <option value="6.0">Hanya Magnitudo M 6.0+ (Potensi Bahaya)</option>
            </select>
          </div>

          <div className="p-3 bg-safety-emerald/10 border border-safety-emerald/30 rounded-xl flex items-center gap-2 text-xs text-safety-emerald font-medium">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Sumber Data Resmi: BMKG Indonesia (TEWS & Open Data)</span>
          </div>
        </div>

          <button 
            onClick={onClose}
            className="w-full bg-primary text-white hover:bg-primary/90 font-bold py-2.5 rounded-xl transition-colors shadow-sm text-xs"
          >
            Simpan & Terapkan
          </button>
      </div>
    </div>
  );
}
