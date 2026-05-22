import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f6f5f0] flex flex-col items-center justify-center text-center px-4">
      <p className="font-mono text-6xl font-bold text-[#e2e1d8] mb-4">404</p>
      <h1 className="text-2xl font-serif font-normal text-[#1a1a14] mb-2">Page introuvable</h1>
      <p className="text-sm text-[#9a9a8a] mb-6">Cette page n'existe pas ou a été déplacée.</p>
      <Link to="/" className="px-6 py-2.5 bg-[#1a1a14] text-white rounded-full text-sm font-semibold hover:bg-[#2a2a20] transition-all">
        ← Retour à l'accueil
      </Link>
    </div>
  );
}
