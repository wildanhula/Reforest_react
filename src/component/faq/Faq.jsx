import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Faq.css';

const FAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIds, setOpenIds] = useState([]);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const response = await fetch('http://localhost:8000/faq/all');
        if (!response.ok) throw new Error('Gagal mengambil data dari API');
        const result = await response.json();
        if (result.status === 'success') {
          setFaqData(result.data.faq);
        } else {
          throw new Error(result.message || 'Terjadi kesalahan pada server');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFaq();
  }, []);

  const toggleFaq = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]
    );
  };

  return (
    <>
      <main>
        <div className="faq-container">
          <h1 className="faq-title">Frequently Asked Questions</h1>

          {loading && <div className="loading">Memuat data FAQ...</div>}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && faqData.length === 0 && (
            <div className="empty-message">Data FAQ kosong.</div>
          )}

          {!loading && !error && faqData.length > 0 && (
            <div className="faq-list">
              {faqData.map((faq) => {
                const isOpen = openIds.includes(faq.id);
                return (
                  <div
                    className="faq-item"
                    key={faq.id}
                    onClick={() => toggleFaq(faq.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') toggleFaq(faq.id);
                    }}
                  >
                    <div className="faq-question-bar">
                      <span className="faq-question">{faq.question}</span>
                      <button
                        className="faq-toggle-button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-content-${faq.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFaq(faq.id);
                        }}
                      >
                        {isOpen ? '−' : '+'}
                      </button>
                    </div>
                    <div
                      id={`faq-content-${faq.id}`}
                      className={`faq-content ${isOpen ? 'show' : ''}`}
                    >
                      <p>{faq.answer}</p>
                     
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

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

export default FAQ;
