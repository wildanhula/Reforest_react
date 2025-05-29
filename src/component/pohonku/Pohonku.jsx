import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"; 
import L from "leaflet"; 
import './Pohonku.css'; 

// Custom marker icon supaya gak default icon leaflet
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng); 
    },
  });

  return position ? <Marker position={position} icon={customIcon} /> : null;
};

const DUMMY_IMAGE_URL = 'https://cdn.pixabay.com/photo/2015/12/01/20/28/forest-1072828_960_720.jpg';

const Pohonku = () => {
  const [pohonData, setPohonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPohon, setNewPohon] = useState({
    id: '',
    namaPohon: '',
    jenis_pohon: '',
    tanggal_tanam: '',
    lat: '',
    long: '',
    gambar: null,
    gambarPreview: null,
    lokasi: { lat: -7.7839, lng: 110.3679 }, 
  });

  const user = JSON.parse(localStorage.getItem('user')); // Ambil data user dari localStorage

  // Fetch data from backend
  const fetchPohonData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/pohonku/all', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      // Sesuaikan dengan struktur response baru
      if (result.success === true || result.status === 'success') {
        const dataArray = Array.isArray(result.data) ? result.data : [];
        setPohonData(dataArray);
        console.log('Data loaded:', dataArray.length, 'items');
      } else {
        throw new Error(result.message || 'Terjadi kesalahan pada server');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message); 
      setPohonData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPohonData();  // Fetch initial pohon data
  }, []);

  // Handle edit for a tree
  const handleEdit = (pohon) => {
    setNewPohon({
      ...pohon,
      gambarPreview: pohon.gambarUrl || DUMMY_IMAGE_URL, 
      lokasi: { lat: parseFloat(pohon.lat), lng: parseFloat(pohon.long) },
    });
    setShowModal(true);
  };

  // Handle delete for a tree
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data pohon ini?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/pohonku/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        console.log('Delete response:', result);

        if (result.success === true) {
          alert('Pohon berhasil dihapus');
          // Update state to remove deleted item
          setPohonData(prevData => prevData.filter(pohon => pohon.id !== id));
        } else {
          alert(result.message || 'Gagal menghapus pohon');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Terjadi kesalahan saat menghapus pohon');
      }
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPohon(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan JPEG, PNG, atau GIF.');
      return;
    }

    setNewPohon(prev => ({
      ...prev,
      gambar: file,
      gambarPreview: URL.createObjectURL(file),
    }));
  };

  // Handle form submission for adding or updating a tree
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPohon.namaPohon || !newPohon.jenis_pohon || !newPohon.tanggal_tanam) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    if (!newPohon.lat || !newPohon.long) {
      alert('Mohon pilih lokasi di peta');
      return;
    }

    if (!newPohon.id && !newPohon.gambar) {
      alert('Mohon pilih gambar untuk pohon baru');
      return;
    }

    const formData = new FormData();
    formData.append('namaPohon', newPohon.namaPohon);
    formData.append('jenis_pohon', newPohon.jenis_pohon);
    formData.append('tanggal_tanam', newPohon.tanggal_tanam);
    formData.append('lat', newPohon.lat);
    formData.append('long', newPohon.long);
    formData.append('user_id', user ? user.id : 1); // Use user ID from localStorage
    
    if (newPohon.gambar) {
      formData.append('image', newPohon.gambar);
    }

    try {
      const endpoint = newPohon.id 
        ? `http://localhost:8000/api/pohonku/update/${newPohon.id}` 
        : 'http://localhost:8000/api/pohonku/post';
      const method = newPohon.id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        body: formData,
      });

      const result = await response.json();
      console.log('Submit response:', result);

      if (result.status === 'success') {
        alert(`${newPohon.id ? 'Pohon berhasil diperbarui' : 'Pohon berhasil ditambahkan'}`);

        // Refresh the pohon data after successful add or update
        fetchPohonData();

        setShowModal(false);
        resetForm();
      } else {
        alert(result.message || 'Gagal menyimpan pohon');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  // Reset form
  const resetForm = () => {
    setNewPohon({
      id: '', 
      namaPohon: '',
      jenis_pohon: '',
      tanggal_tanam: '',
      lat: '',
      long: '',
      user_id: user ? user.id : 1,  // Ensure the user_id is updated
      gambar: null,
      gambarPreview: null,
      lokasi: { lat: -7.7839, lng: 110.3679 }, 
    });
  };

  // Modal logic
  const handleOpenModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handlePositionChange = (position) => {
    setNewPohon(prev => ({
      ...prev,
      lokasi: position, 
      lat: position.lat,
      long: position.lng,
    }));
  };

  if (loading) return <div className="pohonku-loading">Memuat data pohon...</div>;
  if (error) return <div className="pohonku-error">Error: {error}</div>;

  return (
    <>
      <div className="pohonku-container">
        <h1 className="pohonku-title">Daftar pohon yang sudah Anda tanam</h1>
        <div className="pohonku-row">
          {pohonData.map((pohon) => (
            <div key={pohon.id} className="pohonku-item">
              <div className="pohonku-image-container">
                <img
                  src={pohon.images[0] ? `http://localhost:8000/storage/images/${pohon.images[0].filename}` : DUMMY_IMAGE_URL}
                  alt={pohon.namaPohon}
                  className="pohonku-image"
                />
              </div>
              <div className="pohonku-content">
                <h2>{pohon.namaPohon}</h2>
                <p><strong>Jenis Pohon:</strong> {pohon.jenis_pohon}</p>
                <p><strong>Tanggal Tanam:</strong> {new Date(pohon.tanggal_tanam).toLocaleDateString()}</p>
                <p><strong>Lokasi:</strong> Lat {pohon.lat}, Long {pohon.long}</p>
                <div className="pohonku-button-group">
                  <button className="pohonku-btn pohonku-btn-edit" onClick={() => handleEdit(pohon)}>
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

      <button className="floating-btn" onClick={handleOpenModal}>
        +
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{newPohon.id ? 'Update Pohon' : 'Tambah Pohon Baru'}</h2>
            <form onSubmit={handleSubmit}>
              <label>Nama Pohon:</label>
              <input type="text" name="namaPohon" value={newPohon.namaPohon} onChange={handleChange} required />

              <label>Jenis Pohon:</label>
              <input type="text" name="jenis_pohon" value={newPohon.jenis_pohon} onChange={handleChange} required />

              <label>Tanggal Tanam:</label>
              <input type="date" name="tanggal_tanam" value={newPohon.tanggal_tanam} onChange={handleChange} required />

              <label>Gambar:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />

              {newPohon.gambarPreview && <img src={newPohon.gambarPreview} alt="Preview" className="image-preview" />}

              <label>Pilih Lokasi (klik peta):</label>
              <MapContainer center={newPohon.lokasi} zoom={13} style={{ height: "200px", width: "100%", borderRadius: "8px" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker position={newPohon.lokasi} setPosition={handlePositionChange} />
              </MapContainer>

              <button type="submit" className="btn-submit">{newPohon.id ? 'Update' : 'Tambah'}</button>
              <button type="button" className="btn-cancel" onClick={handleCloseModal}>Batal</button>
            </form>
          </div>
        </div>
      )}

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
