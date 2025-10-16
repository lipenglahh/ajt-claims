import { Claim } from './Tabs';

interface ClaimHistoryProps {
  claims: Claim[];
}

export default function ClaimHistory({ claims }: ClaimHistoryProps) {
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
          {claims.map((claim) => (
            <tr key={claim.id}>
              <td className="text-left py-3 px-4">{claim.date}</td>
              <td className="text-left py-3 px-4">{claim.items}</td>
              <td className="text-left py-3 px-4">RM{claim.amount.toFixed(2)}</td>
              <td className="text-left py-3 px-4">{claim.status}</td>
              <td className="text-left py-3 px-4">{claim.approvalDate || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
