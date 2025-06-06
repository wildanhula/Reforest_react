import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './artikel.css';

const Artikel = () => {
  const [artikelData, setArtikelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtikel, setSelectedArtikel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/artikel/all');
        if (!response.ok) throw new Error('Gagal mengambil data dari API');
        const result = await response.json();
        if (result.success) {
          setArtikelData(result.data);
        } else {
          throw new Error('Data tidak valid');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultImage =
    'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

  if (loading) return <div className="loading">Memuat data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const groupedArtikel = [];
  for (let i = 0; i < artikelData.length; i += 3) {
    groupedArtikel.push(artikelData.slice(i, i + 3));
  }

  const handleArtikelClick = (artikel) => {
    setSelectedArtikel(artikel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fungsi bantu untuk potong isi
  const truncateText = (text, maxLength) => {
    if (!text) return 'Tidak ada konten';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <>
      <div className="artikel-container">
        <h1 className="judul-artikel">Artikel Terbaru</h1>

        {/* SECTION DETAIL */}
        {selectedArtikel && (
          <div className="artikel-detail-section">
            <button onClick={() => setSelectedArtikel(null)} className="btn-kembali">← Kembali</button>
            <h2>{selectedArtikel.title}</h2>
            <img
              src={
                selectedArtikel.images && selectedArtikel.images.length > 0
                  ? selectedArtikel.images[0].image_url
                  : defaultImage
              }
              alt={selectedArtikel.title}
              className="detail-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
            <p>{selectedArtikel.isi}</p>
            <div className="pohon-meta">
              {selectedArtikel.created_at && (
                <span>
                  📅 {new Date(selectedArtikel.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
            <hr />
          </div>
        )}

        {/* LIST ARTIKEL */}
        {groupedArtikel.map((row, rowIndex) => (
          <div className="artikel-row" key={rowIndex}>
            {row.map((artikel, i) => {
              const layoutClass =
                rowIndex % 3 === 0 || rowIndex % 3 === 2
                  ? i === 1
                    ? 'panjang'
                    : 'kecil'
                  : i === 0 || i === 2
                  ? 'panjang'
                  : 'kecil';

              const gambarUrl =
                artikel.images && artikel.images.length > 0
                  ? artikel.images[0].image_url
                  : defaultImage;

              return (
                <div
                  className={`pohon-item ${layoutClass}`}
                  key={artikel.id}
                  onClick={() => handleArtikelClick(artikel)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="pohon-image-container">
                    <img
                      src={gambarUrl}
                      alt={artikel.title || 'Gambar'}
                      className="pohon-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>
                  <div className="pohon-content">
                    <h2>{artikel.title || 'Tanpa Judul'}</h2>
                    <p>{truncateText(artikel.isi, 150)}</p>
                    <div className="pohon-meta">
                      {artikel.created_at && (
                        <span>
                          📅 {new Date(artikel.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="artikel-footer">
        <div className="footer-links">
          <span>Syarat dan Ketentuan</span>
          <Link to="/faq">FAQ</Link>
          <span>Kontak</span>
          <span>Offline</span>
        </div>
        <div className="footer-copy">
          Copyright © 2024 Reforest. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Artikel;
