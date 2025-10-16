'use client';

import { useState } from 'react';
import ClaimForm from '@/components/ClaimForm';
import ClaimHistory from '@/components/ClaimHistory';

export interface Claim {
  id: number;
  date: string;
  items: string;
  amount: number;
  status: string;
  approvalDate: string | null;
}

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('submit');
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: 1,
      date: '2023-10-26',
      items: 'Laptop Charger',
      amount: 75.0,
      status: 'Approved',
      approvalDate: '2023-10-27',
    },
    {
      id: 2,
      date: '2023-10-24',
      items: 'Client Lunch',
      amount: 120.5,
      status: 'Pending',
      approvalDate: null,
    },
    {
      id: 3,
      date: '2023-10-22',
      items: 'Office Supplies',
      amount: 45.25,
      status: 'Rejected',
      approvalDate: null,
    },
  ]);

  const handleClaimSubmit = (newClaim: Omit<Claim, 'id' | 'date' | 'status' | 'approvalDate'>) => {
    setClaims((prevClaims) => [
      ...prevClaims,
      {
        ...newClaim,
        id: prevClaims.length + 1,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        approvalDate: null,
      },
    ]);
  };

  return (
    <div>
      <div className="flex border-b">
        <button
          className={`py-2 px-4 ${activeTab === 'submit' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('submit')}
        >
          Submit Claim
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'history' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Claim History
        </button>
      </div>
      <div className="py-4">
        {activeTab === 'submit' && <ClaimForm onClaimSubmit={handleClaimSubmit} />}
        {activeTab === 'history' && <ClaimHistory claims={claims} />}
      </div>
    </div>
  );
}
