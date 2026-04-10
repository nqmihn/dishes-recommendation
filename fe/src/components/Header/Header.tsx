import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <UtensilsCrossed size={28} />
          <span>FoodMenu</span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className="header-link">
            Trang chủ
          </Link>
        </nav>
      </div>
    </header>
  );
}
