"use client";

import { useState } from 'react';
import OcrReader from './OcrReader';

export default function ClaimForm() {
  const [name, setName] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [claimPurpose, setClaimPurpose] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [files, setFiles] = useState<File | null>(null);
  const [itemName, setItemName] = useState('');
  const [amountRM, setAmountRM] = useState<number>(0);
  const [showPopup, setShowPopup] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFiles(selectedFile);
      setAmountRM(0);
    }
  };

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);

    // Extract amount
    const amountRegex = /Total[:\s]*(\d+\.\d{2})/i;
    const amountMatch = text.match(amountRegex);
    if (amountMatch && amountMatch[1]) {
      setAmountRM(parseFloat(amountMatch[1]));
    }

    // Extract item
    const itemRegex = /(item|description)[:\s]*(.*)/i;
    const itemMatch = text.match(itemRegex);
    if (itemMatch && itemMatch[2]) {
      setItemName(itemMatch[2].trim());
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle file submission logic here
    console.log({ name, icNumber, claimPurpose, bankName, bankAccountNumber, file: files, itemName, amountRM });
    setShowPopup(true);
    setName('');
    setIcNumber('');
    setClaimPurpose('');
    setBankName('');
    setBankAccountNumber('');
    setFiles(null);
    setItemName('');
    setAmountRM(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="icNumber" className="block text-sm font-medium text-gray-700">IC/ Passport No.</label>
        <input
          type="text"
          id="icNumber"
          value={icNumber}
          onChange={(e) => setIcNumber(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
        <input
          type="text"
          id="bankName"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">Bank Account Number</label>
        <input
          type="text"
          id="bankAccountNumber"
          value={bankAccountNumber}
          onChange={(e) => setBankAccountNumber(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="claimPurpose" className="block text-sm font-medium text-gray-700">Claim Purpose</label>
        <select
          id="claimPurpose"
          value={claimPurpose}
          onChange={(e) => setClaimPurpose(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">-- Select a purpose --</option>
          <option value="Company Event">Company Event</option>
          <option value="Campaign Expenses">Campaign Expenses</option>
          <option value="Edu & Sports Claim">Edu & Sports Claim</option>
          <option value="Dental Claim">Dental Claim</option>
          <option value="Medical Claim">Medical Claim</option>
          <option value="Team Lunch Claim">Team Lunch Claim</option>
          <option value="Subscription Claim">Subscription Claim</option>
          <option value="Mileage Claim">Mileage Claim</option>
          <option value="BU Claim">BU Claim</option>
          <option value="Others">Others</option>
        </select>
      </div>
      <div>
        <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload Invoice/ Receipt
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".jpeg,.jpg,.png,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {files && (
        <OcrReader file={files} onTextExtracted={handleTextExtracted} />
      )}

      <div>
        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">Item</label>
        <input
          type="text"
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="amountRM" className="block text-sm font-medium text-gray-700">Amount (RM)</label>
        <input
          type="number"
          id="amountRM"
          value={amountRM || ''}
          onChange={(e) => setAmountRM(parseFloat(e.target.value) || 0)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Submit
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Submission Confirmation</h2>
            <p>Your payment is being reviewed. You will receive notification regarding the status within 7 - 14 working days.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
