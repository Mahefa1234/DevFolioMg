import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── NAV ──
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 transition-all duration-300 ${scrolled ? 'bg-[#f6f5f0]/95 backdrop-blur shadow-sm border-b border-[#e2e1d8]' : 'bg-transparent'}`}>
      <Link to="/" className="font-mono text-sm font-medium flex items-center gap-1.5 text-[#1a1a14]">
        <span className="w-2 h-2 rounded-full bg-[#25a058] inline-block animate-pulse"></span>
        DevFolioMG
      </Link>
      <div className="hidden md:flex items-center gap-1">
        {['#features','#how','#templates'].map((href, i) => (
          <a key={href} href={href} className="text-sm text-[#4a4a40] px-3 py-1.5 rounded-full hover:bg-[#eeede6] hover:text-[#1a1a14] transition-all">
            {['Fonctionnalités','Comment ça marche','Templates'][i]}
          </a>
        ))}
      </div>
      {user ? (
        <Link to="/dashboard" className="px-4 py-2 bg-[#1a1a14] text-white text-sm font-semibold rounded-full hover:bg-[#2a2a20] transition-all">
          Mon dashboard →
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/auth" className="text-sm text-[#4a4a40] px-3 py-1.5 hover:text-[#1a1a14] transition-colors hidden sm:block">
            Connexion
          </Link>
          <Link to="/auth" className="px-4 py-2 bg-[#1a1a14] text-white text-sm font-semibold rounded-full hover:bg-[#2a2a20] transition-all">
            Créer mon portfolio
          </Link>
        </div>
      )}
    </nav>
  );
}

// ── HERO ──
function Hero() {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen pt-16 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(#e2e1d8_1px,transparent_1px),linear-gradient(90deg,#e2e1d8_1px,transparent_1px)] bg-[size:44px_44px] opacity-50 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_35%,black,transparent)]"></div>
      {/* Blobs */}
      <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(37,160,88,0.08),transparent_70%)] blur-[70px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-[-60px] w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(29,106,64,0.05),transparent_70%)] blur-[60px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#e8f5ee] border border-[#b8ddc8] text-[#1d6a40] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8 animate-[fadeUp_0.5s_ease_both]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25a058] animate-ping inline-block"></span>
          Fait pour les devs malgaches
        </div>

        {/* Title */}
        <h1 className="font-serif text-[clamp(2.8rem,7vw,6rem)] font-normal leading-[1.04] tracking-[-1.5px] mb-5 animate-[fadeUp_0.6s_0.08s_ease_both]">
          Ton portfolio,<br/>
          <em className="text-[#1d6a40]">en ligne en 5 minutes.</em>
        </h1>

        {/* Sub */}
        <p className="text-[clamp(0.95rem,1.8vw,1.1rem)] text-[#4a4a40] max-w-[500px] leading-[1.8] mb-8 animate-[fadeUp_0.6s_0.16s_ease_both]">
          DevFolioMG est le moyen le plus simple pour les développeurs malgaches de créer un portfolio professionnel — sans code, sans hébergement, sans prise de tête.
        </p>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap justify-center mb-4 animate-[fadeUp_0.6s_0.24s_ease_both]">
          <button onClick={() => navigate('/auth')}
            className="flex items-center gap-2 px-7 py-3 bg-[#1a1a14] text-white text-sm font-semibold rounded-full hover:bg-[#2a2a20] hover:-translate-y-0.5 hover:shadow-lg transition-all">
            🚀 Créer mon portfolio
          </button>
          <a href="#templates" className="px-7 py-3 border-[1.5px] border-[#c8c7bc] text-[#1a1a14] text-sm font-semibold rounded-full hover:border-[#1a1a14] hover:bg-[#eeede6] transition-all">
            Voir les templates
          </a>
        </div>
        <p className="text-xs text-[#9a9a8a] animate-[fadeUp_0.6s_0.32s_ease_both]">
          <strong className="text-[#4a4a40]">100% gratuit</strong> — aucune carte bancaire requise
        </p>

        {/* Browser Mockup */}
        <div className="mt-14 w-full max-w-[820px] animate-[fadeUp_0.7s_0.4s_ease_both]">
          <div className="bg-[#eeede6] border border-[#e2e1d8] border-b-0 rounded-t-xl px-4 py-2.5 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
            <div className="flex-1 mx-3 bg-white rounded px-3 py-1 font-mono text-xs text-[#9a9a8a]">devfoliomg.mg/mahefa</div>
          </div>
          <div className="bg-white border border-[#e2e1d8] rounded-b-xl grid grid-cols-[180px_1fr] min-h-[300px] overflow-hidden text-left">
            {/* Sidebar */}
            <div className="bg-[#f6f5f0] border-r border-[#e2e1d8] p-5 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e8f5ee] to-[#b8ddc8] flex items-center justify-center font-serif text-lg text-[#1d6a40] italic">M</div>
              <div>
                <div className="text-sm font-bold text-[#1a1a14]">Mahefa I.</div>
                <div className="text-xs text-[#9a9a8a]">Full Stack Developer</div>
              </div>
              <div className="inline-flex items-center gap-1 bg-[#e8f5ee] text-[#1d6a40] text-[0.6rem] font-semibold px-2 py-0.5 rounded-full w-fit">
                <span className="w-1 h-1 rounded-full bg-[#25a058]"></span> Disponible
              </div>
              <div className="mt-2">
                <div className="font-mono text-[0.55rem] text-[#9a9a8a] uppercase tracking-widest mb-1.5">Compétences</div>
                {[90, 78, 85].map((w, i) => (
                  <div key={i} className="h-1.5 bg-[#e2e1d8] rounded-full mb-1.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#1d6a40] to-[#25a058] rounded-full" style={{width:`${w}%`}}></div>
                  </div>
                ))}
              </div>
            </div>
            {/* Main */}
            <div className="p-6 flex flex-col gap-4">
              <div className="font-serif text-2xl text-[#1a1a14] leading-tight">
                Construire des choses qui <em className="text-[#1d6a40]">comptent</em> pour Madagascar.
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { ico:'🚀', name:'ShopMada', sub:'E-commerce', tags:['React','Node.js'] },
                  { ico:'🌱', name:'Mihary', sub:'Coopératives', tags:['C#','WPF'] },
                ].map(p => (
                  <div key={p.name} className="bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl p-3">
                    <div className="text-base mb-1">{p.ico}</div>
                    <div className="text-xs font-bold text-[#1a1a14]">{p.name}</div>
                    <div className="text-[0.62rem] text-[#9a9a8a] mb-2">{p.sub}</div>
                    <div className="flex gap-1 flex-wrap">
                      {p.tags.map(t => <span key={t} className="bg-white border border-[#e2e1d8] text-[#4a4a40] text-[0.58rem] px-1.5 py-0.5 rounded-full">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PROOF ──
function Proof() {
  const stats = [['500+','Portfolios créés'],['3','Templates'],['100%','Gratuit'],['5min','Pour être en ligne']];
  return (
    <div className="py-10 bg-white border-y border-[#e2e1d8]">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className="font-mono text-[0.65rem] text-[#9a9a8a] tracking-[0.16em] uppercase mb-6">La confiance des développeurs malgaches</p>
        <div className="flex justify-center gap-12 flex-wrap">
          {stats.map(([n, l]) => (
            <div key={l}>
              <span className="block font-serif text-[2.2rem] text-[#1a1a14]">{n}</span>
              <span className="block text-xs text-[#9a9a8a] mt-0.5">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FEATURES ──
function Features() {
  const feats = [
    { icon:'🎨', title:'Templates Professionnels', desc:'Choisis parmi des designs soignés, conçus pour impressionner les recruteurs dès le premier regard.' },
    { icon:'🔗', title:'Lien Personnalisé', desc:'Ton propre lien : devfoliomg.mg/tonnom — prêt à partager sur LinkedIn, GitHub, CV.' },
    { icon:'📄', title:'Export CV en PDF', desc:'Génère un CV professionnel depuis les données de ton portfolio en un seul clic.' },
    { icon:'⚡', title:'En ligne en 5 minutes', desc:"Pas de code, pas d'hébergement. Remplis ton profil, choisis un template — c'est en ligne." },
    { icon:'📊', title:'Statistiques de visites', desc:"Vois qui visite ton portfolio, d'où ils viennent et quels projets ils consultent le plus." },
    { icon:'📱', title:'100% Mobile', desc:'Chaque template est entièrement responsive — parfait sur tous les écrans et appareils.' },
  ];
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="font-mono text-[0.65rem] text-[#1d6a40] tracking-[0.18em] uppercase mb-2">Fonctionnalités</div>
        <h2 className="font-serif text-[clamp(2rem,3.8vw,3.2rem)] font-normal tracking-[-1px] leading-[1.1] mb-3">
          Tout ce qu'il te faut<br/>pour te <em className="text-[#1d6a40]">démarquer.</em>
        </h2>
        <p className="text-[#4a4a40] text-sm max-w-md leading-relaxed mb-12">
          DevFolioMG gère les parties complexes pour que tu puisses te concentrer sur ce que tu construis.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feats.map((f, i) => (
            <div key={i} className="group bg-white border border-[#e2e1d8] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl hover:border-[#b8ddc8] transition-all duration-300 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1d6a40] to-[#25a058] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="text-sm font-bold mb-2 text-[#1a1a14]">{f.title}</h3>
              <p className="text-xs text-[#4a4a40] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ──
function HowItWorks() {
  const steps = [
    { n:'01', title:'Créer un compte', desc:'Inscris-toi gratuitement en quelques secondes. Aucune carte bancaire.' },
    { n:'02', title:'Remplir ton profil', desc:'Ajoute tes projets, expériences, compétences et ta photo.' },
    { n:'03', title:'Choisir un template', desc:'Sélectionne un design qui te ressemble. Change-le quand tu veux.' },
    { n:'04', title:'Partager ton lien', desc:'Copie ton lien et ajoute-le à ton CV, LinkedIn, GitHub.' },
  ];
  return (
    <section id="how" className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="font-mono text-[0.65rem] text-[#1d6a40] tracking-[0.18em] uppercase mb-2">Comment ça marche</div>
        <h2 className="font-serif text-[clamp(2rem,3.8vw,3.2rem)] font-normal tracking-[-1px] leading-[1.1] mb-12">
          Quatre étapes pour ton<br/><em className="text-[#1d6a40]">portfolio idéal.</em>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-7 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[#e2e1d8] to-transparent"></div>
          {steps.map((s, i) => (
            <div key={i} className="group flex flex-col items-center text-center relative z-10">
              <div className="w-14 h-14 rounded-full bg-white border-[1.5px] border-[#e2e1d8] flex items-center justify-center font-mono text-sm font-medium text-[#1a1a14] mb-4 group-hover:bg-[#1a1a14] group-hover:text-white group-hover:border-[#1a1a14] transition-all duration-300">
                {s.n}
              </div>
              <h4 className="text-sm font-bold mb-2 text-[#1a1a14]">{s.title}</h4>
              <p className="text-xs text-[#4a4a40] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TEMPLATES ──
function Templates() {
  const tmpls = [
    { name:'Futuriste Sombre', bg:'#0d0d14', circleBg:'rgba(108,99,255,0.3)', lineBg:'rgba(255,255,255,0.15)', stripe:'linear-gradient(90deg,#6c63ff,#00e5ff)' },
    { name:'Minimaliste Clair', bg:'#f6f5f0', circleBg:'rgba(29,106,64,0.15)', lineBg:'rgba(0,0,0,0.08)', stripe:'linear-gradient(90deg,#1d6a40,#25a058)' },
    { name:'Vert Forêt', bg:'#0d1a12', circleBg:'rgba(37,160,88,0.25)', lineBg:'rgba(150,220,170,0.18)', stripe:'linear-gradient(90deg,#25a058,#7eeaa0)' },
  ];
  return (
    <section id="templates" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="font-mono text-[0.65rem] text-[#1d6a40] tracking-[0.18em] uppercase mb-2">Templates</div>
        <h2 className="font-serif text-[clamp(2rem,3.8vw,3.2rem)] font-normal tracking-[-1px] leading-[1.1] mb-3">
          Choisis ton <em className="text-[#1d6a40]">style.</em>
        </h2>
        <p className="text-[#4a4a40] text-sm max-w-md leading-relaxed mb-12">Trois designs distincts, tous gratuits. D'autres arrivent bientôt.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tmpls.map((t, i) => (
            <div key={i} className="group rounded-2xl overflow-hidden border-[1.5px] border-[#e2e1d8] hover:-translate-y-1.5 hover:shadow-xl hover:border-[#b8ddc8] transition-all duration-300 cursor-pointer">
              <div className="h-44 flex flex-col p-4 gap-2 relative overflow-hidden" style={{background: t.bg}}>
                <div className="w-8 h-8 rounded-full mb-1" style={{background: t.circleBg}}></div>
                {[['75%'],['50%'],['62%']].map(([w], j) => (
                  <div key={j} className="h-1.5 rounded-full" style={{width: w, background: t.lineBg}}></div>
                ))}
                <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{background: t.stripe}}></div>
              </div>
              <div className="bg-white px-4 py-3 border-t border-[#e2e1d8] flex items-center justify-between">
                <span className="text-sm font-bold text-[#1a1a14]">{t.name}</span>
                <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-[#e8f5ee] text-[#1d6a40]">Gratuit</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FREE ──
function Free() {
  const feats = ['Tous les templates','Projets illimités','Lien personnalisé','Export PDF CV','Statistiques de visites','100% gratuit pour toujours'];
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <div className="font-mono text-[0.65rem] text-[#1d6a40] tracking-[0.18em] uppercase mb-2 flex justify-center">Tarif</div>
        <h2 className="font-serif text-[clamp(2rem,3.8vw,3.2rem)] font-normal tracking-[-1px] leading-[1.1] mb-3">
          100% Gratuit.<br/><em className="text-[#1d6a40]">Pour toujours.</em>
        </h2>
        <p className="text-[#4a4a40] text-sm max-w-md mx-auto leading-relaxed mb-10">
          Pas d'abonnement, pas de carte bancaire, pas de surprise.
        </p>
        <div className="max-w-xl mx-auto bg-[#f6f5f0] border-[1.5px] border-[#b8ddc8] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(37,160,88,0.05),transparent)] pointer-events-none"></div>
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-[#e8f5ee] text-[#1d6a40] text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide">
              🎁 ENTIÈREMENT GRATUIT
            </div>
            <div className="font-serif text-6xl text-[#1a1a14] mb-1"><span className="text-2xl align-top mt-2 inline-block">0</span> Ar</div>
            <div className="text-xs text-[#9a9a8a] mb-6">pour toujours · aucune carte bancaire</div>
            <div className="grid grid-cols-2 gap-2 mb-6 text-left max-w-xs mx-auto">
              {feats.map(f => (
                <div key={f} className="flex items-center gap-1.5 text-xs text-[#4a4a40]">
                  <span className="text-[#25a058] text-xs">✓</span> {f}
                </div>
              ))}
            </div>
            <Link to="/auth" className="inline-flex items-center gap-2 px-7 py-3 bg-[#1a1a14] text-white text-sm font-semibold rounded-full hover:bg-[#2a2a20] hover:-translate-y-0.5 transition-all">
              🚀 Créer mon portfolio gratuitement
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──
function Testimonials() {
  const testis = [
    { i:'RM', name:'Ravo M.', role:'Dev Frontend · Tana', text:"« Mon portfolio était en ligne en moins de 10 minutes. Les templates sont superbes et mon lien est déjà sur mon LinkedIn. »" },
    { i:'TN', name:'Toky N.', role:'Full Stack · Fianarantsoa', text:"« Enfin un générateur de portfolio fait pour nous. L'export PDF est un vrai atout pour postuler à l'international. »" },
    { i:'AS', name:'Aina S.', role:'Dev Backend · Diego', text:"« Les statistiques m'ont montré que des recruteurs de France visitaient mon portfolio. C'est là que j'ai su que ça marchait. »" },
  ];
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="font-mono text-[0.65rem] text-[#1d6a40] tracking-[0.18em] uppercase mb-2">Témoignages</div>
        <h2 className="font-serif text-[clamp(2rem,3.8vw,3.2rem)] font-normal tracking-[-1px] leading-[1.1] mb-12">
          Adoré par les <em className="text-[#1d6a40]">développeurs.</em>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testis.map((t, i) => (
            <div key={i} className="bg-white border border-[#e2e1d8] rounded-2xl p-6 hover:shadow-md hover:border-[#c8c7bc] transition-all">
              <div className="text-[#f59e0b] text-xs tracking-[2px] mb-3">★★★★★</div>
              <p className="font-serif text-sm text-[#4a4a40] leading-relaxed italic mb-4">{t.text}</p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#e8f5ee] flex items-center justify-center text-[0.68rem] font-bold text-[#1d6a40]">{t.i}</div>
                <div>
                  <div className="text-xs font-bold text-[#1a1a14]">{t.name}</div>
                  <div className="text-[0.65rem] text-[#9a9a8a]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA FINAL ──
function CTAFinal() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const handle = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;
    setDone(true);
    setTimeout(() => navigate('/auth'), 1500);
  };
  return (
    <section className="py-24 px-4 bg-[#1a1a14]">
      <div className="max-w-lg mx-auto text-center">
        <div className="font-mono text-[0.65rem] text-white/30 tracking-[0.18em] uppercase mb-2">Commencer</div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal text-white tracking-[-1px] leading-[1.1] mb-3">
          Prêt à créer ton<br/><em className="text-white/50">portfolio ?</em>
        </h2>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          Rejoins des centaines de développeurs malgaches. Gratuit pour toujours.
        </p>
        {done ? (
          <p className="text-[#25a058] font-semibold">✓ Redirection en cours...</p>
        ) : (
          <div className="flex gap-2 max-w-sm mx-auto flex-wrap justify-center">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()}
              placeholder="ton@email.com"
              className="flex-1 min-w-[180px] px-5 py-2.5 rounded-full bg-white/8 border border-white/15 text-white text-sm placeholder:text-white/30 outline-none focus:border-white/35 transition-all"/>
            <button onClick={handle}
              className="px-5 py-2.5 bg-white text-[#1a1a14] rounded-full text-sm font-bold hover:bg-[#f0f0e8] hover:-translate-y-0.5 transition-all whitespace-nowrap">
              Commencer →
            </button>
          </div>
        )}
        <p className="text-white/25 text-xs mt-3">Aucune carte bancaire · 100% gratuit pour toujours</p>
      </div>
    </section>
  );
}

// ── FOOTER ──
function Footer() {
  return (
    <footer className="bg-[#f6f5f0] border-t border-[#e2e1d8] py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-2 md:col-span-1">
          <div className="font-mono text-sm font-medium flex items-center gap-1.5 text-[#1a1a14] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#25a058] inline-block animate-pulse"></span>
            DevFolioMG
          </div>
          <p className="text-xs text-[#9a9a8a] leading-relaxed max-w-[180px]">
            Le générateur de portfolio fait pour les développeurs malgaches.
          </p>
        </div>
        {[
          { title:'Produit', links:[['Fonctionnalités','#features'],['Templates','#templates'],['Comment ça marche','#how']] },
          { title:'À propos', links:[['Notre mission','#'],['Blog','#'],['Contact','#']] },
          { title:'Légal', links:[['Confidentialité','#'],["Conditions d'utilisation",'#']] },
        ].map(col => (
          <div key={col.title}>
            <h5 className="text-[0.7rem] font-bold text-[#1a1a14] uppercase tracking-widest mb-3">{col.title}</h5>
            <ul className="space-y-2">
              {col.links.map(([label, href]) => (
                <li key={label}><a href={href} className="text-xs text-[#9a9a8a] hover:text-[#1a1a14] transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-5xl mx-auto pt-6 border-t border-[#e2e1d8] flex justify-between items-center flex-wrap gap-3">
        <p className="text-xs text-[#9a9a8a]">© 2025 DevFolioMG. Tous droits réservés.</p>
        <p className="text-xs text-[#9a9a8a]">🇲🇬 Fait à Madagascar</p>
      </div>
    </footer>
  );
}

// ── MAIN EXPORT ──
export default function LandingPage() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeUp {
        from { opacity:0; transform:translateY(18px); }
        to   { opacity:1; transform:translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f5f0]">
      <Nav />
      <Hero />
      <Proof />
      <Features />
      <HowItWorks />
      <Templates />
      <Free />
      <Testimonials />
      <CTAFinal />
      <Footer />
    </div>
  );
}
