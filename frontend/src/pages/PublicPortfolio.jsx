import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicPortfolio } from '../api';

const SkillBar = ({ nom, niveau, color = '#1d6a40' }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1 opacity-80"><span>{nom}</span><span>{niveau}%</span></div>
    <div className="h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.1)'}}>
      <div className="h-full rounded-full transition-all duration-1000" style={{width:`${niveau}%`,background:color}}></div>
    </div>
  </div>
);

const SocialLinks = ({ portfolio, color='#1d6a40' }) => (
  <div className="flex gap-3 flex-wrap">
    {portfolio.linkedin && <a href={`https://${portfolio.linkedin}`} target="_blank" style={{color}} className="text-xs hover:underline">LinkedIn ↗</a>}
    {portfolio.github   && <a href={`https://${portfolio.github}`}   target="_blank" style={{color}} className="text-xs hover:underline">GitHub ↗</a>}
    {portfolio.facebook && <a href={`https://${portfolio.facebook}`} target="_blank" style={{color}} className="text-xs hover:underline">Facebook ↗</a>}
    {portfolio.siteWeb  && <a href={portfolio.siteWeb}               target="_blank" style={{color}} className="text-xs hover:underline">Site web ↗</a>}
  </div>
);

// ── T1: MINIMAL ──
function TemplateMinimal({ user, portfolio }) {
  return (
    <div className="min-h-screen bg-[#f6f5f0]" style={{fontFamily:"'Bricolage Grotesque',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Lora:ital,wght@1,400&display=swap')`}</style>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-start gap-8 mb-14 pb-12 border-b border-[#e2e1d8]">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#e8f5ee] border border-[#b8ddc8] flex items-center justify-center flex-shrink-0">
            {user.avatar?<img src={user.avatar} className="w-full h-full object-cover"/>:<span style={{fontFamily:'Lora',fontSize:'2rem',color:'#1d6a40',fontStyle:'italic'}}>{user.prenom[0]}</span>}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-[#1a1a14] mb-1">{user.prenom} {user.nom}</h1>
            <p className="text-lg text-[#1d6a40] font-medium mb-2">{portfolio.titre}</p>
            {portfolio.disponible&&<span className="inline-flex items-center gap-1.5 bg-[#e8f5ee] text-[#1d6a40] text-xs font-semibold px-3 py-1 rounded-full border border-[#b8ddc8] mb-2"><span className="w-1.5 h-1.5 rounded-full bg-[#25a058] animate-pulse"></span>Disponible</span>}
            <p className="text-sm text-[#4a4a40] mt-2 leading-relaxed max-w-xl">{portfolio.bio}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-[#9a9a8a]">
              {portfolio.ville&&<span>📍 {portfolio.ville}</span>}{portfolio.telephone&&<span>📞 {portfolio.telephone}</span>}
            </div>
            <div className="mt-2"><SocialLinks portfolio={portfolio}/></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-10">
          <div className="col-span-2 space-y-12">
            {portfolio.projets?.length>0&&<div><h2 style={{fontFamily:'Lora',fontStyle:'italic',fontSize:'1.5rem',color:'#1a1a14',marginBottom:'1.5rem'}}>Projets</h2><div className="space-y-4">{portfolio.projets.map(p=><div key={p._id} className="bg-white border border-[#e2e1d8] rounded-2xl p-5 hover:border-[#b8ddc8] transition-all"><div className="flex justify-between mb-2"><h3 className="font-bold text-[#1a1a14]">{p.titre}</h3><div className="flex gap-2">{p.lien&&<a href={p.lien} target="_blank" className="text-xs text-[#1d6a40] hover:underline">↗ Voir</a>}{p.github&&<a href={p.github} target="_blank" className="text-xs text-[#4a4a40] hover:underline">GitHub</a>}</div></div><p className="text-sm text-[#4a4a40] mb-3 leading-relaxed">{p.description}</p><div className="flex flex-wrap gap-1.5">{p.technologies?.map(t=><span key={t} className="text-xs bg-[#e8f5ee] text-[#1d6a40] px-2 py-0.5 rounded-full">{t}</span>)}</div></div>)}</div></div>}
            {portfolio.experiences?.length>0&&<div><h2 style={{fontFamily:'Lora',fontStyle:'italic',fontSize:'1.5rem',color:'#1a1a14',marginBottom:'1.5rem'}}>Expériences</h2><div className="space-y-4">{portfolio.experiences.map(e=><div key={e._id} className="border-l-2 border-[#b8ddc8] pl-5"><h3 className="font-bold text-[#1a1a14]">{e.poste}</h3><p className="text-sm text-[#1d6a40] font-medium">{e.entreprise}</p><p className="text-xs text-[#9a9a8a]">{e.dateDebut} → {e.enCours?'Présent':e.dateFin}{e.lieu&&` · ${e.lieu}`}</p>{e.description&&<p className="text-sm text-[#4a4a40] mt-1 leading-relaxed">{e.description}</p>}</div>)}</div></div>}
          </div>
          <div>{portfolio.competences?.length>0&&<div><h2 style={{fontFamily:'Lora',fontStyle:'italic',fontSize:'1.2rem',color:'#1a1a14',marginBottom:'1rem'}}>Compétences</h2>{portfolio.competences.map(c=><SkillBar key={c._id} nom={c.nom} niveau={c.niveau} color="#1d6a40"/>)}</div>}</div>
        </div>
      </div>
    </div>
  );
}

// ── T2: DARK ──
function TemplateDark({ user, portfolio }) {
  return (
    <div className="min-h-screen text-white" style={{background:'#06060e',fontFamily:"'Space Grotesk',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Syne:wght@800&display=swap')`}</style>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-16 flex items-start gap-8">
          <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0" style={{border:'1px solid rgba(108,99,255,0.3)'}}>
            {user.avatar?<img src={user.avatar} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-4xl font-black" style={{background:'linear-gradient(135deg,#6c63ff,#00e5ff)',fontFamily:'Syne'}}>{user.prenom[0]}</div>}
          </div>
          <div>
            <h1 className="text-5xl font-black mb-2" style={{fontFamily:'Syne',background:'linear-gradient(135deg,#fff,#a0a0ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{user.prenom} {user.nom}</h1>
            <p className="text-lg mb-2" style={{color:'#6c63ff'}}>{portfolio.titre}</p>
            {portfolio.disponible&&<span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-2" style={{background:'rgba(0,229,255,0.1)',border:'1px solid rgba(0,229,255,0.3)',color:'#00e5ff'}}><span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse"></span>Disponible</span>}
            <p className="text-sm mt-2 leading-relaxed max-w-xl" style={{color:'rgba(255,255,255,0.6)'}}>{portfolio.bio}</p>
            <div className="mt-2"><SocialLinks portfolio={portfolio} color="#6c63ff"/></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-12">
            {portfolio.projets?.length>0&&<div><h2 className="text-2xl font-bold mb-6" style={{fontFamily:'Syne',color:'#6c63ff'}}>// Projets</h2><div className="space-y-4">{portfolio.projets.map(p=><div key={p._id} className="p-5 rounded-2xl hover:-translate-y-1 transition-all" style={{background:'rgba(108,99,255,0.05)',border:'1px solid rgba(108,99,255,0.2)'}}><div className="flex justify-between mb-2"><h3 className="font-bold">{p.titre}</h3><div className="flex gap-3">{p.lien&&<a href={p.lien} target="_blank" style={{color:'#00e5ff'}} className="text-xs hover:underline">↗ Live</a>}{p.github&&<a href={p.github} target="_blank" style={{color:'rgba(255,255,255,0.5)'}} className="text-xs hover:underline">GitHub</a>}</div></div><p className="text-sm leading-relaxed mb-3" style={{color:'rgba(255,255,255,0.55)'}}>{p.description}</p><div className="flex flex-wrap gap-1.5">{p.technologies?.map(t=><span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{background:'rgba(108,99,255,0.15)',border:'1px solid rgba(108,99,255,0.3)',color:'#a0a0ff'}}>{t}</span>)}</div></div>)}</div></div>}
            {portfolio.experiences?.length>0&&<div><h2 className="text-2xl font-bold mb-6" style={{fontFamily:'Syne',color:'#6c63ff'}}>// Expériences</h2><div className="space-y-4">{portfolio.experiences.map(e=><div key={e._id} className="pl-5" style={{borderLeft:'2px solid rgba(108,99,255,0.4)'}}><h3 className="font-bold">{e.poste}</h3><p className="text-sm" style={{color:'#6c63ff'}}>{e.entreprise}</p><p className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{e.dateDebut} → {e.enCours?'Présent':e.dateFin}</p>{e.description&&<p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.55)'}}>{e.description}</p>}</div>)}</div></div>}
          </div>
          <div>{portfolio.competences?.length>0&&<div><h2 className="text-lg font-bold mb-5" style={{fontFamily:'Syne',color:'#6c63ff'}}>// Skills</h2>{portfolio.competences.map(c=><SkillBar key={c._id} nom={c.nom} niveau={c.niveau} color="linear-gradient(90deg,#6c63ff,#00e5ff)"/>)}</div>}</div>
        </div>
      </div>
    </div>
  );
}

// ── T3: FOREST ──
function TemplateForest({ user, portfolio }) {
  return (
    <div className="min-h-screen text-white" style={{background:'#0d1a12',fontFamily:"'Inter',sans-serif"}}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-6 mb-12 pb-10" style={{borderBottom:'1px solid rgba(37,160,88,0.2)'}}>
          <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0" style={{border:'2px solid #25a058'}}>
            {user.avatar?<img src={user.avatar} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-3xl font-black">{user.prenom[0]}</div>}
          </div>
          <div><h1 className="text-4xl font-black mb-1" style={{color:'#7eeaa0'}}>{user.prenom} {user.nom}</h1><p style={{color:'#25a058'}}>{portfolio.titre}</p>{portfolio.disponible&&<span className="text-xs px-2 py-0.5 rounded-full font-bold mt-1 inline-block" style={{background:'rgba(37,160,88,0.15)',color:'#7eeaa0',border:'1px solid rgba(37,160,88,0.3)'}}>● Disponible</span>}<p className="text-sm mt-2 leading-relaxed" style={{color:'rgba(255,255,255,0.6)'}}>{portfolio.bio}</p><div className="mt-2"><SocialLinks portfolio={portfolio} color="#25a058"/></div></div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-10">
            {portfolio.projets?.length>0&&<div><h2 className="font-black mb-5 uppercase tracking-widest text-xs" style={{color:'#7eeaa0'}}>Projets</h2><div className="space-y-3">{portfolio.projets.map(p=><div key={p._id} className="p-4 rounded-xl" style={{background:'rgba(37,160,88,0.06)',border:'1px solid rgba(37,160,88,0.15)'}}><div className="flex justify-between mb-1"><h3 className="font-bold">{p.titre}</h3>{p.lien&&<a href={p.lien} target="_blank" style={{color:'#25a058'}} className="text-xs">↗</a>}</div><p className="text-sm leading-relaxed mb-2" style={{color:'rgba(255,255,255,0.5)'}}>{p.description}</p><div className="flex flex-wrap gap-1">{p.technologies?.map(t=><span key={t} className="text-xs px-2 py-0.5 rounded" style={{background:'rgba(37,160,88,0.12)',color:'#7eeaa0'}}>{t}</span>)}</div></div>)}</div></div>}
            {portfolio.experiences?.length>0&&<div><h2 className="font-black mb-5 uppercase tracking-widest text-xs" style={{color:'#7eeaa0'}}>Expériences</h2><div className="space-y-4">{portfolio.experiences.map(e=><div key={e._id} className="pl-4" style={{borderLeft:'2px solid #25a058'}}><h3 className="font-bold">{e.poste}</h3><p className="text-sm" style={{color:'#25a058'}}>{e.entreprise}</p><p className="text-xs" style={{color:'rgba(255,255,255,0.35)'}}>{e.dateDebut} → {e.enCours?'Présent':e.dateFin}</p></div>)}</div></div>}
          </div>
          <div>{portfolio.competences?.length>0&&<div><h2 className="font-black mb-4 uppercase tracking-widest text-xs" style={{color:'#7eeaa0'}}>Compétences</h2>{portfolio.competences.map(c=><SkillBar key={c._id} nom={c.nom} niveau={c.niveau} color="linear-gradient(90deg,#25a058,#7eeaa0)"/>)}</div>}</div>
        </div>
      </div>
    </div>
  );
}

// ── T4: TERMINAL ──
function TemplateTerminal({ user, portfolio }) {
  return (
    <div className="min-h-screen" style={{background:'#0a0a0a',fontFamily:"'Courier New',monospace",color:'#00ff41'}}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8 p-4 rounded" style={{border:'1px solid #00ff41',background:'rgba(0,255,65,0.03)'}}>
          <p style={{color:'#444'}}>$ whoami</p>
          <h1 className="text-3xl font-bold mt-2">{user.prenom}_{user.nom}</h1>
          <p className="mt-1" style={{color:'#00cc33'}}>&gt; {portfolio.titre}</p>
          {portfolio.disponible&&<p className="mt-1">[STATUS: AVAILABLE ●]</p>}
          <p className="text-sm mt-3 leading-relaxed" style={{color:'#888'}}>{portfolio.bio}</p>
          <div className="mt-3"><SocialLinks portfolio={portfolio} color="#00ff41"/></div>
        </div>
        {portfolio.projets?.length>0&&<div className="mb-8"><p style={{color:'#444'}}>$ ls projects/</p><div className="mt-3 space-y-3">{portfolio.projets.map((p,i)=><div key={p._id} className="p-3" style={{borderLeft:'2px solid #00ff41'}}><p>[{String(i+1).padStart(2,'0')}] {p.titre}</p>{p.description&&<p className="text-sm mt-1" style={{color:'#666'}}>&gt; {p.description}</p>}<p className="text-xs mt-1" style={{color:'#444'}}>tech: [{p.technologies?.join(', ')}]</p><div className="flex gap-3 mt-1">{p.lien&&<a href={p.lien} target="_blank" className="text-xs hover:underline" style={{color:'#00cc33'}}>→ live</a>}{p.github&&<a href={p.github} target="_blank" className="text-xs hover:underline" style={{color:'#555'}}>→ repo</a>}</div></div>)}</div></div>}
        {portfolio.experiences?.length>0&&<div className="mb-8"><p style={{color:'#444'}}>$ cat experience.log</p><div className="mt-3 space-y-3">{portfolio.experiences.map(e=><div key={e._id} className="p-3" style={{border:'1px solid #1a1a1a'}}><p>{e.poste} @ {e.entreprise}</p><p className="text-xs" style={{color:'#555'}}>{e.dateDebut} → {e.enCours?'now':e.dateFin}</p></div>)}</div></div>}
        {portfolio.competences?.length>0&&<div><p style={{color:'#444'}}>$ skills --list</p><div className="mt-3">{portfolio.competences.map(c=><div key={c._id} className="flex items-center gap-3 mb-2 text-sm"><span className="w-28">{c.nom}</span><span style={{color:'#1a3a1a'}}>{'█'.repeat(Math.floor(c.niveau/10))}{'░'.repeat(10-Math.floor(c.niveau/10))}</span><span style={{color:'#555'}}>{c.niveau}%</span></div>)}</div></div>}
      </div>
    </div>
  );
}

// ── T5: GLASS ──
function TemplateGlass({ user, portfolio }) {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',fontFamily:"'Inter',sans-serif"}}>
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full opacity-30" style={{background:'radial-gradient(circle,#ff6b6b,transparent 70%)',filter:'blur(80px)'}}></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-30" style={{background:'radial-gradient(circle,#4ecdc4,transparent 70%)',filter:'blur(80px)'}}></div>
      <div className="relative max-w-4xl mx-auto px-6 py-16 z-10">
        <div className="p-8 rounded-3xl mb-6 text-white" style={{background:'rgba(255,255,255,0.08)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.15)'}}>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0" style={{border:'2px solid rgba(255,255,255,0.2)'}}>
              {user.avatar?<img src={user.avatar} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-3xl font-black" style={{background:'rgba(255,255,255,0.1)'}}>{user.prenom[0]}</div>}
            </div>
            <div><h1 className="text-4xl font-black mb-1">{user.prenom} {user.nom}</h1><p style={{color:'rgba(255,255,255,0.7)'}}>{portfolio.titre}</p>{portfolio.disponible&&<span className="text-xs px-3 py-1 rounded-full font-semibold mt-1 inline-block" style={{background:'rgba(78,205,196,0.2)',color:'#4ecdc4',border:'1px solid rgba(78,205,196,0.4)'}}>● Disponible</span>}<p className="text-sm mt-2 leading-relaxed" style={{color:'rgba(255,255,255,0.55)'}}>{portfolio.bio}</p><div className="mt-2"><SocialLinks portfolio={portfolio} color="rgba(255,255,255,0.7)"/></div></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5 text-white">
          <div className="col-span-2 space-y-5">
            {portfolio.projets?.length>0&&<div className="p-6 rounded-3xl" style={{background:'rgba(255,255,255,0.06)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.1)'}}><h2 className="text-lg font-bold mb-4">Projets</h2><div className="space-y-3">{portfolio.projets.map(p=><div key={p._id} className="p-4 rounded-2xl" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)'}}><div className="flex justify-between mb-1"><h3 className="font-bold">{p.titre}</h3>{p.lien&&<a href={p.lien} target="_blank" style={{color:'#4ecdc4'}} className="text-xs">↗</a>}</div><p className="text-sm leading-relaxed mb-2" style={{color:'rgba(255,255,255,0.45)'}}>{p.description}</p><div className="flex flex-wrap gap-1.5">{p.technologies?.map(t=><span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.6)'}}>{t}</span>)}</div></div>)}</div></div>}
            {portfolio.experiences?.length>0&&<div className="p-6 rounded-3xl" style={{background:'rgba(255,255,255,0.06)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.1)'}}><h2 className="text-lg font-bold mb-4">Expériences</h2><div className="space-y-3">{portfolio.experiences.map(e=><div key={e._id} className="pl-4" style={{borderLeft:'2px solid rgba(78,205,196,0.5)'}}><h3 className="font-bold text-sm">{e.poste}</h3><p className="text-xs" style={{color:'#4ecdc4'}}>{e.entreprise}</p><p className="text-xs" style={{color:'rgba(255,255,255,0.35)'}}>{e.dateDebut} → {e.enCours?'Présent':e.dateFin}</p></div>)}</div></div>}
          </div>
          <div>{portfolio.competences?.length>0&&<div className="p-5 rounded-3xl" style={{background:'rgba(255,255,255,0.06)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.1)'}}><h2 className="text-sm font-bold mb-4">Compétences</h2>{portfolio.competences.map(c=><SkillBar key={c._id} nom={c.nom} niveau={c.niveau} color="linear-gradient(90deg,#ff6b6b,#4ecdc4)"/>)}</div>}</div>
        </div>
      </div>
    </div>
  );
}

// ── T6: GRADIENT ──
function TemplateGradient({ user, portfolio }) {
  return (
    <div className="min-h-screen text-white" style={{background:'linear-gradient(135deg,#1a0533 0%,#2d0b6b 40%,#1a0533 100%)',fontFamily:"'Inter',sans-serif"}}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-5" style={{border:'3px solid transparent',background:'linear-gradient(#1a0533,#1a0533) padding-box,linear-gradient(135deg,#b482ff,#ff4d8d) border-box'}}>
            {user.avatar?<img src={user.avatar} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-4xl font-black" style={{background:'linear-gradient(135deg,#b482ff,#ff4d8d)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{user.prenom[0]}</div>}
          </div>
          <h1 className="text-5xl font-black mb-2" style={{background:'linear-gradient(135deg,#b482ff,#ff4d8d)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{user.prenom} {user.nom}</h1>
          <p style={{color:'rgba(255,255,255,0.6)'}}>{portfolio.titre}</p>
          {portfolio.disponible&&<span className="inline-block text-xs px-4 py-1.5 rounded-full font-bold mt-2" style={{background:'linear-gradient(135deg,#b482ff,#ff4d8d)'}}>✦ Disponible</span>}
          <p className="text-sm mt-4 max-w-lg mx-auto leading-relaxed" style={{color:'rgba(255,255,255,0.5)'}}>{portfolio.bio}</p>
          <div className="flex justify-center mt-3"><SocialLinks portfolio={portfolio} color="#b482ff"/></div>
        </div>
        {portfolio.projets?.length>0&&<div className="mb-12"><h2 className="text-2xl font-black mb-6 text-center" style={{background:'linear-gradient(135deg,#b482ff,#ff4d8d)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Projets</h2><div className="grid grid-cols-2 gap-4">{portfolio.projets.map(p=><div key={p._id} className="p-5 rounded-2xl hover:-translate-y-1 transition-all" style={{background:'rgba(180,130,255,0.08)',border:'1px solid rgba(180,130,255,0.2)'}}><h3 className="font-bold mb-2">{p.titre}</h3><p className="text-sm leading-relaxed mb-3" style={{color:'rgba(255,255,255,0.5)'}}>{p.description}</p><div className="flex flex-wrap gap-1.5 mb-2">{p.technologies?.map(t=><span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{background:'rgba(180,130,255,0.15)',color:'#b482ff'}}>{t}</span>)}</div>{p.lien&&<a href={p.lien} target="_blank" style={{color:'#ff4d8d'}} className="text-xs hover:underline">↗ Voir</a>}</div>)}</div></div>}
        <div className="grid grid-cols-2 gap-8">
          {portfolio.experiences?.length>0&&<div><h2 className="text-xl font-black mb-5" style={{background:'linear-gradient(135deg,#b482ff,#ff4d8d)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Expériences</h2><div className="space-y-4">{portfolio.experiences.map(e=><div key={e._id} className="pl-4" style={{borderLeft:'2px solid #b482ff'}}><h3 className="font-bold text-sm">{e.poste}</h3><p className="text-xs" style={{color:'#b482ff'}}>{e.entreprise}</p><p className="text-xs" style={{color:'rgba(255,255,255,0.35)'}}>{e.dateDebut} → {e.enCours?'Présent':e.dateFin}</p></div>)}</div></div>}
          {portfolio.competences?.length>0&&<div><h2 className="text-xl font-black mb-5" style={{background:'linear-gradient(135deg,#b482ff,#ff4d8d)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Compétences</h2>{portfolio.competences.map(c=><SkillBar key={c._id} nom={c.nom} niveau={c.niveau} color="linear-gradient(90deg,#b482ff,#ff4d8d)"/>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ── T7: CARD ──
function TemplateCard({ user, portfolio }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]" style={{fontFamily:"'Inter',sans-serif"}}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-5 flex items-center gap-8">
          <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
            {user.avatar?<img src={user.avatar} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-3xl font-black text-white" style={{background:'linear-gradient(135deg,#667eea,#764ba2)'}}>{user.prenom[0]}</div>}
          </div>
          <div className="flex-1"><h1 className="text-3xl font-black text-gray-900 mb-1">{user.prenom} {user.nom}</h1><p className="font-medium mb-2" style={{color:'#667eea'}}>{portfolio.titre}</p>{portfolio.disponible&&<span className="inline-block text-xs px-3 py-1 rounded-full font-bold text-green-700 bg-green-100">✓ Disponible</span>}<p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xl">{portfolio.bio}</p></div>
          <div className="text-right"><SocialLinks portfolio={portfolio} color="#667eea"/>{portfolio.ville&&<p className="text-xs text-gray-400 mt-1">📍 {portfolio.ville}</p>}</div>
        </div>
        <div className="grid grid-cols-3 gap-5 mb-5">
          {[['🚀',portfolio.projets?.length||0,'Projets'],['💼',portfolio.experiences?.length||0,'Expériences'],['⚡',portfolio.competences?.length||0,'Compétences']].map(([icon,val,label])=><div key={label} className="bg-white rounded-2xl p-5 text-center shadow-sm"><div className="text-2xl mb-1">{icon}</div><div className="text-3xl font-black text-gray-900">{val}</div><div className="text-xs text-gray-400 mt-0.5">{label}</div></div>)}
        </div>
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
            {portfolio.projets?.length>0&&<div className="bg-white rounded-2xl p-6 shadow-sm"><h2 className="text-lg font-black text-gray-900 mb-4">🚀 Projets</h2><div className="grid grid-cols-2 gap-3">{portfolio.projets.map(p=><div key={p._id} className="p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-all"><h3 className="font-bold text-gray-900 text-sm mb-1">{p.titre}</h3><p className="text-xs text-gray-400 leading-relaxed mb-2 line-clamp-2">{p.description}</p><div className="flex flex-wrap gap-1">{p.technologies?.slice(0,3).map(t=><span key={t} className="text-[0.6rem] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">{t}</span>)}</div>{p.lien&&<a href={p.lien} target="_blank" className="text-xs text-purple-500 hover:underline mt-1 block">↗ Voir</a>}</div>)}</div></div>}
            {portfolio.experiences?.length>0&&<div className="bg-white rounded-2xl p-6 shadow-sm"><h2 className="text-lg font-black text-gray-900 mb-4">💼 Expériences</h2><div className="space-y-4">{portfolio.experiences.map(e=><div key={e._id} className="flex items-start gap-3"><div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-sm" style={{background:'linear-gradient(135deg,#667eea,#764ba2)'}}>{e.entreprise[0]}</div><div><h3 className="font-bold text-gray-900 text-sm">{e.poste}</h3><p className="text-xs font-medium" style={{color:'#667eea'}}>{e.entreprise}</p><p className="text-xs text-gray-400">{e.dateDebut} → {e.enCours?'Présent':e.dateFin}</p></div></div>)}</div></div>}
          </div>
          <div>{portfolio.competences?.length>0&&<div className="bg-white rounded-2xl p-5 shadow-sm"><h2 className="text-sm font-black text-gray-900 mb-4">⚡ Compétences</h2>{portfolio.competences.map(c=><div key={c._id} className="mb-3"><div className="flex justify-between text-xs mb-1"><span className="text-gray-600">{c.nom}</span><span className="text-gray-400">{c.niveau}%</span></div><div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${c.niveau}%`,background:'linear-gradient(90deg,#667eea,#764ba2)'}}></div></div></div>)}</div>}</div>
        </div>
      </div>
    </div>
  );
}

// ── T8: MAGAZINE ──
function TemplateMagazine({ user, portfolio }) {
  return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'Georgia',serif"}}>
      <div className="border-b-4 border-black px-8 py-4 flex items-center justify-between">
        <div className="text-xs font-bold tracking-widest uppercase" style={{fontFamily:'Arial'}}>Portfolio</div>
        <div className="text-xs text-gray-400" style={{fontFamily:'Arial'}}>devfoliomg.mg/{user.username}</div>
      </div>
      <div className="grid grid-cols-2 border-b-2 border-black">
        <div className="p-10 border-r-2 border-black">
          <h1 className="font-black leading-none mb-4" style={{fontSize:'clamp(3rem,6vw,5rem)',lineHeight:'0.95',fontFamily:'Georgia'}}>{user.prenom}<br/><span className="italic text-gray-400">{user.nom}</span></h1>
          <p className="text-xl font-bold mb-4" style={{fontFamily:'Arial'}}>{portfolio.titre}</p>
          {portfolio.disponible&&<div className="inline-block bg-black text-white text-xs px-4 py-1.5 font-bold mb-4" style={{fontFamily:'Arial',letterSpacing:'0.1em'}}>DISPONIBLE</div>}
          <p className="text-sm leading-relaxed text-gray-600">{portfolio.bio}</p>
          <div className="mt-4" style={{fontFamily:'Arial'}}>{portfolio.ville&&<p className="text-gray-400 text-xs mb-1">{portfolio.ville}, {portfolio.pays}</p>}<SocialLinks portfolio={portfolio} color="#000"/></div>
        </div>
        <div className="p-10 bg-gray-50">
          <div className="w-full h-64 overflow-hidden mb-4 bg-gray-200">
            {user.avatar?<img src={user.avatar} className="w-full h-full object-cover object-top"/>:<div className="w-full h-full flex items-center justify-center text-8xl font-black text-gray-300">{user.prenom[0]}</div>}
          </div>
          {portfolio.competences?.length>0&&<div><h3 className="text-xs font-black uppercase tracking-widest mb-3" style={{fontFamily:'Arial'}}>Compétences</h3>{portfolio.competences.slice(0,6).map(c=><div key={c._id} className="flex items-center gap-2 mb-1.5"><span className="text-xs text-gray-600 w-24">{c.nom}</span><div className="flex-1 h-1 bg-gray-200"><div className="h-full bg-black" style={{width:`${c.niveau}%`}}></div></div></div>)}</div>}
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x-2 divide-black">
        {portfolio.projets?.length>0&&<div className="col-span-2 p-8"><h2 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-6" style={{fontFamily:'Arial'}}>Projets</h2><div className="space-y-6">{portfolio.projets.map((p,i)=><div key={p._id} className={i<portfolio.projets.length-1?"pb-6 border-b border-gray-200":""}><h3 className="text-xl font-black mb-1">{p.titre}</h3><p className="text-sm text-gray-500 leading-relaxed mb-2">{p.description}</p><div className="flex items-center gap-4"><div className="flex flex-wrap gap-1">{p.technologies?.map(t=><span key={t} className="text-xs border border-black px-2 py-0.5" style={{fontFamily:'Arial'}}>{t}</span>)}</div>{p.lien&&<a href={p.lien} target="_blank" className="text-xs underline" style={{fontFamily:'Arial'}}>Voir ↗</a>}</div></div>)}</div></div>}
        {portfolio.experiences?.length>0&&<div className="p-8"><h2 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-6" style={{fontFamily:'Arial'}}>Expériences</h2><div className="space-y-5">{portfolio.experiences.map(e=><div key={e._id}><h3 className="font-black text-sm">{e.poste}</h3><p className="text-sm italic text-gray-600">{e.entreprise}</p><p className="text-xs text-gray-400 mt-0.5" style={{fontFamily:'Arial'}}>{e.dateDebut} — {e.enCours?'présent':e.dateFin}</p></div>)}</div></div>}
      </div>
    </div>
  );
}

const templates = { minimal:TemplateMinimal, dark:TemplateDark, forest:TemplateForest, terminal:TemplateTerminal, glass:TemplateGlass, gradient:TemplateGradient, card:TemplateCard, magazine:TemplateMagazine };

export default function PublicPortfolio() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPublicPortfolio(username).then(res=>setData(res.data)).catch(()=>setError(true)).finally(()=>setLoading(false));
  }, [username]);

  if (loading) return <div className="min-h-screen bg-[#f6f5f0] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#1d6a40] border-t-transparent rounded-full animate-spin"></div></div>;
  if (error||!data) return <div className="min-h-screen bg-[#f6f5f0] flex flex-col items-center justify-center text-center px-4"><p className="font-mono text-6xl font-bold text-[#e2e1d8] mb-4">404</p><h1 className="text-2xl font-serif font-normal text-[#1a1a14] mb-2">Portfolio introuvable</h1><Link to="/" className="mt-4 px-6 py-2.5 bg-[#1a1a14] text-white rounded-full text-sm font-semibold">← Retour</Link></div>;

  const { user, portfolio } = data;
  const TemplateComponent = templates[user.template] || TemplateMinimal;
  return <TemplateComponent user={user} portfolio={portfolio}/>;
}
