import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";

interface ShopQRCodeProps {
  qrCode: string;
  shopName: string;
}

const ShopQRCode = ({ qrCode, shopName }: ShopQRCodeProps) => {
  // Generate full URL for QR code
  const qrUrl = `${window.location.origin}/join/${qrCode}`;
  
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          கடை QR குறியீடு / Shop QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg border-2 border-primary/20">
          <QRCodeSVG
            value={qrUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <p className="text-sm text-center text-muted-foreground">
          வாடிக்கையாளர்கள் ஸ்கேன் செய்ய
          <br />
          For customers to scan and join queue
        </p>
        <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
          {qrUrl}
        </p>
      </CardContent>
    </Card>
  );
};

export default ShopQRCode;
