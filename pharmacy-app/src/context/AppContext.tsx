import React, { createContext, useContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

interface User {
  username: string;
  email: string;
  role: string;
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      const userGroups = await Auth.userGroups(userData.username);
      
      setUser({
        username: userData.username,
        email: userData.attributes.email,
        role: userGroups[0] || 'ATTENDANT',
      });
      
      setIsAdmin(userGroups.includes('ADMIN'));
    } catch (error) {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};