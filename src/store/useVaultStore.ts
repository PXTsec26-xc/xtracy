import { create } from 'zustand';
import { VaultNote } from '@/types';
import { encryptData, decryptData } from '@/lib/crypto';

interface EncryptedVaultRecord {
  id: string;
  ciphertextHex: string;
  ivHex: string;
  saltHex: string;
  createdAt: string;
}

interface VaultState {
  passphrase: string | null;
  isUnlocked: boolean;
  notes: VaultNote[];
  encryptedRecords: EncryptedVaultRecord[];
  error: string | null;

  unlockVault: (passphrase: string) => Promise<boolean>;
  lockVault: () => void;
  addNote: (title: string, category: VaultNote['category'], content: string, evidenceRef?: string) => Promise<boolean>;
  deleteNote: (id: string) => Promise<void>;
  purgeVault: () => void;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  passphrase: null,
  isUnlocked: false,
  notes: [],
  encryptedRecords: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('xtracy_vault_encrypted') || '[]')
    : [],
  error: null,

  unlockVault: async (passphrase: string) => {
    try {
      set({ error: null });
      const records: EncryptedVaultRecord[] = JSON.parse(
        localStorage.getItem('xtracy_vault_encrypted') || '[]'
      );

      if (records.length === 0) {
        // Vault empty, unlock with this new passphrase
        set({ passphrase, isUnlocked: true, notes: [], encryptedRecords: [] });
        return true;
      }

      // Try decrypting the first record to verify passphrase
      const decryptedNotes: VaultNote[] = [];
      for (const rec of records) {
        const jsonStr = await decryptData(rec.ciphertextHex, rec.ivHex, rec.saltHex, passphrase);
        const noteObj: VaultNote = JSON.parse(jsonStr);
        decryptedNotes.push(noteObj);
      }

      set({ passphrase, isUnlocked: true, notes: decryptedNotes, encryptedRecords: records });
      return true;
    } catch (err) {
      set({ error: 'Incorrect passphrase or corrupt encrypted vault data.' });
      return false;
    }
  },

  lockVault: () => {
    set({ passphrase: null, isUnlocked: false, notes: [], error: null });
  },

  addNote: async (title, category, content, evidenceRef) => {
    const { passphrase, notes } = get();
    if (!passphrase) {
      set({ error: 'Vault is locked.' });
      return false;
    }

    try {
      const newNote: VaultNote = {
        id: 'note-' + Date.now(),
        title,
        category,
        timestamp: new Date().toISOString(),
        content,
        evidenceReference: evidenceRef,
        checklistState: {},
      };

      const jsonStr = JSON.stringify(newNote);
      const { ciphertextHex, ivHex, saltHex } = await encryptData(jsonStr, passphrase);

      const record: EncryptedVaultRecord = {
        id: newNote.id,
        ciphertextHex,
        ivHex,
        saltHex,
        createdAt: newNote.timestamp,
      };

      const updatedRecords = [...get().encryptedRecords, record];
      localStorage.setItem('xtracy_vault_encrypted', JSON.stringify(updatedRecords));

      set({
        notes: [newNote, ...notes],
        encryptedRecords: updatedRecords,
      });

      return true;
    } catch (err) {
      set({ error: 'Encryption failed.' });
      return false;
    }
  },

  deleteNote: async (id: string) => {
    const updatedNotes = get().notes.filter((n) => n.id !== id);
    const updatedRecords = get().encryptedRecords.filter((r) => r.id !== id);
    localStorage.setItem('xtracy_vault_encrypted', JSON.stringify(updatedRecords));
    set({ notes: updatedNotes, encryptedRecords: updatedRecords });
  },

  purgeVault: () => {
    localStorage.removeItem('xtracy_vault_encrypted');
    set({ passphrase: null, isUnlocked: false, notes: [], encryptedRecords: [], error: null });
  },
}));
