import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

type Role = 'pro' | 'client' | null;

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  userName: string | null;
  email: string | null;
  signIn: (role: Role, name: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: (role: Role) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  role: null,
  userName: null,
  email: null,
  signIn: async () => {},
  signOut: async () => {},
  switchRole: async () => {},
  isLoading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const storedRole = await SecureStore.getItemAsync('sherpa_role');
      const storedName = await SecureStore.getItemAsync('sherpa_name');
      const storedEmail = await SecureStore.getItemAsync('sherpa_email');
      if (storedRole) {
        setRole(storedRole as Role);
        setUserName(storedName);
        setEmail(storedEmail);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('Auth load failed:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(newRole: Role, name: string, newEmail: string) {
    await SecureStore.setItemAsync('sherpa_role', newRole ?? '');
    await SecureStore.setItemAsync('sherpa_name', name);
    await SecureStore.setItemAsync('sherpa_email', newEmail);
    setRole(newRole);
    setUserName(name);
    setEmail(newEmail);
    setIsAuthenticated(true);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('sherpa_role');
    await SecureStore.deleteItemAsync('sherpa_name');
    await SecureStore.deleteItemAsync('sherpa_email');
    setRole(null);
    setUserName(null);
    setEmail(null);
    setIsAuthenticated(false);
  }

  async function switchRole(newRole: Role) {
    await SecureStore.setItemAsync('sherpa_role', newRole ?? '');
    setRole(newRole);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, userName, email, signIn, signOut, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
