import { useState, useEffect } from 'react';
import { searchNASAImages } from '../api/nasa';

const MISSIONS = [
  { label: '🌙 Apollo', query: 'apollo moon landing' },
  { label: '🚀 Space Shuttle', query: 'space shuttle launch' },
  { label: '🛸 ISS', query: 'international space station' },
  { label: '🔭 James Webb', query: 'james webb telescope' },
  { label: '🪐 Voyager', query: 'voyager spacecraft' },
  { label: '🌑 Artemis', query: 'artemis moon mission' },
  { label: '🤖 Perseverance', query: 'perseverance rover mars' },
  { label: '🛰️ Hubble', query: 'hubble space telescope repair' },
];

export default function SpaceMissions() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMission, setActiveMission] = useState('apollo moon landing');
  const [selectedImg, setSelectedImg] = useState(null);

  const fetchImages = async (q) => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchNASAImages(q, 1, 20);
      setImages(res.data.collection.items.filter(i => i.links?.length > 0));
    } catch {
      setError('Failed to load mission images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages('apollo moon landing'); }, []);

  const handleMission = (q) => {
    setActiveMission(q);
    fetchImages(q);
  };

  return (
    <div className="fade-in">
      <div className="section-header">
        <div className="section-title">🛸 Space Missions</div>
        <div className="section-subtitle">Historic and current NASA mission photo archives</div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {MISSIONS.map(m => (
          <button
            key={m.query}
            className={`btn ${activeMission === m.query ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: 12 }}
            onClick={() => handleMission(m.query)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loader">
          <div className="loader-ring" />
          <span>Loading mission archive...</span>
        </div>
      )}

      {error && !loading && (
        <div className="error-state">
          <div className="error-icon">🛸</div>
          <div>{error}</div>
          <button className="btn btn-primary" onClick={() => fetchImages(activeMission)}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div style={{ columns: '3 300px', gap: 16 }}>
          {images.map((item, i) => {
            const data = item.data[0];
            return (
              <div
                key={i}
                onClick={() => setSelectedImg(item)}
                style={{
                  breakInside: 'avoid',
                  marginBottom: 16,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'inline-block',
                  width: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(179,157,219,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(179,157,219,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = '';
                }}
              >
                <img
                  src={item.links[0].href}
                  alt={data.title}
                  loading="lazy"
                  style={{ width: '100%', display: 'block' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3, color: 'var(--text-primary)' }}>
                    {data.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                    {data.date_created?.substring(0, 10)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedImg && (
        <div className="modal-overlay" onClick={() => setSelectedImg(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <img className="modal-img" src={selectedImg.links[0].href} alt={selectedImg.data[0].title} />
            <div style={{ textAlign: 'center', maxWidth: 600 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{selectedImg.data[0].title}</div>
              <div style={{ fontSize: 12, color: '#90a4ae', lineHeight: 1.6 }}>
                {selectedImg.data[0].description?.substring(0, 300)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                {selectedImg.data[0].date_created?.substring(0, 10)} · NASA {selectedImg.data[0].center}
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => setSelectedImg(null)}>✕ Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
