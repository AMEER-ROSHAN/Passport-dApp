import React, { useState } from 'react';
import Web3 from 'web3';
import { QRCodeCanvas } from 'qrcode.react';
import './passportAuth.css';

const PassportCreate = ({ web3, account, contract }) => {
  const [passportNumber, setPassportNumber] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [downloadLink, setDownloadLink] = useState(''); // State to hold the download link

  const handleCreatePassport = async () => {
    if (contract) {
      await contract.methods
        .createPassport(passportNumber, name, country, issueDate, expiryDate)
        .send({ from: account });
      alert('Passport created!');
      // Generate QR code with the public key (Ethereum address)
      setQrCode(account);
    }
  };

  // Function to generate the downloadable QR code image link
  const generateDownloadLink = () => {
    if (qrCode) {
      const canvas = document.getElementById('qr-code-canvas');
      if (canvas) {
        const qrCodeURL = canvas.toDataURL('image/png'); // Get image data from the canvas
        setDownloadLink(qrCodeURL); // Set the download link
        const link = document.createElement('a');
        link.href = qrCodeURL;
        link.download = 'passport-qr-code.png';
        link.click(); // Trigger download
      }
      
    }
  };

  return (
    <div>
      <h3 className="section-title">Create Passport</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Passport Number"
          value={passportNumber}
          onChange={(e) => setPassportNumber(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Issue Date (timestamp)"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Expiry Date (timestamp)"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
      </div>
      <button className="button" onClick={handleCreatePassport}>
        Submit
      </button>

      {qrCode && (
        <div>
          <h3>QR Code for Verification</h3>
          <QRCodeCanvas id="qr-code-canvas" value={qrCode} size={256} />
            <br/>
          <button className="button" onClick={generateDownloadLink}>Download QR Code</button>
        </div>
      )}
    </div>
  );
};

export default PassportCreate;
