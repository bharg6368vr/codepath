const PDFDocument = require('pdfkit');

const LANGUAGE_LABELS = {
  python: 'Python Systems & Software Engineering',
  java: 'Java Enterprise & Object-Oriented Architecture',
  cpp: 'C++ High Performance & Systems Programming',
  c: 'C Low-Level Programming & Memory Architecture'
};

const GOLD_DARK = '#92400e';
const GOLD = '#b45309';
const GOLD_LIGHT = '#d97706';
const NAVY = '#0f172a';
const SLATE = '#334155';
const MUTED = '#64748b';
const BORDER_LIGHT = '#e2e8f0';

function drawOrnateCorner(doc, x, y, flipX = 1, flipY = 1) {
  doc.save();
  doc.translate(x, y);
  doc.scale(flipX, flipY);
  doc.lineWidth(1).strokeColor(GOLD);

  // Decorative corner brackets
  doc.moveTo(0, 16).lineTo(16, 0).stroke();
  doc.moveTo(0, 22).lineTo(22, 0).stroke();
  doc.circle(8, 8, 2).fill(GOLD);
  doc.restore();
}

function drawGoldMedallionSeal(doc, cx, cy) {
  doc.save();

  // Ribbon tails draping down
  doc.save();
  doc.fillColor(GOLD_DARK);
  // Left ribbon
  doc.polygon([cx - 16, cy + 18], [cx - 24, cy + 50], [cx - 16, cy + 44], [cx - 8, cy + 50], [cx - 8, cy + 22]);
  doc.fill();
  // Right ribbon
  doc.polygon([cx + 8, cy + 22], [cx + 8, cy + 50], [cx + 16, cy + 44], [cx + 24, cy + 50], [cx + 16, cy + 18]);
  doc.fill();
  doc.restore();

  // Scalloped outer starburst effect
  doc.save();
  doc.translate(cx, cy);
  for (let i = 0; i < 24; i++) {
    doc.rotate(15);
    doc.rect(-1.5, -27, 3, 4).fill(GOLD_LIGHT);
  }
  doc.restore();

  // Outer Gold Ring
  doc.circle(cx, cy, 25).lineWidth(2).stroke(GOLD);
  doc.circle(cx, cy, 22).lineWidth(0.75).stroke(BORDER_LIGHT);

  // Inner Shaded Medallion
  doc.circle(cx, cy, 20).fillAndStroke('#fef3c7', GOLD);

  // 5-Point Gold Star in Center
  doc.save();
  doc.translate(cx, cy);
  const starRadius = 8;
  const innerRadius = 4;
  const points = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? starRadius : innerRadius;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    points.push([Math.cos(angle) * r, Math.sin(angle) * r]);
  }
  doc.polygon(...points).fill(GOLD);
  doc.restore();

  // Inscription text under medallion
  doc.fontSize(6.5).fillColor(GOLD).font('Helvetica-Bold')
    .text('OFFICIAL SEAL', cx - 40, cy + 26, { width: 80, align: 'center' });

  doc.restore();
}

function drawSignature(doc, x, y, name, title) {
  const width = 180;
  
  // Simulated elegant handwritten cursive stroke
  doc.save();
  doc.lineWidth(1.2).strokeColor('#1e3a8a').lineCap('round').lineJoin('round');
  doc.moveTo(x + 20, y - 10)
    .bezierCurveTo(x + 35, y - 28, x + 50, y - 5, x + 70, y - 15)
    .bezierCurveTo(x + 90, y - 25, x + 110, y - 8, x + 135, y - 18)
    .bezierCurveTo(x + 145, y - 22, x + 155, y - 10, x + 165, y - 12)
    .stroke();
  doc.restore();

  // Signature line
  doc.moveTo(x, y).lineTo(x + width, y).lineWidth(0.8).stroke('#94a3b8');

  // Signer Name & Title
  doc.fontSize(9.5).fillColor(NAVY).font('Helvetica-Bold')
    .text(name, x, y + 5, { width, align: 'center' });
  doc.fontSize(7.5).fillColor(MUTED).font('Helvetica')
    .text(title, x, y + 18, { width, align: 'center' });
}

function streamCertificatePdf(res, { learnerName, languageId, score, certificateId, issuedAt }) {
  const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 40 });
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="CodePath-Certificate-${certificateId}.pdf"`);
  }
  doc.pipe(res);

  const { width, height } = doc.page;
  const centerX = width / 2;

  // Background subtle ivory tint
  doc.rect(0, 0, width, height).fill('#faf9f6');

  // --- LUXURY BORDER SYSTEM ---
  // Outer Heavy Gold Border
  doc.rect(18, 18, width - 36, height - 36).lineWidth(2.5).stroke(GOLD);

  // Inner Crisp Navy Border
  doc.rect(24, 24, width - 48, height - 48).lineWidth(1).stroke(NAVY);

  // Delicate Innermost Accent Line
  doc.rect(28, 28, width - 56, height - 56).lineWidth(0.5).stroke(GOLD_LIGHT);

  // Ornate Corner Accents
  drawOrnateCorner(doc, 30, 30, 1, 1);
  drawOrnateCorner(doc, width - 30, 30, -1, 1);
  drawOrnateCorner(doc, 30, height - 30, 1, -1);
  drawOrnateCorner(doc, width - 30, height - 30, -1, -1);

  // --- INSTITUTION HEADER ---
  doc.fontSize(10).fillColor(GOLD).font('Helvetica-Bold')
    .text('CODEPATH ACADEMY OF COMPUTER SCIENCE', 0, 48, { align: 'center', characterSpacing: 2 });
  
  doc.fontSize(7.5).fillColor(MUTED).font('Helvetica')
    .text('OFFICIAL GLOBAL CURRICULUM ACCREDITATION & TECHNICAL CERTIFICATION', 0, 64, { align: 'center', characterSpacing: 0.8 });

  // --- CERTIFICATE TITLE ---
  doc.fontSize(27).fillColor(NAVY).font('Times-Bold')
    .text('Certificate of Achievement & Mastery', 0, 88, { align: 'center' });

  // Decorative Diamond Line
  doc.save();
  doc.moveTo(centerX - 130, 124).lineTo(centerX - 12, 124).lineWidth(0.8).stroke(GOLD);
  doc.moveTo(centerX + 12, 124).lineTo(centerX + 130, 124).lineWidth(0.8).stroke(GOLD);
  doc.polygon([centerX - 6, 124], [centerX, 120], [centerX + 6, 124], [centerX, 128]).fill(GOLD);
  doc.restore();

  // --- ATTRIBUTION STATEMENT ---
  doc.fontSize(10.5).fillColor(MUTED).font('Helvetica')
    .text('THIS IS TO OFFICIALLY CERTIFY THAT', 0, 142, { align: 'center', characterSpacing: 1 });

  // --- RECIPIENT NAME ---
  const displayName = learnerName || 'Accomplished Scholar';
  doc.fontSize(32).fillColor(NAVY).font('Times-Bold')
    .text(displayName, 0, 166, { align: 'center' });

  const nameW = Math.min(doc.widthOfString(displayName), 400);
  doc.moveTo(centerX - nameW / 2 - 15, 204).lineTo(centerX + nameW / 2 + 15, 204).lineWidth(1).stroke(GOLD);

  // --- CURRICULUM STATEMENT ---
  doc.fontSize(10.5).fillColor(SLATE).font('Helvetica')
    .text('has successfully completed the comprehensive professional syllabus and demonstrated excellence in', 0, 218, { align: 'center' });

  const trackTitle = LANGUAGE_LABELS[languageId] || `${languageId.toUpperCase()} Software Engineering`;
  doc.fontSize(16).fillColor(GOLD).font('Times-Bold')
    .text(trackTitle.toUpperCase(), 0, 236, { align: 'center', characterSpacing: 0.5 });

  const syllabusText = `Covering core syntax paradigms, object-oriented architecture, algorithms, and runtime memory optimization, evaluated with a verified final assessment score of ${score}%.`;
  doc.fontSize(9.5).fillColor(MUTED).font('Helvetica')
    .text(syllabusText, centerX - 260, 260, { width: 520, align: 'center', lineGap: 3 });

  // --- GOLD FOIL SEAL (CENTER) ---
  drawGoldMedallionSeal(doc, centerX, height - 150);

  // --- DUAL GOVERNANCE SIGNATURES ---
  const sigY = height - 120;
  const leftSigX = 80;
  const rightSigX = width - 260;

  drawSignature(doc, leftSigX, sigY, 'Dr. Arthur Vance, Ph.D.', 'Dean of Academic Engineering & Curriculum');
  drawSignature(doc, rightSigX, sigY, 'Elena Rostova, M.Sc.', 'Chief Assessment Officer, Technical Standards');

  // --- VERIFICATION SECURITY FOOTER ---
  const footerY = height - 52;
  doc.save();
  doc.moveTo(40, footerY - 8).lineTo(width - 40, footerY - 8).lineWidth(0.5).stroke(BORDER_LIGHT);

  const dateStr = new Date(issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const verifyLink = `http://localhost:5173/verify/${certificateId}`;

  doc.fontSize(7.5).fillColor(MUTED).font('Helvetica-Bold')
    .text(`DATE ISSUED: ${dateStr.toUpperCase()}`, 40, footerY, { width: 220, align: 'left' });

  doc.fontSize(7.5).fillColor(GOLD).font('Helvetica-Bold')
    .text(`CREDENTIAL ID: ${certificateId}`, 0, footerY, { align: 'center' });

  doc.fontSize(7.5).fillColor(MUTED).font('Helvetica')
    .text(`AUTHENTICITY: ${verifyLink}`, width - 260, footerY, { width: 220, align: 'right' });

  doc.restore();

  doc.end();
}

module.exports = { streamCertificatePdf };
