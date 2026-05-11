import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Handle Login started with:", { email, password });
    setLoading(true);
    setError(null);
    try {
      console.log("Calling login service...");
      const response = await login({ email, password });
      console.log("Login success, response:", response);
      
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('role', response.role);
      
      console.log("Redirecting based on role:", response.role);
      
      // Chuyển hướng linh hoạt theo quyền
      switch (response.role) {
        case 'ADMIN':
          navigate('/dashboard');
          break;
        case 'DOCTOR':
          navigate('/daily-patients');
          break;
        case 'RECEPTIONIST':
          navigate('/patients');
          break;
        case 'TECHNICIAN':
          navigate('/lab-tests');
          break;
        case 'PHARMACIST':
          navigate('/pharmacy-inventory');
          break;
        case 'ACCOUNTANT':
          navigate('/billing');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login failed error object:', err);
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
      console.log("Handle Login finished.");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-[24px] shadow-ambient overflow-hidden">
        {/* Generous asymmetrical padding per DESIGN.md */}
        <div className="pt-14 px-10 pb-12">
          <div className="mb-12 text-center">
            {/* The Clinical Curator branding icon */}
            <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h1 className="font-display text-[2rem] leading-tight font-semibold text-on-surface tracking-tight mb-3">
              Chào mừng trở lại
            </h1>
            <p className="text-on-surface-variant font-body text-[0.95rem]">
              Đăng nhập để truy cập hệ thống quản lý y tế
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container/10 border border-error/20 rounded-xl flex items-center gap-3 text-error animate-shake">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-7">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold tracking-wider uppercase text-on-surface-variant">
                Địa chỉ Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body px-4 py-3.5 rounded-xl border border-transparent focus:bg-surface-container-lowest focus:border-outline-variant focus:ring-0 outline-none transition-all duration-200"
                placeholder="bacsi@phongkham.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[0.75rem] font-bold tracking-wider uppercase text-on-surface-variant">
                  Mật khẩu
                </label>
                <a href="#" className="text-[0.8rem] font-medium text-primary hover:text-primary-container transition-colors">
                  Quên mật khẩu?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body px-4 py-3.5 rounded-xl border border-transparent focus:bg-surface-container-lowest focus:border-outline-variant focus:ring-0 outline-none transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-container hover:opacity-90 text-white font-bold text-[0.875rem] rounded-xl py-4 transition-all duration-200 shadow-sm disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-10 pt-6 text-center">
             <p className="text-xs text-on-surface-variant/60 font-medium">
                Cổng Thông Tin Lâm Sàng v1.0
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
