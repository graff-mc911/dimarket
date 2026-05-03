import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getTranslation } from '../lib/Translations/i18n';
import type { TranslationKey } from '../lib/Translations/i18n';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm border max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold text-center">
          {getTranslation('login_title' as TranslationKey) || 'Вхід'}
        </h2>
        {error && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</p>}
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input type="email" required placeholder="Email" className="w-full pl-10 pr-4 py-2 border rounded-lg" onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input type="password" required placeholder="Password" className="w-full pl-10 pr-4 py-2 border rounded-lg" onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex justify-center items-center">
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Увійти'}
        </button>
      </form>
    </div>
  );
};

export default Login;