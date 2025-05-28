import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import heroImg from '../assets/hero2.jpg';

const LandingPage = () => {
  const [artikelData, setArtikelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // State untuk statistik
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPohon: 0,
    totalPohonPerUser: [], // Menggunakan array kosong sebagai default
  });

  // Mengambil data artikel dan statistik dari API
  useEffect(() => {
    const fetchArtikelData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/artikel/all'); // Mengambil data artikel
        if (!response.ok) throw new Error('Gagal mengambil data dari API');
        const result = await response.json();
        if (result.status === 'Success') {
          setArtikelData(result.data.artikel.slice(0, 3));  // Menampilkan 3 artikel terakhir
        } else {
          throw new Error(result.message || 'Terjadi kesalahan pada server');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);  // Menangani error jika gagal mengambil data artikel
        setLoading(false);
      }
    };

    // Mengambil data statistik
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/stats'); // Mengambil statistik
        if (!response.ok) throw new Error('Gagal mengambil data statistik');
        const result = await response.json();
        console.log(result);  // Debugging: Memeriksa data yang diterima dari API
        if (result.status === 'success') {
          setStats(result.data);  // Menyimpan data statistik ke state
        } else {
          throw new Error(result.message || 'Terjadi kesalahan pada server');
        }
      } catch (err) {
        console.error('Error fetching stats:', err);  // Menangani error jika gagal mengambil data statistik
      }
    };

    fetchArtikelData(); // Panggil fungsi untuk mengambil artikel
    fetchStats(); // Panggil fungsi untuk mengambil statistik
  }, []); // [] memastikan hanya dipanggil sekali setelah render pertama

  const defaultImage = 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

  // Jika masih memuat data, tampilkan loading
  if (loading) return <div className="loading">Memuat data...</div>;
  // Jika ada error, tampilkan pesan error
  if (error) return <div className="error">Error: {error}</div>;

  console.log(stats); // Debugging: Memeriksa nilai state stats

  return (
    <>
      {/* Tombol Login dan Register */}
      <div className="top-right-buttons">
        <button 
          className="btn login-btn" 
          onClick={() => navigate('/auth/login')}
        >
          Login
        </button>
        <button 
          className="btn register-btn"
          onClick={() => navigate('/auth/signup')}
          >
            Register
        </button>
      </div>

      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImg})` }} // Menetapkan gambar latar belakang
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
            {/* Button untuk mengarahkan ke halaman pohonku */}
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
            {/* Jika data artikel ada, tampilkan artikel */}
            {artikelData.length > 0 ? (
              artikelData.map(article => (
                <article key={article.id} className="article-card">
                  <div className="article-image">
                    <img
                      src={article.gambar || defaultImage} // Gunakan gambar default jika tidak ada
                      alt={article.title || article.nama || 'Gambar Artikel'}
                      onError={e => (e.target.src = defaultImage)} // Jika gambar error, tampilkan gambar default
                    />
                  </div>
                  <div className="article-content">
                    <h3>{article.title || article.nama || 'Judul Artikel'}</h3>
                    <p>{article.deskripsi || article.isi || 'Deskripsi artikel tidak tersedia'}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-message">Tidak ada artikel tersedia</div> // Menampilkan pesan jika artikel kosong
            )}
          </div>
          <Link to="/artikel" className="read-more-link">Read More</Link> {/* Link untuk membaca lebih banyak artikel */}
        </section>

        {/* Statistik Reforest */}
        <section className="stats-section">
          <h2>Statistik Reforest</h2>
          <div className="stats">
            <div className="stat-item">
              <h3>Total User</h3>
              <p>{stats.totalUsers}</p> {/* Menampilkan total user */}
            </div>
            <div className="stat-item">
              <h3>Total Pohon</h3>
              <p>{stats.totalPohon}</p> {/* Menampilkan total pohon */}
            </div>

            {/* Statistik Pohon per User yang sudah di-nonaktifkan */}
            {/*
            <div className="stat-item">
              <h3>Pohon per User</h3>
              <ul>
                {stats.totalPohonPerUser.map((userStats, index) => (
                  <li key={index}>
                    User ID {userStats.user_id}: {userStats.total_pohon} pohon
                  </li>
                ))}
              </ul>
            </div>
            */}
          </div>
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

export default LandingPage;
