import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import L from "leaflet";
import './Pohonku.css';

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

// Form Tambah Pohon
const AddPohonForm = ({ onClose, onAdded }) => {
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    namaPohon: '',
    jenis_pohon: '',
    tanggal_tanam: '',
    lat: -7.7839,
    long: 110.3679,
    gambar: null,
    gambarPreview: null,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Gunakan JPEG, PNG, atau GIF.');
      return;
    }

    setForm(prev => ({
      ...prev,
      gambar: file,
      gambarPreview: URL.createObjectURL(file),
    }));
  };

  const handlePositionChange = (pos) => {
    setForm(prev => ({
      ...prev,
      lat: pos.lat,
      long: pos.lng,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.gambar) {
      toast.error('Mohon pilih gambar untuk pohon baru');
      return;
    }

    const formData = new FormData();
    formData.append('namaPohon', form.namaPohon);
    formData.append('jenis_pohon', form.jenis_pohon);
    formData.append('tanggal_tanam', form.tanggal_tanam);
    formData.append('lat', form.lat);
    formData.append('long', form.long);
    formData.append('image', form.gambar);

    try {
      const response = await fetch('http://localhost:8000/api/pohonku/post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success === true) {
        toast.success('Pohon berhasil ditambahkan');
        onAdded();
        onClose();
      } else {
        toast.error(result.message || 'Gagal menambahkan pohon');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nama Pohon:</label>
      <input type="text" name="namaPohon" value={form.namaPohon} onChange={handleChange} required />

      <label>Jenis Pohon:</label>
      <input type="text" name="jenis_pohon" value={form.jenis_pohon} onChange={handleChange} required />

      <label>Tanggal Tanam:</label>
      <input type="date" name="tanggal_tanam" value={form.tanggal_tanam} onChange={handleChange} required />

      <label>Gambar:</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {form.gambarPreview && <img src={form.gambarPreview} alt="Preview" className="image-preview" />}

      <label>Pilih Lokasi (klik peta):</label>
      <MapContainer center={{ lat: form.lat, lng: form.long }} zoom={13} style={{ height: "200px", width: "100%", borderRadius: "8px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker position={{ lat: form.lat, lng: form.long }} setPosition={handlePositionChange} />
      </MapContainer>

      <button type="submit" className="btn-submit">Tambah</button>
      <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
    </form>
  );
};

// Form Edit Pohon
const EditPohonForm = ({ pohon, onClose, onUpdated }) => {
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    id: pohon.id,
    namaPohon: pohon.namaPohon,
    jenis_pohon: pohon.jenis_pohon,
    tanggal_tanam: pohon.tanggal_tanam.slice(0,10), // format yyyy-mm-dd
    lat: parseFloat(pohon.lat),
    long: parseFloat(pohon.long),
    gambar: null,
    gambarPreview: pohon.images && pohon.images[0]
      ? `http://localhost:8000/storage/images/${pohon.images[0].filename}`
      : DUMMY_IMAGE_URL,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Gunakan JPEG, PNG, atau GIF.');
      return;
    }

    setForm(prev => ({
      ...prev,
      gambar: file,
      gambarPreview: URL.createObjectURL(file),
    }));
  };

  const handlePositionChange = (pos) => {
    setForm(prev => ({
      ...prev,
      lat: pos.lat,
      long: pos.lng,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('namaPohon', form.namaPohon);
    formData.append('jenis_pohon', form.jenis_pohon);
    formData.append('tanggal_tanam', form.tanggal_tanam);
    formData.append('lat', form.lat);
    formData.append('long', form.long);
    formData.append('_method', 'PUT'); // override method

    if (form.gambar) {
      formData.append('image', form.gambar);
    }

    try {
      const response = await fetch(`http://localhost:8000/api/pohonku/update/${form.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success === true) {
        toast.success('Pohon berhasil diperbarui');
        onUpdated();
        onClose();
      } else {
        toast.error(result.message || 'Gagal memperbarui pohon');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memperbarui data');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nama Pohon:</label>
      <input type="text" name="namaPohon" value={form.namaPohon} onChange={handleChange} required />

      <label>Jenis Pohon:</label>
      <input type="text" name="jenis_pohon" value={form.jenis_pohon} onChange={handleChange} required />

      <label>Tanggal Tanam:</label>
      <input type="date" name="tanggal_tanam" value={form.tanggal_tanam} onChange={handleChange} required />

      <label>Gambar:</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {form.gambarPreview && <img src={form.gambarPreview} alt="Preview" className="image-preview" />}

      <label>Pilih Lokasi (klik peta):</label>
      <MapContainer center={{ lat: form.lat, lng: form.long }} zoom={13} style={{ height: "200px", width: "100%", borderRadius: "8px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker position={{ lat: form.lat, lng: form.long }} setPosition={handlePositionChange} />
      </MapContainer>

      <button type="submit" className="btn-submit">Update</button>
      <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
    </form>
  );
};

const Pohonku = () => {
  const [pohonData, setPohonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPohon, setEditPohon] = useState(null);

  const token = localStorage.getItem('token');

  const fetchPohonData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/pohonku/my', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();

      if (result.success === true || result.status === 'success') {
        const dataArray = Array.isArray(result.data) ? result.data : [];
        setPohonData(dataArray);
      } else {
        throw new Error(result.message || 'Terjadi kesalahan pada server');
      }
    } catch (err) {
      setError(err.message);
      setPohonData([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPohonData();
  }, [fetchPohonData]);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data pohon ini?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/pohonku/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success === true) {
          toast.success('Pohon berhasil dihapus');
          setPohonData(prevData => prevData.filter(pohon => pohon.id !== id));
        } else {
          toast.error(result.message || 'Gagal menghapus pohon');
        }
      } catch (error) {
        toast.error('Terjadi kesalahan saat menghapus pohon');
      }
    }
  };

  const openEditModal = (pohon) => {
    setEditPohon(pohon);
    setShowEditModal(true);
  };

  if (loading) {
    return <p>Loading data pohon...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="pohonku-container">
        <h1 className="pohonku-title">Daftar pohon yang sudah Anda tanam</h1>
        <div className="pohonku-row">
          {pohonData.map((pohon) => (
            <div key={pohon.id} className="pohonku-item">
              <div className="pohonku-image-container">
                <img
                  src={pohon.images && pohon.images[0] ? `http://localhost:8000/storage/images/${pohon.images[0].filename}` : DUMMY_IMAGE_URL}
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
                  <button className="pohonku-btn pohonku-btn-edit" onClick={() => openEditModal(pohon)}>Edit</button>
                  <button className="pohonku-btn pohonku-btn-delete" onClick={() => handleDelete(pohon.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="floating-btn" onClick={() => setShowAddModal(true)}>+</button>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Tambah Pohon Baru</h2>
            <AddPohonForm
              onClose={() => setShowAddModal(false)}
              onAdded={fetchPohonData}
            />
          </div>
        </div>
      )}

      {showEditModal && editPohon && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Update Pohon</h2>
            <EditPohonForm
              pohon={editPohon}
              onClose={() => setShowEditModal(false)}
              onUpdated={fetchPohonData}
            />
          </div>
        </div>
      )}

      <footer className="faq-footer">
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
