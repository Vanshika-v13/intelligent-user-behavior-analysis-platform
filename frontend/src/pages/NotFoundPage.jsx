import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-[#0F172A] tracking-tight">404</h1>
        <p className="text-2xl font-bold text-[#64748B] mt-4">Page not found</p>
        <p className="text-[#94A3B8] mt-2 mb-8">Sorry, we couldn't find the page you're looking for.</p>
        <Link 
          to={ROUTES.HOME}
          className="inline-flex items-center justify-center px-8 py-3.5 bg-[#FF6B35] text-white rounded-xl font-bold shadow-sm hover:bg-[#E85D2C] hover:-translate-y-0.5 transition-all"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
