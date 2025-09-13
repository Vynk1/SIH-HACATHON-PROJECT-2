import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import QR from 'react-qr-code';
import { QrCode, Copy, ExternalLink } from 'lucide-react';

const QRCodePage = () => {
  const [publicId, setPublicId] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicId();
  }, []);

  const loadPublicId = async () => {
    try {
      const res = await userAPI.getPublicId();
      setPublicId(res.data.public_emergency_id);
    } catch (err) {
      console.error('Failed to load public id:', err);
    } finally {
      setLoading(false);
    }
  };

  const emergencyUrl = publicId ? `${window.location.origin}/e/${publicId}` : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emergencyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="main-content">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emergency QR Code</h1>
          <p className="text-gray-600">Share this QR with emergency responders to access your emergency information.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
          ) : publicId ? (
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <QR value={emergencyUrl} size={220} />
              </div>
              <p className="mt-4 text-sm text-gray-600">Scan to view emergency info</p>

              <div className="mt-6 w-full max-w-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Public Emergency URL</label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={emergencyUrl}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-gray-600"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 bg-primary-600 text-white ${copied ? 'bg-green-600' : ''}`}
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <a
                    href={emergencyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-800 text-white rounded-r-md"
                    title="Open link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tips</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Print this QR and keep it in your wallet</li>
                  <li>Save the image to your phone's lock screen</li>
                  <li>Share with your emergency contacts</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No public ID available</h3>
              <p className="text-gray-500">Create your health profile first to generate a public emergency ID.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
