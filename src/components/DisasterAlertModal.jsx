import React, { useState, useEffect } from 'react';
import { ShieldAlert, PhoneCall, Volume2, VolumeX, CheckCircle, X, BellRing, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function DisasterAlertModal({ isOpen, onClose, latestQuake }) {
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
        <div className={`p-6 sm:p-7 border-b flex justify-between items-start text-white relative overflow-hidden ${
          isHighAlert ? 'bg-gradient-to-r from-red-600 to-rose-700' : 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700'
        }`}>
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 space-y-2.5 max-w-[85%]">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs border border-white/20 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping shrink-0"></span>
                Peringatan Siaga Bencana Publik
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
              {isHighAlert ? 'PERINGATAN SIAGA GEMPA BUMI M 6.0+' : 'Pusat Informasi & Kesiapsiagaan Bencana'}
            </h2>
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
              <AlertTriangle className="w-6 h-6 text-alert-rose shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-safety-emerald shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-bold text-sm text-on-surface">
                {isHighAlert ? 'Status Wilayah: SIAGA GEMPA & EVALUASI TSUNAMI' : 'Status Wilayah Indonesia: NORMAL & AMAN'}
              </h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                {latestQuake 
                  ? `Gempa bumi M ${latestQuake.Magnitude} terdeteksi di ${latestQuake.Wilayah} (${latestQuake.Jam}). ${latestQuake.Potensi}`
                  : 'Hasil pemantauan 842 stasiun seismograf BMKG menunjukkan kondisi pesisir Indonesia aman dari ancaman tsunami.'}
              </p>
            </div>
          </div>

          {/* Quick Direct Call Emergency Buttons */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-alert-rose" /> Panggilan Darurat Siaga (Direct Call 24 Jam)
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              <button 
                onClick={() => handleDirectDial('115')}
                className="bg-alert-rose/10 hover:bg-alert-rose text-alert-rose hover:text-white border border-alert-rose/30 p-3 rounded-2xl transition-all text-center flex flex-col items-center justify-center group shadow-xs"
              >
                <span className="font-black text-lg group-hover:scale-110 transition-transform">115</span>
                <span className="text-[10px] font-bold mt-0.5">Basarnas SAR</span>
              </button>

              <button 
                onClick={() => handleDirectDial('117')}
                className="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 p-3 rounded-2xl transition-all text-center flex flex-col items-center justify-center group shadow-xs"
              >
                <span className="font-black text-lg group-hover:scale-110 transition-transform">117</span>
                <span className="text-[10px] font-bold mt-0.5">BNPB Pusat</span>
              </button>

              <button 
                onClick={() => handleDirectDial('119')}
                className="bg-warning-amber/10 hover:bg-warning-amber text-warning-amber hover:text-white border border-warning-amber/30 p-3 rounded-2xl transition-all text-center flex flex-col items-center justify-center group shadow-xs"
              >
                <span className="font-black text-lg group-hover:scale-110 transition-transform">119</span>
                <span className="text-[10px] font-bold mt-0.5">Ambulans Medis</span>
              </button>
            </div>
          </div>

          {/* 3 Steps Readiness Protocol */}
          <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-border space-y-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-primary" /> Protokol Utama Kesiapsiagaan Diri
            </h3>
            
            <ul className="text-xs text-on-surface-variant space-y-2 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span><strong>Saat Gempa:</strong> Lakukan prinsip <em>Merunduk, Lindungi Kepala, dan Berpegangan</em> di bawah meja yang kokoh.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span><strong>Tanda Tsunami:</strong> Jika air laut surut tiba-tiba setelah gempa kuat, segera lari menuju area tinggi di atas 20 meter.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span><strong>Tas Siaga Bencana:</strong> Pastikan ransel darurat berisi air, makanan, P3K, dan dokumen penting telah disiapkan.</span>
              </li>
            </ul>
          </div>

          {/* Sound & Notification Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-surface-border text-xs">
            <div className="flex items-center gap-2.5">
              {soundAlert ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-text-muted" />}
              <div>
                <span className="font-bold text-on-surface">Sirine Alarm Suara Darurat</span>
                <p className="text-[11px] text-text-muted">Bunyikan alarm saat ada gempa M 6.0+</p>
              </div>
            </div>

            <input 
              type="checkbox" 
              checked={soundAlert}
              onChange={(e) => setSoundAlert(e.target.checked)}
              className="w-4 h-4 accent-primary rounded cursor-pointer"
            />
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
