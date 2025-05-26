import React, { useState, useEffect } from 'react'; // Import useState and useEffect from React
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"; // For Map components
import L from "leaflet"; // For Leaflet custom markers
import './Pohonku.css'; // Import CSS for styling

// Custom marker icon supaya gak default icon leaflet (biar lebih keren)
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // icon pohon kecil
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng); // Update position when user clicks on map
    },
  });

  // Only render the marker when position is valid
  return position ? <Marker position={position} icon={customIcon} /> : null;
};

const DUMMY_IMAGE_URL = 'https://cdn.pixabay.com/photo/2015/12/01/20/28/forest-1072828_960_720.jpg';

const Pohonku = () => {
  const [pohonData, setPohonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const [newPohon, setNewPohon] = useState({
    id: '',
    namaPohon: '',
    jenis_pohon: '',
    tanggal_tanam: '',
    lat: '',
    long: '',
    gambar: null,
    gambarPreview: null,
    lokasi: { lat: -7.7839, lng: 110.3679 }, // Default location
  });

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

  const handleEdit = (pohon) => {
    setNewPohon({
      ...pohon,
      gambarPreview: pohon.gambarUrl || DUMMY_IMAGE_URL, // Show existing image in modal
    });
    setShowModal(true); // Open the modal for editing
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus data pohon ini?')) {
      alert(`Hapus pohon dengan ID: ${id}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPohon(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewPohon(prev => ({
      ...prev,
      gambar: file,
      gambarPreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If editing, update data, otherwise add new tree
    if (newPohon.id) {
      // Here you should perform the update logic (e.g., API call to update data)
      alert(`Pohon dengan ID ${newPohon.id} diperbarui: ${JSON.stringify(newPohon)}`);
    } else {
      // Here you should perform the add new tree logic (e.g., API call to add data)
      alert(`Pohon Baru: ${JSON.stringify(newPohon)}`);
    }
    setShowModal(false); // Close modal after submit
  };

  const handleOpenModal = () => {
    setNewPohon({
      id: '', // Reset ID for new tree
      namaPohon: '',
      jenis_pohon: '',
      tanggal_tanam: '',
      lat: '',
      long: '',
      gambar: null,
      gambarPreview: null,
      lokasi: { lat: -7.7839, lng: 110.3679 }, // Default location
    });
    setShowModal(true); // Open the modal for adding a new tree
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePositionChange = (position) => {
    setNewPohon(prev => ({
      ...prev,
      lokasi: position, // Update the location in the state
      lat: position.lat,
      long: position.lng,
    }));
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

      {/* Floating Add Button */}
      <button className="floating-btn" onClick={handleOpenModal}>
        +
      </button>

      {/* Modal for Adding or Editing Pohon */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{newPohon.id ? 'Update Pohon' : 'Tambah Pohon Baru'}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nama Pohon:
                <input 
                  type="text" 
                  name="namaPohon" 
                  value={newPohon.namaPohon} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                Jenis Pohon:
                <input 
                  type="text" 
                  name="jenis_pohon" 
                  value={newPohon.jenis_pohon} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                Tanggal Tanam:
                <input 
                  type="date" 
                  name="tanggal_tanam" 
                  value={newPohon.tanggal_tanam} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              <label>
                Penanam:
                <input 
                  type="text" 
                  name="penanam" 
                  value={newPohon.penanam} 
                  onChange={handleChange} 
                  required 
                />
              </label>

              <label>
                Gambar:
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </label>
              {newPohon.gambarPreview && <img src={newPohon.gambarPreview} alt="Preview" className="image-preview" />}

              <label>Pilih Lokasi (klik peta):</label>
              <MapContainer 
                center={newPohon.lokasi || { lat: -7.7839, lng: 110.3679 }} 
                zoom={13} 
                style={{ height: "200px", width: "100%", borderRadius: "8px" }}
              >
                <TileLayer 
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>' 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                />
                <LocationPicker 
                  position={newPohon.lokasi} // Position should always be valid now
                  setPosition={handlePositionChange} 
                />
              </MapContainer>

              <button type="submit" className="btn-submit">{newPohon.id ? 'Update' : 'Tambah'}</button>
              <button type="button" className="btn-cancel" onClick={handleCloseModal}>Batal</button>
            </form>
          </div>
        </div>
      )}

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
