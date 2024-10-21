import React from 'react'
import { useZxing } from 'react-zxing'
import { Barcode } from "lucide-react"
import { Button } from 'components/ui/button'

interface BarcodeReaderProps {
  onScan: (result: string) => void
}

export function BarcodeReader({ onScan }: BarcodeReaderProps) {
  const [isScanning, setIsScanning] = React.useState(false)

  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.getText())
      setIsScanning(false)
    },
  })

  return (
    <div>
      <div className="mt-4">
        <Button onClick={() => setIsScanning(!isScanning)} variant="outline">
          <Barcode className="mr-2 h-4 w-4" />
          {isScanning ? 'Stop Scanning' : 'Start Barcode Scan'}
        </Button>
      </div>

      {isScanning && (
        <div className="mt-4 border-2 border-primary rounded-lg overflow-hidden">
          <video ref={ref} className="w-full h-64 object-cover">
            <track kind="captions" />
          </video>
        </div>
      )}
    </div>
  )
}