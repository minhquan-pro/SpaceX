import { useState, useEffect } from 'react';
import { searchNASAImages } from '../api/nasa';

const TOPICS = [
  { label: '🌌 Galaxy', query: 'galaxy' },
  { label: '🪐 Saturn', query: 'saturn' },
  { label: '⭐ Nebula', query: 'nebula' },
  { label: '🔭 Hubble', query: 'hubble telescope' },
  { label: '🌙 Moon', query: 'moon surface' },
  { label: '🔴 Mars', query: 'mars landscape' },
  { label: '☀️ Sun', query: 'solar flare sun' },
  { label: '🌠 Supernova', query: 'supernova explosion' },
  { label: '🟠 Jupiter', query: 'jupiter' },
  { label: '🌑 Black Hole', query: 'black hole' },
];

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('galaxy');
  const [inputVal, setInputVal] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImg, setSelectedImg] = useState(null);

  const fetchImages = async (q, p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchNASAImages(q, p, 24);
      const items = res.data.collection.items || [];
      const total = res.data.collection.metadata?.total_hits || 0;
      setImages(items.filter(i => i.links?.length > 0));
      setTotalPages(Math.min(Math.ceil(total / 24), 20));
    } catch {
      setError('Failed to load NASA images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages('galaxy', 1); }, []);

  const handleTopic = (q) => {
    setQuery(q);
    setPage(1);
    setInputVal('');
    fetchImages(q, 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setQuery(inputVal.trim());
    setPage(1);
    fetchImages(inputVal.trim(), 1);
  };

  const handlePage = (p) => {
    setPage(p);
    fetchImages(query, p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fade-in">
      <div className="section-header">
        <div className="section-title">🖼️ NASA Image Gallery</div>
        <div className="section-subtitle">Search NASA's entire image library — over 140,000 space photos</div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          type="text"
          className="date-input"
          style={{ flex: 1, maxWidth: 400 }}
          placeholder="Search: nebula, apollo, saturn..."
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">🔍 Search</button>
      </form>

      {/* Topic pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {TOPICS.map(t => (
          <button
            key={t.query}
            className={`btn ${query === t.query ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '5px 14px', fontSize: 12 }}
            onClick={() => handleTopic(t.query)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loader">
          <div className="loader-ring" />
          <span>Loading from NASA archives...</span>
        </div>
      )}

      {error && !loading && (
        <div className="error-state">
          <div className="error-icon">🔭</div>
          <div>{error}</div>
          <button className="btn btn-primary" onClick={() => fetchImages(query, page)}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}>
            {images.map((item, i) => {
              const data = item.data[0];
              const thumb = item.links[0].href;
              return (
                <div
                  key={data.nasa_id || i}
                  onClick={() => setSelectedImg(item)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
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
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#000' }}>
                    <img
                      src={thumb}
                      alt={data.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = ''}
                      onError={e => { e.target.src = ''; e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;background:#1a1a2e;display:flex;align-items:center;justify-content:center;font-size:32px">🌌</div>'; }}
                    />
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {data.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      {data.date_created?.substring(0, 10)} · {data.center}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
              <button className="btn btn-secondary" onClick={() => handlePage(page - 1)} disabled={page === 1}>← Prev</button>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Page {page} / {totalPages}</span>
              <button className="btn btn-secondary" onClick={() => handlePage(page + 1)} disabled={page === totalPages}>Next →</button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selectedImg && (
        <div className="modal-overlay" onClick={() => setSelectedImg(null)}>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}
          >
            <img
              className="modal-img"
              src={selectedImg.links[0].href}
              alt={selectedImg.data[0].title}
            />
            <div style={{ textAlign: 'center', maxWidth: 600 }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{selectedImg.data[0].title}</div>
              <div style={{ fontSize: 12, color: '#b0bec5', lineHeight: 1.7 }}>
                {selectedImg.data[0].description?.substring(0, 280)}...
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                {selectedImg.data[0].date_created?.substring(0, 10)} · {selectedImg.data[0].center}
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => setSelectedImg(null)} style={{ fontSize: 12 }}>✕ Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
