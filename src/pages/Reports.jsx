import { useState } from 'react';
import { batchReports } from '../data/reports';

export default function Reports() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const verify = (inputCode) => {
    const c = (inputCode || code).trim().toUpperCase();
    if (!c) { setResult({ type: 'empty' }); return; }
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const report = batchReports[c];
      setResult(report ? { type: 'found', report, code: c } : { type: 'notfound' });
      setLoading(false);
    }, 1000);
  };

  const mockDownload = () => { setDownloaded(true); setTimeout(() => setDownloaded(false), 3500); };

  return (
    <section id="reports" className="page-view active">
      <div className="reports-hero">
        <span className="sub-title">100% Uncompromised Purity</span>
        <h1 className="page-title">Purity Verified & Lab Certified</h1>
        <p className="page-subtitle">Every batch of Kesari Royale is rigorously tested. Verify yours below.</p>
      </div>

      <div className="verifier-card glass-panel">
        <h3>Trace Your Batch Report</h3>
        <p>Enter the batch code printed on your bottle (e.g. <strong>KR-2026-A2</strong> or <strong>OTHPL/RN-202603525</strong>)</p>
        <div className="verifier-form">
          <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter Batch Code or Report No." />
          <button className="btn btn-primary" onClick={() => verify()}>Verify Report <i className="fa-solid fa-magnifying-glass"></i></button>
        </div>

        <div className="verifier-result">
          {!result && !loading && (
            <div className="result-placeholder">
              <i className="fa-solid fa-magnifying-glass-chart"></i>
              <p>Awaiting batch code... Enter 'KR-2026-A2' to view the verified Omega Test House report.</p>
            </div>
          )}
          {loading && (
            <div className="text-center" style={{ padding: '40px 0', color: 'var(--color-primary)' }}>
              <i className="fa-solid fa-arrows-spin fa-spin" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
              <p>Contacting laboratory database...</p>
            </div>
          )}
          {result?.type === 'empty' && <p style={{ color: 'var(--color-primary-dark)', padding: '20px' }}>Please enter a valid batch code.</p>}
          {result?.type === 'notfound' && (
            <div className="text-center" style={{ padding: '40px 0' }}>
              <i className="fa-solid fa-circle-question" style={{ fontSize: '4rem', marginBottom: '16px' }}></i>
              <h4>Batch Code Not Found</h4>
              <p style={{ maxWidth: 420, margin: '8px auto 20px', fontSize: '0.9rem', color: 'var(--color-gray-600)' }}>The code you entered does not match any current batch. Try a demo code below.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-outline btn-small" onClick={() => { setCode('KR-2026-A2'); verify('KR-2026-A2'); }}>Load Demo Gir A2 Code</button>
                <button className="btn btn-outline btn-small" onClick={() => { setCode('KR-2026-MUSTARD'); verify('KR-2026-MUSTARD'); }}>Load Demo Mustard Code</button>
              </div>
            </div>
          )}
          {result?.type === 'found' && (
            <div className="verifier-report-layout">
              <div className="verification-header">
                <div className="verified-title"><i className="fa-solid fa-shield-halved"></i><span>{result.report.status}</span></div>
                <span className="verified-batch-meta">Batch Ref: <strong>{result.code}</strong> | Issue Date: {result.report.date}</span>
              </div>
              <div className="report-details-box" style={{ gridColumn: 'span 2' }}>
                <h4>Product & Origin Audit</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px 40px' }}>
                  {[['Product Title', result.report.product],['Testing Laboratory', result.report.labName],['Report Number', result.report.reportNo],['Sourcing Location', result.report.location]].map(([l,v]) => (
                    <div key={l} className="detail-item"><span>{l}</span><strong>{v}</strong></div>
                  ))}
                </div>
              </div>
              {result.report.hasTable ? (
                <div className="report-table-box" style={{ gridColumn: 'span 2' }}>
                  <h4>Chemical Analysis Certificate</h4>
                  <div className="report-table-wrapper">
                    <table className="report-table">
                      <thead><tr><th>S.No.</th><th>Parameter</th><th>Result</th><th>Method</th><th>Limit</th><th>Status</th></tr></thead>
                      <tbody>
                        {result.report.parameters.map((p, i) => (
                          <tr key={i}><td><strong>{i+1}</strong></td><td>{p.name}</td><td><strong>{p.result}</strong></td><td>{p.method}</td><td>{p.limit}</td><td className="pass-badge"><i className="fa-solid fa-circle-check"></i> Complies</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div style={{ gridColumn: 'span 2' }}>
                  <div className="metric-bar-group"><div className="metric-label-row"><span>Purity Standard</span><span>100% PURITY</span></div><div className="bar-outer"><div className="bar-inner" style={{ width: '100%' }}></div></div></div>
                  <div className="metric-bar-group" style={{ marginTop: 14 }}><div className="metric-label-row"><span>Fatty Acid Profile</span><span>{result.report.claValue}</span></div><div className="bar-outer"><div className="bar-inner" style={{ width: '99.4%' }}></div></div></div>
                </div>
              )}
              <div className="report-actions">
                <button className="btn btn-primary btn-small" onClick={mockDownload}><i className="fa-solid fa-arrow-down-to-bracket"></i> Download Full NABL Certificate PDF</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="certificates-grid">
        {[
          { title: 'Omega Test House Chemical Analysis', no: 'OTHPL/RN-202603525', date: '01/04/2026', lab: 'Omega Test House (NABL Acc.)', desc: 'Official chemical & fat purity analysis. Confirms 99.90% milk fat, 0.08% moisture, 0.0% adulteration.' },
          { title: 'Pesticide & Chemical Analysis', no: 'SGS-CHEM-7762', date: 'April 2026', lab: 'SGS India Food Safety Laboratory', desc: 'Screened for over 180 pesticides, synthetic preservatives, heavy metals. Results: Not Detected.' },
          { title: 'Nutritive & Fatty Acid Profile', no: 'NABL-NUTRI-2281', date: 'May 2026', lab: 'NABL Accredited Food Lab', desc: 'Detailed nutritional factsheet verifying High CLA content, Butyric Acid, and Vitamins A, D, E, K.' },
        ].map(c => (
          <div key={c.no} className="cert-card glass-panel">
            <div className="cert-header">
              <i className="fa-solid fa-file-pdf cert-icon"></i>
              <div><h4>{c.title}</h4><p>Report No: {c.no}</p></div>
            </div>
            <div className="cert-meta">
              <span><strong>Tested:</strong> {c.date}</span>
              <span><strong>Lab:</strong> {c.lab}</span>
            </div>
            <p className="cert-desc">{c.desc}</p>
            <button className="btn btn-outline btn-small" onClick={mockDownload}><i className="fa-solid fa-arrow-down-to-bracket"></i> Download Report</button>
          </div>
        ))}
      </div>

      {downloaded && (
        <div className="download-notification show">
          <i className="fa-solid fa-file-arrow-down"></i>
          <span>Lab verification report downloaded successfully!</span>
        </div>
      )}
    </section>
  );
}
