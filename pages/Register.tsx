import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { mockRegister } from '../services/mockServer';

interface RegisterProps {
  onLogin: (token: string, user: any) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    aadhaar: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.aadhaar.length < 12) {
      setError("Please enter a valid ID number");
      return;
    }

    setLoading(true);

    try {
      const response = await mockRegister(
        formData.name,
        formData.email,
        formData.aadhaar,
        formData.password
      );
      
      onLogin(response.token, response.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative">
       {/* Background */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/5 blur-[120px] -z-10" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-panel p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-400 text-sm">Join the secure secure identity network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <Input 
              label="Full Name" 
              name="name" 
              placeholder="John Doe" 
              value={formData.name} 
              onChange={handleChange}
              required 
            />
            
            <Input 
              label="Email Address" 
              name="email" 
              type="email" 
              placeholder="john@example.com" 
              value={formData.email} 
              onChange={handleChange}
              required 
            />

            <Input 
              label="Aadhaar / National ID Number" 
              name="aadhaar" 
              type="text" 
              placeholder="XXXX-XXXX-XXXX" 
              value={formData.aadhaar} 
              onChange={handleChange}
              required 
            />
            <p className="text-[10px] text-emerald-400 -mt-2 mb-4 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Will be encrypted with AES-256 at rest
            </p>

            <Input 
              label="Password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange}
              required 
            />

            <Input 
              label="Confirm Password" 
              name="confirmPassword" 
              type="password" 
              placeholder="••••••••" 
              value={formData.confirmPassword} 
              onChange={handleChange}
              required 
            />

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 mt-4 rounded-lg font-semibold text-white transition-all transform hover:-translate-y-0.5 ${
                loading 
                  ? 'bg-slate-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/25 hover:shadow-primary/40'
              }`}
            >
              {loading ? (
                 <span className="flex items-center justify-center gap-2">
                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                   Encrypting & Saving...
                 </span>
              ) : 'Register Securely'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">Already have an account? </span>
            <Link to="/login" className="text-primary hover:text-sky-300 font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;