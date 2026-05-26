import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getMyPortfolio, updatePortfolio,
  addProjet, deleteProjet,
  addExperience, deleteExperience,
  addCompetence, deleteCompetence,
  updateProfile, uploadAvatar
} from '../api';
import toast from 'react-hot-toast';

const navItems = [
  { id: 'overview',     icon: '📊', label: 'Vue générale' },
  { id: 'profile',      icon: '👤', label: 'Mon profil' },
  { id: 'projets',      icon: '🚀', label: 'Projets' },
  { id: 'experiences',  icon: '💼', label: 'Expériences' },
  { id: 'competences',  icon: '⚡', label: 'Compétences' },
  { id: 'template',     icon: '🎨', label: 'Template' },
  { id: 'settings',     icon: '⚙️', label: 'Paramètres' },
];

const Input = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">{label}</label>}
    <input {...props} className="w-full px-3 py-2.5 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm outline-none focus:border-[#1d6a40] focus:ring-2 focus:ring-[#1d6a40]/10 transition-all"/>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">{label}</label>}
    <textarea {...props} className="w-full px-3 py-2.5 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm outline-none focus:border-[#1d6a40] focus:ring-2 focus:ring-[#1d6a40]/10 transition-all resize-none"/>
  </div>
);

const Btn = ({ children, variant = 'primary', loading, ...props }) => (
  <button {...props} disabled={loading || props.disabled}
    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50
      ${variant === 'primary' ? 'bg-[#1a1a14] text-white hover:bg-[#2a2a20]' : ''}
      ${variant === 'danger'  ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100' : ''}
      ${variant === 'ghost'   ? 'bg-[#f6f5f0] text-[#4a4a40] border border-[#e2e1d8] hover:bg-[#eeede6]' : ''}
    `}>
    {loading ? <span className="animate-spin">⟳</span> : null}
    {children}
  </button>
);

const Card = ({ title, children, action }) => (
  <div className="bg-white border border-[#e2e1d8] rounded-2xl p-6">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-semibold text-[#1a1a14]">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

function Overview({ portfolio, user }) {
  const stats = [
    { label: 'Vues totales',   value: portfolio?.vues || 0,                 icon: '👁' },
    { label: 'Projets',        value: portfolio?.projets?.length || 0,      icon: '🚀' },
    { label: 'Expériences',    value: portfolio?.experiences?.length || 0,  icon: '💼' },
    { label: 'Compétences',    value: portfolio?.competences?.length || 0,  icon: '⚡' },
  ];
  const completion = () => {
    let s = 0;
    if (portfolio?.bio) s += 20;
    if (portfolio?.projets?.length > 0) s += 20;
    if (portfolio?.experiences?.length > 0) s += 20;
    if (portfolio?.competences?.length > 0) s += 20;
    if (user?.avatar) s += 20;
    return s;
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-normal mb-1">Bonjour, {user?.prenom} 👋</h2>
        <p className="text-sm text-[#9a9a8a]">Voici un aperçu de ton portfolio.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s,i) => (
          <div key={i} className="bg-white border border-[#e2e1d8] rounded-2xl p-5 text-center hover:border-[#b8ddc8] transition-all">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-serif text-3xl font-normal text-[#1a1a14]">{s.value}</div>
            <div className="text-xs text-[#9a9a8a] mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <Card title="Complétion du portfolio">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 h-2 bg-[#f6f5f0] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#1d6a40] to-[#25a058] rounded-full transition-all duration-700" style={{width:`${completion()}%`}}></div>
          </div>
          <span className="font-serif text-xl text-[#1d6a40]">{completion()}%</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            ['Photo de profil', !!user?.avatar],
            ['Bio remplie', !!portfolio?.bio],
            ['Projets ajoutés', portfolio?.projets?.length > 0],
            ['Expériences ajoutées', portfolio?.experiences?.length > 0],
            ['Compétences ajoutées', portfolio?.competences?.length > 0],
          ].map(([label, done]) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <span className={done ? 'text-[#25a058]' : 'text-[#e2e1d8]'}>{done ? '✓' : '○'}</span>
              <span className={done ? 'text-[#1a1a14]' : 'text-[#9a9a8a]'}>{label}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Ton lien portfolio">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl px-4 py-2.5 font-mono text-sm text-[#1d6a40]">
            devfoliomg.vercel.app/p/{user?.username}
          </div>
          <Btn variant="ghost" onClick={() => { navigator.clipboard.writeText(`https://devfoliomg.vercel.app/p/${user?.username}`); toast.success('Lien copié !'); }}>📋 Copier</Btn>
          <Link to={`/p/${user?.username}`} target="_blank"><Btn variant="ghost">↗ Voir</Btn></Link>
        </div>
      </Card>
    </div>
  );
}

function Profile({ user, portfolio, onRefresh }) {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ titre: portfolio?.titre||'', bio: portfolio?.bio||'', disponible: portfolio?.disponible??true, telephone: portfolio?.telephone||'', ville: portfolio?.ville||'', pays: portfolio?.pays||'Madagascar', linkedin: portfolio?.linkedin||'', github: portfolio?.github||'', facebook: portfolio?.facebook||'', siteWeb: portfolio?.siteWeb||'' });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    try { await updatePortfolio(form); toast.success('Profil mis à jour !'); onRefresh(); }
    catch { toast.error('Erreur'); } finally { setLoading(false); }
  };
  const handleAvatar = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setAvatarLoading(true);
    try { const fd = new FormData(); fd.append('avatar', file); const res = await uploadAvatar(fd); setUser(p => ({...p, avatar: res.data.avatar})); toast.success('Photo mise à jour !'); }
    catch { toast.error('Erreur upload'); } finally { setAvatarLoading(false); }
  };
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-normal">Mon profil</h2>
      <Card title="Photo de profil">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-[#e8f5ee] border-2 border-[#b8ddc8] flex items-center justify-center flex-shrink-0">
            {user?.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover"/> : <span className="font-serif text-2xl text-[#1d6a40] italic">{user?.prenom?.[0]}</span>}
          </div>
          <div>
            <label className="cursor-pointer">
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-[#f6f5f0] text-[#4a4a40] border border-[#e2e1d8] hover:bg-[#eeede6] transition-all inline-flex items-center gap-1.5">
                {avatarLoading ? '⟳ Upload...' : '📷 Changer la photo'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatar}/>
            </label>
            <p className="text-xs text-[#9a9a8a] mt-1.5">JPG, PNG — max 5MB</p>
          </div>
        </div>
      </Card>
      <Card title="Informations générales">
        <div className="space-y-4">
          <Input label="Titre / Poste" value={form.titre} onChange={e=>setForm(p=>({...p,titre:e.target.value}))} placeholder="Ex: Développeur Full Stack"/>
          <Textarea label="Bio" value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} rows={4} placeholder="Décris-toi en quelques phrases..."/>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="disponible" checked={form.disponible} onChange={e=>setForm(p=>({...p,disponible:e.target.checked}))} className="accent-[#1d6a40]"/>
            <label htmlFor="disponible" className="text-sm text-[#4a4a40]">Disponible pour des missions / emploi</label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ville" value={form.ville} onChange={e=>setForm(p=>({...p,ville:e.target.value}))} placeholder="Antananarivo"/>
            <Input label="Pays" value={form.pays} onChange={e=>setForm(p=>({...p,pays:e.target.value}))} placeholder="Madagascar"/>
          </div>
          <Input label="Téléphone" value={form.telephone} onChange={e=>setForm(p=>({...p,telephone:e.target.value}))} placeholder="034 XX XXX XX"/>
        </div>
      </Card>
      <Card title="Réseaux sociaux & liens">
        <div className="space-y-4">
          <Input label="LinkedIn" value={form.linkedin} onChange={e=>setForm(p=>({...p,linkedin:e.target.value}))} placeholder="linkedin.com/in/tonprofil"/>
          <Input label="GitHub" value={form.github} onChange={e=>setForm(p=>({...p,github:e.target.value}))} placeholder="github.com/tonprofil"/>
          <Input label="Facebook" value={form.facebook} onChange={e=>setForm(p=>({...p,facebook:e.target.value}))} placeholder="facebook.com/tonprofil"/>
          <Input label="Site web" value={form.siteWeb} onChange={e=>setForm(p=>({...p,siteWeb:e.target.value}))} placeholder="https://tonsite.com"/>
        </div>
      </Card>
      <div className="flex justify-end"><Btn loading={loading} onClick={handleSave}>💾 Sauvegarder</Btn></div>
    </div>
  );
}

function Projets({ portfolio, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ titre:'', description:'', lien:'', github:'', technologies:'' });
  const handleAdd = async () => {
    if (!form.titre) return toast.error('Le titre est requis');
    setLoading(true);
    try { await addProjet({...form, technologies: form.technologies.split(',').map(t=>t.trim()).filter(Boolean)}); toast.success('Projet ajouté !'); setForm({titre:'',description:'',lien:'',github:'',technologies:''}); setShowForm(false); onRefresh(); }
    catch { toast.error('Erreur'); } finally { setLoading(false); }
  };
  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return;
    try { await deleteProjet(id); toast.success('Supprimé'); onRefresh(); } catch { toast.error('Erreur'); }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-normal">Projets</h2>
        <Btn onClick={()=>setShowForm(!showForm)}>{showForm?'✕ Annuler':'+ Ajouter'}</Btn>
      </div>
      {showForm && (
        <Card title="Nouveau projet">
          <div className="space-y-4">
            <Input label="Titre *" value={form.titre} onChange={e=>setForm(p=>({...p,titre:e.target.value}))} placeholder="Mon super projet"/>
            <Textarea label="Description" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} placeholder="Décris ton projet..."/>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Lien live" value={form.lien} onChange={e=>setForm(p=>({...p,lien:e.target.value}))} placeholder="https://..."/>
              <Input label="GitHub" value={form.github} onChange={e=>setForm(p=>({...p,github:e.target.value}))} placeholder="https://github.com/..."/>
            </div>
            <Input label="Technologies (séparées par virgule)" value={form.technologies} onChange={e=>setForm(p=>({...p,technologies:e.target.value}))} placeholder="React, Node.js, MongoDB"/>
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={()=>setShowForm(false)}>Annuler</Btn>
              <Btn loading={loading} onClick={handleAdd}>Ajouter le projet</Btn>
            </div>
          </div>
        </Card>
      )}
      {portfolio?.projets?.length === 0 && (
        <div className="text-center py-16 bg-white border border-dashed border-[#e2e1d8] rounded-2xl">
          <div className="text-4xl mb-3">🚀</div>
          <p className="text-[#9a9a8a] text-sm">Aucun projet encore. Ajoute ton premier projet !</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {portfolio?.projets?.map(p => (
          <div key={p._id} className="bg-white border border-[#e2e1d8] rounded-2xl p-5 hover:border-[#b8ddc8] transition-all">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-[#1a1a14]">{p.titre}</h4>
              <Btn variant="danger" onClick={()=>handleDelete(p._id)}>🗑</Btn>
            </div>
            {p.description && <p className="text-xs text-[#4a4a40] mb-3 line-clamp-2 leading-relaxed">{p.description}</p>}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {p.technologies?.map(t => <span key={t} className="text-[0.65rem] bg-[#e8f5ee] text-[#1d6a40] px-2 py-0.5 rounded-full font-medium">{t}</span>)}
            </div>
            <div className="flex gap-2">
              {p.lien && <a href={p.lien} target="_blank" className="text-xs text-[#1d6a40] hover:underline">↗ Voir</a>}
              {p.github && <a href={p.github} target="_blank" className="text-xs text-[#4a4a40] hover:underline">⌥ GitHub</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Experiences({ portfolio, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ poste:'', entreprise:'', lieu:'', dateDebut:'', dateFin:'', enCours:false, description:'' });
  const handleAdd = async () => {
    if (!form.poste||!form.entreprise||!form.dateDebut) return toast.error('Poste, entreprise et date requis');
    setLoading(true);
    try { await addExperience({...form, dateFin: form.enCours?'Présent':form.dateFin}); toast.success('Expérience ajoutée !'); setForm({poste:'',entreprise:'',lieu:'',dateDebut:'',dateFin:'',enCours:false,description:''}); setShowForm(false); onRefresh(); }
    catch { toast.error('Erreur'); } finally { setLoading(false); }
  };
  const handleDelete = async (id) => {
    if (!confirm('Supprimer ?')) return;
    try { await deleteExperience(id); toast.success('Supprimée'); onRefresh(); } catch { toast.error('Erreur'); }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-normal">Expériences</h2>
        <Btn onClick={()=>setShowForm(!showForm)}>{showForm?'✕ Annuler':'+ Ajouter'}</Btn>
      </div>
      {showForm && (
        <Card title="Nouvelle expérience">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Poste *" value={form.poste} onChange={e=>setForm(p=>({...p,poste:e.target.value}))} placeholder="Développeur Full Stack"/>
              <Input label="Entreprise *" value={form.entreprise} onChange={e=>setForm(p=>({...p,entreprise:e.target.value}))} placeholder="Nom de l'entreprise"/>
            </div>
            <Input label="Lieu" value={form.lieu} onChange={e=>setForm(p=>({...p,lieu:e.target.value}))} placeholder="Antananarivo, Madagascar"/>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date de début *" type="month" value={form.dateDebut} onChange={e=>setForm(p=>({...p,dateDebut:e.target.value}))}/>
              {!form.enCours && <Input label="Date de fin" type="month" value={form.dateFin} onChange={e=>setForm(p=>({...p,dateFin:e.target.value}))}/>}
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="enCours" checked={form.enCours} onChange={e=>setForm(p=>({...p,enCours:e.target.checked}))} className="accent-[#1d6a40]"/>
              <label htmlFor="enCours" className="text-sm text-[#4a4a40]">Poste actuel</label>
            </div>
            <Textarea label="Description" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} placeholder="Décris tes missions..."/>
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={()=>setShowForm(false)}>Annuler</Btn>
              <Btn loading={loading} onClick={handleAdd}>Ajouter</Btn>
            </div>
          </div>
        </Card>
      )}
      {portfolio?.experiences?.length === 0 && (
        <div className="text-center py-16 bg-white border border-dashed border-[#e2e1d8] rounded-2xl">
          <div className="text-4xl mb-3">💼</div>
          <p className="text-[#9a9a8a] text-sm">Aucune expérience encore.</p>
        </div>
      )}
      <div className="space-y-4">
        {portfolio?.experiences?.map(e => (
          <div key={e._id} className="bg-white border border-[#e2e1d8] rounded-2xl p-5 hover:border-[#b8ddc8] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-[#1a1a14]">{e.poste}</h4>
                <p className="text-sm text-[#1d6a40] font-medium">{e.entreprise}</p>
                <p className="text-xs text-[#9a9a8a] mt-0.5">{e.dateDebut} → {e.enCours ? <span className="text-[#25a058] font-semibold">Présent</span> : e.dateFin}{e.lieu && ` · ${e.lieu}`}</p>
                {e.description && <p className="text-xs text-[#4a4a40] mt-2 leading-relaxed">{e.description}</p>}
              </div>
              <Btn variant="danger" onClick={()=>handleDelete(e._id)}>🗑</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Competences({ portfolio, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nom:'', niveau:80, categorie:'Frontend' });
  const categories = ['Frontend','Backend','Base de données','DevOps','Mobile','Design','Management','Autre'];
  const handleAdd = async () => {
    if (!form.nom) return toast.error('Nom requis');
    setLoading(true);
    try { await addCompetence(form); toast.success('Ajoutée !'); setForm({nom:'',niveau:80,categorie:'Frontend'}); setShowForm(false); onRefresh(); }
    catch { toast.error('Erreur'); } finally { setLoading(false); }
  };
  const handleDelete = async (id) => {
    try { await deleteCompetence(id); toast.success('Supprimée'); onRefresh(); } catch { toast.error('Erreur'); }
  };
  const grouped = portfolio?.competences?.reduce((acc,c) => { if(!acc[c.categorie]) acc[c.categorie]=[]; acc[c.categorie].push(c); return acc; },{}) || {};
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-normal">Compétences</h2>
        <Btn onClick={()=>setShowForm(!showForm)}>{showForm?'✕ Annuler':'+ Ajouter'}</Btn>
      </div>
      {showForm && (
        <Card title="Nouvelle compétence">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nom *" value={form.nom} onChange={e=>setForm(p=>({...p,nom:e.target.value}))} placeholder="React, Node.js..."/>
              <div>
                <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">Catégorie</label>
                <select value={form.categorie} onChange={e=>setForm(p=>({...p,categorie:e.target.value}))} className="w-full px-3 py-2.5 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm outline-none focus:border-[#1d6a40] transition-all">
                  {categories.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">Niveau : {form.niveau}%</label>
              <input type="range" min="10" max="100" value={form.niveau} onChange={e=>setForm(p=>({...p,niveau:parseInt(e.target.value)}))} className="w-full accent-[#1d6a40]"/>
            </div>
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={()=>setShowForm(false)}>Annuler</Btn>
              <Btn loading={loading} onClick={handleAdd}>Ajouter</Btn>
            </div>
          </div>
        </Card>
      )}
      {portfolio?.competences?.length === 0 && (
        <div className="text-center py-16 bg-white border border-dashed border-[#e2e1d8] rounded-2xl">
          <div className="text-4xl mb-3">⚡</div>
          <p className="text-[#9a9a8a] text-sm">Aucune compétence encore.</p>
        </div>
      )}
      {Object.entries(grouped).map(([cat,comps]) => (
        <Card key={cat} title={cat}>
          <div className="space-y-3">
            {comps.map(c => (
              <div key={c._id} className="flex items-center gap-3">
                <div className="w-24 text-sm text-[#4a4a40] font-medium flex-shrink-0">{c.nom}</div>
                <div className="flex-1 h-2 bg-[#f6f5f0] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#1d6a40] to-[#25a058] rounded-full" style={{width:`${c.niveau}%`}}></div>
                </div>
                <span className="text-xs text-[#9a9a8a] w-10 text-right">{c.niveau}%</span>
                <Btn variant="danger" onClick={()=>handleDelete(c._id)}>🗑</Btn>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}



function Template({ user, onRefresh }) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(user?.template || 'minimal');

  const templates = [
    {
      id: 'minimal', name: 'Minimaliste Clair',
      bg: '#f6f5f0', circle: 'rgba(29,106,64,0.15)',
      stripe: 'linear-gradient(90deg,#1d6a40,#25a058)',
      lines: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.07)', 'rgba(0,0,0,0.05)']
    },
    {
      id: 'dark', name: 'Futuriste Sombre',
      bg: '#0d0d14', circle: 'rgba(108,99,255,0.3)',
      stripe: 'linear-gradient(90deg,#6c63ff,#00e5ff)',
      lines: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.08)']
    },
    {
      id: 'forest', name: 'Vert Forêt',
      bg: '#0d1a12', circle: 'rgba(37,160,88,0.25)',
      stripe: 'linear-gradient(90deg,#25a058,#7eeaa0)',
      lines: ['rgba(150,220,170,0.2)', 'rgba(150,220,170,0.15)', 'rgba(150,220,170,0.1)']
    },
    {
      id: 'terminal', name: 'Retro Terminal',
      bg: '#0a0a0a', circle: 'rgba(0,255,65,0.2)',
      stripe: 'linear-gradient(90deg,#00ff41,#00cc33)',
      lines: ['rgba(0,255,65,0.15)', 'rgba(0,255,65,0.1)', 'rgba(0,255,65,0.07)']
    },
    {
      id: 'glass', name: 'Glassmorphism',
      bg: 'linear-gradient(135deg,#0f0c29,#302b63)',
      circle: 'rgba(255,107,107,0.4)',
      stripe: 'linear-gradient(90deg,#ff6b6b,#4ecdc4)',
      lines: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.05)']
    },
    {
      id: 'gradient', name: 'Gradient Violet/Rose',
      bg: 'linear-gradient(135deg,#1a0533,#2d0b6b)',
      circle: 'rgba(180,130,255,0.4)',
      stripe: 'linear-gradient(90deg,#b482ff,#ff4d8d)',
      lines: ['rgba(180,130,255,0.2)', 'rgba(180,130,255,0.12)', 'rgba(255,77,141,0.1)']
    },
    {
      id: 'card', name: 'Card Layout',
      bg: '#f0f2f5', circle: 'rgba(102,126,234,0.2)',
      stripe: 'linear-gradient(90deg,#667eea,#764ba2)',
      lines: ['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.03)']
    },
    {
      id: 'magazine', name: 'Magazine',
      bg: '#ffffff', circle: 'rgba(0,0,0,0.08)',
      stripe: '#000000',
      lines: ['rgba(0,0,0,0.12)', 'rgba(0,0,0,0.08)', 'rgba(0,0,0,0.05)']
    },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ template: selected });
      setUser(p => ({ ...p, template: selected }));
      toast.success('Template mis à jour !');
      onRefresh();
    } catch { toast.error('Erreur'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-normal">Choisir un template</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {templates.map(t => (
          <div key={t.id} onClick={() => setSelected(t.id)}
            className={`rounded-2xl overflow-hidden border-2 cursor-pointer transition-all hover:-translate-y-1 ${selected === t.id ? 'border-[#1d6a40] shadow-lg' : 'border-[#e2e1d8]'}`}>
            <div className="h-32 p-3 flex flex-col gap-1.5 relative" style={{ background: t.bg }}>
              <div className="w-7 h-7 rounded-full mb-1" style={{ background: t.circle }}></div>
              {t.lines.map((c, j) => (
                <div key={j} className="h-1 rounded-full" style={{ background: c, width: ['70%', '50%', '60%'][j] }}></div>
              ))}
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: t.stripe }}></div>
              {selected === t.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#1d6a40] rounded-full flex items-center justify-center text-white text-xs">✓</div>
              )}
            </div>
            <div className="bg-white px-3 py-2 border-t border-[#e2e1d8] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1a1a14] truncate">{t.name}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Btn loading={loading} onClick={handleSave}>💾 Appliquer</Btn>
      </div>
    </div>
  );
}

function Settings({ user }) {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-normal">Paramètres</h2>
      <Card title="Informations du compte">
        <div className="space-y-3 text-sm text-[#4a4a40]">
          <div className="flex justify-between"><span className="text-[#9a9a8a]">Nom</span><span className="font-medium">{user?.prenom} {user?.nom}</span></div>
          <div className="flex justify-between"><span className="text-[#9a9a8a]">Email</span><span className="font-medium">{user?.email}</span></div>
          <div className="flex justify-between"><span className="text-[#9a9a8a]">Username</span><span className="font-mono text-[#1d6a40]">@{user?.username}</span></div>
        </div>
      </Card>
      <Card title="Danger zone">
        <Btn variant="danger" onClick={()=>{ logoutUser(); navigate('/'); toast.success('Déconnecté !'); }}>🚪 Se déconnecter</Btn>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchPortfolio = async () => {
    try { const res = await getMyPortfolio(); setPortfolio(res.data.portfolio); }
    catch { toast.error('Erreur chargement'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPortfolio(); }, []);

  const renderContent = () => {
    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#1d6a40] border-t-transparent rounded-full animate-spin"></div></div>;
    switch(activeTab) {
      case 'overview':    return <Overview portfolio={portfolio} user={user}/>;
      case 'profile':     return <Profile portfolio={portfolio} user={user} onRefresh={fetchPortfolio}/>;
      case 'projets':     return <Projets portfolio={portfolio} onRefresh={fetchPortfolio}/>;
      case 'experiences': return <Experiences portfolio={portfolio} onRefresh={fetchPortfolio}/>;
      case 'competences': return <Competences portfolio={portfolio} onRefresh={fetchPortfolio}/>;
      case 'template':    return <Template user={user} onRefresh={fetchPortfolio}/>;
      case 'settings':    return <Settings user={user}/>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f0] flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={()=>setSidebarOpen(false)}></div>}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-[#e2e1d8] z-30 flex flex-col transition-transform duration-300 ${sidebarOpen?'translate-x-0':'-translate-x-full'} md:translate-x-0 md:static md:flex`}>
        <div className="h-16 flex items-center px-5 border-b border-[#e2e1d8]">
          <Link to="/" className="font-mono text-sm font-medium flex items-center gap-1.5 text-[#1a1a14]">
            <span className="w-2 h-2 rounded-full bg-[#25a058] inline-block animate-pulse"></span> DevFolioMG
          </Link>
        </div>
        <div className="p-4 border-b border-[#e2e1d8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#e8f5ee] border border-[#b8ddc8] flex items-center justify-center flex-shrink-0">
              {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover"/> : <span className="font-serif text-sm text-[#1d6a40] italic">{user?.prenom?.[0]}</span>}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-[#1a1a14] truncate">{user?.prenom} {user?.nom}</div>
              <div className="text-xs text-[#9a9a8a] font-mono truncate">@{user?.username}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={()=>{ setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${activeTab===item.id?'bg-[#e8f5ee] text-[#1d6a40]':'text-[#4a4a40] hover:bg-[#f6f5f0]'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-[#e2e1d8]">
          <Link to={`/p/${user?.username}`} target="_blank" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#9a9a8a] hover:bg-[#f6f5f0] hover:text-[#1a1a14] transition-all">
            ↗ Voir mon portfolio
          </Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#e2e1d8] flex items-center justify-between px-4 md:hidden sticky top-0 z-10">
          <button onClick={()=>setSidebarOpen(true)} className="text-[#4a4a40] text-lg">☰</button>
          <span className="font-mono text-sm font-medium">DevFolioMG</span>
          <span className="w-6"></span>
        </header>
        <main className="flex-1 p-6 overflow-auto max-w-4xl w-full mx-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
