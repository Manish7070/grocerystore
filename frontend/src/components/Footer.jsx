import { Link } from 'react-router-dom';
import { Mail, Phone, ShieldCheck, MapPin, Truck, Award } from 'lucide-react';
import Brand from './Brand';

const Footer = () => (
  <footer className="border-t border-sandstone bg-[#35272F] px-4 pt-16 pb-12 text-ivory">
    <div className="mx-auto max-w-7xl">
      {/* Top Four Columns Grid */}
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 pb-14 border-b border-ivory/10">
        {/* Brand & Editorial Philosophy */}
        <div className="space-y-4">
          <Brand inverted className="mb-2" />
          <p className="text-xs font-normal leading-relaxed text-ivory/70 max-w-sm">
            Good food, beautifully everyday. Sourced directly from verified partner orchards, organic vegetable mandis, and artisan cold-press millers across India.
          </p>
          <div className="space-y-2 pt-2 text-[11px] text-ivory/60">
            <p className="flex items-center gap-2">
              <MapPin size={13} className="text-apricot shrink-0" />
              Central Mandi Hub: Navi Mumbai, Maharashtra 400703
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck size={13} className="text-apricot shrink-0" />
              100% Certified Cold-Chain Direct Delivery
            </p>
          </div>
        </div>

        {/* Shop Departments */}
        <div>
          <h4 className="font-serif text-sm font-semibold tracking-wide text-ivory mb-4">
            The Grocery Aisles
          </h4>
          <ul className="space-y-2.5 text-xs text-ivory/70">
            <li><Link to="/shop" className="hover:text-ivory transition">All Produce & Staples</Link></li>
            <li><Link to="/shop?category=Vegetables" className="hover:text-ivory transition">Daily Farm Vegetables</Link></li>
            <li><Link to="/shop?category=Fruits" className="hover:text-ivory transition">Seasonal Fruits & Orchards</Link></li>
            <li><Link to="/bundles" className="hover:text-ivory transition">1-Click Recipe Cook Kits</Link></li>
            <li><Link to="/waste-center" className="hover:text-ivory transition">Smart Savings (Less Waste)</Link></li>
            <li><Link to="/watchlist" className="hover:text-ivory transition">Saved Kitchen Essentials</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-serif text-sm font-semibold tracking-wide text-ivory mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-xs text-ivory/70">
            <li><Link to="/track" className="hover:text-ivory transition">Track Your Delivery</Link></li>
            <li><Link to="/dashboard" className="hover:text-ivory transition">Customer Account</Link></li>
            <li><Link to="/orders" className="hover:text-ivory transition">Order History & Invoices</Link></li>
            <li><a href="mailto:care@grocerystore.in" className="hover:text-ivory transition">care@grocerystore.in</a></li>
            <li><a href="tel:+919876543210" className="hover:text-ivory transition">+91 98765 43210 (8 AM – 9 PM)</a></li>
            <li><span className="text-[11px] text-ivory/50">Delivery Slots: 7:00 AM – 10:00 PM</span></li>
          </ul>
        </div>

        {/* Kitchen Journal & Newsletter */}
        <div>
          <h4 className="font-serif text-sm font-semibold tracking-wide text-ivory mb-2">
            The Kitchen Journal
          </h4>
          <p className="text-xs text-ivory/70 leading-relaxed mb-4">
            Receive seasonal harvest releases, chef recipes, and zero-waste savings alerts directly to your inbox.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to The Kitchen Journal.');
            }}
            className="flex items-center rounded-xl border border-ivory/20 bg-ivory/5 p-1 backdrop-blur-sm"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-xs text-ivory outline-none placeholder:text-ivory/40"
            />
            <button
              type="submit"
              className="rounded-lg bg-terracotta px-3 py-1.5 text-xs font-bold text-ivory hover:bg-[#9C432A] transition"
              aria-label="Join newsletter"
            >
              Join
            </button>
          </form>
          <div className="mt-5 flex items-center gap-3 text-[11px] text-ivory/60">
            <span className="flex items-center gap-1"><Award size={13} className="text-apricot" /> Freshness Guaranteed</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Truck size={13} className="text-apricot" /> Free on ₹499+</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal / Payment Bar */}
      <div className="pt-8 flex flex-col items-center justify-between gap-4 text-[11px] font-medium text-ivory/50 sm:flex-row">
        <p>© {new Date().getFullYear()} GroceryStore Ltd. Registered Indian Commerce Platform. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Supported: UPI • Debit / Credit Cards • Net Banking • Cash on Delivery</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
