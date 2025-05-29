import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import heroImg from '../assets/hero2.jpg';

const HomePage = () => {
  const [artikelData, setArtikelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk statistik
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPohon: 0,
    totalPohonPerUser: [],
  });

  // Mengambil data artikel dan statistik dari API
  useEffect(() => {
    const fetchArtikelData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Calling Artikel API:', 'http://localhost:8000/api/artikel/all');
        
        const response = await fetch('http://localhost:8000/api/artikel/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors', // Explicitly set CORS mode
        });
        
        console.log('Artikel Response status:', response.status);
        console.log('Artikel Response ok:', response.ok);
        
        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Artikel Response error text:', errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Check content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('Artikel Non-JSON response:', responseText);
          throw new Error('Server returned non-JSON response for artikel');
        }
        
        const result = await response.json();
        console.log('Full Artikel API Response:', result);
        console.log('Artikel Response status field:', result.status);
        console.log('Artikel Response success field:', result.success);
        
        // Check response structure
        if (result.status === 'Success' || result.status === 'success' || result.success === true) {
          let dataToSet = [];
          
          if (result.data && result.data.artikel && Array.isArray(result.data.artikel)) {
            dataToSet = result.data.artikel.slice(0, 3); // Menampilkan 3 artikel terakhir
            console.log('Using result.data.artikel:', dataToSet.length, 'items');
          } else if (Array.isArray(result.data)) {
            dataToSet = result.data.slice(0, 3);
            console.log('Using result.data directly (array):', dataToSet.length, 'items');
          } else if (result.data) {
            dataToSet = [result.data].slice(0, 3);
            console.log('Wrapping single result.data in array');
          } else {
            dataToSet = [];
            console.log('No artikel data found, using empty array');
          }
          
          setArtikelData(dataToSet);
          console.log('Final artikel data set:', dataToSet);
        } else {
          console.error('Artikel Server error response:', result);
          throw new Error(result.message || result.error || 'Server returned error status for artikel');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Artikel Fetch error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        setError(`Artikel connection failed: ${err.message}`);
        setArtikelData([]); // Set empty array on error
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        console.log('Calling Stats API:', 'http://localhost:8000/stats');
        
        const response = await fetch('http://localhost:8000/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors', // Explicitly set CORS mode
        });
        
        console.log('Stats Response status:', response.status);
        console.log('Stats Response ok:', response.ok);
        
        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Stats Response error text:', errorText);
          throw new Error(`Stats HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Check content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('Stats Non-JSON response:', responseText);
          throw new Error('Server returned non-JSON response for stats');
        }
        
        const result = await response.json();
        console.log('Full Stats API Response:', result);
        console.log('Stats Response status field:', result.status);
        console.log('Stats Response success field:', result.success);
        
        if (result.status === 'success' || result.success === true) {
          setStats(result.data || {
            totalUsers: 0,
            totalPohon: 0,
            totalPohonPerUser: [],
          });
          console.log('Stats data set successfully:', result.data);
        } else {
          console.error('Stats Server error response:', result);
          throw new Error(result.message || result.error || 'Server returned error status for stats');
        }
      } catch (err) {
        console.error('Stats Fetch error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        console.error('Error fetching stats:', err);
        // Don't set main error for stats failure, just log it
      }
    };

    fetchArtikelData();
    fetchStats();
  }, []);

  const defaultImage = 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

  // Jika masih memuat data, tampilkan loading
  if (loading) return <div className="loading">Memuat data...</div>;
  // Jika ada error, tampilkan pesan error
  if (error) return <div className="error">Error: {error}</div>;

  // Cek apakah pengguna sudah login
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <>
      {/* Menampilkan tombol login dan signup hanya jika user belum login */}
      {!user && (
        <div className="auth-buttons">
          <Link to="/login" className="auth-button">Login</Link>
          <Link to="/login" className="auth-button">Sign Up</Link>
        </div>
      )}

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
        <section className="articles-section">
          <h2>ARTIKEL</h2>
          
          {/* Debug info */}
          <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
            Total artikel: {artikelData.length}
          </div>
          
          <div className="articles-grid">
            {artikelData.length > 0 ? (
              artikelData.map(article => (
                <article key={article.id} className="article-card">
                  <div className="article-image">
                    <img
                      src={article.gambar || defaultImage}
                      alt={article.title || 'Gambar Artikel'}
                      onError={e => (e.target.src = defaultImage)} // fallback image
                    />
                  </div>
                  <div className="article-content">
                    <h3>{article.title || 'Judul Artikel'}</h3>
                    <p>{article.deskripsi || 'Deskripsi artikel tidak tersedia'}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-message">Tidak ada artikel tersedia</div>
            )}
          </div>
          <Link to="/artikel" className="read-more-link">Read More</Link>
        </section>

        <section className="stats-section">
          <h2>Statistik Reforest</h2>
          
          {/* Debug info untuk stats */}
          <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
            Stats loaded: Users({stats.totalUsers}), Trees({stats.totalPohon})
          </div>
          
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