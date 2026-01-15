import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContextType, User } from '../types';
import axios from 'axios';



// Creating the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS = [
  { id: '1', email: 'user@example.com', password: 'password', name: 'Demo User' }
];

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('comix_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        localStorage.removeItem('comix_user');
      }    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
  
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        username: "",
        email,
        password
      });
      const data = response.data
      localStorage.setItem('comix_user', JSON.stringify(data)); 
      setUser(data);
      // המשך טיפול בתגובה
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const login = async (email: string, password: string): Promise<void> => {
  //   setIsLoading(true);


  //   // לעדכן לשימוש בAxios
  //   const response = await fetch('http://localhost:8000/auth/login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({"username": "" ,"email": email, "password": password }),
  //   });

  //   if (!response.ok) {
  //     setIsLoading(false);
  //     throw new Error('Invalid email or password');
  //   }

  //   const data = await response.json();
  //   localStorage.setItem('comix_user', JSON.stringify(data)); 

  //   // localStorage.setItem('token', data["token"].token);
  //   // const foundUser = data["user"]; 

  //   // Remove password from user object
  //   // const { password: _, ...userWithoutPassword } = foundUser;
    
  //   // Store user in state and localStorage
  //   setUser(data);
  //   // localStorage.setItem('comix_user', JSON.stringify(userWithoutPassword));
    
  //   setIsLoading(false);
  // };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    const response = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "username": name, "email": email, "password": password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      setIsLoading(false);
      throw new Error(errorData.message || 'Registration failed');
    }
  
    const userData = await response.json();
    setUser(userData); 


    localStorage.setItem('comix_user', JSON.stringify(userData)); 
    setIsLoading(false);
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('comix_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};