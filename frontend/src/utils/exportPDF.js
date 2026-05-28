// src/utils/exportPDF.js
// Installe les dépendances : npm install jspdf html2canvas

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (user, portfolio) => {
  // Crée un div temporaire hors écran
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 794px;
    background: white;
    font-family: 'Bricolage Grotesque', sans-serif;
    color: #1a1a14;
    padding: 48px;
    box-sizing: border-box;
  `;

  container.innerHTML = generateCVHTML(user, portfolio);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pdfWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    // Si le contenu dépasse une page, on pagine
    if (scaledHeight <= pdfHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);
    } else {
      let position = 0;
      let remainingHeight = scaledHeight;
      let page = 0;

      while (remainingHeight > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -page * pdfHeight, pdfWidth, scaledHeight);
        remainingHeight -= pdfHeight;
        page++;
      }
    }

    const filename = `CV_${user.prenom}_${user.nom}_${new Date().getFullYear()}.pdf`;
    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('Erreur export PDF:', err);
    throw err;
  } finally {
    document.body.removeChild(container);
  }
};

const generateCVHTML = (user, portfolio) => {
  const green = '#1d6a40';
  const greenLight = '#e8f5ee';
  const text = '#1a1a14';
  const muted = '#4a4a40';
  const light = '#9a9a8a';
  const border = '#e2e1d8';

  const skillsHTML = portfolio.competences?.length > 0
    ? portfolio.competences.map(c => `
        <div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;">
            <span style="color:${text};font-weight:500;">${c.nom}</span>
            <span style="color:${light};">${c.niveau}%</span>
          </div>
          <div style="height:4px;background:#f0f0ec;border-radius:2px;overflow:hidden;">
            <div style="height:100%;width:${c.niveau}%;background:linear-gradient(90deg,${green},#25a058);border-radius:2px;"></div>
          </div>
        </div>
      `).join('')
    : '';

  const projetsHTML = portfolio.projets?.length > 0
    ? portfolio.projets.map(p => `
        <div style="margin-bottom:14px;padding:14px;background:#fafaf8;border-radius:8px;border:1px solid ${border};">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <h4 style="margin:0;font-size:13px;font-weight:700;color:${text};">${p.titre}</h4>
            <div style="display:flex;gap:8px;">
              ${p.lien ? `<span style="font-size:10px;color:${green};">↗ ${p.lien}</span>` : ''}
              ${p.github ? `<span style="font-size:10px;color:${light};">GitHub</span>` : ''}
            </div>
          </div>
          ${p.description ? `<p style="margin:0 0 8px;font-size:11px;color:${muted};line-height:1.6;">${p.description}</p>` : ''}
          <div style="display:flex;flex-wrap:wrap;gap:4px;">
            ${p.technologies?.map(t => `<span style="font-size:10px;background:${greenLight};color:${green};padding:2px 8px;border-radius:100px;">${t}</span>`).join('') || ''}
          </div>
        </div>
      `).join('')
    : '';

  const expHTML = portfolio.experiences?.length > 0
    ? portfolio.experiences.map(e => `
        <div style="margin-bottom:14px;padding-left:14px;border-left:2px solid #b8ddc8;">
          <h4 style="margin:0 0 2px;font-size:13px;font-weight:700;color:${text};">${e.poste}</h4>
          <p style="margin:0 0 2px;font-size:12px;color:${green};font-weight:600;">${e.entreprise}</p>
          <p style="margin:0 0 4px;font-size:10px;color:${light};">${e.dateDebut} → ${e.enCours ? 'Présent' : e.dateFin}${e.lieu ? ` · ${e.lieu}` : ''}</p>
          ${e.description ? `<p style="margin:0;font-size:11px;color:${muted};line-height:1.6;">${e.description}</p>` : ''}
        </div>
      `).join('')
    : '';

  return `
    <div style="font-family:'Bricolage Grotesque',Arial,sans-serif;color:${text};background:white;">

      <!-- HEADER -->
      <div style="display:flex;align-items:flex-start;gap:24px;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid ${border};">
        ${user.avatar
          ? `<img src="${user.avatar}" style="width:80px;height:80px;border-radius:12px;object-fit:cover;flex-shrink:0;" crossorigin="anonymous"/>`
          : `<div style="width:80px;height:80px;border-radius:12px;background:${greenLight};display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:${green};flex-shrink:0;">${user.prenom[0]}</div>`
        }
        <div style="flex:1;">
          <h1 style="margin:0 0 4px;font-size:28px;font-weight:800;color:${text};">${user.prenom} ${user.nom}</h1>
          <p style="margin:0 0 8px;font-size:15px;color:${green};font-weight:600;">${portfolio.titre || ''}</p>
          ${portfolio.disponible ? `<span style="display:inline-block;background:${greenLight};color:${green};font-size:10px;font-weight:700;padding:3px 10px;border-radius:100px;margin-bottom:8px;">● Disponible</span>` : ''}
          <p style="margin:0 0 8px;font-size:11px;color:${muted};line-height:1.7;max-width:500px;">${portfolio.bio || ''}</p>
          <div style="display:flex;flex-wrap:wrap;gap:16px;font-size:10px;color:${light};">
            ${portfolio.ville ? `<span>📍 ${portfolio.ville}, ${portfolio.pays}</span>` : ''}
            ${portfolio.telephone ? `<span>📞 ${portfolio.telephone}</span>` : ''}
            ${user.email ? `<span>✉ ${user.email}</span>` : ''}
            ${portfolio.linkedin ? `<span>LinkedIn: ${portfolio.linkedin}</span>` : ''}
            ${portfolio.github ? `<span>GitHub: ${portfolio.github}</span>` : ''}
          </div>
        </div>
      </div>

      <!-- CONTENU 2 colonnes -->
      <div style="display:grid;grid-template-columns:1fr 220px;gap:32px;">

        <!-- COLONNE PRINCIPALE -->
        <div>
          ${projetsHTML ? `
            <div style="margin-bottom:28px;">
              <h2 style="margin:0 0 14px;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:${text};padding-bottom:8px;border-bottom:1.5px solid ${border};">Projets</h2>
              ${projetsHTML}
            </div>
          ` : ''}

          ${expHTML ? `
            <div style="margin-bottom:28px;">
              <h2 style="margin:0 0 14px;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:${text};padding-bottom:8px;border-bottom:1.5px solid ${border};">Expériences</h2>
              ${expHTML}
            </div>
          ` : ''}
        </div>

        <!-- SIDEBAR -->
        <div>
          ${skillsHTML ? `
            <div style="margin-bottom:28px;">
              <h2 style="margin:0 0 14px;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:${text};padding-bottom:8px;border-bottom:1.5px solid ${border};">Compétences</h2>
              ${skillsHTML}
            </div>
          ` : ''}
        </div>
      </div>

      <!-- FOOTER -->
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid ${border};display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:10px;color:${light};">Généré par DevFolioMG · devfoliomg.vercel.app</span>
        <span style="font-size:10px;color:${light};">${new Date().toLocaleDateString('fr-FR')}</span>
      </div>
    </div>
  `;
};
