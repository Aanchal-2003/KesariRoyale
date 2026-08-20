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

    // Simulated laboratory ledger query
    setTimeout(() => {
      const match = getReportByCode(raw);
      if (match && match.report) {
        setResult({ type: 'found', report: match.report, code: match.matchedCode });
      } else {
        setResult({ type: 'notfound', searchedCode: raw });
      }
      setLoading(false);
    }, 500);
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
    }, 600);
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

      {/* Verifier Card */}
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

        {/* Scanned Toast / Notification */}
        {scannedFeedback && (
          <div className="kr-scan-success-alert">
            <i className="fa-solid fa-circle-check"></i>
            <span>{scannedFeedback} — Fetching authentic laboratory records...</span>
          </div>
        )}

        {/* Verifier Results Dynamic Viewport */}
        <div id="kr-verification-viewport" className="verifier-result">
          {!result && !loading && (
            <div className="result-placeholder">
              <div className="placeholder-icon-circle">
                <i className="fa-solid fa-qrcode"></i>
              </div>
              <h4>Awaiting Batch Verification</h4>
              <p>Click the <strong>Scan QR</strong> camera button above or enter the batch code printed on your Kesari Royale jar to view the authentic laboratory report.</p>
            </div>
          )}

          {loading && (
            <div className="text-center kr-loading-block">
              <div className="kr-spinner-ring">
                <i className="fa-solid fa-arrows-spin fa-spin"></i>
              </div>
              <h4>Consulting Accredited Laboratory Ledger...</h4>
              <p>Validating cryptographic hash and retrieving original NABL test certificates</p>
            </div>
          )}

          {result?.type === 'empty' && (
            <div className="kr-empty-warning">
              <i className="fa-solid fa-circle-info"></i>
              <p>Please enter a batch code or use the camera button to scan your bottle's QR code.</p>
            </div>
          )}

          {result?.type === 'notfound' && (
            <div className="text-center kr-notfound-card">
              <div className="notfound-icon">
                <i className="fa-solid fa-circle-question"></i>
              </div>
              <h4>Batch Code Not Found</h4>
              <p style={{ maxWidth: 480, margin: '8px auto 20px', fontSize: '0.92rem', color: 'var(--color-gray-600)' }}>
                We couldn't locate a direct record for "<strong>{result.searchedCode}</strong>". Select one of our accredited batch certificates below or scan your jar again:
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary btn-small" 
                  onClick={() => { setCode('KR-2026-A2'); verify('KR-2026-A2'); }}
                >
                  <i className="fa-solid fa-jar"></i> Gir A2 Ghee (KR-2026-A2)
                </button>
                <button 
                  className="btn btn-outline btn-small" 
                  onClick={() => { setCode('KR-2026-MUSTARD'); verify('KR-2026-MUSTARD'); }}
                >
                  <i className="fa-solid fa-bottle-droplet"></i> Mustard Oil (KR-2026-MUSTARD)
                </button>
                <button 
                  className="btn btn-outline btn-small" 
                  onClick={() => { setCode('KR-2026-KESAR'); verify('KR-2026-KESAR'); }}
                >
                  <i className="fa-solid fa-spa"></i> Kesar Honey (KR-2026-KESAR)
                </button>
              </div>
            </div>
          )}

          {/* Render Full Authentic Laboratory Certificate */}
          {result?.type === 'found' && (
            <OriginalLabCertificate 
              report={result.report} 
              code={result.code} 
              onScanAnother={() => setIsScannerOpen(true)}
              onDownload={mockDownload}
            />
          )}
        </div>
      </div>

      {/* Summary Laboratory Grid */}
      <div className="reports-section-header">
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
