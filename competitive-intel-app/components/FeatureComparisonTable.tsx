import React from 'react';
import { FeatureMatrixItem } from '@/lib/agents/competitiveIntel';

interface FeatureComparisonTableProps {
  matrix: Record<string, FeatureMatrixItem>;
  targetCompany: string;
}

export default function FeatureComparisonTable({ matrix, targetCompany }: FeatureComparisonTableProps) {
  const platforms = Object.keys(matrix);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800 bg-dark-800/60 backdrop-blur-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-dark-900/80 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
          <tr>
            <th className="py-3 px-4">Platform</th>
            <th className="py-3 px-4">Publisher Inventory</th>
            <th className="py-3 px-4">AI Automation & Bot Vetting</th>
            <th className="py-3 px-4">SaaS Hybrid Model</th>
            <th className="py-3 px-4">GEO / AEO Support</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60">
          {platforms.map((platform) => {
            const item = matrix[platform];
            const isTarget = platform.toLowerCase() === targetCompany.toLowerCase();
            return (
              <tr
                key={platform}
                className={isTarget ? 'bg-sky-500/10 font-medium text-white' : 'text-gray-300 hover:bg-gray-800/40'}
              >
                <td className="py-3 px-4 font-bold flex items-center gap-2">
                  {platform}
                  {isTarget && (
                    <span className="px-2 py-0.5 rounded text-[9px] bg-sky-500 text-white font-mono">
                      TARGET
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">{item.inventory}</td>
                <td className="py-3 px-4">{item.aiAutomation}</td>
                <td className="py-3 px-4">{item.saasModel}</td>
                <td className="py-3 px-4">{item.geoSupport}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
