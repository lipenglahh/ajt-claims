"use client";

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import OcrReader from './OcrReader';

interface EmployeeData {
  'Full Name': string;
  'IC/Passport No.': string;
  'Bank Name': string;
  'Bank Account No.': string;
}

interface ClaimFormProps {
  onClaimSubmit: (newClaim: { items: string; amount: number }) => void;
}

export default function ClaimForm({ onClaimSubmit }: ClaimFormProps) {
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [name, setName] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [lastFourIc, setLastFourIc] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [claimPurpose, setClaimPurpose] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [files, setFiles] = useState<File | null>(null);
  const [itemName, setItemName] = useState('');
  const [amountRM, setAmountRM] = useState<number>(0);
  const [showPopup, setShowPopup] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch('/data.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<EmployeeData>(worksheet);
        setEmployeeData(jsonData);
      } catch (error) {
        console.error('Error reading the Excel file:', error);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    setName(selectedName);
    setIsVerified(false);
    setIcNumber('');
    setBankName('');
    setBankAccountNumber('');
    setLastFourIc('');
  };

  const handleIcVerification = () => {
    const selectedEmployee = employeeData.find((employee) => employee['Full Name'] === name);
    if (selectedEmployee) {
      const icNumberStr = String(selectedEmployee['IC/Passport No.']);
      if (icNumberStr.slice(-4) === lastFourIc) {
        setIsVerified(true);
        setIcNumber(icNumberStr);
        setBankName(selectedEmployee['Bank Name']);
        setBankAccountNumber(String(selectedEmployee['Bank Account No.']));
      } else {
        alert('Invalid last 4 digits of IC/Passport No.');
      }
    } else {
      alert('Employee not found.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFiles(selectedFile);
      setAmountRM(0);

      const fileType = selectedFile.type;
      if (fileType.startsWith('image/') || fileType === 'application/pdf') {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);

    // Extract amount
    const amountRegex = /(Total Amt|Nett Sales|Paid|Total|Amount|Amt|Subtotal|Balance)[\s:RM]*(\d+\.\d{2})/gi;
    const amountMatches = [...text.matchAll(amountRegex)];
    if (amountMatches.length > 0) {
      const lastMatch = amountMatches[amountMatches.length - 1];
      setAmountRM(parseFloat(lastMatch[2]));
    }

    // Extract item
    const lines = text.split('\n');
    const itemRegex = /^(?!(Total|Nett Sales|Paid|Change|Credit Card|Item\(s\)|Balance|Subtotal))(.*?)\s+RM\s+\d+\.\d{2}/i;
    for (const line of lines) {
      const itemMatch = line.match(itemRegex);
      if (itemMatch && itemMatch[2]) {
        setItemName(itemMatch[2].trim());
        break; // Stop after finding the first item
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onClaimSubmit({ items: itemName, amount: amountRM });
    setShowPopup(true);
    setName('');
    setIcNumber('');
    setClaimPurpose('');
    setBankName('');
    setBankAccountNumber('');
    setFiles(null);
    setItemName('');
    setAmountRM(0);
    setIsVerified(false);
    setLastFourIc('');
    setFilePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <select
          id="name"
          value={name}
          onChange={handleNameChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">-- Select your name --</option>
          {employeeData.map((employee) => (
            <option key={employee['Full Name']} value={employee['Full Name']}>
              {employee['Full Name']}
            </option>
          ))}
        </select>
      </div>

      {name && (
        <div>
          <label htmlFor="lastFourIc" className="block text-sm font-medium text-gray-700">Last 4 digits of IC/ Passport No.</label>
          <div className="flex items-center">
            <input
              type="text"
              id="lastFourIc"
              value={lastFourIc}
              onChange={(e) => setLastFourIc(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              maxLength={4}
            />
            <button
              type="button"
              onClick={handleIcVerification}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Verify
            </button>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="icNumber" className="block text-sm font-medium text-gray-700">IC/ Passport No.</label>
        <input
          type="text"
          id="icNumber"
          value={icNumber}
          readOnly
          className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
        <input
          type="text"
          id="bankName"
          value={bankName}
          readOnly
          className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">Bank Account Number</label>
        <input
          type="text"
          id="bankAccountNumber"
          value={bankAccountNumber}
          readOnly
          className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>
      <div className={`${!isVerified ? 'opacity-50 pointer-events-none' : ''}`}>
        <div>
          <label htmlFor="claimPurpose" className="block text-sm font-medium text-gray-700">Claim Purpose</label>
          <select
            id="claimPurpose"
            value={claimPurpose}
            onChange={(e) => setClaimPurpose(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Select a purpose --</option>
            <option value="9001-100 Company Event">9001-100 Company Event</option>
            <option value="9001-101 Campaign Expenses">9001-101 Campaign Expenses</option>
            <option value="9001-102 Edu & Sports Claim">9001-102 Edu & Sports Claim</option>
            <option value="9001-103 Dental Claim">9001-103 Dental Claim</option>
            <option value="9001-104 Medical Claim">9001-104 Medical Claim</option>
            <option value="9001-105 Team Lunch Claim">9001-105 Team Lunch Claim</option>
            <option value="9001-106 Subscription Claim">9001-106 Subscription Claim</option>
            <option value="9001-107 Mileage Claim">9001-107 Mileage Claim</option>
            <option value="9001-108 BU Claim">9001-108 BU Claim</option>
            <option value="9001-109 Others">9001-109 Others</option>
          </select>
        </div>
        <div className="my-8">
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
          <p className="text-sm text-gray-500 mt-2">NOTE : please upload ONE invoice/ receipt at a time</p>
        </div>

        {filePreview && files && (
          <div className="my-4">
            <h3 className="text-lg font-semibold">Preview:</h3>
            {files.type.startsWith('image/') ? (
              <img src={filePreview} alt="Invoice/Receipt Preview" className="mt-2 rounded-md max-w-full h-auto" />
            ) : (
              <iframe src={filePreview} className="mt-2 w-full h-96" title="Invoice/Receipt Preview"></iframe>
            )}
          </div>
        )}

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

        <div className="mt-8">
          <label htmlFor="amountRM" className="block text-sm font-medium text-gray-700">Amount (RM)</label>
          <input
            type="number"
            id="amountRM"
            value={amountRM || ''}
            onChange={(e) => setAmountRM(parseFloat(e.target.value) || 0)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-8">
          Submit
        </button>
      </div>


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
