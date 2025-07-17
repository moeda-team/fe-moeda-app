import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

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
      {qrCodeUrl && (
        <div className="flex flex-col items-center gap-2">
          <Image src={qrCodeUrl} alt="QR" width={100} height={100} />
          <div>
            <p className="text-white text-sm">Scan QR Code</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
