// src/components/OcrReader.tsx
"use client";

import { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';

interface OcrReaderProps {
  file: File;
  onTextExtracted: (text: string) => void;
}

export default function OcrReader({ file, onTextExtracted }: OcrReaderProps) {
  const [ocrText, setOcrText] = useState('');
  const [isOcrInProgress, setIsOcrInProgress] = useState(false);

  useEffect(() => {
    const recognizeText = async () => {
      setIsOcrInProgress(true);
      const worker = await createWorker('eng');
      const ret = await worker.recognize(file);
      setOcrText(ret.data.text);
      onTextExtracted(ret.data.text);
      await worker.terminate();
      setIsOcrInProgress(false);
    };

    recognizeText();
  }, [file, onTextExtracted]);

  return (
    <div>
      {isOcrInProgress && <p>Reading receipt...</p>}
      {ocrText && (
        <div>
          <h3 className="text-lg font-semibold mt-4">Extracted Text:</h3>
          <pre className="bg-gray-100 p-4 rounded-md mt-2">{ocrText}</pre>
        </div>
      )}
    </div>
  );
}
