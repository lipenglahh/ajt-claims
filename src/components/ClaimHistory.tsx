'use client';

import { useState } from 'react';

const mockClaims = [
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
];

export default function ClaimHistory() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Items</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Amount</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Approval Date</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {mockClaims.map((claim) => (
            <tr key={claim.id}>
              <td className="text-left py-3 px-4">{claim.date}</td>
              <td className="text-left py-3 px-4">{claim.items}</td>
              <td className="text-left py-3 px-4">${claim.amount.toFixed(2)}</td>
              <td className="text-left py-3 px-4">{claim.status}</td>
              <td className="text-left py-3 px-4">{claim.approvalDate || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
