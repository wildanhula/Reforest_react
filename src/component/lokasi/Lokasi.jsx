import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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
        
        console.log('Calling API:', 'http://localhost:8000/api/pohonku/map');
        
        const response = await fetch('http://localhost:8000/api/pohonku/map', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors', // Explicitly set CORS mode
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error text:', errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Check content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('Non-JSON response:', responseText);
          throw new Error('Server returned non-JSON response');
        }
        
        const result = await response.json();
        console.log('Full API Response:', result);
        console.log('Response status field:', result.status);
        console.log('Response success field:', result.success);
        
        // Check response structure - handle both 'status' and 'success' fields
        if (result.status === 'success' || result.success === true) {
          let dataToSet = [];
          
          // Original controller structure: result.data is direct array
          if (Array.isArray(result.data)) {
            dataToSet = result.data;
            console.log('Using result.data directly (array):', dataToSet.length, 'items');
          } else if (result.data && result.data.pohonku) {
            dataToSet = result.data.pohonku;
            console.log('Using result.data.pohonku:', dataToSet.length, 'items');
          } else if (result.data) {
            dataToSet = [result.data];
            console.log('Wrapping single result.data in array');
          } else {
            dataToSet = [];
            console.log('No data found, using empty array');
          }
          
          setPohonData(dataToSet);
          console.log('Final data set:', dataToSet);
        } else {
          console.error('Server error response:', result);
          throw new Error(result.message || result.error || 'Server returned error status');
        }
      } catch (err) {
        console.error('Fetch error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
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
          {pohonData && pohonData.length > 0 && pohonData.map((pohon) => {
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
              />
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