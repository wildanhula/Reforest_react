import React, { useState, useEffect } from 'react';
import './artikel.css';

const Artikel = () => {
  const [artikelData, setArtikelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/artikel/all');
        if (!response.ok) throw new Error('Gagal mengambil data dari API');
        const result = await response.json();
        if (result.status === 'Success') {
          setArtikelData(result.data.artikel);
        } else {
          throw new Error(result.message || 'Terjadi kesalahan pada server');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultImage = 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

  if (loading) return <div className="loading">Memuat data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <div className="artikel-container">
        <h1 className="judul-artikel">Artikel Terbaru</h1>
        <div className="artikel-grid">
          {artikelData.length > 0 ? (
            artikelData.map((artikel) => (
              <div className="pohon-item" key={artikel.id}>
                <div className="pohon-image-container">
                  <img
                    src={artikel.gambar || defaultImage}
                    alt={artikel.title || 'Gambar'}
                    className="pohon-image"
                    onError={(e) => { e.target.src = defaultImage }}
                  />
                </div>
                <div className="pohon-content">
                  <h2>{artikel.title || artikel.nama || 'Tanpa Judul'}</h2>
                  <p>{artikel.deskripsi || artikel.isi || 'Tidak ada konten'}</p>
                  <div className="pohon-meta">
                    {artikel.lokasi && <span>📍 {artikel.lokasi}</span>}
                    {artikel.tanggal_publikasi && (
                      <span>📅 {new Date(artikel.tanggal_publikasi).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-message">Tidak ada artikel tersedia</div>
          )}
        </div>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <span>Syarat & Ketentuan</span>
          <a href="/faq">FAQ</a>
          <span>Kontak</span>
          <span>Offline</span>
        </div>
        <div className="footer-copy">
          © 2024 Reforest. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Artikel;
