import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const QRCodeGenerator = ({ link }: { link: string }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (link) {
      QRCode.toDataURL(link)
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error("Failed to generate QR code", err);
        });
    }
  }, [link]);

  return (
    <div className="flex flex-col items-center gap-2">
      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />}
    </div>
  );
};

export default QRCodeGenerator;
