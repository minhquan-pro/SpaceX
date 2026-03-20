import { useState, useEffect } from 'react';
import { getEPICImages, getEPICDates } from '../api/nasa';

export default function EarthEPIC() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('2024-01-04');
  const [selectedImg, setSelectedImg] = useState(null);

  const fetchImages = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEPICImages(date);
      setImages(res.data.slice(0, 16));
    } catch {
      setError('Failed to load EPIC images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDates = async () => {
    try {
      const res = await getEPICDates();
      const recent = res.data.slice(-30).reverse().map(d => d.date);
      setDates(recent);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchDates();
    fetchImages('2024-01-04');
  }, []);

  const handleDateChange = (d) => {
    setSelectedDate(d);
    fetchImages(d);
  };

  const getImageUrl = (img) => {
    const d = img.date.substring(0, 10).replace(/-/g, '/');
    return `https://epic.gsfc.nasa.gov/archive/natural/${d}/png/${img.image}.png`;
  };

  return (
    <div className="fade-in">
      <div className="section-header">
        <div className="section-title">🌍 Earth from DSCOVR</div>
        <div className="section-subtitle">
          Real-time Earth photos from NASA's EPIC camera aboard DSCOVR satellite — 1.5 million km away at L1
        </div>
      </div>

      {/* Info banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14,
        marginBottom: 24,
      }}>
        {[
          { icon: '🛰️', title: 'DSCOVR Satellite', desc: 'Positioned at Lagrange Point L1 between Earth and the Sun' },
          { icon: '📸', title: 'EPIC Camera', desc: '2048×2048 pixel Earth Polychromatic Imaging Camera' },
          { icon: '🌏', title: 'Full Earth Disc', desc: 'Captures a full view of Earth up to 22 times per day' },
        ].map(c => (
          <div key={c.title} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '16px',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 24 }}>{c.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Date selector */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>📅 Date:</span>
        <select
          className="select-input"
          value={selectedDate}
          onChange={e => handleDateChange(e.target.value)}
        >
          {dates.length > 0 ? dates.map(d => (
            <option key={d} value={d}>{d}</option>
          )) : (
            <option value="2024-01-04">2024-01-04</option>
          )}
        </select>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {images.length > 0 ? `${images.length} images captured` : ''}
        </span>
      </div>

      {loading && (
        <div className="loader">
          <div className="loader-ring" />
          <span>Downloading from satellite...</span>
        </div>
      )}

      {error && !loading && (
        <div className="error-state">
          <div className="error-icon">🌍</div>
          <div>{error}</div>
          <button className="btn btn-primary" onClick={() => fetchImages(selectedDate)}>Retry</button>
        </div>
      )}

      {!loading && !error && images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {images.map(img => (
            <div
              key={img.identifier}
              onClick={() => setSelectedImg(img)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(79,195,247,0.15)';
                e.currentTarget.style.borderColor = 'rgba(79,195,247,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.borderColor = '';
              }}
            >
              <div style={{ aspectRatio: '1', background: 'radial-gradient(circle at center, #0d1b4b, #000)', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={getImageUrl(img)}
                  alt="Earth from DSCOVR"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:64px">🌍</div>';
                  }}
                />
              </div>
              <div style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: 12, color: 'var(--accent-blue)', fontFamily: 'monospace' }}>
                  {img.centroid_coordinates
                    ? `${img.centroid_coordinates.lat.toFixed(1)}°, ${img.centroid_coordinates.lon.toFixed(1)}°`
                    : 'Earth'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                  {new Date(img.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImg && (
        <div className="modal-overlay" onClick={() => setSelectedImg(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }} onClick={e => e.stopPropagation()}>
            <img className="modal-img" src={getImageUrl(selectedImg)} alt="Earth" />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: 14 }}>
                {selectedImg.centroid_coordinates
                  ? `${selectedImg.centroid_coordinates.lat.toFixed(2)}°N, ${selectedImg.centroid_coordinates.lon.toFixed(2)}°E`
                  : ''}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{selectedImg.date} UTC</div>
              <div style={{ color: '#90a4ae', fontSize: 12, marginTop: 6, maxWidth: 500 }}>{selectedImg.caption}</div>
            </div>
            <button className="btn btn-secondary" onClick={() => setSelectedImg(null)} style={{ fontSize: 12 }}>✕ Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
