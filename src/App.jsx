import { useState } from 'react';
import APOD from './components/APOD';
import MarsRover from './components/MarsRover';
import Asteroids from './components/Asteroids';
import EarthView from './components/EarthView';
import './index.css';

const TABS = [
  { id: 'apod', label: '🖼️ NASA Gallery' },
  { id: 'mars', label: '🚀 Rocket Launches' },
  { id: 'neo', label: '🌍 Earth from DSCOVR' },
  { id: 'earth', label: '🛸 Space Missions' },
];

export default function App() {
  const [tab, setTab] = useState('apod');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">COSMIC EXPLORER</span>
        </div>
        <div className="header-date">
          <div>{dateStr}</div>
          <div style={{ fontSize: 11, marginTop: 2, opacity: 0.6 }}>Powered by NASA Open APIs</div>
        </div>
      </header>

      <nav className="nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nav-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="main">
        {tab === 'apod' && <APOD />}
        {tab === 'mars' && <MarsRover />}
        {tab === 'neo' && <Asteroids />}
        {tab === 'earth' && <EarthView />}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-muted)',
        fontSize: 12,
      }}>
        Data provided by{' '}
        <a
          href="https://api.nasa.gov"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
        >
          NASA Open APIs
        </a>
        {' '}· Free & no authentication required
      </footer>
    </div>
  );
}
