import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import heroImg from '../assets/hero2.jpg';

const HomePage = () => {
  const [artikelData, setArtikelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtikel, setSelectedArtikel] = useState(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPohon: 0,
    totalPohonPerUser: [],
  });

  useEffect(() => {
    const fetchArtikelData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:8000/api/artikel/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data artikel');
        }

        const result = await response.json();
        if (result.success) {
          setArtikelData(result.data.slice(0, 3)); // hanya tampilkan 3
        } else {
          throw new Error('Gagal memuat artikel');
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setArtikelData([]);
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data statistik');
        }

        const result = await response.json();
        if (result.status === 'success') {
          setStats(result.data);
        }
      } catch (err) {
        console.error('Gagal mengambil data statistik:', err);
      }
    };

    fetchArtikelData();
    fetchStats();
  }, []);

  const defaultImage =
    'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

  const handleArtikelClick = (artikel) => {
    setSelectedArtikel(artikel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackClick = () => {
    setSelectedArtikel(null);
  };

  if (loading) return <div className="loading">Memuat data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <section className="hero-section" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Reforest</h1>
            <p className="hero-subtitle">Menanam Harapan, Menjaga Kelestarian</p>
            <p className="hero-description">
              Bergabunglah dalam misi global melawan perubahan iklim dengan aksi nyata.
              Reforest mempermudah Anda mendokumentasikan setiap pohon yang ditanam,
              memantau pertumbuhannya, dan melihat dampak kontribusi Anda terhadap kelestarian bumi.
            </p>
            <Link to="/pohonku">
              <button className="cta-button">Mulai Menanam</button>
            </Link>
          </div>
        </div>
      </section>

      <div className="homepage">
        {/* TAMPILAN DETAIL ARTIKEL */}
        {selectedArtikel ? (
          <section className="artikel-detail-section">
            <button onClick={handleBackClick} className="btn-kembali">← Kembali</button>
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
            <div className="article-meta">
              {selectedArtikel.created_at && (
                <span>
                  📅{' '}
                  {new Date(selectedArtikel.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
            <hr />
          </section>
        ) : (
          <>
            {/* LIST ARTIKEL */}
            <section className="articles-section">
              <h2>ARTIKEL</h2>
              <div className="articles-grid">
                {artikelData.map((article) => (
                  <article
                    key={article.id}
                    className="article-card"
                    onClick={() => handleArtikelClick(article)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="article-image">
                      <img
                        src={
                          article.images && article.images.length > 0
                            ? article.images[0].image_url
                            : defaultImage
                        }
                        alt={article.title || 'Gambar Artikel'}
                        onError={(e) => (e.target.src = defaultImage)}
                      />
                    </div>
                    <div className="article-content">
                      <h3>{article.title || 'Judul Artikel'}</h3>
                      <p>
                        {article.isi
                          ? article.isi.length > 150
                            ? article.isi.substring(0, 150) + '...'
                            : article.isi
                          : 'Deskripsi artikel tidak tersedia'}
                      </p>
                      <div className="article-meta">
                        {article.created_at && (
                          <span>
                            📅{' '}
                            {new Date(article.created_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <Link to="/artikel" className="read-more-link">
                Read More
              </Link>
            </section>

            {/* STATISTIK */}
            <section className="stats-section">
              <h2>Statistik Reforest</h2>
              <div className="stats">
                <div className="stat-item">
                  <h3>Total User</h3>
                  <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-item">
                  <h3>Total Pohon</h3>
                  <p>{stats.totalPohon}</p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

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
