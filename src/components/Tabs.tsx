'use client';

import { useState } from 'react';
import ClaimForm from '@/components/ClaimForm';
import ClaimHistory from '@/components/ClaimHistory';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('submit');

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
        {activeTab === 'submit' && <ClaimForm />}
        {activeTab === 'history' && <ClaimHistory />}
      </div>
    </div>
  );
}
