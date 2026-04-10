import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import ChatWidget from '../ChatWidget/ChatWidget';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        <Outlet />
      </main>
      <ChatWidget />
    </div>
  );
}
