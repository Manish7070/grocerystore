import { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Truck,
  ShieldCheck,
  Sprout,
  Store,
  CheckCircle2,
  Crosshair,
  Clock,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { partnerAPI } from '../utils/api';

const HyperlocalConnect = () => {
  const [nearbyPartners, setNearbyPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState('Ward 3');
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const [showHindi, setShowHindi] = useState(false);

  const fetchNearby = (loc) => {
    setLoading(true);
    partnerAPI
      .getNearby({ village: loc })
      .then(({ data }) => {
        setNearbyPartners(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load nearby partners:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNearby(selectedVillage);
  }, [selectedVillage]);

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setGpsDetecting(false);
        setGpsActive(true);
        setSelectedVillage('Ward 3');
        fetchNearby('Ward 3');
      },
      () => {
        setGpsDetecting(false);
        alert('Could not retrieve GPS coordinates. Defaulting to Ward 3.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#E7DFC6] bg-gradient-to-br from-[#FAF7F0] via-[#F4EFE6] to-[#ECE5D8] p-6 sm:p-10 shadow-lg transition-all duration-300 dark:border-[#223933] dark:from-[#101D1A] dark:via-[#132420] dark:to-[#0D1815]">
      {/* Decorative Orchard Atmosphere Background Ambient Glow & Foliage */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-amber-400/15 blur-3xl dark:bg-amber-500/10" />

      {/* Top Banner Row */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div className="max-w-3xl space-y-3">
          {/* Top Category Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 shadow-xs">
              <Sprout size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>HYPERLOCAL EXPRESS</span>
              <span className="text-emerald-400 dark:text-emerald-600">|</span>
              <span>300M – 500M SECTOR</span>
            </span>

            <button
              type="button"
              onClick={() => setShowHindi((v) => !v)}
              className="text-xs font-bold px-3 py-1 rounded-full border border-[#DDD5C8] dark:border-[#2A443E] bg-white/90 dark:bg-[#162723] text-[#5A554E] dark:text-[#CBD5E1] hover:text-emerald-700 dark:hover:text-emerald-400 transition shadow-xs"
            >
              {showHindi ? 'English Mode' : 'हिंदी में देखें'}
            </button>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#1C332D] dark:text-[#F8FAFC] leading-[1.15]">
            Nearby Orchard &amp; Merchant Dispatch
          </h2>

          <p className="text-sm sm:text-base text-[#666056] dark:text-[#94A3B8] leading-relaxed max-w-2xl font-normal">
            {showHindi
              ? 'शाखा तक नहीं जा सकते? अपनी लोकेशन सेट करें — नजदीकी दुकान या किसान का हेल्पर 10–15 मिनट में आपके घर पहुंचेगा।'
              : 'Fresh groceries from verified local orchards and neighborhood merchants, delivered to your doorstep in 10–15 minutes.'}
          </p>

          {/* 4 Feature Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-[#162622]/90 border border-[#E2DAD0] dark:border-white/10 px-3 py-1 text-xs font-semibold text-[#2D3F3A] dark:text-[#E2E8F0] shadow-xs">
              <Truck size={14} className="text-emerald-600 dark:text-emerald-400" />
              10–15 Mins Dispatch
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-[#162622]/90 border border-[#E2DAD0] dark:border-white/10 px-3 py-1 text-xs font-semibold text-[#2D3F3A] dark:text-[#E2E8F0] shadow-xs">
              <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
              Verified Local Partners
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-[#162622]/90 border border-[#E2DAD0] dark:border-white/10 px-3 py-1 text-xs font-semibold text-[#2D3F3A] dark:text-[#E2E8F0] shadow-xs">
              <Sprout size={14} className="text-emerald-600 dark:text-emerald-400" />
              Farm Fresh Quality Produce
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-[#162622]/90 border border-[#E2DAD0] dark:border-white/10 px-3 py-1 text-xs font-semibold text-[#2D3F3A] dark:text-[#E2E8F0] shadow-xs">
              <Store size={14} className="text-emerald-600 dark:text-emerald-400" />
              Nearby In Your Neighborhood
            </span>
          </div>
        </div>

        {/* Location Controls on Top Right */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start">
          <button
            type="button"
            onClick={handleDetectGps}
            disabled={gpsDetecting}
            className={`px-4 py-2.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-all duration-200 shadow-sm ${
              gpsActive
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-white dark:bg-[#162723] text-[#192D2A] dark:text-[#F8FAFC] border-[#DDD5C8] dark:border-[#2A443E] hover:border-emerald-600 hover:shadow'
            }`}
          >
            <Crosshair size={15} className={gpsDetecting ? 'animate-spin text-emerald-600' : 'text-emerald-600 dark:text-emerald-400'} />
            <span>{gpsDetecting ? 'Locating Sector...' : gpsActive ? 'GPS Active (350m)' : 'Detect My Location'}</span>
          </button>

          <div className="flex items-center gap-2 bg-white dark:bg-[#162723] border border-[#DDD5C8] dark:border-[#2A443E] rounded-full px-4 py-2 shadow-sm">
            <MapPin size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              aria-label="Filter neighborhood branch"
              className="bg-transparent text-xs font-bold text-[#192D2A] dark:text-[#F8FAFC] outline-none cursor-pointer pr-1"
            >
              <option value="Ward 3" className="dark:bg-[#13221E]">Ward 3 / Main Bazaar (300m)</option>
              <option value="Panchayat Hub" className="dark:bg-[#13221E]">Panchayat Hub / Farm Gate (500m)</option>
              <option value="Station Road" className="dark:bg-[#13221E]">Station Road Area (400m)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2 Wide Interactive Cards matching Reference Mockup */}
      <div className="relative z-10 grid gap-6 lg:grid-cols-2">
        {/* =========================================================================
            CARD 1 — RAMESH ORGANIC ORCHARDS (DIRECT FARMER)
            ========================================================================= */}
        <div className="group overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white p-4 sm:p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-[#223933] dark:bg-[#142320]">
          <div className="flex flex-col sm:flex-row gap-5 items-stretch">
            {/* Left Image with Badges */}
            <div className="relative sm:w-[42%] aspect-[4/3] sm:aspect-auto overflow-hidden rounded-2xl bg-[#E8E2D5] shrink-0">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80"
                alt="Ramesh Organic Orchards fresh harvested vegetables crate"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

              {/* Top Left Tag: LOCAL ORCHARD */}
              <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                <Sprout size={11} />
                LOCAL ORCHARD
              </span>

              {/* Bottom Left Badge: 500+ Happy Customers */}
              <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-[#192D2A] shadow-md dark:bg-[#0D1815]/90 dark:text-white">
                <div className="flex -space-x-1.5">
                  <span className="h-4 w-4 rounded-full bg-amber-400 border border-white flex items-center justify-center text-[8px] font-bold text-amber-950">R</span>
                  <span className="h-4 w-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[8px] font-bold text-white">S</span>
                  <span className="h-4 w-4 rounded-full bg-teal-600 border border-white flex items-center justify-center text-[8px] font-bold text-white">A</span>
                </div>
                <span>500+ Happy Customers</span>
              </div>
            </div>

            {/* Right Details */}
            <div className="flex flex-1 flex-col justify-between py-1">
              <div>
                {/* Title & Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#192D2A] dark:text-white">
                      Ramesh Organic Orchards
                    </h3>
                    <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-100 shrink-0" />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                    DIRECT ORCHARD
                  </span>
                </div>

                {/* Subtitle */}
                <p className="mt-1 flex items-center gap-1 text-xs text-[#706A62] dark:text-[#94A3B8] font-medium">
                  <MapPin size={12} className="text-emerald-600 shrink-0" />
                  Rampur Panchayat (Ward 3) &bull; 310 meters away
                </p>

                {/* Metrics Badges */}
                <div className="mt-3.5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F2EB] px-2.5 py-1 text-xs font-semibold text-[#2D3F3A] dark:bg-[#1A2D28] dark:text-[#E2E8F0]">
                    <Clock size={13} className="text-emerald-600 dark:text-emerald-400" />
                    10–15 Mins Doorstep Dispatch
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F2EB] px-2.5 py-1 text-xs font-semibold text-[#2D3F3A] dark:bg-[#1A2D28] dark:text-[#E2E8F0]">
                    <Sprout size={13} className="text-emerald-600 dark:text-emerald-400" />
                    100% Fresh Locally Sourced
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#D5CDBD] bg-white px-3 py-2 text-xs font-bold text-[#6B5A4B] shadow-xs transition hover:bg-[#F8F4EC] dark:border-[#2A443E] dark:bg-[#162723] dark:text-[#E2E8F0]"
                >
                  <Phone size={13} />
                  <span>Direct Call</span>
                </a>
                <a
                  href="https://wa.me/919876543210?text=Namaste%20Ramesh%20Patel%20(Kisan)%2C%20I%20want%20to%20order%20fresh%20harvest%20groceries%20from%20GroceryStore."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#D96B27] to-[#C85A1B] px-3 py-2 text-xs font-black text-white shadow-md transition hover:brightness-105 active:scale-95"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Order</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 2 — GUPTA KIRANA STORE (MERCHANT PARTNER)
            ========================================================================= */}
        <div className="group overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white p-4 sm:p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-[#223933] dark:bg-[#142320]">
          <div className="flex flex-col sm:flex-row gap-5 items-stretch">
            {/* Left Image with Badges */}
            <div className="relative sm:w-[42%] aspect-[4/3] sm:aspect-auto overflow-hidden rounded-2xl bg-[#E8E2D5] shrink-0">
              <img
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=700&q=80"
                alt="Gupta Kirana Store authentic shelves packed with groceries"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

              {/* Top Left Tag: TRUSTED MERCHANT */}
              <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-amber-600/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                <Sparkles size={11} />
                TRUSTED MERCHANT
              </span>

              {/* Bottom Left Badge: 1K+ Orders Delivered */}
              <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-[#192D2A] shadow-md dark:bg-[#0D1815]/90 dark:text-white">
                <ShoppingBag size={12} className="text-amber-600" />
                <span>1K+ Orders Delivered</span>
              </div>
            </div>

            {/* Right Details */}
            <div className="flex flex-1 flex-col justify-between py-1">
              <div>
                {/* Title & Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#192D2A] dark:text-white">
                      Gupta Kirana Store
                    </h3>
                    <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-100 shrink-0" />
                  </div>
                  <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-sky-800 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800">
                    MERCHANT PARTNER
                  </span>
                </div>

                {/* Subtitle */}
                <p className="mt-1 flex items-center gap-1 text-xs text-[#706A62] dark:text-[#94A3B8] font-medium">
                  <MapPin size={12} className="text-emerald-600 shrink-0" />
                  Ward 3 Main Bazaar (300m) &bull; 420 meters away
                </p>

                {/* Metrics Badges */}
                <div className="mt-3.5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F2EB] px-2.5 py-1 text-xs font-semibold text-[#2D3F3A] dark:bg-[#1A2D28] dark:text-[#E2E8F0]">
                    <Clock size={13} className="text-emerald-600 dark:text-emerald-400" />
                    10–15 Mins Doorstep Dispatch
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F2EB] px-2.5 py-1 text-xs font-semibold text-[#2D3F3A] dark:bg-[#1A2D28] dark:text-[#E2E8F0]">
                    <Store size={13} className="text-emerald-600 dark:text-emerald-400" />
                    Wide Variety Daily Essentials
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <a
                  href="tel:+919811122233"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#D5CDBD] bg-white px-3 py-2 text-xs font-bold text-[#6B5A4B] shadow-xs transition hover:bg-[#F8F4EC] dark:border-[#2A443E] dark:bg-[#162723] dark:text-[#E2E8F0]"
                >
                  <Phone size={13} />
                  <span>Direct Call</span>
                </a>
                <a
                  href="https://wa.me/919811122233?text=Namaste%20Suresh%20Gupta%20(Dukandar)%2C%20I%20want%20to%20order%20grocery%20from%20GroceryStore."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-2 text-xs font-black text-white shadow-md transition hover:brightness-105 active:scale-95"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Order</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HyperlocalConnect;
