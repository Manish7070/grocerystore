import { Link } from 'react-router-dom';
import { Mail, Phone, ShieldCheck, MapPin, Truck, Award } from 'lucide-react';
import Brand from './Brand';

const Footer = () => (
  <footer className="border-t border-[#192D2A]/40 bg-[#192D2A] px-4 pt-16 pb-12 text-[#F8F3EA]">
    <div className="mx-auto max-w-7xl">
      {/* Top Four Columns Grid */}
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 pb-14 border-b border-white/15">
        {/* Brand & Editorial Philosophy */}
        <div className="space-y-4">
          <Brand inverted className="mb-2" />
          <p className="text-xs font-normal leading-relaxed text-[#E7E2D9] max-w-sm">
            Good food, beautifully everyday. Sourced directly from verified partner orchards, organic vegetable mandis, and artisan cold-press millers across India.
          </p>
          <div className="space-y-2 pt-2 text-xs text-[#E7E2D9]/90">
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-[#D9A441] shrink-0" />
              <span>Central Mandi Hub: Navi Mumbai, Maharashtra 400703</span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#D9A441] shrink-0" />
              <span>100% Certified Cold-Chain Direct Delivery</span>
            </p>
          </div>
        </div>

        {/* Shop Departments */}
        <div>
          <h4 className="font-serif text-sm font-semibold tracking-wide text-white mb-4">
            The Grocery Aisles
          </h4>
          <ul className="space-y-2.5 text-xs text-[#E7E2D9]">
            <li><Link to="/shop" className="hover:text-[#D9A441] transition">All Produce & Staples</Link></li>
            <li><Link to="/shop?category=Vegetables" className="hover:text-[#D9A441] transition">Daily Farm Vegetables</Link></li>
            <li><Link to="/shop?category=Fruits" className="hover:text-[#D9A441] transition">Seasonal Fruits & Orchards</Link></li>
            <li><Link to="/bundles" className="hover:text-[#D9A441] transition">1-Click Recipe Cook Kits</Link></li>
            <li><Link to="/waste-center" className="hover:text-[#D9A441] transition">Smart Savings (Less Waste)</Link></li>
            <li><Link to="/watchlist" className="hover:text-[#D9A441] transition">Saved Kitchen Essentials</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-serif text-sm font-semibold tracking-wide text-white mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-xs text-[#E7E2D9]">
            <li><Link to="/track" className="hover:text-[#D9A441] transition">Track Your Delivery</Link></li>
            <li><Link to="/dashboard" className="hover:text-[#D9A441] transition">Customer Account</Link></li>
            <li><Link to="/orders" className="hover:text-[#D9A441] transition">Order History & Invoices</Link></li>
            <li><a href="mailto:care@grocerystore.in" className="hover:text-[#D9A441] transition">care@grocerystore.in</a></li>
            <li><a href="tel:+919876543210" className="hover:text-[#D9A441] transition">+91 98765 43210 (8 AM – 9 PM)</a></li>
            <li><span className="text-xs text-[#E7E2D9]/70">Delivery Slots: 7:00 AM – 10:00 PM</span></li>
          </ul>
        </div>

        {/* Kitchen Journal & Newsletter */}
        <div>
          <h4 className="font-serif text-sm font-semibold tracking-wide text-white mb-2">
            The Kitchen Journal
          </h4>
          <p className="text-xs text-[#E7E2D9] leading-relaxed mb-4">
            Receive seasonal harvest releases, chef recipes, and zero-waste savings alerts directly to your inbox.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to The Kitchen Journal.');
            }}
            className="flex items-center rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-sm"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-xs text-white outline-none placeholder:text-white/60"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#C66B42] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#B9583D] transition shadow-sm"
              aria-label="Join newsletter"
            >
              Join
            </button>
          </form>
          <div className="mt-5 flex items-center gap-3 text-xs text-[#E7E2D9]">
            <span className="flex items-center gap-1.5"><Award size={14} className="text-[#D9A441]" /> Freshness Guaranteed</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Truck size={14} className="text-[#D9A441]" /> Free on ₹499+</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Payment Bar */}
      <div className="pt-8 flex flex-col items-center justify-between gap-4 text-xs font-medium text-[#E7E2D9]/80 sm:flex-row">
        <p>© {new Date().getFullYear()} GroceryStore Ltd. Registered Indian Commerce Platform. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Supported: UPI • Debit / Credit Cards • Net Banking • Cash on Delivery</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
