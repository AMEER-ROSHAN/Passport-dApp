import React, { useState, useEffect, useRef } from 'react';
import './passportAuth.css';
import { BrowserQRCodeReader } from '@zxing/browser';

const PassportVerify = ({ contract }) => {
  const [qrScanResult, setQrScanResult] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const videoRef = useRef(null); // Ref for video element
  const codeReaderRef = useRef(null); // Ref for the QR code reader instance

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();
    codeReaderRef.current = codeReader;

    // Start scanning for QR codes
    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result) {
            setQrScanResult(result.getText());
            setPublicKey(result.getText()); // Automatically set publicKey from scanned result
            setVerificationMessage(''); // Clear previous messages
          }
          if (err && !(err instanceof Error)) {
            console.warn('QR code scanning error:', err);
          }
        })
        .catch((error) => {
          console.error('Error initializing QR code reader:', error);
          setVerificationMessage('Error initializing QR code scanner.');
        });
    }

    return () => {
      // Stop the video feed and clean up resources
      codeReaderRef.current?.reset();
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const handleVerifyPassport = async () => {
    if (!publicKey) {
      setVerificationMessage('Please enter a public key or scan a QR code.');
      return;
    }

    if (contract) {
      try {
        const isValid = await contract.methods.verifyPassportByAddress(publicKey).call();
        if (isValid) {
          setVerificationMessage('Passport exists for this public key!');
        } else {
          setVerificationMessage('No passport found for this public key.');
        }
      } catch (error) {
        console.error('Error verifying passport by public key:', error);
        setVerificationMessage('Error occurred while verifying passport.');
      }
    }
  };

  return (
    <div>
      <h3 className="section-title">Verify Passport by Public Key</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter Public Key or Scan QR Code"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
        />
      </div>
      <div>
        <h3>Scan QR Code</h3>
        {/* Video element for the camera feed */}
        <video ref={videoRef} style={{ width: '100%', height: '300px' }} />
      </div>
      <button className="button" onClick={handleVerifyPassport}>
        Verify
      </button>

      {/* Display verification messages */}
      {verificationMessage && (
        <p
          className={
            verificationMessage === 'Passport exists for this public key!'
              ? 'verification-message-success'
              : 'verification-message-error'
          }
        >
          {verificationMessage}
        </p>
      )}

      {/* Display scanned result */}
      {qrScanResult && <p>Scanned Public Key: {qrScanResult}</p>}
    </div>
  );
};

export default PassportVerify;
