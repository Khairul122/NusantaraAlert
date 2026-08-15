import React, { useState, useEffect } from 'react';
import { ShieldAlert, PhoneCall, Volume2, VolumeX, CheckCircle, X, BellRing, ShieldCheck, AlertTriangle } from 'lucide-react';

export function DisasterAlertModal({ isOpen, onClose, latestQuake }) {
  const [soundAlert, setSoundAlert] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleAcknowledge = () => {
    if (dontShowAgain) {
      localStorage.setItem('nusantara_alert_popup_seen', 'true');
    }
    onClose();
  };

  const handleDirectDial = (num) => {
    window.location.href = `tel:${num}`;
  };

  if (!isOpen) return null;

  const mag = parseFloat(latestQuake?.Magnitude) || 5.1;
  const isHighAlert = mag >= 6.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-surface-container-lowest rounded-3xl border border-surface-border w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className={`px-6 pt-6 pb-8 sm:px-8 sm:pt-7 sm:pb-9 border-b flex justify-between items-start text-white relative overflow-hidden ${
          isHighAlert ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700' : 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700'
        }`}>
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 space-y-3 max-w-[85%]">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs border border-white/20 shadow-xs">
                <span className={`w-2 h-2 rounded-full animate-ping shrink-0 ${isHighAlert ? 'bg-white' : 'bg-emerald-300'}`}></span>
                Peringatan Siaga Bencana Publik
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
              {isHighAlert ? 'PERINGATAN SIAGA GEMPA BUMI M 6.0+' : 'Pusat Informasi & Kesiapsiagaan Bencana'}
            </h2>
            <p className="text-xs text-white/90 font-medium leading-relaxed">

            </p>
          </div>

          <button 
            onClick={onClose}
            className="relative z-10 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors shrink-0 -mt-1 -mr-1"
            aria-label="Tutup Pop-up Siaga Bencana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Real-Time Summary */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-border flex items-start gap-3">
            {isHighAlert ? (
              <ShieldAlert className="w-6 h-6 text-alert-rose shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-safety-emerald shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-extrabold text-sm text-on-surface">
                {isHighAlert ? 'PERINGATAN DARURAT BMKG: GEMPA KUAT' : 'Status Wilayah Indonesia: NORMAL & AMAN'}
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                {isHighAlert 
                  ? `Terdeteksi Gempa M ${latestQuake?.Magnitude} di ${latestQuake?.Wilayah}. Lakukan evakuasi mandiri ke lokasi aman!`
                  : 'Seluruh stasiun pemantau seismik BMKG & sistem peringatan dini tsunami (TEWS) dalam kondisi aktif dan terpantau terkendali.'}
              </p>
            </div>
          </div>

          {/* Emergency Direct Call Section */}
          <div>
            <h4 className="text-xs font-extrabold text-on-surface uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-primary" /> Hotline Darurat Bencana Direct (24 Jam)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => handleDirectDial('115')}
                className="p-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl font-bold flex items-center justify-between transition-colors shadow-xs"
              >
                <span>Basarnas (SAR)</span>
                <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-md">115</span>
              </button>
              <button 
                onClick={() => handleDirectDial('117')}
                className="p-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl font-bold flex items-center justify-between transition-colors shadow-xs"
              >
                <span>Call Center BNPB</span>
                <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-md">117</span>
              </button>
              <button 
                onClick={() => handleDirectDial('119')}
                className="p-3 bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-border rounded-xl font-bold flex items-center justify-between transition-colors shadow-xs"
              >
                <span>Ambulans Medis</span>
                <span className="bg-surface-border text-on-surface text-[10px] px-2 py-0.5 rounded-md">119</span>
              </button>
              <button 
                onClick={() => handleDirectDial('196')}
                className="p-3 bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-border rounded-xl font-bold flex items-center justify-between transition-colors shadow-xs"
              >
                <span>Info BMKG</span>
                <span className="bg-surface-border text-on-surface text-[10px] px-2 py-0.5 rounded-md">196</span>
              </button>
            </div>
          </div>

          {/* 3 Steps Readiness Protocol */}
          <div>
            <h4 className="text-xs font-extrabold text-on-surface uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-alert-amber" /> 3 Langkah Taktis Mitigasi Cepat
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-border flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <div className="font-bold text-on-surface">Merunduk, Lindungi Kepala & Berpegangan</div>
                  <div className="text-text-muted text-[11px] mt-0.5">Seketika gempa terjadi, segera merunduk di bawah meja kokoh dan jauhi barang kaca.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-border flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <div className="font-bold text-on-surface">Evakuasi Jalur Terbuka Tanpa Lift</div>
                  <div className="text-text-muted text-[11px] mt-0.5">Gunakan tangga darurat gedung, jauhi tiang listrik, baliho, dan lereng rawan longsor.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-border flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <div className="font-bold text-on-surface">Pastikan Radio / Informasi Resmi BMKG Active</div>
                  <div className="text-text-muted text-[11px] mt-0.5">Hanya percayai kabar dari BPBD, BMKG, dan Basarnas. Jauhi isu hoax yang beredar.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Don't show again checkbox */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <input 
              type="checkbox"
              id="dont-show-checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 accent-primary rounded cursor-pointer"
            />
            <label htmlFor="dont-show-checkbox" className="cursor-pointer font-medium select-none">
              Jangan tampilkan pop-up ini lagi di sesi mendatang
            </label>
          </div>
        </div>

        {/* Footer Action Button */}
        <div className="p-4 border-t border-surface-border bg-surface-container-low/50 flex gap-3">
          <button 
            onClick={handleAcknowledge}
            className="w-full bg-primary text-white hover:bg-primary/90 font-bold py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
          >
            <CheckCircle className="w-4 h-4" /> Saya Mengerti & Siap Siaga
          </button>
        </div>
      </div>
    </div>
  );
}

export default DisasterAlertModal;
