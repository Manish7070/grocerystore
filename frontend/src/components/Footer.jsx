import { Link } from 'react-router-dom';
import { Mail, Phone, ShieldCheck } from 'lucide-react';
import Brand from './Brand';

const Footer = () => (
  <footer className="mt-20 border-t border-emerald-900/10 bg-[#0b3520] px-4 py-12 text-emerald-50">
    <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <Brand inverted className="mb-5" />
        <p className="max-w-sm text-sm font-medium leading-7 text-emerald-100/80">
          Fresh groceries, a simple checkout, and dependable everyday essentials in one thoughtfully designed shopping experience.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-emerald-100">
          <ShieldCheck size={16} /> Secure checkout & protected account
        </div>
      </div>
      <div>
        <h4 className="mb-4 font-black text-white">Quick Links</h4>
        <ul className="space-y-3 text-sm font-semibold text-emerald-100/75">
          <li><Link to="/" className="hover:text-white">Home</Link></li>
          <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
          <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
          <li><Link to="/watchlist" className="hover:text-white">Watchlist</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-4 font-black text-white">Categories</h4>
        <ul className="space-y-3 text-sm font-semibold text-emerald-100/75">
          {['Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Snacks', 'Rice'].map((category) => (
            <li key={category}><Link to={`/?search=${encodeURIComponent(category)}#shop`} className="hover:text-white">{category}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="mb-4 font-black text-white">Contact</h4>
        <a href="mailto:hello@greenbasket.in" className="mb-3 flex items-center gap-3 text-sm font-semibold text-emerald-100/75 hover:text-white">
          <Mail size={17} /> hello@greenbasket.in
        </a>
        <a href="tel:+919876543210" className="flex items-center gap-3 text-sm font-semibold text-emerald-100/75 hover:text-white">
          <Phone size={17} /> +91 98765 43210
        </a>
        <div className="mt-6 rounded-2xl bg-white/10 p-4">
          <p className="text-sm font-black text-white">Fresh offers every day</p>
          <p className="mt-1 text-xs font-medium leading-5 text-emerald-100/75">Seasonal deals and carefully selected weekly baskets.</p>
        </div>
      </div>
    </div>
    <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center text-sm font-semibold text-emerald-100/60">
      © 2026 GreenBasket – Online Grocery Store. Original brand identity and content.
    </div>
  </footer>
);

export default Footer;
