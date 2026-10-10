import { Link } from 'react-router-dom';
import { Mail, Phone, ShieldCheck, Sparkles, ChefHat, Truck, LayoutDashboard } from 'lucide-react';
import Brand from './Brand';

const Footer = () => (
  <footer className="mt-20 border-t border-emerald-900/10 bg-[#075F46] px-4 py-14 text-emerald-50">
    <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <Brand inverted className="mb-5" />
        <p className="max-w-sm text-sm font-medium leading-relaxed text-emerald-100/80">
          Smart farm-to-fork grocery platform delivering certified organic produce, 1-click recipe cook kits, and intelligent zero-waste markdowns across India.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-emerald-100">
          <ShieldCheck size={16} /> 100% Protected Gateway & OTP Delivery
        </div>
      </div>

      <div>
        <h4 className="mb-4 font-black text-white text-base">Shop & Discover</h4>
        <ul className="space-y-3 text-sm font-semibold text-emerald-100/80">
          <li><Link to="/shop" className="hover:text-white transition">All Grocery Aisles</Link></li>
          <li><Link to="/bundles" className="hover:text-white transition flex items-center gap-1.5"><ChefHat size={14} /> 1-Click Recipe Kits</Link></li>
          <li><Link to="/waste-center" className="hover:text-white transition flex items-center gap-1.5"><Sparkles size={14} /> Freshness & Waste Radar</Link></li>
          <li><Link to="/track" className="hover:text-white transition flex items-center gap-1.5"><Truck size={14} /> Track Order Live</Link></li>
          <li><Link to="/watchlist" className="hover:text-white transition">My Watchlist</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-4 font-black text-white text-base">Store Operations</h4>
        <ul className="space-y-3 text-sm font-semibold text-emerald-100/80">
          <li><Link to="/admin" className="hover:text-white transition flex items-center gap-1.5"><LayoutDashboard size={14} /> Admin Dashboard</Link></li>
          <li><Link to="/delivery" className="hover:text-white transition flex items-center gap-1.5"><Truck size={14} /> Delivery Partner Terminal</Link></li>
          <li><Link to="/waste-center" className="hover:text-white transition">FEFO Batch Management</Link></li>
          <li><Link to="/orders" className="hover:text-white transition">Customer Purchases</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-4 font-black text-white text-base">Help & Support</h4>
        <a href="mailto:support@taazadaily.in" className="mb-3 flex items-center gap-3 text-sm font-semibold text-emerald-100/80 hover:text-white transition">
          <Mail size={17} /> support@taazadaily.in
        </a>
        <a href="tel:+919876543210" className="flex items-center gap-3 text-sm font-semibold text-emerald-100/80 hover:text-white transition">
          <Phone size={17} /> +91 98765 43210
        </a>
        <div className="mt-6 rounded-2xl bg-white/10 p-4 border border-white/10 backdrop-blur">
          <p className="text-sm font-black text-white">Daily Freshness Promise</p>
          <p className="mt-1 text-xs font-medium leading-5 text-emerald-100/75">
            Sourced directly from verified mandis and orchards in Nashik, Pune and Himachal.
          </p>
        </div>
      </div>
    </div>

    <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-center text-xs font-semibold text-emerald-100/60">
      © {new Date().getFullYear()} TaazaDaily — Smart Farm-to-Fork Grocery Commerce Platform. All rights reserved.
    </div>
  </footer>
);

export default Footer;
