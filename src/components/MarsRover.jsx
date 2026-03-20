import { useState, useEffect } from 'react';
import { getUpcomingLaunches, getPastLaunches } from '../api/nasa';

const STATUS_COLOR = {
  'Go for Launch': '#4caf50',
  'Launch Successful': '#4fc3f7',
  'Launch Failure': '#ef5350',
  'To Be Confirmed': '#ffd54f',
  'To Be Determined': '#78909c',
  'In Flight': '#b39ddb',
};

function LaunchCard({ launch }) {
  const net = new Date(launch.net);
  const now = new Date();
  const isPast = net < now;
  const diff = Math.abs(net - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const statusColor = STATUS_COLOR[launch.status?.name] || 'var(--text-muted)';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(79,195,247,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 160, background: '#0d0d1a', overflow: 'hidden' }}>
        {launch.image ? (
          <img
            src={launch.image}
            alt={launch.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: 'radial-gradient(circle at center, #1a1a2e, #0a0a0f)' }}>🚀</div>
        )}
        {/* Countdown badge */}
        <div style={{
          position: 'absolute', bottom: 10, right: 10,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(79,195,247,0.3)',
          borderRadius: 8,
          padding: '4px 10px',
          fontSize: 12,
          color: isPast ? 'var(--text-muted)' : 'var(--accent-blue)',
          fontWeight: 600,
        }}>
          {isPast ? `${days}d ago` : days > 0 ? `T-${days}d ${hours}h` : `T-${hours}h`}
        </div>
      </div>

      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3, flex: 1 }}>{launch.name}</div>
          <span style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 20,
            background: `${statusColor}15`,
            color: statusColor,
            border: `1px solid ${statusColor}40`,
            whiteSpace: 'nowrap',
            fontWeight: 500,
          }}>
            {launch.status?.abbrev || '?'}
          </span>
        </div>

        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
            <span>🚀</span>
            <span>{launch.rocket?.configuration?.name || 'Unknown rocket'}</span>
          </div>
          {launch.launch_service_provider && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
              <span>🏢</span>
              <span>{launch.launch_service_provider.name}</span>
            </div>
          )}
          {launch.pad?.location && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
              <span>📍</span>
              <span>{launch.pad.location.name}</span>
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--accent-blue)', display: 'flex', gap: 6, marginTop: 2 }}>
            <span>📅</span>
            <span>{net.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })} UTC</span>
          </div>
        </div>

        {launch.mission?.description && (
          <div style={{
            marginTop: 10,
            fontSize: 12,
            color: '#90a4ae',
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {launch.mission.description}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RocketLaunches() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('upcoming');

  const fetchLaunches = async (type = tab) => {
    setLoading(true);
    setError(null);
    try {
      const res = type === 'upcoming' ? await getUpcomingLaunches(20) : await getPastLaunches(20);
      setLaunches(res.data.results || []);
    } catch {
      setError('Failed to load launch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLaunches(); }, []);

  const switchTab = (t) => {
    setTab(t);
    fetchLaunches(t);
  };

  return (
    <div className="fade-in">
      <div className="section-header">
        <div className="section-title">🚀 Rocket Launches</div>
        <div className="section-subtitle">Real-time global rocket launch tracker — powered by Launch Library 2</div>
      </div>

      {/* Stats */}
      {!loading && launches.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total', value: launches.length, icon: '🚀' },
            { label: 'Success', value: launches.filter(l => l.status?.name === 'Launch Successful').length, icon: '✅' },
            { label: 'Agencies', value: [...new Set(launches.map(l => l.launch_service_provider?.name).filter(Boolean))].length, icon: '🏢' },
            { label: 'Locations', value: [...new Set(launches.map(l => l.pad?.location?.country_code).filter(Boolean))].length, icon: '🌍' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div className="stat-value" style={{ fontSize: 24 }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button className={`btn ${tab === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => switchTab('upcoming')}>
          🔮 Upcoming
        </button>
        <button className={`btn ${tab === 'past' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => switchTab('past')}>
          📖 Recent Past
        </button>
      </div>

      {loading && (
        <div className="loader">
          <div className="loader-ring" />
          <span>Fetching launch data...</span>
        </div>
      )}

      {error && !loading && (
        <div className="error-state">
          <div className="error-icon">🚀</div>
          <div>{error}</div>
          <button className="btn btn-primary" onClick={() => fetchLaunches()}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {launches.map(l => <LaunchCard key={l.id} launch={l} />)}
        </div>
      )}
    </div>
  );
}
