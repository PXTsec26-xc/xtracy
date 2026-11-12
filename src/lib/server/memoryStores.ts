import { DbIncidentRecord, DbSavedReport, DbScanHistoryItem, DbVaultNote } from './models';

/**
 * Shared in-memory runtime stores for non-database deployments.
 * Centralizing them enables verifiable per-user purge via /api/user/privacy.
 */

export const userScansStore = new Map<string, DbScanHistoryItem[]>();
export const userBookmarksStore = new Map<string, DbSavedReport[]>();
export const userIncidentsStore = new Map<string, DbIncidentRecord[]>();
export const userVaultStore = new Map<string, DbVaultNote[]>();
export const userCasesStore = new Map<string, DbIncidentRecord[]>();
export const userFootprintsStore = new Map<string, any[]>();
export const nexusCasesStore = new Map<string, any[]>();

export function purgeAllUserMemoryStores(userId: string): {
  scansRemoved: number;
  bookmarksRemoved: number;
  incidentsRemoved: number;
  vaultRemoved: number;
  casesRemoved: number;
  footprintsRemoved: number;
  nexusCasesRemoved: number;
} {
  const counts = {
    scansRemoved: (userScansStore.get(userId) || []).length,
    bookmarksRemoved: (userBookmarksStore.get(userId) || []).length,
    incidentsRemoved: (userIncidentsStore.get(userId) || []).length,
    vaultRemoved: (userVaultStore.get(userId) || []).length,
    casesRemoved: (userCasesStore.get(userId) || []).length,
    footprintsRemoved: (userFootprintsStore.get(userId) || []).length,
    nexusCasesRemoved: (nexusCasesStore.get(userId) || []).length,
  };

  userScansStore.delete(userId);
  userBookmarksStore.delete(userId);
  userIncidentsStore.delete(userId);
  userVaultStore.delete(userId);
  userCasesStore.delete(userId);
  userFootprintsStore.delete(userId);
  nexusCasesStore.delete(userId);

  return counts;
}
