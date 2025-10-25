import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRecord } from '../types';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, mobile: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  getUsers: () => User[];
  updateUserCredentials: (userId: string, updates: { name?: string; email?: string; mobile?: string; pass?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserRecord[]>(() => {
    try {
      const storedUsers = localStorage.getItem('app_users');
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error("Failed to parse users from local storage", error);
      return [];
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

  const signup = async (name: string, email: string, mobile: string, pass: string) => {
      return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
              const emailLower = email.toLowerCase();
              const existingUser = users.find(u => u.email.toLowerCase() === emailLower || u.mobile === mobile);
              if (existingUser) {
                  reject(new Error('User with this email or mobile already exists.'));
                  return;
              }

              const newUser: UserRecord = {
                  id: `user${Date.now()}`,
                  name,
                  email,
                  mobile,
                  pass,
                  role: 'user'
              };

              setUsers(prev => [...prev, newUser]);
              resolve();
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

  const updateUserCredentials = async (userId: string, updates: { name?: string, email?: string, mobile?: string, pass?: string }) => {
      return new Promise<void>((resolve) => {
          setTimeout(() => {
              setUsers(currentUsers => 
                  currentUsers.map(u => {
                      if (u.id === userId) {
                          const finalUpdates: Partial<UserRecord> = { ...updates };
                           if ('pass' in finalUpdates && finalUpdates.pass === '') {
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
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, loginWithGoogle, getUsers, updateUserCredentials }}>
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
