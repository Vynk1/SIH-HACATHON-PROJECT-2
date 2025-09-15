import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import QR from 'react-qr-code';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { QrCode, Copy, ExternalLink, CheckCircle } from 'lucide-react';

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Emergency QR Code</h1>
          <p className="text-muted-foreground text-lg">
            Share this QR with emergency responders to access your emergency information.
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5" />
              Emergency Access QR
            </CardTitle>
            <CardDescription>
              Instant access to your critical health information during emergencies
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="animate-pulse text-center">
                <div className="h-6 bg-muted rounded w-1/3 mx-auto mb-6"></div>
                <div className="h-64 bg-muted rounded mx-auto max-w-xs"></div>
              </div>
            ) : publicId ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="p-6 bg-background rounded-lg border-2 border-dashed border-border">
                  <QR value={emergencyUrl} size={220} className="mx-auto" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan to view emergency health information
                </p>

                <div className="w-full max-w-lg space-y-2">
                  <Label>Emergency Access URL</Label>
                  <div className="flex">
                    <Input
                      readOnly
                      value={emergencyUrl}
                      className="rounded-r-none"
                    />
                    <Button
                      variant={copied ? "default" : "secondary"}
                      onClick={copyToClipboard}
                      className="rounded-none px-3"
                      title="Copy link"
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="rounded-l-none px-3"
                      title="Open link"
                    >
                      <a
                        href={emergencyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                <Card className="w-full max-w-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Usage Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-primary mt-2"></div>
                        Print this QR and keep it in your wallet or purse
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-primary mt-2"></div>
                        Save the image to your phone's lock screen wallpaper
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-primary mt-2"></div>
                        Share with your emergency contacts and family
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-primary mt-2"></div>
                        Wear medical jewelry with the QR code or URL
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Emergency ID Available</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your health profile first to generate a public emergency ID.
                </p>
                <Button asChild>
                  <a href="/profile">Complete Health Profile</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodePage;
