import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    <section className="relative overflow-hidden rounded-3xl border border-[#E7DFC6] bg-gradient-to-br from-[#FAF7F0] via-[#F4EFE6] to-[#ECE5D8] p-6 sm:p-10 shadow-lg transition-all duration-300 dark:border-[#30483C] dark:from-[#0B1714] dark:via-[#10221B] dark:to-[#0B1714]">
      {/* Decorative Orchard Atmosphere Background Ambient Glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl dark:bg-[#55D6A0]/10" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-amber-400/15 blur-3xl dark:bg-[#E6BC70]/10" />

      {/* Top Banner Row */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div className="max-w-3xl space-y-3">
          {/* Top Category Badge - Modern Geometric Tag */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm dark:bg-[#172C24] dark:border dark:border-[#30483C] dark:text-[#55D6A0]">
              <Sprout size={14} className="text-emerald-200 dark:text-[#55D6A0]" />
              <span>Hyperlocal Express</span>
              <span className="text-emerald-300 dark:text-[#55D6A0] opacity-60">•</span>
              <span className="text-emerald-100 dark:text-[#F3F0E6] font-semibold">300m – 500m Sector</span>
            </span>

            <button
              type="button"
              onClick={() => setShowHindi((v) => !v)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[#DDD5C8] dark:border-[#30483C] bg-white/90 dark:bg-[#172C24] text-[#5A554E] dark:text-[#B6C7BD] hover:text-emerald-700 dark:hover:text-[#55D6A0] hover:border-emerald-500 dark:hover:border-[#55D6A0]/50 transition shadow-xs"
            >
              {showHindi ? 'English Mode' : 'हिंदी में देखें'}
            </button>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-[#1C332D] dark:text-[#F3F0E6] leading-[1.15]">
            Nearby Orchard &amp; Merchant Dispatch
          </h2>

          <p className="text-sm sm:text-base text-[#666056] dark:text-[#B6C7BD] leading-relaxed max-w-2xl font-normal">
            {showHindi
              ? 'शाखा तक नहीं जा सकते? अपनी लोकेशन सेट करें — नजदीकी दुकान या किसान का हेल्पर 10–15 मिनट में आपके घर पहुंचेगा।'
              : 'Fresh groceries from verified local orchards and neighborhood merchants, delivered to your doorstep in 10–15 minutes.'}
          </p>

          {/* 4 Feature Badges Row - Clean Modern Boxes */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 dark:bg-[#172C24]/90 border border-[#E2DAD0] dark:border-[#30483C] px-3 py-1.5 text-xs font-semibold text-[#2D3F3A] dark:text-[#F3F0E6] shadow-xs">
              <Truck size={14} className="text-emerald-600 dark:text-[#55D6A0]" />
              10–15 Mins Dispatch
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 dark:bg-[#172C24]/90 border border-[#E2DAD0] dark:border-[#30483C] px-3 py-1.5 text-xs font-semibold text-[#2D3F3A] dark:text-[#F3F0E6] shadow-xs">
              <ShieldCheck size={14} className="text-emerald-600 dark:text-[#55D6A0]" />
              Verified Local Partners
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 dark:bg-[#172C24]/90 border border-[#E2DAD0] dark:border-[#30483C] px-3 py-1.5 text-xs font-semibold text-[#2D3F3A] dark:text-[#F3F0E6] shadow-xs">
              <Sprout size={14} className="text-emerald-600 dark:text-[#55D6A0]" />
              Farm Fresh Quality Produce
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 dark:bg-[#172C24]/90 border border-[#E2DAD0] dark:border-[#30483C] px-3 py-1.5 text-xs font-semibold text-[#2D3F3A] dark:text-[#F3F0E6] shadow-xs">
              <Store size={14} className="text-emerald-600 dark:text-[#55D6A0]" />
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
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all duration-200 shadow-xs ${
              gpsActive
                ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-[#55D6A0] dark:text-[#0B1714] dark:border-[#55D6A0] shadow-md'
                : 'bg-white dark:bg-[#172C24] text-[#192D2A] dark:text-[#F3F0E6] border-[#DDD5C8] dark:border-[#30483C] hover:border-emerald-600 dark:hover:border-[#55D6A0]/50 hover:shadow'
            }`}
          >
            <Crosshair size={15} className={gpsDetecting ? 'animate-spin text-emerald-600 dark:text-[#55D6A0]' : 'text-emerald-600 dark:text-[#55D6A0]'} />
            <span>{gpsDetecting ? 'Locating Sector...' : gpsActive ? 'GPS Active (350m)' : 'Detect My Location'}</span>
          </button>

          <div className="flex items-center gap-2 bg-white dark:bg-[#172C24] border border-[#DDD5C8] dark:border-[#30483C] rounded-xl px-3.5 py-2 shadow-xs">
            <MapPin size={15} className="text-emerald-600 dark:text-[#55D6A0] shrink-0" />
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              aria-label="Filter neighborhood branch"
              className="bg-transparent text-xs font-bold text-[#192D2A] dark:text-[#F3F0E6] outline-none cursor-pointer pr-1"
            >
              <option value="Ward 3" className="dark:bg-[#172C24]">Ward 3 / Main Bazaar (300m)</option>
              <option value="Panchayat Hub" className="dark:bg-[#172C24]">Panchayat Hub / Farm Gate (500m)</option>
              <option value="Station Road" className="dark:bg-[#172C24]">Station Road Area (400m)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Symmetrical Wide Cards from MongoDB Atlas */}
      {loading ? (
        <div className="relative z-10 grid gap-6 lg:grid-cols-2">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2DBD0] bg-white p-5 dark:border-[#30483C] dark:bg-[#172C24] animate-pulse"
            >
              <div className="flex flex-col sm:flex-row gap-5 items-stretch">
                <div className="w-full sm:w-52 h-52 shrink-0 rounded-xl bg-gray-200 dark:bg-[#10221B]" />
                <div className="flex flex-1 flex-col justify-between min-h-[208px] py-1 space-y-3">
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-[#20392F]" />
                    <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-[#20392F]" />
                    <div className="h-7 w-2/3 rounded-lg bg-gray-200 dark:bg-[#20392F] mt-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="h-9 rounded-xl bg-gray-200 dark:bg-[#20392F]" />
                    <div className="h-9 rounded-xl bg-gray-200 dark:bg-[#20392F]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : nearbyPartners.length === 0 ? (
        <div className="relative z-10 rounded-2xl border border-dashed border-[#DDD5C8] dark:border-[#30483C] bg-white/70 dark:bg-[#172C24]/70 p-8 sm:p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-[#20392F] dark:text-[#55D6A0] mb-4">
            <Store size={26} />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#192D2A] dark:text-[#F3F0E6]">
            No verified partner in {selectedVillage} yet
          </h3>
          <p className="mt-2 text-sm text-[#666056] dark:text-[#B6C7BD] max-w-md mx-auto">
            Are you an organic farmer or neighborhood kirana owner? Connect directly with 500+ local households.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/merchant/register"
              className="btn-motion inline-flex items-center gap-2 rounded-xl bg-[#17745A] dark:bg-[#55D6A0] px-5 py-2.5 text-xs font-bold text-white dark:text-[#0B1714] shadow-md transition hover:brightness-105"
            >
              <Sprout size={14} />
              <span>Register Your Farm / Store</span>
              <ArrowRight size={13} />
            </Link>
            <button
              type="button"
              onClick={() => setSelectedVillage('Ward 3')}
              className="btn-motion rounded-xl border border-[#DDD5C8] dark:border-[#30483C] bg-white dark:bg-[#20392F] px-4 py-2.5 text-xs font-semibold text-[#192D2A] dark:text-[#F3F0E6]"
            >
              View Ward 3 Partners
            </button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 grid gap-6 lg:grid-cols-2">
          {nearbyPartners.map((partner) => {
            const isFarmer = partner.role === 'kisan';
            const partnerImg = partner.image || (isFarmer
              ? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80');

            return (
              <div
                key={partner._id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-[#30483C] dark:bg-[#172C24] dark:hover:bg-[#20392F]"
              >
                <div className="flex flex-col sm:flex-row gap-5 items-stretch">
                  {/* Fixed Balanced Image Container (Strict h-52 on all cards to eliminate whitespace & stretch) */}
                  <div className="relative w-full sm:w-52 h-52 shrink-0 overflow-hidden rounded-xl bg-[#E8E2D5] dark:bg-[#10221B]">
                    <img
                      src={partnerImg}
                      alt={`${partner.businessName} photo`}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                    {/* Top Left Tag */}
                    <span
                      className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-md backdrop-blur-md px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm ${
                        isFarmer
                          ? 'bg-emerald-700/95 dark:bg-[#20392F]/90 dark:border dark:border-[#30483C] dark:text-[#55D6A0]'
                          : 'bg-amber-600/95 dark:bg-[#20392F]/90 dark:border dark:border-[#30483C] dark:text-[#E6BC70]'
                      }`}
                    >
                      {isFarmer ? <Sprout size={11} /> : <Sparkles size={11} />}
                      {partner.badge || (isFarmer ? 'Local Orchard' : 'Trusted Merchant')}
                    </span>

                    {/* Bottom Left Badge: Orders/Customers */}
                    <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                      {isFarmer ? (
                        <Users size={12} className="text-amber-300 dark:text-[#E6BC70]" />
                      ) : (
                        <ShoppingBag size={12} className="text-amber-300 dark:text-[#E6BC70]" />
                      )}
                      <span>{partner.customerCount || (isFarmer ? '500+ Happy Customers' : '1K+ Orders Delivered')}</span>
                    </div>
                  </div>

                  {/* Right Details — Equal height with action buttons anchored at bottom */}
                  <div className="flex flex-1 flex-col justify-between min-h-[208px] py-0.5">
                    <div>
                      {/* Title & Tag */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#192D2A] dark:text-[#F3F0E6] capitalize">
                            {partner.businessName}
                          </h3>
                          {partner.isVerified && (
                            <CheckCircle2 size={16} className="text-emerald-500 dark:text-[#55D6A0] fill-emerald-100 dark:fill-[#20392F] shrink-0" />
                          )}
                        </div>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 border ${
                            isFarmer
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-[#20392F] dark:text-[#55D6A0] dark:border-[#30483C]'
                              : 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-[#20392F] dark:text-sky-300 dark:border-[#30483C]'
                          }`}
                        >
                          {partner.categoryTag || (isFarmer ? 'Direct Orchard' : 'Merchant Partner')}
                        </span>
                      </div>

                      {/* Subtitle / Location */}
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#706A62] dark:text-[#B6C7BD] font-medium">
                        <MapPin size={12} className="text-emerald-600 dark:text-[#55D6A0] shrink-0" />
                        <span>{partner.villageOrArea}</span>
                      </p>

                      {/* Metrics Badges */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F2EB] px-2.5 py-1 text-xs font-semibold text-[#2D3F3A] dark:bg-[#20392F] dark:text-[#F3F0E6]">
                          <Clock size={13} className="text-emerald-600 dark:text-[#55D6A0]" />
                          {partner.deliveryEstimate || '10–15 Mins Doorstep Dispatch'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5F2EB] px-2.5 py-1 text-xs font-semibold text-[#2D3F3A] dark:bg-[#20392F] dark:text-[#F3F0E6]">
                          {isFarmer ? (
                            <Sprout size={13} className="text-emerald-600 dark:text-[#55D6A0]" />
                          ) : (
                            <Store size={13} className="text-emerald-600 dark:text-[#55D6A0]" />
                          )}
                          {partner.sourceTag || (isFarmer ? '100% Fresh Locally Sourced' : 'Wide Variety Daily Essentials')}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons — Symmetrically Aligned with Motion */}
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <a
                        href={partner.callUrl || `tel:${partner.phone}`}
                        className="btn-motion inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D5CDBD] bg-[#FDFBF7] px-3 py-2.5 text-xs font-bold text-[#4A4036] shadow-xs transition hover:bg-[#F3EDE2] dark:border-[#30483C] dark:bg-[#20392F] dark:text-[#F3F0E6] dark:hover:bg-[#172C24]"
                      >
                        <Phone size={13} />
                        <span>Direct Call</span>
                      </a>
                      <a
                        href={partner.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn-motion inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-105 active:scale-95 ${
                          isFarmer
                            ? 'bg-gradient-to-r from-[#D96B27] to-[#C85A1B]'
                            : 'bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-[#55D6A0] dark:to-[#42C48E] dark:text-[#0B1714]'
                        }`}
                      >
                        <MessageCircle size={14} />
                        <span>WhatsApp Order</span>
                        <ArrowRight size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default HyperlocalConnect;
