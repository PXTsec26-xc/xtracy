import { env } from './env';

export interface DatabaseHealth {
  connected: boolean;
  provider: string;
  fallbackMode: boolean;
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  if (env.IS_DATABASE_CONNECTED) {
    return {
      connected: true,
      provider: 'PostgreSQL / Production DB',
      fallbackMode: false,
    };
  }

  return {
    connected: true,
    provider: 'XTRACY Local Storage & Client Memory Store',
    fallbackMode: true,
  };
}
