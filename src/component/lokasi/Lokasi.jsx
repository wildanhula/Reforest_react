import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'; // For Map components
import L from 'leaflet'; // For Leaflet custom markers
import './Lokasi.css'; // Import CSS for styling
import { Link } from 'react-router-dom'; // Import Link for navigation

// Custom marker icon for tree
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Tree icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const Lokasi = () => {
  const [pohonData, setPohonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data pohon from API
  useEffect(() => {
    const fetchPohonData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/pohonku/all');
        if (!response.ok) throw new Error('Failed to fetch data from API');
        const result = await response.json();
        if (result.status === 'success') {
          setPohonData(result.data.pohonku); // Set tree data
        } else {
          throw new Error(result.message || 'Server error');
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

  // Set Indonesia's center position
  const indonesiaPosition = { lat: -2.5489, lng: 118.0149 };  // Centered at Indonesia
  const zoomLevel = 5;  // Set the zoom level to show Indonesia nicely

  return (
    <>
      <div className="lokasi-container">
        <h1 className="lokasi-title">Lokasi Pohon Terdaftar Reforest</h1>

        <MapContainer 
          center={indonesiaPosition} 
          zoom={zoomLevel} 
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Loop through pohonData and add markers for each tree */}
          {pohonData.map((pohon) => (
            <Marker 
              key={pohon.id} 
              position={{ lat: parseFloat(pohon.lat), lng: parseFloat(pohon.long) }} 
              icon={customIcon}
            />
          ))}
        </MapContainer>
      </div>

      {/* Footer Section */}
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

export default Lokasi;
