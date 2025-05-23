import React, { useState, useEffect } from 'react';
import './Pohonku.css';

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
          setPohonData(result.data.pohonku);  // sesuaikan dengan struktur API
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

  if (loading) return <div className="loading">Memuat data pohon...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (pohonData.length === 0) return <div className="empty-message">Data pohon kosong.</div>;

  return (
    <div className="pohonku-container">
      <h1 className="judul-pohonku">Daftar Pohonku</h1>
      {pohonData.map((pohon) => (
        <div key={pohon.id} className="pohon-item">
          {/* Jika kamu punya properti gambar di model, gunakan, kalau tidak, hapus bagian ini */}
          {pohon.gambarUrl && (
            <div className="pohon-image-container">
              <img src={pohon.gambarUrl} alt={pohon.namaPohon} className="pohon-image" />
            </div>
          )}
          <div className="pohon-content">
            <h2>{pohon.namaPohon}</h2>
            <p>Jenis Pohon: {pohon.jenis_pohon}</p>
            <p>Tanggal Tanam: {new Date(pohon.tanggal_tanam).toLocaleDateString()}</p>
            <p>Lokasi: Lat {pohon.lat}, Long {pohon.long}</p>
            {/* Jika ingin tampilkan user yang menanam */}
            {pohon.user && <p>Penanam: {pohon.user.name}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Pohonku;
