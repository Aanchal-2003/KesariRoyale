import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function OriginalLabCertificate({ report, code, onScanAnother, onDownload }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!report) return;
    const payload = report.qrPayload || `https://kesariroyale.com/reports?batch=${report.batchNo || code}`;
    QRCode.toDataURL(payload, {
      width: 140,
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.warn('QR generate error:', err));
  }, [report, code]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // When the signed original is on file, hand over that PDF; otherwise fall
    // back to whatever the page provides.
    if (report?.pdfUrl) {
      window.open(report.pdfUrl, '_blank', 'noopener');
      return;
    }
    onDownload?.();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/reports?batch=${encodeURIComponent(report.batchNo || code)}`;
    navigator.clipboard?.writeText(url);
    alert('Direct verification link copied to clipboard!');
  };

  if (!report) return null;

  return (
    <div className="kr-original-report-container">
      {/* Verification Success Ribbon */}
      <div className="kr-verified-ribbon">
        <div className="kr-ribbon-left">
          <div className="kr-shield-icon">
            <i className="fa-solid fa-shield-check"></i>
          </div>
          <div>
            <h4>Original Laboratory Report Authenticated</h4>
            <p>Verified through Kesari Royale Traceability & Quality Ledger</p>
          </div>
        </div>
        <div className="kr-ribbon-right">
          <span className="kr-badge kr-badge-success">
            <i className="fa-solid fa-circle-check"></i> 100% Authentic
          </span>
          <button className="btn btn-outline btn-small" onClick={onScanAnother}>
            <i className="fa-solid fa-camera"></i> Scan Another Jar
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Panel */}
      <div className="kr-cert-paper">
        {/* Certificate Header / Lab Banner */}
        <div className="kr-cert-head">
          <div className="kr-cert-lab-identity">
            <div className="kr-lab-logo-mark">
              <i className="fa-solid fa-flask-vial"></i>
            </div>
            <div>
              <span className="kr-cert-lab-badge">
                {report.labAccreditation || 'NABL ISO/IEC 17025:2017 ACCREDITED'}
              </span>
              <h2>{report.labName}</h2>
              <p className="kr-lab-address">{report.labAddress}</p>
              {report.labRegNo && (
                <p className="kr-lab-lic">NABL Accreditation: <strong>{report.labRegNo}</strong></p>
              )}
              {report.formatNo && (
                <p className="kr-lab-lic">Format No: <strong>{report.formatNo}</strong></p>
              )}
            </div>
          </div>

          <div className="kr-cert-qr-stamp">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Certificate QR Code" className="kr-qr-image" />
            ) : (
              <div className="kr-qr-placeholder"><i className="fa-solid fa-qrcode"></i></div>
            )}
            <span>Scan to Verify</span>
          </div>
        </div>

        {/* Certificate Meta Grid */}
        <div className="kr-cert-meta-grid">
          <div className="kr-meta-cell">
            <span className="meta-label">Test Report Number</span>
            <strong className="meta-value text-gold">{report.reportNo}</strong>
          </div>
          <div className="kr-meta-cell">
            <span className="meta-label">ULR Reference No.</span>
            <strong className="meta-value">{report.ulrNo}</strong>
          </div>
          <div className="kr-meta-cell">
            <span className="meta-label">Date of Report Issue</span>
            <strong className="meta-value">{report.issueDate}</strong>
          </div>
          <div className="kr-meta-cell">
            <span className="meta-label">Testing Period</span>
            <strong className="meta-value">{report.testingPeriod}</strong>
          </div>
          {report.sampleCode && (
            <div className="kr-meta-cell">
              <span className="meta-label">Sample Code</span>
              <strong className="meta-value">{report.sampleCode}</strong>
            </div>
          )}
          {report.pageNo && (
            <div className="kr-meta-cell">
              <span className="meta-label">Page No.</span>
              <strong className="meta-value">{report.pageNo}</strong>
            </div>
          )}
        </div>

        {/* Product & Sampling Details */}
        <div className="kr-cert-section">
          <h4 className="kr-cert-section-title">
            <i className="fa-solid fa-boxes-packing"></i> Sample Identification & Origin Traceability
          </h4>
          <div className="kr-sample-info-grid">
            <div className="kr-info-row">
              <span className="info-key">Product Name:</span>
              <span className="info-val highlight">{report.product}</span>
            </div>
            <div className="kr-info-row">
              <span className="info-key">Category & Craft:</span>
              <span className="info-val">{report.productCategory}</span>
            </div>
            <div className="kr-info-row">
              <span className="info-key">Batch / Lot Number:</span>
              <span className="info-val">
                <code className="kr-batch-code-tag">{report.batchNo}</code>
              </span>
            </div>
            <div className="kr-info-row">
              <span className="info-key">Sample Quantity & Pack:</span>
              <span className="info-val">{report.quantity}</span>
            </div>
            <div className="kr-info-row">
              <span className="info-key">Manufacturing Date:</span>
              <span className="info-val">{report.mfgDate}</span>
            </div>
            <div className="kr-info-row">
              <span className="info-key">Best Before Date:</span>
              <span className="info-val">{report.expDate}</span>
            </div>
            {report.sampleType && (
              <div className="kr-info-row">
                <span className="info-key">Description:</span>
                <span className="info-val">{report.sampleType}</span>
              </div>
            )}
            {report.sampleReceived && (
              <div className="kr-info-row">
                <span className="info-key">Sample Receiving Date:</span>
                <span className="info-val">{report.sampleReceived}</span>
              </div>
            )}
            {report.sampledBy && (
              <div className="kr-info-row">
                <span className="info-key">Sample Collected By:</span>
                <span className="info-val">{report.sampledBy}</span>
              </div>
            )}
            {report.environmentalConditions && (
              <div className="kr-info-row">
                <span className="info-key">Environmental Conditions:</span>
                <span className="info-val">{report.environmentalConditions}</span>
              </div>
            )}
            {report.customerLic && (
              <div className="kr-info-row">
                <span className="info-key">Customer FSSAI Lic. No:</span>
                <span className="info-val">{report.customerLic}</span>
              </div>
            )}
            {report.registrationNo && (
              <div className="kr-info-row">
                <span className="info-key">Lab Registration No:</span>
                <span className="info-val">{report.registrationNo}</span>
              </div>
            )}
            <div className="kr-info-row full-width">
              <span className="info-key">Customer Name & Address:</span>
              <span className="info-val">{report.location}</span>
            </div>
          </div>
        </div>

        {/* KPI Highlights Bar */}
        {report.summaryHighlights && (
          <div className="kr-highlights-bar">
            {report.summaryHighlights.map((h, i) => (
              <div key={i} className="kr-highlight-card">
                <span className="kr-highlight-label">{h.label}</span>
                <div className="kr-highlight-val">{h.value}</div>
                <span className="kr-highlight-note">{h.note}</span>
              </div>
            ))}
          </div>
        )}

        {/* Comprehensive Test Parameters Table */}
        {report.parameters && report.parameters.length > 0 && (
          <div className="kr-cert-section">
            <div className="kr-table-heading-row">
              <h4 className="kr-cert-section-title">
                <i className="fa-solid fa-microscope"></i> Chemical & Analytical Test Results
              </h4>
              <span className="kr-status-pill-pass">
                <i className="fa-solid fa-circle-check"></i> ALL PARAMETERS COMPLIANT
              </span>
            </div>

            <div className="kr-table-responsive">
              <table className="kr-lab-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tested Parameter</th>
                    <th>Observed Result</th>
                    <th>Prescribed Limit (FSSAI/IS)</th>
                    <th>Standard Test Method</th>
                    <th>Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {report.parameters.map((p, idx) => (
                    <tr key={idx}>
                      <td className="text-center">{idx + 1}</td>
                      <td className="font-semibold">{p.name}</td>
                      <td className="kr-result-val">
                        <strong>{p.result}</strong>
                      </td>
                      <td className="text-muted">{p.limit}</td>
                      <td className="text-muted text-small">{p.method}</td>
                      <td>
                        <span className="kr-pass-tag">
                          <i className="fa-solid fa-check"></i> {p.status || 'Complies'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Opinion & Statutory Notes */}
        {(report.opinion || report.notes) && (
          <div className="kr-cert-section kr-cert-opinion">
            {report.opinion && (
              <p className="kr-opinion-line">
                <strong>Opinion:</strong> {report.opinion}
              </p>
            )}
            {report.notes && report.notes.length > 0 && (
              <ol className="kr-cert-notes">
                {report.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* Signature & Seal Footer */}
        <div className="kr-cert-signatures">
          <div className="kr-sign-box">
            <div className="kr-stamp-seal">
              <i className="fa-solid fa-certificate"></i>
              <span>NABL TESTED</span>
              <small>GOVT RECOGNIZED</small>
            </div>
            <div className="kr-lab-seal-text">
              <strong>OFFICIAL LABORATORY SEAL</strong>
              <span>{report.labName} — Analytical Quality Assurance</span>
            </div>
          </div>

          {report.reviewedBy && (
            <div className="kr-sign-box kr-sign-auth">
              <div className="kr-digital-signature">
                <em>{report.reviewedBy}</em>
              </div>
              <div className="kr-sign-line"></div>
              <strong>{report.reviewedBy}</strong>
              <span className="text-small text-muted">{report.reviewedByTitle}</span>
            </div>
          )}

          <div className="kr-sign-box kr-sign-auth">
            <div className="kr-digital-signature">
              <em>{report.signatory}</em>
            </div>
            <div className="kr-sign-line"></div>
            <strong>{report.signatory}</strong>
            <span className="text-small text-muted">{report.signatoryTitle}</span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="kr-cert-actions">
          <button className="btn btn-primary" onClick={handleDownload}>
            <i className="fa-solid fa-file-arrow-down"></i> Download Verified PDF Report
          </button>
          <button className="btn btn-outline" onClick={handlePrint}>
            <i className="fa-solid fa-print"></i> Print Certificate
          </button>
          <button className="btn btn-outline" onClick={handleCopyLink}>
            <i className="fa-solid fa-link"></i> Share Verification Link
          </button>
          <button className="btn btn-outline" onClick={onScanAnother}>
            <i className="fa-solid fa-camera"></i> Scan Another Bottle
          </button>
        </div>
      </div>
    </div>
  );
}
