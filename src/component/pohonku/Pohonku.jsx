import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // jangan lupa import Link
import './Pohonku.css';

const DUMMY_IMAGE_URL = 'https://cdn.pixabay.com/photo/2015/12/01/20/28/forest-1072828_960_720.jpg';

const Pohonku = () => {
  const [pohonData, setPohonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPohonData = async () => {
      try {
        const response = await fetch('http://localhost:8000/pohonku/all');
        if (!response.ok) throw new Error('Gagal mengambil data dari API');
        const result = await response.json();
        if (result.status === 'success') {
          setPohonData(result.data.pohonku);
        } else {
          throw new Error(result.message || 'Terjadi kesalahan pada server');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPohonData();
  }, []);

  const handleEdit = (id) => {
    alert(`Edit pohon dengan ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus data pohon ini?')) {
      alert(`Hapus pohon dengan ID: ${id}`);
    }
  };

  if (loading) return <div className="pohonku-loading">Memuat data pohon...</div>;
  if (error) return <div className="pohonku-error">Error: {error}</div>;
  if (pohonData.length === 0) return <div className="pohonku-empty-message">Data pohon kosong.</div>;

  return (
    <>
      <div className="pohonku-container">
        <h1 className="pohonku-title">Daftar pohon yang sudah Anda tanam</h1>
        <div className="pohonku-row">
          {pohonData.map((pohon) => (
            <div key={pohon.id} className="pohonku-item">
              <div className="pohonku-image-container">
                <img
                  src={pohon.gambarUrl || DUMMY_IMAGE_URL}
                  alt={pohon.namaPohon}
                  className="pohonku-image"
                />
              </div>
              <div className="pohonku-content">
                <h2>{pohon.namaPohon}</h2>
                <p><strong>Jenis Pohon:</strong> {pohon.jenis_pohon}</p>
                <p><strong>Tanggal Tanam:</strong> {new Date(pohon.tanggal_tanam).toLocaleDateString()}</p>
                <p><strong>Lokasi:</strong> Lat {pohon.lat}, Long {pohon.long}</p>
                {pohon.user && <p><strong>Penanam:</strong> {pohon.user.name}</p>}
                <div className="pohonku-button-group">
                  <button className="pohonku-btn pohonku-btn-edit" onClick={() => handleEdit(pohon.id)}>
                    Edit
                  </button>
                  <button className="pohonku-btn pohonku-btn-delete" onClick={() => handleDelete(pohon.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default Pohonku;
