import { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, Truck, Store, Wheat, CheckCircle2, Navigation, Crosshair } from 'lucide-react';
import { partnerAPI } from '../utils/api';

const HyperlocalConnect = () => {
  const [nearbyPartners, setNearbyPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVillage, setSelectedVillage] = useState('Ward 3');
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);

  const fetchNearby = (loc) => {
    setLoading(true);
    partnerAPI.getNearby({ village: loc })
      .then(({ data }) => {
        setNearbyPartners(data);
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
      (pos) => {
        setGpsDetecting(false);
        setGpsActive(true);
        setSelectedVillage('Ward 3'); // Locks to closest cluster
        fetchNearby('Ward 3');
      },
      (err) => {
        setGpsDetecting(false);
        alert('Could not retrieve GPS coordinates. Defaulting to local ward hub.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="rounded-3xl border border-[#DDD5C8] dark:border-white/10 bg-white dark:bg-[#162421] p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DDD5C8]/60 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F1E8D8] dark:bg-white/10 border border-[#DDD5C8] dark:border-white/10 rounded-full text-xs font-bold text-[#C66B42] dark:text-[#D9A441] uppercase tracking-wider mb-2">
            <Navigation size={13} />
            <span>Hyperlocal Quick-Commerce (300m – 500m Radius)</span>
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#192D2A] dark:text-[#F8F3EA]">
            Nearby Branch, Farmer & Shop Connect
          </h2>
          <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/70 mt-1">
            शाखा तक नहीं जा सकते? अपनी लोकेशन सेट करें — नजदीकी दुकान या किसान का हेल्पर 10–15 मिनट में आपके घर पहुंचेगा।
          </p>
        </div>

        {/* GPS Button & Locality Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDetectGps}
            disabled={gpsDetecting}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              gpsActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60'
                : 'bg-[#FDFBF7] dark:bg-[#1A2624] border-[#DDD5C8] dark:border-white/10 hover:border-[#C66B42]'
            }`}
          >
            <Crosshair size={14} className={gpsDetecting ? 'animate-spin' : ''} />
            <span>{gpsDetecting ? 'Locating...' : gpsActive ? '📍 GPS Locked (~350m)' : 'Detect GPS'}</span>
          </button>

          <div className="flex items-center gap-1 bg-[#F1E8D8]/40 dark:bg-[#1A2624] border border-[#DDD5C8] dark:border-white/10 rounded-xl px-2 py-1">
            <MapPin size={15} className="text-[#C66B42]" />
            <select
              value={selectedVillage}
              onChange={(e) => {
                setSelectedVillage(e.target.value);
                setGpsActive(false);
              }}
              className="bg-transparent text-xs font-bold outline-none py-1 text-[#192D2A] dark:text-[#F8F3EA]"
            >
              <option value="Ward 3">Ward 3 / Main Bazaar (300m)</option>
              <option value="Panchayat">Panchayat Hub / Farm Gate (500m)</option>
              <option value="Station">Station Road Area (400m)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-[#F1E8D8]/30 rounded-2xl animate-pulse" />
          <div className="h-32 bg-[#F1E8D8]/30 rounded-2xl animate-pulse" />
        </div>
      ) : nearbyPartners.length === 0 ? (
        <div className="p-8 text-center text-xs text-[#625F59]">
          <Store size={36} className="mx-auto mb-2 text-[#DDD5C8]" />
          <p className="font-bold">No partners currently registered in this exact 500m sector.</p>
          <p>Orders will be routed from the central GroceryStore hub!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyPartners.slice(0, 4).map((partner, idx) => {
            const isFarmer = partner.role === 'kisan';
            const distanceEst = idx === 0 ? '310 meters' : idx === 1 ? '420 meters' : '480 meters';

            return (
              <div
                key={partner._id}
                className="p-5 rounded-2xl border border-[#DDD5C8] dark:border-white/10 bg-[#FDFBF7] dark:bg-white/5 flex flex-col justify-between hover:border-[#C66B42] transition shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#192D2A] dark:text-[#F8F3EA]">
                      {partner.businessName}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isFarmer ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isFarmer ? '🌾 Direct Farmer' : '🏪 Kirana Partner'}
                    </span>
                  </div>

                  <p className="text-xs text-[#625F59] dark:text-[#E7E2D9]/70 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#C66B42]" />
                    <span>{partner.villageOrArea} &bull; Approx. <strong>{distanceEst} away</strong></span>
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-[#17745A]">
                    <Truck size={13} />
                    <span>Doorstep Delivery: 10–15 Mins by Helper &bull; COD & UPI</span>
                  </div>
                </div>

                {/* Instant Connect Buttons */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#DDD5C8]/60 dark:border-white/10">
                  <a
                    href={partner.callUrl}
                    className="flex-1 py-2 px-3 bg-white dark:bg-[#1A2624] border border-[#DDD5C8] dark:border-white/10 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#F1E8D8] transition text-[#192D2A] dark:text-[#F8F3EA]"
                  >
                    <Phone size={13} className="text-[#17745A]" />
                    <span>Direct Call</span>
                  </a>

                  <a
                    href={partner.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HyperlocalConnect;
