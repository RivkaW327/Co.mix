import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GeneratePage from './pages/GeneratePage';
import MyWorksPage from './pages/MyWorksPage';
import StoryPage from './pages/StoryPage';
import { useAuth } from './context/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-blue border-t-transparent"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="generate"
              element={
                <PrivateRoute>
                  <GeneratePage />
                </PrivateRoute>
              }
            />
            <Route
              path="story"
              element={
                <PrivateRoute>
                  <StoryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="my-works"
              element={
                <PrivateRoute>
                  <MyWorksPage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;