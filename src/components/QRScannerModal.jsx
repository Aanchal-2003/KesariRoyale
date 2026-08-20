import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload'
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [torchAvailable, setTorchAvailable] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const scannerRef = useRef(null);
  const fileScannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const qrContainerId = 'kr-qr-reader-viewport';

  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
        setTorchOn(false);
      }
    }
  }, []);

  const handleSuccessfulDecode = useCallback(async (text) => {
    if (navigator.vibrate) {
      try { navigator.vibrate(100); } catch { /* ignore haptic error */ }
    }
    await stopCamera();
    onScanSuccess(text);
    onClose();
  }, [stopCamera, onScanSuccess, onClose]);

  const startCamera = useCallback(async (cameraId) => {
    try {
      await stopCamera();
      
      const html5QrCode = new Html5Qrcode(qrContainerId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const size = Math.floor(minEdge * 0.72);
          return { width: Math.max(200, size), height: Math.max(200, size) };
        },
        aspectRatio: 1.0,
      };

      const cameraParam = cameraId ? { deviceId: { exact: cameraId } } : { facingMode: 'environment' };

      await html5QrCode.start(
        cameraParam,
        config,
        (decodedText) => {
          handleSuccessfulDecode(decodedText);
        },
        () => {
          // Ignore frequent frame parsing misses
        }
      );

      setIsScanning(true);
      setIsStarting(false);

      // Check torch capability
      try {
        const capabilities = html5QrCode.getRunningTrackCameraCapabilities();
        if (capabilities && capabilities.torchFeature().isSupported()) {
          setTorchAvailable(true);
        }
      } catch {
        setTorchAvailable(false);
      }
    } catch (err) {
      console.error('Failed to start camera scanner:', err);
      setIsStarting(false);
      setIsScanning(false);
      setCameraError('Could not start live camera preview. You may upload a QR image or try another camera.');
    }
  }, [stopCamera, handleSuccessfulDecode]);

  // Handle camera enumeration and startup
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
      return;
    }

    let isMounted = true;

    async function initCamera() {
      setIsStarting(true);
      setCameraError(null);

      try {
        const devices = await Html5Qrcode.getCameras();
        if (!isMounted) return;

        if (devices && devices.length > 0) {
          setCameras(devices);
          const backCam = devices.find(d => 
            d.label.toLowerCase().includes('back') || 
            d.label.toLowerCase().includes('rear') || 
            d.label.toLowerCase().includes('environment')
          );
          const camId = backCam ? backCam.id : devices[0].id;
          setSelectedCameraId(camId);
          startCamera(camId);
        } else {
          setCameraError('No camera found on this device. You can upload a QR image or select a demo code below.');
          setIsStarting(false);
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn('Camera enumeration error:', err);
        setCameraError(
          err?.name === 'NotAllowedError'
            ? 'Camera access was denied. Please allow camera permissions in your browser or upload a QR image.'
            : 'Unable to access camera. Please check camera permissions or upload an image.'
        );
        setIsStarting(false);
      }
    }

    const timer = setTimeout(() => {
      initCamera();
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopCamera();
    };
  }, [isOpen, activeTab, startCamera, stopCamera]);

  const toggleTorch = async () => {
    if (!scannerRef.current || !scannerRef.current.isScanning) return;
    try {
      const nextState = !torchOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: nextState }]
      });
      setTorchOn(nextState);
    } catch (err) {
      console.warn('Failed to toggle torch:', err);
    }
  };

  const handleCameraChange = (e) => {
    const newId = e.target.value;
    setSelectedCameraId(newId);
    if (newId) {
      startCamera(newId);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setFileError(null);

    try {
      if (!fileScannerRef.current) {
        fileScannerRef.current = new Html5Qrcode('kr-qr-file-reader');
      }
      const decodedText = await fileScannerRef.current.scanFile(file, true);
      setIsProcessingFile(false);
      handleSuccessfulDecode(decodedText);
    } catch (err) {
      console.warn('File scan error:', err);
      setIsProcessingFile(false);
      setFileError('No recognizable QR code found in this image. Please try another clear photo.');
    }
  };

  const handleDemoClick = (sampleCode) => {
    handleSuccessfulDecode(sampleCode);
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="kr-qr-modal-overlay" onClick={onClose}>
      <div className="kr-qr-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="kr-qr-modal-header">
          <div className="kr-qr-modal-title">
            <div className="kr-qr-icon-badge">
              <i className="fa-solid fa-camera"></i>
            </div>
            <div>
              <h3>Scan Batch QR Code</h3>
              <p>Scan the QR on your bottle to verify laboratory authenticity</p>
            </div>
          </div>
          <button className="kr-qr-modal-close" onClick={onClose} aria-label="Close scanner">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="kr-qr-tabs">
          <button 
            className={`kr-qr-tab-btn ${activeTab === 'camera' ? 'active' : ''}`}
            onClick={() => setActiveTab('camera')}
          >
            <i className="fa-solid fa-video"></i> Live Camera
          </button>
          <button 
            className={`kr-qr-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <i className="fa-solid fa-image"></i> Upload QR Photo
          </button>
        </div>

        {/* Body Content */}
        <div className="kr-qr-modal-body">
          {activeTab === 'camera' && (
            <div className="kr-camera-section">
              {cameraError ? (
                <div className="kr-camera-error-box">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <h4>Camera Unavailable</h4>
                  <p>{cameraError}</p>
                  <button 
                    className="btn btn-primary btn-small"
                    onClick={() => setActiveTab('upload')}
                  >
                    <i className="fa-solid fa-upload"></i> Upload Image Instead
                  </button>
                </div>
              ) : (
                <div className="kr-camera-wrapper">
                  <div id={qrContainerId} className="kr-scanner-viewport"></div>

                  {isStarting && (
                    <div className="kr-camera-loading-overlay">
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      <span>Initializing High-Resolution Lens...</span>
                    </div>
                  )}

                  {isScanning && (
                    <div className="kr-viewfinder-overlay">
                      <div className="kr-target-frame">
                        <span className="kr-corner top-left"></span>
                        <span className="kr-corner top-right"></span>
                        <span className="kr-corner bottom-left"></span>
                        <span className="kr-corner bottom-right"></span>
                        <div className="kr-scan-laser"></div>
                      </div>
                      <p className="kr-scan-instruction">
                        Position the bottle's QR code within the golden frame
                      </p>
                    </div>
                  )}

                  {/* Camera Controls Bar */}
                  <div className="kr-camera-controls">
                    {cameras.length > 1 && (
                      <div className="kr-camera-selector">
                        <i className="fa-solid fa-arrows-rotate"></i>
                        <select value={selectedCameraId} onChange={handleCameraChange}>
                          {cameras.map((c, idx) => (
                            <option key={c.id} value={c.id}>
                              {c.label || `Camera ${idx + 1}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {torchAvailable && (
                      <button 
                        className={`kr-torch-btn ${torchOn ? 'active' : ''}`} 
                        onClick={toggleTorch}
                        title={torchOn ? "Turn off light" : "Turn on light"}
                      >
                        <i className="fa-solid fa-bolt"></i> {torchOn ? 'Torch On' : 'Torch'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="kr-upload-section">
              <div 
                className="kr-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleFileUpload} 
                />
                <div className="kr-dropzone-icon">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <h4>Choose or Drop a QR Code Image</h4>
                <p>Upload a screenshot or photo of the QR code from your Kesari Royale packaging</p>
                <button className="btn btn-outline btn-small" type="button">
                  <i className="fa-solid fa-folder-open"></i> Browse Files
                </button>
              </div>

              <div id="kr-qr-file-reader" style={{ display: 'none' }}></div>

              {isProcessingFile && (
                <div className="kr-file-status loading">
                  <i className="fa-solid fa-spinner fa-spin"></i> Decoding QR image...
                </div>
              )}

              {fileError && (
                <div className="kr-file-status error">
                  <i className="fa-solid fa-circle-exclamation"></i> {fileError}
                </div>
              )}
            </div>
          )}

          {/* Quick Demo QR Test Chips */}
          <div className="kr-quick-samples">
            <div className="kr-samples-label">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>Sample Kesari Royale Batches (Click to test):</span>
            </div>
            <div className="kr-sample-chips">
              <button 
                type="button"
                className="kr-chip"
                onClick={() => handleDemoClick('KR-2026-A2')}
              >
                <i className="fa-solid fa-jar"></i> Gir A2 Ghee 1kg (KR-2026-A2)
              </button>
              <button 
                type="button"
                className="kr-chip"
                onClick={() => handleDemoClick('KR-2026-500G')}
              >
                <i className="fa-solid fa-jar"></i> Gir A2 Ghee 500gm (KR-2026-500G)
              </button>
              <button 
                type="button"
                className="kr-chip"
                onClick={() => handleDemoClick('KR-2026-250G')}
              >
                <i className="fa-solid fa-jar"></i> Gir A2 Ghee 250gm (KR-2026-250G)
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="kr-qr-modal-footer">
          <span className="kr-security-note">
            <i className="fa-solid fa-shield-check"></i> Cryptographically verified with NABL accredited test records
          </span>
          <button className="btn btn-outline btn-small" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
