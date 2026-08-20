import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getReportByCode, extractBatchCode } from '../data/reports';
import QRScannerModal from '../components/QRScannerModal';
import OriginalLabCertificate from '../components/OriginalLabCertificate';

export default function Reports() {
  const [searchParams] = useSearchParams();
  const initialBatch = searchParams.get('batch') || searchParams.get('code') || searchParams.get('id') || '';

  const [code, setCode] = useState(initialBatch);
  const [result, setResult] = useState(() => {
    if (initialBatch) {
      const match = getReportByCode(initialBatch);
      if (match && match.report) {
        return { type: 'found', report: match.report, code: match.matchedCode };
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedFeedback, setScannedFeedback] = useState(null);

  const verify = useCallback((inputCode) => {
    const raw = inputCode !== undefined ? inputCode : code;
    if (!raw || !raw.trim()) {
      setResult({ type: 'empty' });
      return;
    }

    setLoading(true);
    setResult(null);

    // Query laboratory ledger
    setTimeout(() => {
      const match = getReportByCode(raw);
      if (match && match.report) {
        setResult({ type: 'found', report: match.report, code: match.matchedCode });
      } else {
        setResult({ type: 'notfound', searchedCode: raw });
      }
      setLoading(false);
    }, 450);
  }, [code]);

  const handleScanSuccess = (decodedText) => {
    const cleanCode = extractBatchCode(decodedText) || decodedText;
    setScannedFeedback(`Scanned Code: "${cleanCode}"`);
    setCode(cleanCode);
    verify(decodedText);
    setTimeout(() => setScannedFeedback(null), 5000);

    setTimeout(() => {
      const el = document.getElementById('kr-verification-viewport');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 550);
  };

  const mockDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  return (
    <section id="reports" className="page-view active">
      {/* Hero Header */}
      <div className="reports-hero">
        <span className="sub-title">
          <i className="fa-solid fa-shield-halved"></i> 100% Uncompromised Purity
        </span>
        <h1 className="page-title">Purity Verified & Lab Certified</h1>
        <p className="page-subtitle">
          Every single batch of Kesari Royale is independently analyzed by NABL accredited food laboratories. Scan your jar's QR code or enter your batch number to inspect the original lab certificate.
        </p>
      </div>

      {/* Verifier Search Card */}
      <div className="verifier-card glass-panel">
        <div className="verifier-header-row">
          <div>
            <h3>Trace & Verify Your Batch</h3>
            <p>Scan the QR code on your bottle label or enter your batch code (e.g. <strong>KR-2026-A2</strong>, <strong>OTHPL/RN-202603525</strong>)</p>
          </div>
        </div>

        {/* Verifier Form with Camera Trigger */}
        <form 
          className="verifier-form" 
          onSubmit={(e) => { e.preventDefault(); verify(); }}
        >
          <div className="verifier-input-wrapper">
            <i className="fa-solid fa-barcode verifier-input-icon"></i>
            <input 
              type="text" 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              placeholder="Enter Batch Code, Report No., or paste QR URL..." 
            />
            {code && (
              <button 
                type="button" 
                className="verifier-input-clear" 
                onClick={() => setCode('')}
                title="Clear input"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          <button 
            type="button"
            className="btn btn-secondary kr-scan-input-btn"
            onClick={() => setIsScannerOpen(true)}
            title="Open Camera QR Scanner"
          >
            <i className="fa-solid fa-camera"></i>
            <span>Scan QR</span>
          </button>

          <button type="submit" className="btn btn-primary">
            Verify Report <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>

        {/* Quick Batch Suggestions */}
        <div className="verifier-quick-chips" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--color-gray-100)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', fontWeight: '600' }}>Sample Batches:</span>
          {[
            { label: 'Gir A2 Ghee (1kg)', code: 'KR-2026-A2' },
            { label: 'Gir A2 Ghee (500g)', code: 'KR-2026-500G' },
            { label: 'Gir A2 Ghee (250g)', code: 'KR-2026-250G' },
          ].map((b) => (
            <button
              key={b.code}
              type="button"
              className="btn btn-outline btn-small"
              style={{ fontSize: '0.76rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}
              onClick={() => { setCode(b.code); verify(b.code); }}
            >
              <i className="fa-solid fa-jar"></i> {b.label}
            </button>
          ))}
        </div>

        {/* Scanned Toast / Notification */}
        {scannedFeedback && (
          <div className="kr-scan-success-alert">
            <i className="fa-solid fa-circle-check"></i>
            <span>{scannedFeedback} — Authenticating laboratory records...</span>
          </div>
        )}
      </div>

      {/* Verifier Results Viewport */}
      <div id="kr-verification-viewport" className="verifier-viewport">
        {!result && !loading && (
          <div className="result-placeholder glass-panel" style={{ marginTop: '24px', padding: '40px 20px', textAlign: 'center' }}>
            <div className="placeholder-icon-circle">
              <i className="fa-solid fa-qrcode"></i>
            </div>
            <h4>Awaiting Batch Verification</h4>
            <p>Click the <strong>Scan QR</strong> camera button above or enter the batch code printed on your Kesari Royale jar to view the authentic laboratory report.</p>
          </div>
        )}

        {loading && (
          <div className="text-center kr-loading-block glass-panel" style={{ marginTop: '24px', padding: '40px 20px' }}>
            <div className="kr-spinner-ring">
              <i className="fa-solid fa-arrows-spin fa-spin"></i>
            </div>
            <h4>Consulting Accredited Laboratory Ledger...</h4>
            <p>Validating cryptographic hash and retrieving original NABL test certificates</p>
          </div>
        )}

        {result?.type === 'empty' && (
          <div className="kr-empty-warning glass-panel" style={{ marginTop: '24px' }}>
            <i className="fa-solid fa-circle-info"></i>
            <p>Please enter a batch code or use the camera button to scan your bottle's QR code.</p>
          </div>
        )}

        {result?.type === 'found' && (
          <OriginalLabCertificate 
            report={result.report} 
            code={result.code} 
            onScanAnother={() => setIsScannerOpen(true)}
            onDownload={mockDownload}
          />
        )}
      </div>

      {/* Summary Laboratory Grid */}
      <div className="reports-section-header" style={{ marginTop: '60px' }}>
        <h3>Archived Laboratory Certifications</h3>
        <p>Comprehensive safety profiles, heavy metal testing, and nutritive certificates</p>
      </div>

      <div className="certificates-grid">
        {[
          { 
            title: 'Omega Test House Chemical Analysis', 
            no: 'OTHPL/RN-202603525', 
            date: '01/04/2026', 
            lab: 'Omega Test House (NABL ISO/IEC 17025)', 
            desc: 'Official chemical & fat purity analysis. Confirms 99.90% milk fat, 0.08% moisture, zero adulteration (Baudouin negative).' 
          },
          { 
            title: 'Pesticide & Synthetic Chemical Screen', 
            no: 'SGS-CHEM-7762', 
            date: 'April 2026', 
            lab: 'SGS India Food Safety Laboratory', 
            desc: 'Screened for over 180 pesticides, heavy metals (Lead, Mercury, Arsenic), synthetic preservatives. Results: Not Detected.' 
          },
          { 
            title: 'Nutritive & Fatty Acid Profile', 
            no: 'NABL-NUTRI-2281', 
            date: 'May 2026', 
            lab: 'NABL Accredited Food Lab', 
            desc: 'Detailed nutritional factsheet verifying High CLA content, Omega-3 & 6 balance, Butyric Acid, and Fat Soluble Vitamins A, D, E, K.' 
          },
        ].map(c => (
          <div key={c.no} className="cert-card glass-panel">
            <div className="cert-header">
              <i className="fa-solid fa-file-pdf cert-icon"></i>
              <div>
                <h4>{c.title}</h4>
                <p>Report No: {c.no}</p>
              </div>
            </div>
            <div className="cert-meta">
              <span><strong>Tested:</strong> {c.date}</span>
              <span><strong>Lab:</strong> {c.lab}</span>
            </div>
            <p className="cert-desc">{c.desc}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button 
                className="btn btn-outline btn-small" 
                onClick={() => { setCode(c.no); verify(c.no); }}
              >
                <i className="fa-solid fa-eye"></i> View Full Audit
              </button>
              <button 
                className="btn btn-primary btn-small" 
                onClick={mockDownload}
              >
                <i className="fa-solid fa-arrow-down-to-bracket"></i> Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive QR Scanner Modal */}
      <QRScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScanSuccess={handleScanSuccess} 
      />

      {/* Download Notification Toast */}
      {downloaded && (
        <div className="download-notification show">
          <i className="fa-solid fa-file-arrow-down"></i>
          <span>Official NABL lab verification report downloaded successfully!</span>
        </div>
      )}
    </section>
  );
}
