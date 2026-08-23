import React from 'react';
import { VaultManager } from '@/components/vault/VaultManager';
import { Badge } from '@/components/ui/Badge';
import { Lock } from 'lucide-react';

export const metadata = {
  title: 'Private XTRACY Safe Vault — AES-GCM Local Encrypted Notes',
};

export default function SafeVaultPage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Lock className="w-8 h-8 text-emerald-400" />
            Private XTRACY Safe Vault
          </h1>
          <Badge type="productStatus" value="AES-GCM ENCRYPTED" size="sm" />
        </div>
        <p className="text-xs text-gray-400">
          Client-side encrypted local storage for incident logs, evidence notes, timeline events, and account recovery checklists.
        </p>
      </div>

      <VaultManager />
    </div>
  );
}
