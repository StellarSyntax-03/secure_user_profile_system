import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { mockLogin } from '../services/mockServer';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await mockLogin(formData.email, formData.password);
      onLogin(response.token, response.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative">
      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-panel p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Enter your credentials to access the encrypted vault.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              label="Password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password} 
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
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:-translate-y-0.5 ${
                loading 
                  ? 'bg-slate-600 cursor-not-allowed' 
                  : 'bg-white text-darker hover:bg-slate-200'
              }`}
            >
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-400">Don't have an account? </span>
            <Link to="/register" className="text-primary hover:text-sky-300 font-medium transition-colors">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;