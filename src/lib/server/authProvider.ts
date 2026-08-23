import { DbUser } from './models';
import { hashPassword, verifyPassword, generateToken } from './passwordCrypto';

const devUsersStore = new Map<string, DbUser>();
const devSessionsStore = new Map<string, string>(); // token -> userId

if (devUsersStore.size === 0) {
  const demoUser: DbUser = {
    id: 'user-demo-1',
    email: 'user@xtracy.org',
    passwordHash: hashPassword('XtracyPass123!'),
    fullName: 'Alex Morgan',
    userRole: 'Everyday User',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  devUsersStore.set(demoUser.email, demoUser);
}

export interface AuthProviderResult {
  user?: Omit<DbUser, 'passwordHash'>;
  token?: string;
  isDevFallback: boolean;
  providerName: string;
  error?: string;
}

export async function registerUser({
  email,
  password,
  fullName,
  userRole = 'Everyday User',
}: {
  email: string;
  password: string;
  fullName: string;
  userRole?: DbUser['userRole'];
}): Promise<AuthProviderResult> {
  const normalizedEmail = email.toLowerCase().trim();

  if (devUsersStore.has(normalizedEmail)) {
    return {
      isDevFallback: true,
      providerName: 'XTRACY Local Auth Service',
      error: 'An account with this email address already exists.',
    };
  }

  const newUser: DbUser = {
    id: 'user-' + Date.now(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    fullName: fullName.trim(),
    userRole,
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  devUsersStore.set(normalizedEmail, newUser);
  const token = generateToken(24);
  devSessionsStore.set(token, newUser.id);

  const { passwordHash: _, ...safeUser } = newUser;

  return {
    user: safeUser,
    token,
    isDevFallback: true,
    providerName: 'XTRACY Local Auth Service',
  };
}

export async function authenticateUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthProviderResult> {
  const normalizedEmail = email.toLowerCase().trim();
  const foundUser = devUsersStore.get(normalizedEmail);

  if (!foundUser) {
    return {
      isDevFallback: true,
      providerName: 'XTRACY Local Auth Service',
      error: 'Invalid email or password combination.',
    };
  }

  const isValid = verifyPassword(password, foundUser.passwordHash);
  if (!isValid) {
    return {
      isDevFallback: true,
      providerName: 'XTRACY Local Auth Service',
      error: 'Invalid email or password combination.',
    };
  }

  const token = generateToken(24);
  devSessionsStore.set(token, foundUser.id);

  const { passwordHash: _, ...safeUser } = foundUser;

  return {
    user: safeUser,
    token,
    isDevFallback: true,
    providerName: 'XTRACY Local Auth Service',
  };
}

export async function getUserBySessionToken(token: string): Promise<Omit<DbUser, 'passwordHash'> | null> {
  const userId = devSessionsStore.get(token);
  if (!userId) return null;

  const usersList = Array.from(devUsersStore.values());
  for (let i = 0; i < usersList.length; i++) {
    const user = usersList[i];
    if (user.id === userId) {
      const { passwordHash: _, ...safeUser } = user;
      return safeUser;
    }
  }

  return null;
}
