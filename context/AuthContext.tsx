
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  mobile?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  getUsers: () => User[];
  updateUserCredentials: (userId: string, updates: { email?: string; mobile?: string; pass?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIX: Create an internal `UserRecord` type that includes the `pass` property.
// This resolves type errors when accessing `pass` for authentication,
// while keeping the public `User` type clean of sensitive data.
type UserRecord = User & { pass?: string };

// Dummy user data
const DUMMY_USERS: UserRecord[] = [
  { id: 'admin1', email: 'admin@store.com', mobile: '1234567890', pass: 'admin123', role: 'admin' },
  { id: 'user1', email: 'user@store.com', mobile: '9876543210', pass: 'user123', role: 'user' },
  { id: 'google_user', email: 'google.user@gmail.com', mobile: '1112223334', role: 'user' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserRecord[]>(() => {
    try {
      const storedUsers = localStorage.getItem('app_users');
      return storedUsers ? JSON.parse(storedUsers) : DUMMY_USERS;
    } catch (error) {
      console.error("Failed to parse users from local storage", error);
      return DUMMY_USERS;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('app_users', JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to local storage", error);
    }
  }, [users]);

  const performLogin = (foundUser: UserRecord) => {
      const { pass, ...loggedInUser } = foundUser;
      setUser(loggedInUser);
      sessionStorage.setItem('user', JSON.stringify(loggedInUser));
  }

  const login = async (identifier: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => { 
        const identifierLower = identifier.toLowerCase();
        const foundUser = users.find(u => 
            (u.email.toLowerCase() === identifierLower || u.mobile === identifier) && u.pass === pass
        );
        
        if (foundUser) {
          performLogin(foundUser);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const loginWithGoogle = async () => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            const googleUser = users.find(u => u.id === 'google_user');
            if (googleUser) {
                performLogin(googleUser);
            }
            resolve();
        }, 500);
    });
  }
  
  const getUsers = () => {
    return users.map(({ pass, ...user }) => user);
  };

  const updateUserCredentials = async (userId: string, updates: { email?: string, mobile?: string, pass?: string }) => {
      return new Promise<void>((resolve) => {
          setTimeout(() => {
              setUsers(currentUsers => 
                  currentUsers.map(u => {
                      if (u.id === userId) {
                          const finalUpdates = { ...updates };
                          if (finalUpdates.pass === '') {
                              delete finalUpdates.pass;
                          }
                          return { ...u, ...finalUpdates };
                      }
                      return u;
                  })
              );
              resolve();
          }, 500);
      });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    // Also revoke any object URLs created for image previews
    const productsStr = localStorage.getItem('products');
    if (productsStr) {
      try {
        const products = JSON.parse(productsStr);
        products.forEach((p: { image: string }) => {
            if (p.image && p.image.startsWith('blob:')) {
            URL.revokeObjectURL(p.image);
          }
        });
      } catch (e) {
        console.error("Failed to parse products from local storage on logout", e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, loginWithGoogle, getUsers, updateUserCredentials }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
