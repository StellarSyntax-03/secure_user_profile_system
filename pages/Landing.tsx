import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center z-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs font-medium text-primary mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AES-256 Encryption Standard
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Secure Identity <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Management System
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          A robust MERN-stack architecture demonstration featuring client-side encryption, 
          JWT authentication, and secure data handling at rest.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto">
            <button className="w-full px-8 py-3.5 bg-primary hover:bg-sky-400 text-white rounded-lg font-semibold shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5">
              Create Secure Account
            </button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full px-8 py-3.5 glass-panel text-white rounded-lg font-medium hover:bg-surface transition-all">
              Access Dashboard
            </button>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { title: "Zero Knowledge", desc: "Data is encrypted before it hits the database." },
            { title: "JWT Auth", desc: "Stateless session management with secure tokens." },
            { title: "Modern UI", desc: "Built with React 18, TypeScript and Tailwind." }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl glass-panel hover:bg-white/5 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;