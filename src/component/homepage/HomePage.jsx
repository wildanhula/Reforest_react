// HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import heroImg from '../assets/hero2.jpg';

const HomePage = () => {
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
          setArtikelData(result.data.artikel.slice(0, 3));
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
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Reforest</h1>
            <p className="hero-subtitle">Menanam Harapan, Menjaga Kelestarian</p>
            <p className="hero-description">
              Bergabunglah dalam misi global melawan perubahan iklim dengan aksi nyata.
              Reforest mempermudah Anda mendokumentasikan setiap pohon yang ditanam,
              memantau pertumbuhannya, dan melihat dampak kontribusi Anda terhadap kelestarian bumi.
            </p>
            <Link to="/pohonku" style={{ textDecoration: 'none' }}>
              <button className="cta-button">Mulai Menanam</button>
            </Link>
          </div>
        </div>
      </section>

      <div className="homepage">
        <section className="articles-section">
          <h2>ARTIKEL</h2>
          <div className="articles-grid">
            {artikelData.length > 0 ? (
              artikelData.map(article => (
                <article key={article.id} className="article-card">
                  <div className="article-image">
                    <img
                      src={article.gambar || defaultImage}
                      alt={article.title || article.nama || 'Gambar Artikel'}
                      onError={e => (e.target.src = defaultImage)}
                    />
                  </div>
                  <div className="article-content">
                    <h3>{article.title || article.nama || 'Judul Artikel'}</h3>
                    <p>{article.deskripsi || article.isi || 'Deskripsi artikel tidak tersedia'}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-message">Tidak ada artikel tersedia</div>
            )}
          </div>
          <Link to="/artikel" className="read-more-link">Read More</Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
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

export default HomePage;
