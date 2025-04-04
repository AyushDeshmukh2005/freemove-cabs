
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'rider' | 'driver';
  profilePicture?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in (from localStorage for now)
    const storedUser = localStorage.getItem('gocabs-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // Mocking a successful login for demo purposes
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        phone: '+1234567890',
        type: 'rider',
        profilePicture: 'https://i.pravatar.cc/150?u=john'
      };
      
      // Save to localStorage for persistence across refreshes
      localStorage.setItem('gocabs-user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: Omit<User, 'id'> & { password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // Mocking a successful signup for demo purposes
      const mockUser: User = {
        id: '1',
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        type: userData.type,
        profilePicture: userData.profilePicture
      };
      
      // Save to localStorage for persistence across refreshes
      localStorage.setItem('gocabs-user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('gocabs-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
