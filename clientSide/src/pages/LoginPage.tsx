import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ComixLogo from '../assets/comixLogo';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
  
    try {
      login(email, password);
      navigate('/generate');
    } catch (err) {
      setError((err as Error).message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // For demo purposes, fill with test credentials
  const fillTestCredentials = () => {
    setEmail('user@example.com');
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link to="/">
          <ComixLogo width={200} height={100} />
        </Link>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-comic mb-2">Welcome Back!</h1>
          <p className="text-neutral-600">Sign in to continue your comic creation journey</p>
        </div>
        
        {error && (
          <div className="bg-error-light text-error-dark p-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="form-label">Password</label>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="inline-block w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo account button */}
        <div className="mt-4">
          <button 
            onClick={fillTestCredentials}
            className="text-primary-blue hover:text-primary-blue hover:underline text-sm font-medium"
          >
            Use demo account
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-blue hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
      
      <div className="mt-8 text-center">
        <Link to="/" className="text-primary-blue hover:text-neutral-800 transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;