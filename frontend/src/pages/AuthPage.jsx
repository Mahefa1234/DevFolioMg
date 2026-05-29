import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register, checkUsername } from '../api';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register form state
  const [regData, setRegData] = useState({ prenom: '', nom: '', email: '', username: '', password: '' });
  const [usernameStatus, setUsernameStatus] = useState({ msg: '', ok: null });
  const [pwdStrength, setPwdStrength] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(loginData);
      loginUser(res.data.token, res.data.user);
      toast.success(`Bon retour, ${res.data.user.prenom} !`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!document.getElementById('terms').checked) {
      return toast.error('Accepte les conditions d\'utilisation');
    }
    setLoading(true);
    try {
      const res = await register(regData);
      loginUser(res.data.token, res.data.user);
      toast.success('Compte créé ! Bienvenue sur DevFolioMG 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  let usernameTimer;
  const handleUsernameChange = (val) => {
    setRegData(p => ({ ...p, username: val }));
    clearTimeout(usernameTimer);
    if (!val) { setUsernameStatus({ msg: '', ok: null }); return; }
    setUsernameStatus({ msg: '⏳ Vérification...', ok: null });
    usernameTimer = setTimeout(async () => {
      if (val.length < 3) { setUsernameStatus({ msg: '✗ Minimum 3 caractères', ok: false }); return; }
      try {
        const res = await checkUsername(val);
        setUsernameStatus({ msg: res.data.available ? `✓ devfoliomg.mg/${val} est disponible !` : '✗ Ce nom est déjà pris', ok: res.data.available });
      } catch { setUsernameStatus({ msg: 'Erreur de vérification', ok: false }); }
    }, 600);
  };

  const checkPwd = (val) => {
    setRegData(p => ({ ...p, password: val }));
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setPwdStrength(score);
  };

  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort'];

  return (
    <div className="min-h-screen bg-[#f6f5f0] flex flex-col">
      {/* Nav */}
      <nav className="h-[60px] bg-[#f6f5f0]/90 backdrop-blur border-b border-[#e2e1d8] flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/" className="text-[#9a9a8a] text-sm flex items-center gap-1.5 hover:text-[#1a1a14] transition-colors">
          ← Retour
        </Link>
        <Link to="/" className="font-mono text-sm font-medium flex items-center gap-1.5 text-[#1a1a14]">
          <span className="w-2 h-2 rounded-full bg-[#25a058] inline-block animate-pulse"></span>
          DevFolioMG
        </Link>
        <span className="w-16"></span>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          {/* Tabs */}
          <div className="flex bg-[#eeede6] rounded-2xl p-1 mb-6 border border-[#e2e1d8]">
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${tab === t ? 'bg-white text-[#1a1a14] shadow-sm' : 'text-[#4a4a40]'}`}>
                {t === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-[#e2e1d8] p-8">

            {/* LOGIN */}
            {tab === 'login' && (
              <form onSubmit={handleLogin}>
                <h1 className="text-xl font-serif font-normal mb-1">Bon retour 👋</h1>
                <p className="text-sm text-[#4a4a40] mb-6">Connecte-toi pour accéder à ton portfolio.</p>

                <div className="mb-4">
                  <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">Email</label>
                  <input type="email" value={loginData.email} onChange={e => setLoginData(p => ({...p, email: e.target.value}))}
                    placeholder="ton@email.com" required
                    className="w-full px-4 py-2.5 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm outline-none focus:border-[#1d6a40] focus:ring-2 focus:ring-[#1d6a40]/10 transition-all"/>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest">Mot de passe</label>
                    <a href="#" className="text-xs text-[#1d6a40] hover:underline">Oublié ?</a>
                  </div>

                  <Link to="/forgot-password" className="text-xs text-[#1d6a40] hover:underline">
                    Mot de passe oublié ?
                  </Link>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={loginData.password} onChange={e => setLoginData(p => ({...p, password: e.target.value}))}
                      placeholder="••••••••" required
                      className="w-full px-4 py-2.5 pr-10 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm outline-none focus:border-[#1d6a40] focus:ring-2 focus:ring-[#1d6a40]/10 transition-all"/>
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a8a] hover:text-[#4a4a40]">
                      {showPwd ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-5">
                  <input type="checkbox" id="remember" className="accent-[#1d6a40]"/>
                  <label htmlFor="remember" className="text-sm text-[#4a4a40]">Se souvenir de moi</label>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-2.5 bg-[#1a1a14] text-white rounded-full text-sm font-semibold hover:bg-[#2a2a20] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="animate-spin">⟳</span> Connexion...</> : '→ Se connecter'}
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-[#e2e1d8]"></div>
                  <span className="text-xs text-[#9a9a8a]">ou</span>
                  <div className="flex-1 h-px bg-[#e2e1d8]"></div>
                </div>

                <button type="button" className="w-full py-2.5 border border-[#c8c7bc] rounded-full text-sm font-medium hover:bg-[#f6f5f0] transition-all flex items-center justify-center gap-2">
                  <GoogleIcon/> Continuer avec Google
                </button>

                <p className="text-center text-sm text-[#4a4a40] mt-5">
                  Pas de compte ? <button type="button" onClick={() => setTab('register')} className="text-[#1d6a40] font-semibold hover:underline">S'inscrire</button>
                </p>
              </form>
            )}

            {/* REGISTER */}
            {tab === 'register' && (
              <form onSubmit={handleRegister}>
                <h1 className="text-xl font-serif font-normal mb-1">Créer mon compte</h1>
                <p className="text-sm text-[#4a4a40] mb-6">100% gratuit — aucune carte bancaire requise.</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[['prenom','Prénom','Mahefa'],['nom','Nom','Iarantsoa']].map(([k,l,p]) => (
                    <div key={k}>
                      <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">{l}</label>
                      <input type="text" value={regData[k]} onChange={e => setRegData(prev => ({...prev, [k]: e.target.value}))}
                        placeholder={p} required
                        className="w-full px-3 py-2.5 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm outline-none focus:border-[#1d6a40] focus:ring-2 focus:ring-[#1d6a40]/10 transition-all"/>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">Nom d'utilisateur</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9a9a8a] font-mono pointer-events-none">devfoliomg.mg/</span>
                    <input type="text" value={regData.username} onChange={e => handleUsernameChange(e.target.value)}
                      placeholder="tonnom" required
                      className="w-full pl-[130px] pr-3 py-2.5 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm font-mono outline-none focus:border-[#1d6a40] focus:ring-2 focus:ring-[#1d6a40]/10 transition-all"/>
                  </div>
                  {usernameStatus.msg && (
                    <p className={`text-xs mt-1 ${usernameStatus.ok === true ? 'text-green-600' : usernameStatus.ok === false ? 'text-red-500' : 'text-[#9a9a8a]'}`}>
                      {usernameStatus.msg}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">Email</label>
                  <input type="email" value={regData.email} onChange={e => setRegData(p => ({...p, email: e.target.value}))}
                    placeholder="ton@email.com" required
                    className="w-full px-4 py-2.5 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm outline-none focus:border-[#1d6a40] focus:ring-2 focus:ring-[#1d6a40]/10 transition-all"/>
                </div>

                <div className="mb-4">
                  <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={regData.password} onChange={e => checkPwd(e.target.value)}
                      placeholder="Minimum 8 caractères" required
                      className="w-full px-4 py-2.5 pr-10 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm outline-none focus:border-[#1d6a40] focus:ring-2 focus:ring-[#1d6a40]/10 transition-all"/>
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a8a]">
                      {showPwd ? '🙈' : '👁'}
                    </button>
                  </div>
                  {regData.password && (
                    <>
                      <div className="flex gap-1 mt-1.5">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwdStrength ? strengthColors[pwdStrength-1] : 'bg-[#e2e1d8]'}`}></div>
                        ))}
                      </div>
                      <p className="text-xs mt-1 text-[#9a9a8a]">{pwdStrength > 0 ? strengthLabels[pwdStrength-1] : ''}</p>
                    </>
                  )}
                </div>

                <div className="flex items-start gap-2 mb-5">
                  <input type="checkbox" id="terms" className="accent-[#1d6a40] mt-0.5"/>
                  <label htmlFor="terms" className="text-xs text-[#4a4a40] leading-relaxed">
                    J'accepte les <a href="#" className="text-[#1d6a40] font-medium">conditions d'utilisation</a> et la <a href="#" className="text-[#1d6a40] font-medium">politique de confidentialité</a>
                  </label>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-2.5 bg-[#1a1a14] text-white rounded-full text-sm font-semibold hover:bg-[#2a2a20] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><span className="animate-spin">⟳</span> Création...</> : '🚀 Créer mon portfolio gratuitement'}
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-[#e2e1d8]"></div>
                  <span className="text-xs text-[#9a9a8a]">ou</span>
                  <div className="flex-1 h-px bg-[#e2e1d8]"></div>
                </div>

            <button type="button" 
  onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
  className="w-full py-2.5 border border-[#c8c7bc] rounded-full text-sm font-medium hover:bg-[#eeede6] transition-all flex items-center justify-center gap-2 text-[#1a1a14]">
  <GoogleIcon/> Continuer avec Google
</button>
        
                <p className="text-center text-sm text-[#4a4a40] mt-5">
                  Déjà un compte ? <button type="button" onClick={() => setTab('login')} className="text-[#1d6a40] font-semibold hover:underline">Se connecter</button>
                </p>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-[#9a9a8a] mt-4">🇲🇬 DevFolioMG · 100% gratuit pour toujours</p>
        </div>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
