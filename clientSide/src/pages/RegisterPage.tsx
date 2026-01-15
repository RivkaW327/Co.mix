import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ComixLogo from '../assets/comixLogo';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formData = new FormData();

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try{
        await register(name, email, password);
        navigate('/generate');

    } catch (err) {
        setError((err as Error).message);
    } finally {
        setIsSubmitting(false);
    }

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
          <h1 className="text-3xl font-comic mb-2">Create an Account</h1>
          <p className="text-neutral-600">Start your comic creation journey today</p>
        </div>
        
        {error && (
          <div className="bg-error-light text-error-dark p-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
              placeholder="Your Name"
            />
          </div>
          
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
            <label htmlFor="password" className="form-label">Password</label>
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
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-blue hover:underline font-medium">
              Sign in
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

export default RegisterPage;