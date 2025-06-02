import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './Lokasi.css';
import { Link } from 'react-router-dom';

// Custom marker icon for tree
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
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
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8000/api/pohonku/map', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors', // Explicitly set CORS mode
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success) {
          setPohonData(result.data);
        } else {
          throw new Error(result.message || 'Server returned error status');
        }
      } catch (err) {
        setError(`Connection failed: ${err.message}`);
        setPohonData([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    

    fetchPohonData();
  }, []);

  if (loading) return <div className="loading">Memuat data pohon...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Set Indonesia's center position
  const indonesiaPosition = { lat: -2.5489, lng: 118.0149 };
  const zoomLevel = 5;

  return (
    <>
      <div className="lokasi-container">
        <h1 className="lokasi-title">Lokasi Pohon Terdaftar Reforest</h1>
        
        {/* Debug info */}
        <div style={{ marginBottom: '10px', fontSize: '12px', color: '#666' }}>
          Total pohon: {pohonData.length}
        </div>

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
          {pohonData.map((pohon) => {
            const lat = parseFloat(pohon.lat);
            const lng = parseFloat(pohon.long);
            
            // Validate coordinates
            if (isNaN(lat) || isNaN(lng)) {
              console.warn(`Invalid coordinates for pohon ${pohon.id}:`, { lat: pohon.lat, lng: pohon.long });
              return null;
            }
            
            return (
              <Marker 
                key={pohon.id} 
                position={{ lat, lng }} 
                icon={customIcon}
              >
                <Popup>
                  <div>
                    <strong>Nama Pohon:</strong> {pohon.namaPohon}<br />
                    <strong>Pemilik:</strong> {pohon.username}
                  </div>
                </Popup>
              </Marker>
            );
          })}
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
