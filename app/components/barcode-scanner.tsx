import { useState } from "react";
import { Button } from "components/ui/button";
import { Barcode } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/library";

export const BarcodeReader = ({
  onScan,
}: {
  onScan: (barcode: string) => void;
}) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScanning = () => {
    if (isScanning) {
      setIsScanning(false);
    } else {
      setIsScanning(true);
      init();
    }
  };

  async function init() {
    const reader = new BrowserMultiFormatReader();
    const videoDevices = await reader.listVideoInputDevices();
    if (videoDevices.length > 0) {
      reader.decodeFromVideoDevice(
        videoDevices[0].deviceId,
        "video",
        (result, error) => {
          if (result) {
            console.log(result.getText());
            onScan(result.getText());
            reader.reset();
            setIsScanning(false);
          }
        }
      );
    }
  }

  return (
    <div>
      <div className="mt-4">
        <Button onClick={handleScanning} variant="outline">
          <Barcode className="mr-2 h-4 w-4" />
          {isScanning ? "Stop Scanning" : "Start Barcode Scan"}
        </Button>
      </div>

      {isScanning && (
        <div className="mt-4 border-2 border-primary rounded-lg overflow-hidden">
          <video id="video" className="w-full h-full" autoPlay></video>
        </div>
      )}
    </div>
  );
};
