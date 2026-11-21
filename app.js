/* ============================================================
   FARM YIELD ANALYZER — App Logic
   app.js  |  Vanilla JS + Chart.js 4
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   MOCK DATA
────────────────────────────────────────────────────────────── */
const DB = {
  farms: [
    { id:'f1', name:'Riverbend Farm',    location:'Napa Valley, CA',    region:'Northern CA', area:45.5, soilType:'Loamy',     irrigationType:'Drip',      status:'active',     managerId:'u2' },
    { id:'f2', name:'Green Valley Farm', location:'Sacramento, CA',     region:'Central CA',  area:78.2, soilType:'Clay Loam', irrigationType:'Flood',     status:'active',     managerId:'u2' },
    { id:'f3', name:'Sunset Ridge Farm', location:'Fresno, CA',         region:'Central CA',  area:32.8, soilType:'Sandy Loam',irrigationType:'Sprinkler', status:'monitoring', managerId:'u3' },
    { id:'f4', name:'Highland Acres',    location:'Modesto, CA',        region:'Central CA',  area:55.0, soilType:'Silty Clay',irrigationType:'Drip',      status:'active',     managerId:'u3' },
  ],

  crops: [
    { id:'c1', farmId:'f1', name:'Rice',  variety:'IR-64',           seasons:['Kharif 2022','Kharif 2023','Kharif 2024','Kharif 2025'] },
    { id:'c2', farmId:'f1', name:'Wheat', variety:'HD-2967',         seasons:['Rabi 2023','Rabi 2024','Rabi 2025'] },
    { id:'c3', farmId:'f2', name:'Rice',  variety:'Swarna',          seasons:['Kharif 2022','Kharif 2023','Kharif 2024','Kharif 2025'] },
    { id:'c4', farmId:'f2', name:'Maize', variety:'Hybrid DHM-117',  seasons:['Kharif 2023','Kharif 2024'] },
    { id:'c5', farmId:'f3', name:'Wheat', variety:'PBW-550',         seasons:['Rabi 2024','Rabi 2025'] },
    { id:'c6', farmId:'f4', name:'Rice',  variety:'Basmati-370',     seasons:['Kharif 2023','Kharif 2024','Kharif 2025'] },
  ],

  yields: [
    {id:'y1', farmId:'f1',cropId:'c1',season:'Kharif 2022',year:2022,yieldPerHa:3.80,totalProd:172.9,rainfall:520,irrigation:4200,soilPH:6.2},
    {id:'y2', farmId:'f1',cropId:'c1',season:'Kharif 2023',year:2023,yieldPerHa:4.10,totalProd:186.6,rainfall:580,irrigation:4500,soilPH:6.3},
    {id:'y3', farmId:'f1',cropId:'c1',season:'Kharif 2024',year:2024,yieldPerHa:3.90,totalProd:177.5,rainfall:490,irrigation:4800,soilPH:6.1},
    {id:'y4', farmId:'f1',cropId:'c1',season:'Kharif 2025',year:2025,yieldPerHa:4.25,totalProd:193.4,rainfall:610,irrigation:4500,soilPH:6.4},
    {id:'y5', farmId:'f1',cropId:'c2',season:'Rabi 2023',  year:2023,yieldPerHa:3.20,totalProd:145.6,rainfall:210,irrigation:3800,soilPH:6.2},
    {id:'y6', farmId:'f1',cropId:'c2',season:'Rabi 2024',  year:2024,yieldPerHa:3.50,totalProd:159.3,rainfall:240,irrigation:3600,soilPH:6.3},
    {id:'y7', farmId:'f1',cropId:'c2',season:'Rabi 2025',  year:2025,yieldPerHa:3.70,totalProd:168.4,rainfall:260,irrigation:3500,soilPH:6.5},
    {id:'y8', farmId:'f2',cropId:'c3',season:'Kharif 2022',year:2022,yieldPerHa:3.50,totalProd:273.7,rainfall:480,irrigation:6200,soilPH:6.8},
    {id:'y9', farmId:'f2',cropId:'c3',season:'Kharif 2023',year:2023,yieldPerHa:3.60,totalProd:281.5,rainfall:510,irrigation:6000,soilPH:6.7},
    {id:'y10',farmId:'f2',cropId:'c3',season:'Kharif 2024',year:2024,yieldPerHa:3.40,totalProd:265.9,rainfall:440,irrigation:6400,soilPH:6.6},
    {id:'y11',farmId:'f2',cropId:'c3',season:'Kharif 2025',year:2025,yieldPerHa:4.10,totalProd:320.6,rainfall:590,irrigation:5800,soilPH:6.9},
    {id:'y12',farmId:'f2',cropId:'c4',season:'Kharif 2023',year:2023,yieldPerHa:5.80,totalProd:453.6,rainfall:510,irrigation:3200,soilPH:6.7},
    {id:'y13',farmId:'f2',cropId:'c4',season:'Kharif 2024',year:2024,yieldPerHa:6.10,totalProd:476.6,rainfall:540,irrigation:3100,soilPH:6.8},
    {id:'y14',farmId:'f3',cropId:'c5',season:'Rabi 2024',  year:2024,yieldPerHa:2.90,totalProd:95.1, rainfall:180,irrigation:4200,soilPH:5.8},
    {id:'y15',farmId:'f3',cropId:'c5',season:'Rabi 2025',  year:2025,yieldPerHa:3.10,totalProd:101.7,rainfall:200,irrigation:4100,soilPH:5.9},
    {id:'y16',farmId:'f4',cropId:'c6',season:'Kharif 2023',year:2023,yieldPerHa:4.40,totalProd:242.0,rainfall:620,irrigation:3800,soilPH:6.5},
    {id:'y17',farmId:'f4',cropId:'c6',season:'Kharif 2024',year:2024,yieldPerHa:4.20,totalProd:231.0,rainfall:570,irrigation:4000,soilPH:6.4},
    {id:'y18',farmId:'f4',cropId:'c6',season:'Kharif 2025',year:2025,yieldPerHa:3.80,totalProd:209.0,rainfall:490,irrigation:4300,soilPH:6.3},
  ],

  soil: [
    {farmId:'f1',ph:6.4,nitrogen:182,phosphorus:28,potassium:210,organicMatter:3.2,texture:'Loamy'},
    {farmId:'f2',ph:6.9,nitrogen:165,phosphorus:22,potassium:195,organicMatter:2.8,texture:'Clay Loam'},
    {farmId:'f3',ph:5.9,nitrogen:142,phosphorus:18,potassium:175,organicMatter:2.1,texture:'Sandy Loam'},
    {farmId:'f4',ph:6.3,nitrogen:175,phosphorus:25,potassium:205,organicMatter:3.0,texture:'Silty Clay'},
  ],

  users: [
    {id:'u1',name:'Arun Kumar',   email:'arun@farm.com',   role:'Farmer',         farms:['f1'],         status:'active',   lastLogin:'2026-08-25'},
    {id:'u2',name:'Maya Sharma',  email:'maya@farmco.com', role:'Farm Manager',   farms:['f1','f2'],    status:'active',   lastLogin:'2026-08-26'},
    {id:'u3',name:'Dr. Priya Nair',email:'priya@agri.edu', role:'Researcher',     farms:[],             status:'active',   lastLogin:'2026-08-24'},
    {id:'u4',name:'Vikram Singh', email:'vikram@consult.com',role:'Agronomist',   farms:['f1','f3','f4'],status:'active',  lastLogin:'2026-08-23'},
    {id:'u5',name:'Admin User',   email:'admin@system.com',role:'Administrator',  farms:[],             status:'active',   lastLogin:'2026-08-26'},
    {id:'u6',name:'Ravi Patel',   email:'ravi@farm.com',   role:'Farm Manager',   farms:['f3','f4'],    status:'inactive', lastLogin:'2026-07-15'},
  ],

  auditLogs: [
    {id:'l1',userId:'u5',action:'CREATE_USER',     target:'Ravi Patel',                      ts:'2026-08-26T09:15:00',ip:'192.168.1.105'},
    {id:'l2',userId:'u2',action:'UPLOAD_DATASET',  target:'Kharif 2025 – Riverbend Farm',    ts:'2026-08-25T14:32:00',ip:'192.168.1.102'},
    {id:'l3',userId:'u1',action:'VIEW_PREDICTION', target:'Rice Kharif 2025',                ts:'2026-08-25T10:18:00',ip:'192.168.1.101'},
    {id:'l4',userId:'u5',action:'MODIFY_PERMISSIONS',target:'user-u6',                       ts:'2026-08-24T16:45:00',ip:'192.168.1.105'},
    {id:'l5',userId:'u4',action:'EXPORT_REPORT',   target:'Farm Comparison Q3 2025',         ts:'2026-08-24T11:22:00',ip:'192.168.1.104'},
    {id:'l6',userId:'u3',action:'EXPORT_DATASET',  target:'Regional Analysis – Central CA',  ts:'2026-08-23T09:05:00',ip:'192.168.1.103'},
    {id:'l7',userId:'u2',action:'EDIT_FARM',       target:'Green Valley Farm',               ts:'2026-08-22T15:10:00',ip:'192.168.1.102'},
    {id:'l8',userId:'u1',action:'LOGIN',            target:'arun@farm.com',                  ts:'2026-08-21T07:30:00',ip:'192.168.1.101'},
  ],

  datasets: [
    {id:'ds1',farmId:'f1',name:'Riverbend Historical 2022-2025', rows:4,status:'Imported',  uploadedBy:'u2',date:'2026-08-25',errors:0},
    {id:'ds2',farmId:'f2',name:'Green Valley Yield Records',     rows:6,status:'Imported',  uploadedBy:'u2',date:'2026-08-20',errors:0},
    {id:'ds3',farmId:'f3',name:'Sunset Ridge 2024-2025',         rows:2,status:'Imported',  uploadedBy:'u3',date:'2026-08-18',errors:0},
    {id:'ds4',farmId:'f4',name:'Highland Q3 Upload',             rows:3,status:'Processing',uploadedBy:'u2',date:'2026-08-26',errors:2},
  ],

  modelMetrics: {
    current: {version:'v2.4.1',mae:0.28,rmse:0.35,r2:0.87,trainSize:2840,valSize:710,trainedDate:'2026-07-15',status:'healthy'},
    previous:{version:'v2.3.0',mae:0.31,rmse:0.39,r2:0.84,trainSize:2420,valSize:605,trainedDate:'2026-04-02',status:'archived'},
    maeTrend:[
      {label:'Jan 26',val:0.33},{label:'Feb 26',val:0.31},{label:'Mar 26',val:0.30},
      {label:'Apr 26',val:0.29},{label:'May 26',val:0.28},{label:'Jun 26',val:0.28},
      {label:'Jul 26',val:0.27},{label:'Aug 26',val:0.28},
    ],
  },

  insights: [
    {id:'i1',type:'warning',farmId:'f2',msg:'Farm B has lower yield than similar farms despite comparable rainfall conditions.',action:'View Comparisons'},
    {id:'i2',type:'info',   farmId:'f1',msg:'Historical yield increased during seasons with rainfall above 550 mm.',           action:'View Trends'},
    {id:'i3',type:'success',farmId:'f1',msg:'Riverbend Farm shows a consistent upward yield trend over 3 seasons.',           action:null},
    {id:'i4',type:'warning',farmId:'f4',msg:'Irrigation is 14 % below historical average for Highland Acres this season.',   action:'View Irrigation'},
    {id:'i5',type:'info',   farmId:null,msg:'Soil pH 6.2–6.8 correlates strongly with above-average rice yields region-wide.',action:null},
  ],
};

const STORAGE_KEY = 'farmYieldDatabaseV1';

function loadDatabase() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;
    Object.keys(DB).forEach(key => {
      if (saved[key] !== undefined) DB[key] = saved[key];
    });
  } catch (error) {
    console.warn('Saved database could not be loaded.', error);
  }
  DB.users.forEach(user => { if (!user.password) user.password = 'demo1234'; });
}

function saveDatabase() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DB)); }
  catch (error) { showToast('Database could not be saved in this browser.', 'error'); }
}

function recordAudit(action, target, userId = S.user?.id || 'u5') {
  DB.auditLogs.unshift({ id:'la'+Date.now(), userId, action, target, ts:new Date().toISOString(), ip:'local-browser' });
  saveDatabase();
}

/* ──────────────────────────────────────────────────────────────
   APP STATE
────────────────────────────────────────────────────────────── */
const S = {
  user: null,
  role: null,
  page: 'dashboard',
  farmId: 'f1',
  season: 'Kharif 2025',
  sidebarCollapsed: false,
  charts: {},         // Chart instances — destroyed on page change
  compareTab: 'farm', // 'farm' | 'crop'
  adminTab: 'users',  // 'users' | 'datasets' | 'model' | 'audit'
};

/* ──────────────────────────────────────────────────────────────
   CHART.JS GLOBAL DEFAULTS
────────────────────────────────────────────────────────────── */
function setupChartDefaults() {
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';
  Chart.defaults.font.family = 'Inter';
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
  Chart.defaults.plugins.legend.labels.padding = 18;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.backgroundColor = 'hsl(220,20%,14%)';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.titleColor = '#f0f4f8';
  Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
}

/* ──────────────────────────────────────────────────────────────
   UTILITIES
────────────────────────────────────────────────────────────── */
const fmt  = (n, d = 1) => Number(n).toLocaleString('en-IN', {minimumFractionDigits:d,maximumFractionDigits:d});
const fmtN = (n) => Number(n).toLocaleString('en-IN', {maximumFractionDigits:0});
const fmtDate = (ts) => new Date(ts).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});

function showToast(msg, type = 'success') {
  const icons = {success:'✅',warning:'⚠️',error:'❌',info:'ℹ️'};
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><span class="toast-msg">${msg}</span>`;
  const cont = document.getElementById('toast-container');
  cont.prepend(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 3500);
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadImageAsJpeg(file) {
  return new Promise((resolve, reject) => {
    if (!file) { resolve(null); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
        canvas.getContext('2d').drawImage(image, 0, 0);
        resolve({ data: canvas.toDataURL('image/jpeg', .9), width: image.naturalWidth, height: image.naturalHeight });
      };
      image.onerror = reject; image.src = reader.result;
    };
    reader.onerror = reject; reader.readAsDataURL(file);
  });
}

function generateChartImage(type, data, options = {}) {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 300;
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    const chart = new Chart(canvas, {
      type, data,
      options: { ...options, animation: false, responsive: false, devicePixelRatio: 2 },
      plugins: [{
        id: 'bg_white',
        beforeDraw: (c) => {
          const ctx = c.canvas.getContext('2d');
          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.restore();
        }
      }]
    });
    setTimeout(() => {
      resolve(chart.toBase64Image());
      chart.destroy();
      canvas.remove();
    }, 50);
  });
}

async function downloadPdfReport(title, selectedSections, certificateImage = null) {
  const jsPDF = window.jspdf?.jsPDF;
  const farm = DB.farms.find(f => f.id === S.farmId) || DB.farms[0];
  const yields = DB.yields.filter(y => y.farmId === farm.id);
  const safeTitle = title || `Farm Performance Summary - ${S.season}`;
  const certificateId = `FY-${farm.id.toUpperCase()}-${S.season.replace(/[^0-9]/g, '')}`;
  const approvalDate = new Date().toLocaleDateString();
  const lines = [
    ['Farm Summary & KPIs', `Area: ${farm.area} ha | Soil: ${farm.soilType} | Irrigation: ${farm.irrigationType}`],
    ['Historical Trend Analysis', `Recorded seasons: ${yields.length} | Average yield: ${fmt(yields.reduce((sum, item) => sum + item.yieldPerHa, 0) / (yields.length || 1), 2)} t/ha`],
    ['Yield Prediction Results', `Latest production: ${fmt(yields[yields.length - 1]?.totalProd || 0, 1)} tonnes`],
    ['Factor Analysis & Correlations', 'Rainfall, irrigation, soil pH, and historical yield factors included.'],
    ['Soil Profile Data', `Current soil profile: ${DB.soil.find(item => item.farmId === farm.id)?.ph || 'N/A'} pH`],
    ['Farm Comparison Table', `Portfolio farms: ${DB.farms.length} | Active farms: ${DB.farms.filter(item => item.status === 'active').length}`],
  ];

  if (!jsPDF) {
    const escapePdf = value => String(value).replace(/\\/g, '\\\\').replace(/[()]/g, '\\$&');
    const textLines = [
      'KL UNIVERSITY       FARMFUSION       KBRF',
      'CERTIFICATE OF APPROVAL', safeTitle,
      `Certificate ID: ${certificateId}`, `Status: APPROVED | Issued: ${approvalDate}`,
      'Issued by: FarmYield AI Administration', `${farm.name} | ${S.season}`, '',
    ];
    if (certificateImage) textLines.splice(6, 0, 'Certificate image included below.');
    lines.filter((_, index) => selectedSections[index]).forEach(([heading, detail]) => textLines.push(heading, detail, ''));
    textLines.push('', 'DIGITAL APPROVAL', 'Approved by: FarmYield AI Administration', 'Authorized digital signature: ____________________');
    let cursor = 760;
    const imageObject = certificateImage ? 6 : null;
    const commands = [
      '0.98 0.97 0.93 rg 0 0 612 792 re f',
      '0.09 0.35 0.22 RG 1.5 w 22 22 568 748 re S',
      '0.80 0.64 0.25 RG 1 w 30 30 552 732 re S',
      '0.80 0.64 0.25 rg 30 670 552 2 re f',
      '0.30 0.55 0.32 rg 30 35 m 70 35 l 45 60 l 30 35 l f',
      '0.80 0.64 0.25 rg 542 35 m 582 35 l 567 60 l 542 35 l f',
      ...(certificateImage ? ['q 540 0 0 220 36 450 cm /Im1 Do Q'] : []),
      ...textLines.map(line => {
      const command = `BT /F1 11 Tf 50 ${cursor} Td (${escapePdf(line)}) Tj ET`;
      cursor -= 18;
      return command;
      }),
      '0.95 0.65 0.12 RG 2 w 470 80 90 35 re S',
    ].join('\n');
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >>${certificateImage ? ' /XObject << /Im1 6 0 R >>' : ''} >> /Contents 5 0 R >>`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`,
    ];
    if (certificateImage) {
      const imageBytes = atob(certificateImage.data.split(',')[1]);
      objects.push(`<< /Type /XObject /Subtype /Image /Width ${certificateImage.width} /Height ${certificateImage.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n${imageBytes}\nendstream`);
    }
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object, index) => { offsets[index + 1] = pdf.length; pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const filename = `${safeTitle.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'farm-report'}.pdf`;
    const pdfContent = certificateImage
      ? Uint8Array.from(pdf, character => character.charCodeAt(0) & 255)
      : pdf;
    downloadBlob(pdfContent, filename, 'application/pdf');
    return true;
  }

  const doc = new jsPDF();
  let y = 20;
  doc.setFillColor(250, 248, 242); doc.rect(8, 8, 194, 281, 'F');
  doc.setDrawColor(22, 100, 72); doc.setLineWidth(1.2); doc.rect(8, 8, 194, 281);
  doc.setDrawColor(205, 165, 65); doc.setLineWidth(.5); doc.rect(12, 12, 186, 273);
  doc.setFontSize(9); doc.setTextColor(22, 100, 72); doc.text('KL UNIVERSITY', 25, y);
  doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.text('FARMFUSION', 105, y, { align: 'center' });
  doc.setFontSize(9); doc.text('KBRF', 185, y, { align: 'right' });
  y += 15; doc.setDrawColor(205, 165, 65); doc.line(20, y, 190, y);
  y += 14; doc.setFontSize(18); doc.setTextColor(22, 100, 72); doc.text('CERTIFICATE OF APPROVAL', 105, y, { align: 'center' });
  y += 12; doc.setFontSize(14); doc.setTextColor(35, 35, 35); doc.text(safeTitle, 105, y, { align: 'center', maxWidth: 170 });
  y += 9; doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 100, 100);
  doc.text(`${farm.name} | ${S.season}`, 105, y, { align: 'center' });
  y += 7; doc.text(`Certificate ID: ${certificateId} | Issued: ${approvalDate}`, 105, y, { align: 'center' });
  y += 7; doc.setFillColor(22, 150, 95); doc.roundedRect(78, y - 6, 54, 9, 3, 3, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.text('APPROVED', 105, y, { align: 'center' });
  y += 14; doc.setDrawColor(205, 165, 65); doc.setLineWidth(.8); doc.line(20, y, 190, y); y += 10;
  
  for (let i = 0; i < lines.length; i++) {
    if (!selectedSections[i]) continue;
    const [heading, detail] = lines[i];
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFontSize(12); doc.setTextColor(22, 100, 72); doc.text(heading, 15, y);
    y += 6; doc.setFontSize(10); doc.setTextColor(90, 90, 90); doc.text(detail, 18, y, { maxWidth: 170 }); y += 13;
    
    // Add graph for Historical Trend Analysis if checked
    if (i === 1 && yields.length > 0) {
      if (y > 200) { doc.addPage(); y = 20; }
      const imgData = await generateChartImage('line', {
        labels: yields.map(y => y.season),
        datasets: [{ label: 'Yield (t/ha)', data: yields.map(y => y.yieldPerHa), borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)', fill: true }]
      });
      doc.addImage(imgData, 'PNG', 18, y, 150, 75);
      y += 82;
    }
  }
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setDrawColor(242, 177, 35); doc.line(20, y, 190, y); y += 12;
  doc.setFontSize(11); doc.setTextColor(22, 100, 72); doc.text('DIGITAL APPROVAL', 20, y);
  y += 7; doc.setFontSize(10); doc.setTextColor(90, 90, 90); doc.text('Approved by: FarmYield AI Administration', 20, y);
  y += 12; doc.setTextColor(35, 35, 35); doc.text('Authorized digital signature: ____________________', 20, y);
  y += 7; doc.setFontSize(9); doc.setTextColor(120, 120, 120); doc.text(`Approval recorded on ${approvalDate} | Certificate ID: ${certificateId}`, 20, y);
  const filename = `${safeTitle.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'farm-report'}.pdf`;
  doc.save(filename);
  return true;
}

function downloadReport(title, format, selectedSections = [], certificateImage = null) {
  const safeTitle = title || 'Farm Performance Report';
  if (format === 'pdf') {
    downloadPdfReport(safeTitle, selectedSections, certificateImage).then(success => {
      if (success) showToast(`${safeTitle} downloaded as PDF.`, 'success');
    });
    return;
  }
  const rows = DB.yields.map(y => [y.season, DB.farms.find(f => f.id === y.farmId)?.name || '', y.yieldPerHa, y.totalProd]);
  const csv = [['Season', 'Farm', 'Yield (t/ha)', 'Production (t)'], ...rows]
    .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadBlob(csv, `${safeTitle.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.csv`, 'text/csv;charset=utf-8');
  showToast(`${safeTitle} downloaded.`, 'success');
}

function animateCounter(el, target, decimals = 0) {
  const start = 0;
  const duration = 900;
  const startTime = performance.now();
  function step(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = start + (target - start) * ease;
    el.textContent = decimals > 0 ? fmt(val, decimals) : fmtN(val);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function destroyCharts() {
  Object.values(S.charts).forEach(c => { try { c.destroy(); } catch(e){} });
  S.charts = {};
}

function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function el(tag, cls, html='') {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function svgIcon(name, size = 16) {
  const icons = {
    home: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    map: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>`,
    leaf: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    trend: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    brain: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
    compare: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="m21 3-7.536 7.536A5 5 0 0 1 10 12H3"/><path d="M3 21l7.536-7.536A5 5 0 0 1 14 12h7"/></svg>`,
    droplets: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>`,
    microscope: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>`,
    upload: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    report: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
    shield: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    cpu: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
    users: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    bell: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    logout: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    menu: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    plus: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    download: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    info: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    x: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    chevronLeft:`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
    chevronRight:`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    arrowUp:`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
    arrowDown:`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`,
    star:`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    scatter:`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="7.5" r="1.5"/><circle cx="18.5" cy="5.5" r="1.5"/><circle cx="11.5" cy="11.5" r="1.5"/><circle cx="14.5" cy="18.5" r="1.5"/><circle cx="5.5" cy="17.5" r="1.5"/></svg>`,
    activity:`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    settings:`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  };
  return icons[name] || icons['info'];
}

/* ──────────────────────────────────────────────────────────────
   NAVIGATION
────────────────────────────────────────────────────────────── */
function navigate(page, extra = {}) {
  if (S.page === 'camera' && typeof stopFarmCamera === 'function') stopFarmCamera(true);
  destroyCharts();
  Object.assign(S, extra);
  S.page = page;
  renderPage(page);
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  window.scrollTo(0, 0);
}

/* ──────────────────────────────────────────────────────────────
   AUTH SCREEN
────────────────────────────────────────────────────────────── */
const ROLES = [
  { key:'Farmer',        label:'Farmer',        icon:'🌾' },
  { key:'Farm Manager',  label:'Farm Manager',   icon:'📊' },
  { key:'Researcher',    label:'Researcher',     icon:'🔬' },
  { key:'Agronomist',    label:'Agronomist',     icon:'🌱' },
  { key:'Administrator', label:'Administrator',  icon:'⚙️'  },
];

const ROLE_USERS = {
  'Farmer':        'u1',
  'Farm Manager':  'u2',
  'Researcher':    'u3',
  'Agronomist':    'u4',
  'Administrator': 'u5',
};

function renderAuth() {
  const app = document.getElementById('app');

  // Generate particles
  const particles = Array.from({length:24}, (_, i) => {
    const left = Math.random() * 90 + '%';
    const top  = Math.random() * 90 + '%';
    const dur  = (6 + Math.random() * 8).toFixed(1) + 's';
    const del  = (Math.random() * 5).toFixed(1) + 's';
    return `<div class="auth-particle" style="left:${left};top:${top};--dur:${dur};--delay:${del}"></div>`;
  }).join('');

  app.innerHTML = `
    <div class="auth-screen">
      <div class="auth-bg">
        <div class="auth-particles">${particles}</div>
        <div>
          <div class="auth-bg-title">AI-Powered Farm<br>Yield Intelligence</div>
          <p class="auth-bg-sub" style="margin-top:.75rem">
            Predict yields, diagnose underperformance, compare farms,
            and generate stakeholder-ready reports — all in one platform.
          </p>
        </div>
        <div class="auth-stats">
          <div class="auth-stat"><span class="auth-stat-value">4</span><span class="auth-stat-label">Farms Monitored</span></div>
          <div class="auth-stat"><span class="auth-stat-value">87%</span><span class="auth-stat-label">Model R²</span></div>
          <div class="auth-stat"><span class="auth-stat-value">18</span><span class="auth-stat-label">Season Records</span></div>
        </div>
      </div>

      <div class="auth-panel">
        <div class="auth-logo">
          <div class="auth-logo-icon">🌿</div>
          <span>Farm Yield Analyzer</span>
        </div>

        <div style="width:100%">
          <h1 class="auth-heading" id="authHeading">Welcome back</h1>
          <p class="auth-sub" id="authSub">Sign in to your personal farm workspace</p>
        </div>

        <form class="auth-form" id="loginForm">
          <div>
            <label for="loginEmail">Email address</label>
            <input id="loginEmail" type="email" value="arun@farm.com" placeholder="your@email.com" autocomplete="email" />
          </div>
          <div>
            <label for="loginPass">Password</label>
            <input id="loginPass" type="password" value="demo1234" placeholder="Password" autocomplete="current-password" />
          </div>
          <div>
            <label>Sign in as</label>
            <div class="auth-role-grid" id="roleGrid">
              ${ROLES.map(r => `
                <button type="button" class="role-btn${r.key === 'Farmer' ? ' active' : ''}" data-role="${r.key}">
                  <span class="role-icon">${r.icon}</span>
                  <span>${r.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-full btn-lg" id="loginBtn" style="margin-top:.25rem">
            ${svgIcon('leaf')} Sign In
          </button>
          <button type="button" class="btn btn-outline btn-full" id="showRegisterBtn">Create personal account</button>
        </form>

        <form class="auth-form" id="registerForm" style="display:none">
          <div><label for="registerName">Full name</label><input id="registerName" required placeholder="Your name" /></div>
          <div><label for="registerEmail">Email address</label><input id="registerEmail" type="email" required placeholder="your@email.com" /></div>
          <div><label for="registerPassword">Password</label><input id="registerPassword" type="password" minlength="6" required placeholder="At least 6 characters" /></div>
          <div><label for="registerRole">Account type</label><select id="registerRole"><option>Farmer</option><option>Farm Manager</option><option>Researcher</option><option>Agronomist</option></select></div>
          <button type="submit" class="btn btn-primary btn-full btn-lg">${svgIcon('check')} Register account</button>
          <button type="button" class="btn btn-secondary btn-full" id="showLoginBtn">Back to sign in</button>
        </form>

        <p class="text-muted text-xs" style="text-align:center">
          Demo platform — all data is synthetic. No real farm data is used.
        </p>
      </div>
    </div>
  `;

  // Role selection
  let selectedRole = 'Farmer';
  const grid = document.getElementById('roleGrid');

  // Pre-fill email based on selected role
  const emailMap = {
    'Farmer':'arun@farm.com','Farm Manager':'maya@farmco.com',
    'Researcher':'priya@agri.edu','Agronomist':'vikram@consult.com','Administrator':'admin@system.com'
  };

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.role-btn');
    if (!btn) return;
    $$('.role-btn', grid).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedRole = btn.dataset.role;
    const emailEl = document.getElementById('loginEmail');
    if (emailEl) {
      const isDemo = Object.values(emailMap).includes(emailEl.value);
      if (emailEl.value === '' || isDemo) {
        emailEl.value = emailMap[selectedRole] || '';
      }
    }
  });

  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPass').value;
    const account = DB.users.find(user => user.email.toLowerCase() === email && user.role === selectedRole);
    if (!account || account.password !== password) {
      showToast('Email, password, or account type is incorrect.', 'error');
      return;
    }
    const btn = document.getElementById('loginBtn');
    btn.innerHTML = `<span class="spinner"></span> Signing in…`;
    btn.disabled = true;
    setTimeout(() => {
      S.role = selectedRole;
      S.user = account;
      account.lastLogin = new Date().toISOString().slice(0, 10);
      recordAudit('LOGIN', account.email, account.id);
      renderAppShell();
      navigate('dashboard');
    }, 900);
  });

  document.getElementById('showRegisterBtn').addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'flex';
    document.getElementById('authHeading').textContent = 'Create your account';
    document.getElementById('authSub').textContent = 'Your personal workspace is saved in this browser';
  });
  document.getElementById('showLoginBtn').addEventListener('click', () => {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('authHeading').textContent = 'Welcome back';
    document.getElementById('authSub').textContent = 'Sign in to your personal farm workspace';
  });
  document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    if (DB.users.some(user => user.email.toLowerCase() === email)) {
      showToast('An account with this email already exists.', 'error'); return;
    }
    const user = { id:'ux'+Date.now(), name, email, password, role, farms:[], status:'active', lastLogin:'—' };
    DB.users.push(user);
    recordAudit('REGISTER_USER', name, user.id);
    saveDatabase();
    showToast('Account created. Sign in to continue.', 'success');
    document.querySelector(`[data-role="${role}"]`)?.click();
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPass').value = password;
    document.getElementById('showLoginBtn').click();
  });
}

/* ──────────────────────────────────────────────────────────────
   APP SHELL (Sidebar + Header + Content)
────────────────────────────────────────────────────────────── */
function getNavItems(role) {
  const all = [
    { page:'dashboard',  label:'Dashboard',        icon:'home',       roles:['Farmer','Farm Manager','Researcher','Agronomist','Administrator'] },
    { page:'camera',     label:'Live Farm Camera', icon:'activity',   roles:['Farmer','Farm Manager','Researcher','Agronomist','Administrator'] },
    { page:'farms',      label:'Farm Management',  icon:'map',        roles:['Farmer','Farm Manager','Agronomist','Administrator'] },
    { page:'crops',      label:'Crop Management',  icon:'leaf',       roles:['Farmer','Farm Manager','Agronomist','Administrator'] },
    { page:'predictions',label:'Yield Predictions',icon:'brain',      roles:['Farmer','Farm Manager','Agronomist'] },
    { page:'trends',     label:'Historical Trends', icon:'trend',      roles:['Farmer','Farm Manager','Researcher','Agronomist','Administrator'] },
    { page:'factors',    label:'Factor Analysis',   icon:'scatter',    roles:['Farm Manager','Researcher','Agronomist'] },
    { page:'comparisons',label:'Comparisons',       icon:'compare',    roles:['Farm Manager','Researcher','Agronomist'] },
    { page:'irrigation', label:'Irrigation Analysis',icon:'droplets',  roles:['Farm Manager','Agronomist','Administrator'] },
    { page:'soil',       label:'Soil Analysis',     icon:'microscope', roles:['Farmer','Farm Manager','Researcher','Agronomist','Administrator'] },
    { page:'upload',     label:'Upload Dataset',    icon:'upload',     roles:['Farmer','Farm Manager','Administrator'] },
    { page:'reports',    label:'Reports',           icon:'report',     roles:['Farm Manager','Researcher','Administrator'] },
    { page:'model',      label:'Model Performance', icon:'cpu',        roles:['Researcher','Administrator'] },
    { page:'admin',      label:'Admin Dashboard',   icon:'shield',     roles:['Administrator'], badge:'4' },
  ];
  return all.filter(i => i.roles.includes(role));
}

function renderAppShell() {
  const app = document.getElementById('app');
  const items = getNavItems(S.role);
  const user = S.user;
  const initials = user.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);

  app.innerHTML = `
    <div class="app-layout">
      <aside class="sidebar${S.sidebarCollapsed ? ' collapsed' : ''}" id="sidebar">
        <div class="sidebar-logo">
          <div class="logo-icon">🌿</div>
          <div class="logo-text">
            <span class="logo-name">FarmYield AI</span>
            <span class="logo-tagline">Analytics Platform</span>
          </div>
          <button class="sidebar-toggle" id="sidebarToggle" title="Toggle sidebar" aria-label="Toggle sidebar">
            ${svgIcon('chevronLeft', 16)}
          </button>
        </div>

        <nav class="sidebar-nav" id="sidebarNav">
          <div class="sidebar-section-label">Main Menu</div>
          ${items.map(i => `
            <button class="nav-item${S.page === i.page ? ' active' : ''}" data-page="${i.page}" title="${i.label}">
              <span class="nav-icon">${svgIcon(i.icon, 17)}</span>
              <span class="nav-label">${i.label}</span>
              ${i.badge ? `<span class="nav-badge">${i.badge}</span>` : ''}
            </button>
          `).join('')}
        </nav>

        <div class="sidebar-user">
          <div class="user-avatar">${initials}</div>
          <div class="user-info">
            <div class="user-name">${user.name}</div>
            <div class="user-role">${user.role}</div>
          </div>
          <button class="logout-btn" id="logoutBtn" title="Sign out" aria-label="Sign out">
            ${svgIcon('logout', 15)}
          </button>
        </div>
      </aside>

      <div class="main-content${S.sidebarCollapsed ? ' sidebar-collapsed' : ''}" id="mainContent">
        <header class="app-header" id="appHeader">
          <button class="icon-btn" id="mobileMenuBtn" style="display:none" aria-label="Open menu">
            ${svgIcon('menu', 18)}
          </button>
          <div class="header-breadcrumb">
            <span>FarmYield AI</span>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-current" id="breadcrumb">Dashboard</span>
          </div>
          <div class="header-selectors">
            <select class="header-select" id="farmSelect" aria-label="Select farm">
              ${DB.farms.map(f => `<option value="${f.id}"${f.id===S.farmId?' selected':''}>${f.name}</option>`).join('')}
            </select>
            <select class="header-select" id="seasonSelect" aria-label="Select season">
              ${['Kharif 2025','Kharif 2024','Rabi 2025','Rabi 2024','Kharif 2023'].map(s => `<option${s===S.season?' selected':''}>${s}</option>`).join('')}
            </select>
          </div>
          <div class="header-actions">
            <button class="icon-btn" id="notifBtn" title="Notifications" aria-label="Notifications">
              ${svgIcon('bell', 17)}
              <span class="notif-dot"></span>
            </button>
            <button class="icon-btn" title="Settings" aria-label="Settings">${svgIcon('settings', 17)}</button>
          </div>
        </header>

        <main class="page-content" id="pageContent"></main>
      </div>
    </div>
  `;

  // Events
  document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (typeof stopFarmCamera === 'function') stopFarmCamera(true);
    destroyCharts();
    renderAuth();
  });
  document.getElementById('sidebarNav').addEventListener('click', e => {
    const btn = e.target.closest('.nav-item');
    if (btn && btn.dataset.page) navigate(btn.dataset.page);
  });
  document.getElementById('farmSelect').addEventListener('change', e => {
    S.farmId = e.target.value;
    navigate(S.page);
  });
  document.getElementById('seasonSelect').addEventListener('change', e => {
    S.season = e.target.value;
    navigate(S.page);
  });

  const mobileBtn = document.getElementById('mobileMenuBtn');
  if (window.innerWidth <= 768) {
    mobileBtn.style.display = 'flex';
    mobileBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    });
  }
}

function toggleSidebar() {
  S.sidebarCollapsed = !S.sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', S.sidebarCollapsed);
  document.getElementById('mainContent').classList.toggle('sidebar-collapsed', S.sidebarCollapsed);
  const toggleBtn = document.getElementById('sidebarToggle');
  toggleBtn.innerHTML = svgIcon(S.sidebarCollapsed ? 'chevronRight' : 'chevronLeft', 16);
  $$('.nav-label, .logo-text, .user-info, .nav-badge, .sidebar-section-label').forEach(el => {
    el.style.opacity = S.sidebarCollapsed ? '0' : '1';
  });
}

function updateBreadcrumb(label) {
  const bc = document.getElementById('breadcrumb');
  if (bc) bc.textContent = label;
}

/* ──────────────────────────────────────────────────────────────
   PAGE ROUTER
────────────────────────────────────────────────────────────── */
const PAGE_LABELS = {
  dashboard:'Dashboard', camera:'Live Farm Camera', farms:'Farm Management', crops:'Crop Management',
  predictions:'Yield Predictions', trends:'Historical Trends', factors:'Factor Analysis',
  comparisons:'Comparisons', irrigation:'Irrigation Analysis', soil:'Soil Analysis',
  upload:'Upload Dataset', reports:'Reports', model:'Model Performance', admin:'Admin Dashboard',
};

function renderPage(page) {
  const cont = document.getElementById('pageContent');
  if (!cont) return;
  cont.innerHTML = '';
  cont.style.animation = 'none';
  cont.offsetHeight; // reflow
  cont.style.animation = '';
  updateBreadcrumb(PAGE_LABELS[page] || page);

  const renderers = {
    dashboard: renderDashboard, camera: renderLiveCamera, farms: renderFarms, crops: renderCrops,
    predictions: renderPredictions, trends: renderTrends, factors: renderFactors,
    comparisons: renderComparisons, irrigation: renderIrrigation, soil: renderSoil,
    upload: renderUpload, reports: renderReports, model: renderModelPerf, admin: renderAdmin,
  };

  if (renderers[page]) renderers[page]();
  else cont.innerHTML = `<div class="empty-state"><div class="empty-icon">🚧</div><h3>Coming soon</h3><p>This module is under construction.</p></div>`;
}

/* ──────────────────────────────────────────────────────────────
   PAGE: DASHBOARD
────────────────────────────────────────────────────────────── */
function renderDashboard() {
  const cont = document.getElementById('pageContent');
  const farm = DB.farms.find(f => f.id === S.farmId) || DB.farms[0];
  const farmYields = DB.yields.filter(y => y.farmId === S.farmId);
  const currentY = farmYields.find(y => y.season === S.season);

  const totalProd = farmYields.reduce((s, y) => s + y.totalProd, 0);
  const avgYield  = farmYields.length ? farmYields.reduce((s, y) => s + y.yieldPerHa, 0) / farmYields.length : 0;
  const expYield  = currentY ? currentY.yieldPerHa : 4.1;
  const activeFarms = DB.farms.filter(f => f.status === 'active').length;
  const totalArea = DB.farms.reduce((s, f) => s + f.area, 0);

  const insights = DB.insights.slice(0, 4);

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Welcome back, ${S.user.name.split(' ')[0]} 👋</h1>
        <p class="page-desc">${farm.name} — ${S.season} overview</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" onclick="navigate('upload')">${svgIcon('upload',14)} Upload Data</button>
        <button class="btn btn-primary btn-sm" onclick="navigate('predictions')">${svgIcon('brain',14)} Run Prediction</button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card green">
        <div class="kpi-header">
          <span class="kpi-label">Total Production</span>
          <div class="kpi-icon" style="--kpi-hsl:142,71%,40%">${svgIcon('leaf',14)}</div>
        </div>
        <div><span class="kpi-value" id="kpi1">0</span><span class="kpi-unit">tons</span></div>
        <span class="kpi-change up">${svgIcon('arrowUp',11)} 8.4% vs last season</span>
      </div>
      <div class="kpi-card blue">
        <div class="kpi-header">
          <span class="kpi-label">Average Yield</span>
          <div class="kpi-icon">${svgIcon('trend',14)}</div>
        </div>
        <div><span class="kpi-value" id="kpi2">0</span><span class="kpi-unit">t/ha</span></div>
        <span class="kpi-change up">${svgIcon('arrowUp',11)} 4.1% vs last season</span>
      </div>
      <div class="kpi-card amber">
        <div class="kpi-header">
          <span class="kpi-label">Expected Yield</span>
          <div class="kpi-icon">${svgIcon('brain',14)}</div>
        </div>
        <div><span class="kpi-value" id="kpi3">0</span><span class="kpi-unit">t/ha</span></div>
        <span class="kpi-change flat">± 0.4 confidence interval</span>
      </div>
      <div class="kpi-card purple">
        <div class="kpi-header">
          <span class="kpi-label">Active Farms</span>
          <div class="kpi-icon">${svgIcon('map',14)}</div>
        </div>
        <div><span class="kpi-value" id="kpi4">0</span><span class="kpi-unit">farms</span></div>
        <span class="kpi-change flat">${fmtN(totalArea)} ha total area</span>
      </div>
      <div class="kpi-card red">
        <div class="kpi-header">
          <span class="kpi-label">Data Records</span>
          <div class="kpi-icon">${svgIcon('report',14)}</div>
        </div>
        <div><span class="kpi-value" id="kpi5">0</span><span class="kpi-unit">seasons</span></div>
        <span class="kpi-change up">${svgIcon('arrowUp',11)} 3 added this month</span>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:1rem">
      <div class="card col-span-2" style="grid-column:1">
        <div class="card-header">
          <div>
            <div class="card-title">Yield Trend — All Farms</div>
            <div class="card-subtitle">Historical yield per hectare (t/ha) across seasons</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="navigate('trends')">${svgIcon('trend',13)} Full Analysis</button>
        </div>
        <div class="chart-wrap tall"><canvas id="dashTrendChart"></canvas></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Smart Insights</div>
          <span class="badge badge-green">${insights.length} active</span>
        </div>
        <div class="card-body">
          <div class="insight-list">
            ${insights.map(i => {
              const dotMap = {success:'success',warning:'warning',info:'info',danger:'danger'};
              const iconMap = {success:'✓',warning:'!',info:'i',danger:'✗'};
              return `
                <div class="insight-item">
                  <div class="insight-dot ${dotMap[i.type]||'info'}">${iconMap[i.type]||'i'}</div>
                  <div style="flex:1">
                    <div class="insight-text">${i.msg}</div>
                    ${i.action ? `<div class="insight-action" onclick="navigate('${i.action === 'View Comparisons' ? 'comparisons' : i.action === 'View Trends' ? 'trends' : i.action === 'View Irrigation' ? 'irrigation' : 'dashboard'}')">${i.action} →</div>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Farm Performance</div>
          <button class="btn btn-secondary btn-sm" onclick="navigate('comparisons')">${svgIcon('compare',13)} Compare</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Farm</th><th>Crop</th><th>Yield (t/ha)</th><th>Trend</th><th>Status</th></tr></thead>
            <tbody>
              ${DB.farms.map(f => {
                const fy = DB.yields.filter(y => y.farmId === f.id);
                const lastY = fy[fy.length-1];
                const prevY = fy[fy.length-2];
                const change = lastY && prevY ? ((lastY.yieldPerHa - prevY.yieldPerHa)/prevY.yieldPerHa*100).toFixed(1) : null;
                const crop = DB.crops.find(c => c.farmId === f.id);
                return `<tr>
                  <td><strong>${f.name}</strong><div class="text-muted text-xs">${f.location}</div></td>
                  <td>${crop ? crop.name : '—'}</td>
                  <td>${lastY ? fmt(lastY.yieldPerHa, 2) : '—'}</td>
                  <td>
                    ${change !== null ? `<span class="${+change >= 0 ? 'text-green' : 'text-red'}">${+change >= 0 ? '▲' : '▼'} ${Math.abs(change)}%</span>` : '—'}
                  </td>
                  <td><span class="badge badge-${f.status === 'active' ? 'green' : 'amber'}">${f.status}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Animate KPIs
  requestAnimationFrame(() => {
    animateCounter(document.getElementById('kpi1'), totalProd, 1);
    animateCounter(document.getElementById('kpi2'), avgYield, 2);
    animateCounter(document.getElementById('kpi3'), expYield, 2);
    animateCounter(document.getElementById('kpi4'), activeFarms, 0);
    animateCounter(document.getElementById('kpi5'), DB.yields.length, 0);
    createDashTrendChart();
  });
}

function createDashTrendChart() {
  const ctx = document.getElementById('dashTrendChart');
  if (!ctx) return;

  const seasonsAll = ['Kharif 2022','Kharif 2023','Kharif 2024','Kharif 2025'];
  const colors = [
    { border:'hsl(142,65%,52%)', bg:'hsla(142,65%,52%,.15)' },
    { border:'hsl(210,85%,65%)', bg:'hsla(210,85%,65%,.15)' },
    { border:'hsl(38,95%,60%)',  bg:'hsla(38,95%,60%,.15)'  },
    { border:'hsl(265,75%,70%)',bg:'hsla(265,75%,70%,.15)' },
  ];

  const datasets = DB.farms.map((f, i) => {
    const data = seasonsAll.map(s => {
      const y = DB.yields.find(yy => yy.farmId === f.id && yy.season === s);
      return y ? y.yieldPerHa : null;
    });
    return {
      label: f.name,
      data,
      borderColor: colors[i].border,
      backgroundColor: colors[i].bg,
      fill: true,
      tension: 0.4,
      borderWidth: 2.5,
      pointRadius: 5,
      pointHoverRadius: 7,
      spanGaps: true,
    };
  });

  S.charts.dashTrend = new Chart(ctx, {
    type: 'line',
    data: { labels: seasonsAll, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode:'index', intersect:false },
      plugins: { legend:{ position:'top' } },
      scales: {
        x: { grid:{ color:'rgba(255,255,255,0.05)' } },
        y: {
          grid: { color:'rgba(255,255,255,0.05)' },
          title: { display:true, text:'Yield (t/ha)', color:'#64748b' },
          beginAtZero: false,
        },
      },
    },
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: FARM MANAGEMENT
────────────────────────────────────────────────────────────── */
function renderFarms() {
  const cont = document.getElementById('pageContent');

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Farm Management</h1>
        <p class="page-desc">${DB.farms.length} farms registered across ${[...new Set(DB.farms.map(f=>f.region))].length} regions</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="addFarmBtn">${svgIcon('plus',14)} Add Farm</button>
      </div>
    </div>

    <div class="grid-auto" id="farmGrid">
      ${DB.farms.map(f => renderFarmCard(f)).join('')}
    </div>
  `;

  document.getElementById('addFarmBtn').addEventListener('click', () => showAddFarmModal());
  document.getElementById('farmGrid').addEventListener('click', e => {
    const card = e.target.closest('.farm-card');
    if (card) { S.farmId = card.dataset.farmId; navigate('crops'); }
  });
}

function renderFarmCard(f) {
  const fy = DB.yields.filter(y => y.farmId === f.id);
  const lastY = fy[fy.length-1];
  const crops = DB.crops.filter(c => c.farmId === f.id);
  const soil = DB.soil.find(s => s.farmId === f.id);
  return `
    <div class="farm-card" data-farm-id="${f.id}" role="button" tabindex="0">
      <div class="farm-card-header">
        <div>
          <div class="farm-card-name">${f.name}</div>
          <div class="farm-card-location">📍 ${f.location}</div>
        </div>
        <span class="badge badge-${f.status === 'active' ? 'green' : 'amber'}">${f.status}</span>
      </div>
      <div class="flex gap-2 mt-2" style="flex-wrap:wrap">
        <span class="badge badge-blue">${f.soilType}</span>
        <span class="badge badge-purple">${f.irrigationType}</span>
      </div>
      <div class="farm-card-metrics">
        <div class="farm-metric">
          <div class="farm-metric-label">Area</div>
          <div class="farm-metric-value">${f.area} ha</div>
        </div>
        <div class="farm-metric">
          <div class="farm-metric-label">Last Yield</div>
          <div class="farm-metric-value">${lastY ? fmt(lastY.yieldPerHa, 2) + ' t/ha' : '—'}</div>
        </div>
        <div class="farm-metric">
          <div class="farm-metric-label">Crops</div>
          <div class="farm-metric-value">${crops.length}</div>
        </div>
        <div class="farm-metric">
          <div class="farm-metric-label">Soil pH</div>
          <div class="farm-metric-value">${soil ? soil.ph : '—'}</div>
        </div>
      </div>
      <div style="margin-top:.85rem;display:flex;gap:.5rem">
        <button class="btn btn-secondary btn-sm" style="flex:1" onclick="event.stopPropagation();navigate('trends')">Trends</button>
        <button class="btn btn-outline btn-sm" style="flex:1" onclick="event.stopPropagation();S.farmId='${f.id}';navigate('predictions')">Predict</button>
      </div>
    </div>
  `;
}

function showAddFarmModal() {
  const ov = document.createElement('div');
  ov.className = 'modal-overlay';
  ov.id = 'addFarmModal';
  ov.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">${svgIcon('plus',14)} Add New Farm</span>
        <button class="modal-close" id="closeModal">${svgIcon('x',14)}</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Farm Name</label>
            <input class="form-input" id="farmName" placeholder="e.g. Sunrise Fields" />
          </div>
          <div class="form-group">
            <label class="form-label">Location</label>
            <input class="form-input" id="farmLoc" placeholder="City, State" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Area (hectares)</label>
            <input class="form-input" type="number" id="farmArea" placeholder="e.g. 45.5" />
          </div>
          <div class="form-group">
            <label class="form-label">Region</label>
            <select class="form-select" id="farmRegion">
              <option>Northern CA</option><option>Central CA</option><option>Southern CA</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Soil Type</label>
            <select class="form-select" id="farmSoil">
              <option>Loamy</option><option>Clay Loam</option><option>Sandy Loam</option><option>Silty Clay</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Irrigation Type</label>
            <select class="form-select" id="farmIrrig">
              <option>Drip</option><option>Flood</option><option>Sprinkler</option><option>Canal</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancelModal">Cancel</button>
        <button class="btn btn-primary" id="saveFarm">${svgIcon('check',14)} Create Farm</button>
      </div>
    </div>
  `;
  document.body.appendChild(ov);
  document.getElementById('closeModal').onclick = document.getElementById('cancelModal').onclick = () => ov.remove();
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  document.getElementById('saveFarm').addEventListener('click', () => {
    const name = document.getElementById('farmName').value.trim();
    if (!name) { showToast('Farm name is required', 'error'); return; }
    const newFarm = {
      id: 'f' + (DB.farms.length + 1),
      name,
      location: document.getElementById('farmLoc').value || 'Unknown, CA',
      region: document.getElementById('farmRegion').value,
      area: parseFloat(document.getElementById('farmArea').value) || 10,
      soilType: document.getElementById('farmSoil').value,
      irrigationType: document.getElementById('farmIrrig').value,
      status: 'active',
      managerId: S.user.id,
    };
    DB.farms.push(newFarm);
    ov.remove();
    showToast(`"${name}" created successfully!`, 'success');
    renderFarms();
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: CROP MANAGEMENT
────────────────────────────────────────────────────────────── */
function renderCrops() {
  const cont = document.getElementById('pageContent');
  const farm = DB.farms.find(f => f.id === S.farmId) || DB.farms[0];
  const crops = DB.crops.filter(c => c.farmId === S.farmId);

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Crop Management</h1>
        <p class="page-desc">${farm.name} — ${crops.length} crop(s) registered</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="addCropBtn">${svgIcon('plus',14)} Add Crop & Season</button>
      </div>
    </div>

    ${crops.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">${svgIcon('leaf',40)}</div>
        <h3>No crops yet</h3>
        <p>Add a crop and season to start tracking yield data for ${farm.name}.</p>
        <button class="btn btn-primary" onclick="document.getElementById('addCropBtn').click()">${svgIcon('plus',14)} Add First Crop</button>
      </div>
    ` : `
      <div class="grid-auto">
        ${crops.map(c => {
          const ylds = DB.yields.filter(y => y.cropId === c.id);
          const avgY = ylds.length ? ylds.reduce((s, y) => s + y.yieldPerHa, 0) / ylds.length : 0;
          const lastY = ylds[ylds.length - 1];
          return `
            <div class="card" style="transition:all .2s">
              <div class="card-header">
                <div>
                  <div class="card-title">🌾 ${c.name}</div>
                  <div class="card-subtitle">${c.variety}</div>
                </div>
                <span class="badge badge-green">${c.seasons.length} seasons</span>
              </div>
              <div class="card-body" style="padding-top:.75rem">
                <div class="stat-row">
                  <div class="stat-item">
                    <div class="stat-val text-green">${fmt(avgY, 2)}</div>
                    <div class="stat-label">Avg Yield (t/ha)</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-val">${lastY ? lastY.season : '—'}</div>
                    <div class="stat-label">Latest Season</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-val">${lastY ? fmt(lastY.totalProd, 0) + ' t' : '—'}</div>
                    <div class="stat-label">Last Production</div>
                  </div>
                </div>
                <div style="margin-top:1rem">
                  <div class="form-label" style="margin-bottom:.5rem">Recorded Seasons</div>
                  <div class="flex gap-2" style="flex-wrap:wrap">
                    ${c.seasons.map(s => `<span class="badge badge-blue">${s}</span>`).join('')}
                  </div>
                </div>
              </div>
              <div class="card-footer" style="display:flex;gap:.5rem">
                <button class="btn btn-secondary btn-sm" onclick="S.farmId='${c.farmId}';navigate('trends')">View Trends</button>
                <button class="btn btn-outline btn-sm" onclick="S.farmId='${c.farmId}';navigate('predictions')">Predict Yield</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;

  document.getElementById('addCropBtn').addEventListener('click', showAddCropModal);
}

function showAddCropModal() {
  const ov = document.createElement('div');
  ov.className = 'modal-overlay';
  ov.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">${svgIcon('leaf',14)} Add Crop & Season</span>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">${svgIcon('x',14)}</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Crop</label>
          <select class="form-select" id="cropName">
            <option>Rice</option><option>Wheat</option><option>Maize</option><option>Cotton</option><option>Soybean</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Variety</label>
          <input class="form-input" id="cropVariety" placeholder="e.g. IR-64, HD-2967" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Season Type</label>
            <select class="form-select" id="cropSeason">
              <option>Kharif</option><option>Rabi</option><option>Zaid</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Year</label>
            <select class="form-select" id="cropYear">
              <option>2026</option><option>2025</option><option>2024</option><option>2023</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" id="saveCropBtn">${svgIcon('check',14)} Save Crop</button>
      </div>
    </div>
  `;
  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  document.getElementById('saveCropBtn').addEventListener('click', () => {
    const name = document.getElementById('cropName').value;
    const season = `${document.getElementById('cropSeason').value} ${document.getElementById('cropYear').value}`;
    const newCrop = { id: 'cx'+Date.now(), farmId: S.farmId, name, variety: document.getElementById('cropVariety').value || 'Standard', seasons: [season] };
    DB.crops.push(newCrop);
    ov.remove();
    showToast(`${name} (${season}) added!`, 'success');
    renderCrops();
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: YIELD PREDICTIONS
────────────────────────────────────────────────────────────── */
function renderPredictions() {
  const cont = document.getElementById('pageContent');
  const farm = DB.farms.find(f => f.id === S.farmId) || DB.farms[0];
  const crops = DB.crops.filter(c => c.farmId === S.farmId);
  const currentCrop = crops[0];
  const currentY = DB.yields.find(y => y.farmId === S.farmId && y.season === S.season);

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Yield Predictions</h1>
        <p class="page-desc">AI-powered crop yield forecast with explainable factor analysis</p>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">${svgIcon('brain',16)} Prediction Inputs</div></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:1rem">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Farm</label>
              <select class="form-select" id="predFarm">
                ${DB.farms.map(f => `<option value="${f.id}"${f.id===S.farmId?' selected':''}>${f.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Crop</label>
              <select class="form-select" id="predCrop">
                ${crops.map(c => `<option value="${c.id}">${c.name} (${c.variety})</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Season</label>
              <select class="form-select" id="predSeason">
                ${['Kharif 2025','Rabi 2025','Kharif 2024'].map(s => `<option${s===S.season?' selected':''}>${s}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Area (ha)</label>
              <input class="form-input" type="number" id="predArea" value="${farm.area}" />
            </div>
          </div>

          <hr style="border-color:var(--border-faint)">
          <div class="form-label" style="font-size:.8rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:.04em">Auto-filled from records — adjust if needed</div>

          <div class="form-group">
            <div style="display:flex;justify-content:space-between;margin-bottom:.35rem">
              <label class="form-label">Seasonal Rainfall (mm)</label>
              <span class="text-green font-semi text-sm" id="rainfallVal">${currentY ? currentY.rainfall : 580} mm</span>
            </div>
            <input type="range" class="form-range" id="predRainfall" min="100" max="1000" value="${currentY ? currentY.rainfall : 580}"
              oninput="document.getElementById('rainfallVal').textContent=this.value+' mm'" />
          </div>
          <div class="form-group">
            <div style="display:flex;justify-content:space-between;margin-bottom:.35rem">
              <label class="form-label">Irrigation Volume (L)</label>
              <span class="text-blue font-semi text-sm" id="irrigVal">${currentY ? currentY.irrigation : 4500} L</span>
            </div>
            <input type="range" class="form-range" id="predIrrigation" min="1000" max="10000" step="100" value="${currentY ? currentY.irrigation : 4500}"
              oninput="document.getElementById('irrigVal').textContent=Number(this.value).toLocaleString()+' L'" />
          </div>
          <div class="form-group">
            <div style="display:flex;justify-content:space-between;margin-bottom:.35rem">
              <label class="form-label">Soil pH</label>
              <span class="text-amber font-semi text-sm" id="phVal">${currentY ? currentY.soilPH : 6.3}</span>
            </div>
            <input type="range" class="form-range" id="predPH" min="4" max="9" step=".1" value="${currentY ? currentY.soilPH : 6.3}"
              oninput="document.getElementById('phVal').textContent=Number(this.value).toFixed(1)" />
          </div>

          <button class="btn btn-primary btn-full btn-lg" id="runPredBtn" style="margin-top:.25rem">
            ${svgIcon('brain',16)} Run Yield Prediction
          </button>
        </div>
      </div>

      <div id="predResultPanel">
        <div class="card" style="height:100%">
          <div class="card-header"><div class="card-title">Prediction Result</div></div>
          <div class="card-body" style="display:flex;align-items:center;justify-content:center;min-height:300px">
            <div class="empty-state">
              <div class="empty-icon" style="font-size:2rem">🤖</div>
              <h3>Ready to predict</h3>
              <p>Configure inputs on the left and click <strong>Run Yield Prediction</strong> to see your forecast.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('runPredBtn').addEventListener('click', () => {
    const btn = document.getElementById('runPredBtn');
    btn.innerHTML = `<span class="spinner"></span> Calculating…`;
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = `${svgIcon('brain',16)} Run Yield Prediction`;
      btn.disabled = false;
      const cropId = document.getElementById('predCrop').value;
      const crop = DB.crops.find(c => c.id === cropId) || currentCrop || {name:'Rice'};
      const rainfall = +document.getElementById('predRainfall').value;
      const irrigation = +document.getElementById('predIrrigation').value;
      const soilPH = +document.getElementById('predPH').value;
      const area = +document.getElementById('predArea').value;
      const result = simulatePrediction({ cropName: crop.name, rainfall, irrigation, soilPH, area });
      showPredictionResult(result, crop);
    }, 1400);
  });
}

function simulatePrediction({ cropName, rainfall, irrigation, soilPH, area }) {
  const base = { Rice: 3.6, Wheat: 3.1, Maize: 5.6, Cotton: 2.2, Soybean: 2.8 };
  let y = base[cropName] || 3.5;

  const optRain = { Rice: 580, Wheat: 280, Maize: 500 };
  const rf = Math.max(-1, Math.min(1, (rainfall - (optRain[cropName] || 500)) / (optRain[cropName] || 500)));
  y += y * rf * 0.35;

  const phOptimal = 6.4;
  const phScore = 1 - Math.min(1, Math.abs(soilPH - phOptimal) / 2.5);
  y *= (0.65 + 0.35 * phScore);

  const irrScore = Math.min(1, irrigation / 4800);
  y *= (0.78 + 0.22 * irrScore);

  const noise = (Math.random() - 0.5) * 0.15;
  y = Math.max(0.5, y + noise);
  y = Math.round(y * 100) / 100;

  return {
    yieldPerHa: y,
    totalProd: Math.round(y * area * 10) / 10,
    lower: Math.round(y * 0.87 * 100) / 100,
    upper: Math.round(y * 1.13 * 100) / 100,
    confidence: 85,
    factors: [
      { name:'Rainfall',         impact: rf > 0 ? 'positive' : 'negative', score: Math.round(Math.abs(rf)*60 + 30) },
      { name:'Soil pH',          impact: phScore > 0.6 ? 'positive' : 'negative', score: Math.round(phScore * 80 + 10) },
      { name:'Irrigation',       impact: irrScore > 0.75 ? 'positive' : 'negative', score: Math.round(irrScore * 70 + 15) },
      { name:'Historical Avg',   impact: 'positive', score: 72 },
      { name:'Season Pattern',   impact: 'positive', score: 63 },
      { name:'Soil Fertility',   impact: 'neutral',  score: 55 },
    ],
  };
}

function showPredictionResult(result, crop) {
  const panel = document.getElementById('predResultPanel');
  panel.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:1rem">
      <div class="pred-result">
        <div style="font-size:.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.5rem">${crop.name} — Expected Yield</div>
        <div class="pred-value">${fmt(result.yieldPerHa, 2)}</div>
        <div class="pred-unit">tonnes per hectare</div>
        <div class="pred-range">Confidence range: ${result.lower} – ${result.upper} t/ha</div>
        <div class="pred-confidence">${svgIcon('check',12)} ${result.confidence}% Confidence</div>
        <div class="pred-meta-grid">
          <div class="pred-meta-item">
            <div class="pred-meta-label">Total Production</div>
            <div class="pred-meta-val text-green">${fmt(result.totalProd, 1)} t</div>
          </div>
          <div class="pred-meta-item">
            <div class="pred-meta-label">Lower Bound</div>
            <div class="pred-meta-val">${result.lower} t/ha</div>
          </div>
          <div class="pred-meta-item">
            <div class="pred-meta-label">Upper Bound</div>
            <div class="pred-meta-val">${result.upper} t/ha</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">${svgIcon('info',15)} Why this prediction?</div>
          <span class="badge badge-blue">Explainable AI</span>
        </div>
        <div class="card-body">
          <div class="factor-list" id="factorList">
            ${result.factors.map(f => `
              <div class="factor-item">
                <div class="factor-name">${f.name}</div>
                <div class="factor-bar">
                  <div class="factor-fill ${f.impact}" data-score="${f.score}" style="width:0%"></div>
                </div>
                <div class="factor-score ${f.impact === 'positive' ? 'text-green' : f.impact === 'negative' ? 'text-red' : 'text-amber'}">${f.score}%</div>
              </div>
            `).join('')}
          </div>
          <p class="text-xs text-muted" style="margin-top:.85rem">
            ℹ️ This is a correlational estimate, not a guarantee. Factors are derived from historical patterns in your uploaded data.
          </p>
        </div>
      </div>
    </div>
  `;

  // Animate factor bars
  requestAnimationFrame(() => {
    setTimeout(() => {
      $$('.factor-fill').forEach(el => {
        el.style.width = el.dataset.score + '%';
      });
    }, 200);
  });

  showToast('Prediction complete!', 'success');
}

/* ──────────────────────────────────────────────────────────────
   PAGE: HISTORICAL TRENDS
────────────────────────────────────────────────────────────── */
function renderTrends() {
  const cont = document.getElementById('pageContent');
  const farm = DB.farms.find(f => f.id === S.farmId) || DB.farms[0];
  const farmYields = DB.yields.filter(y => y.farmId === S.farmId).sort((a, b) => a.year - b.year);

  if (farmYields.length === 0) {
    cont.innerHTML = `<div class="page-header"><div><h1 class="page-title">Historical Trends</h1></div></div><div class="empty-state"><div class="empty-icon">📈</div><h3>No data yet</h3><p>Upload historical yield records to see trend analysis.</p><button class="btn btn-primary" onclick="navigate('upload')">${svgIcon('upload',14)} Upload Data</button></div>`;
    return;
  }

  const firstY = farmYields[0].yieldPerHa;
  const lastY2 = farmYields[farmYields.length-1].yieldPerHa;
  const trendDir = lastY2 > firstY * 1.05 ? 'Increasing' : lastY2 < firstY * 0.95 ? 'Declining' : 'Stable';
  const trendBadge = { Increasing:'green', Declining:'red', Stable:'amber' }[trendDir];

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Historical Trends</h1>
        <p class="page-desc">${farm.name} — year-over-year yield analysis</p>
      </div>
      <div class="page-actions">
        <span class="badge badge-${trendBadge}" style="padding:.35rem 1rem;font-size:.8rem">
          ${trendDir === 'Increasing' ? '▲' : trendDir === 'Declining' ? '▼' : '→'} ${trendDir} Trend
        </span>
        <button class="btn btn-secondary btn-sm" onclick="navigate('reports')">${svgIcon('download',14)} Export</button>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:1rem">
      <div class="card" style="grid-column:1/-1">
        <div class="card-header">
          <div><div class="card-title">Yield Per Hectare — Year Over Year</div><div class="card-subtitle">Showing all crops for ${farm.name}</div></div>
        </div>
        <div class="chart-wrap tall"><canvas id="trendChart"></canvas></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">Season Summary</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Season</th><th>Crop</th><th>Yield (t/ha)</th><th>Production (t)</th><th>Rainfall (mm)</th><th>Change</th></tr></thead>
            <tbody>
              ${farmYields.map((y, i) => {
                const crop = DB.crops.find(c => c.id === y.cropId);
                const prev = farmYields[i-1];
                const chg = prev ? ((y.yieldPerHa - prev.yieldPerHa)/prev.yieldPerHa*100).toFixed(1) : null;
                return `<tr>
                  <td><strong>${y.season}</strong></td>
                  <td>${crop ? crop.name : '—'}</td>
                  <td class="${i === farmYields.length-1 ? 'text-green font-semi' : ''}">${fmt(y.yieldPerHa, 2)}</td>
                  <td>${fmt(y.totalProd, 1)}</td>
                  <td>${y.rainfall}</td>
                  <td>${chg !== null ? `<span class="${+chg >= 0 ? 'text-green' : 'text-red'}">${+chg >= 0 ? '+' : ''}${chg}%</span>` : '—'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Auto-Generated Insight</div></div>
        <div class="card-body">
          <div class="insight-list">
            ${generateTrendInsights(farmYields).map(ins => `
              <div class="insight-item">
                <div class="insight-dot ${ins.type}">${ins.type === 'success' ? '✓' : ins.type === 'warning' ? '!' : 'i'}</div>
                <div class="insight-text">${ins.msg}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => createTrendChart(farmYields));
}

function generateTrendInsights(yields) {
  const ins = [];
  const rainfallAvg = yields.reduce((s, y) => s + y.rainfall, 0) / yields.length;
  const highRainYields = yields.filter(y => y.rainfall > rainfallAvg);
  const avgHighYield = highRainYields.length ? highRainYields.reduce((s, y) => s + y.yieldPerHa, 0) / highRainYields.length : 0;
  const avgLowYield = yields.filter(y => y.rainfall <= rainfallAvg).reduce((s, y) => s + y.yieldPerHa, 0) / Math.max(1, yields.filter(y => y.rainfall <= rainfallAvg).length);

  if (avgHighYield > avgLowYield) {
    ins.push({type:'info', msg:`Historical yield averaged ${fmt(avgHighYield, 2)} t/ha during seasons with rainfall above ${Math.round(rainfallAvg)} mm, vs ${fmt(avgLowYield, 2)} t/ha in drier seasons.`});
  }

  const last = yields[yields.length-1];
  const prev = yields[yields.length-2];
  if (last && prev) {
    const chg = ((last.yieldPerHa - prev.yieldPerHa)/prev.yieldPerHa*100);
    if (chg < -8) ins.push({type:'warning', msg:`Yield dropped ${Math.abs(chg).toFixed(1)}% in ${last.season}. Rainfall was ${last.rainfall < prev.rainfall ? 'lower' : 'comparable'} at ${last.rainfall} mm.`});
    else if (chg > 5) ins.push({type:'success', msg:`Yield improved ${chg.toFixed(1)}% in ${last.season}, potentially driven by better rainfall (${last.rainfall} mm).`});
  }

  const maxYield = Math.max(...yields.map(y => y.yieldPerHa));
  const maxY = yields.find(y => y.yieldPerHa === maxYield);
  if (maxY) ins.push({type:'info', msg:`Best season on record: ${maxY.season} with ${fmt(maxY.yieldPerHa, 2)} t/ha (${maxY.rainfall} mm rainfall, pH ${maxY.soilPH}).`});

  return ins;
}

function createTrendChart(yields) {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;

  const seasons = yields.map(y => y.season);
  const yieldVals = yields.map(y => y.yieldPerHa);
  const rainfall = yields.map(y => y.rainfall / 100); // scale for dual axis

  S.charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: seasons,
      datasets: [
        {
          label: 'Yield (t/ha)',
          data: yieldVals,
          borderColor: 'hsl(142,65%,52%)',
          backgroundColor: 'hsla(142,65%,52%,.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 9,
          yAxisID: 'y',
        },
        {
          label: 'Rainfall (×100 mm)',
          data: rainfall,
          borderColor: 'hsl(210,85%,65%)',
          backgroundColor: 'transparent',
          borderDash: [5, 4],
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: { mode:'index', intersect:false },
      plugins: { legend:{ position:'top' } },
      scales: {
        y:  { position:'left',  grid:{ color:'rgba(255,255,255,0.05)' }, title:{ display:true, text:'Yield (t/ha)', color:'#64748b' } },
        y1: { position:'right', grid:{ display:false }, title:{ display:true, text:'Rainfall (÷100)', color:'#64748b' }, min:0 },
      },
    },
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: FACTOR ANALYSIS
────────────────────────────────────────────────────────────── */
function renderFactors() {
  const cont = document.getElementById('pageContent');
  const allYields = DB.yields;

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Factor Analysis</h1>
        <p class="page-desc">Explore correlations between agronomic inputs and yield outcomes</p>
      </div>
    </div>

    <div class="filter-bar">
      <label>X Axis:</label>
      <select class="form-select" id="xAxis" style="width:auto">
        <option value="rainfall">Rainfall (mm)</option>
        <option value="irrigation">Irrigation (L)</option>
        <option value="soilPH">Soil pH</option>
      </select>
      <label style="margin-left:1rem">Y Axis:</label>
      <select class="form-select" id="yAxis" style="width:auto">
        <option value="yieldPerHa">Yield (t/ha)</option>
        <option value="totalProd">Total Production (t)</option>
      </select>
      <button class="btn btn-primary btn-sm" id="updateScatter">Update Chart</button>
    </div>

    <div class="grid-2" style="margin-bottom:1rem">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Scatter Plot</div>
          <span class="badge badge-blue">All Farms × All Seasons</span>
        </div>
        <div class="chart-wrap tall"><canvas id="scatterChart"></canvas></div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Feature Importance</div>
          <span class="badge badge-green">System-wide model</span>
        </div>
        <div class="chart-wrap tall"><canvas id="importanceChart"></canvas></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Correlation Matrix</div>
        <div class="card-subtitle">Pearson r values between variables across all records</div>
      </div>
      <div class="card-body">
        <div id="correlationMatrix"></div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    createScatterChart(allYields, 'rainfall', 'yieldPerHa');
    createImportanceChart();
    createCorrelationMatrix(allYields);

    document.getElementById('updateScatter').addEventListener('click', () => {
      const x = document.getElementById('xAxis').value;
      const y2 = document.getElementById('yAxis').value;
      if (S.charts.scatter) { S.charts.scatter.destroy(); delete S.charts.scatter; }
      createScatterChart(allYields, x, y2);
    });
  });
}

function createScatterChart(yields, xKey, yKey) {
  const ctx = document.getElementById('scatterChart');
  if (!ctx) return;

  const farmColors = ['hsl(142,65%,52%)', 'hsl(210,85%,65%)', 'hsl(38,95%,60%)', 'hsl(265,75%,70%)'];
  const datasets = DB.farms.map((f, i) => ({
    label: f.name,
    data: yields.filter(y => y.farmId === f.id).map(y => ({ x: y[xKey], y: y[yKey] })),
    backgroundColor: farmColors[i].replace('hsl', 'hsla').replace(')', ',.7)'),
    pointRadius: 8,
    pointHoverRadius: 11,
  }));

  const xLabels = { rainfall:'Rainfall (mm)', irrigation:'Irrigation (L)', soilPH:'Soil pH' };
  const yLabels = { yieldPerHa:'Yield (t/ha)', totalProd:'Total Production (t)' };

  S.charts.scatter = new Chart(ctx, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend:{ position:'top' } },
      scales: {
        x: { grid:{ color:'rgba(255,255,255,0.05)' }, title:{ display:true, text:xLabels[xKey], color:'#64748b' } },
        y: { grid:{ color:'rgba(255,255,255,0.05)' }, title:{ display:true, text:yLabels[yKey], color:'#64748b' } },
      },
    },
  });
}

function createImportanceChart() {
  const ctx = document.getElementById('importanceChart');
  if (!ctx) return;

  const features = ['Rainfall', 'Soil pH', 'Irrigation', 'Season', 'Fertilizer', 'Crop Rotation', 'Temperature'];
  const importance = [78, 65, 58, 45, 38, 32, 28];
  const colors = importance.map(v => v > 60 ? 'hsla(142,65%,52%,.8)' : v > 40 ? 'hsla(210,85%,65%,.8)' : 'hsla(38,95%,60%,.8)');

  S.charts.importance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: features,
      datasets: [{ label:'Feature Importance (%)', data: importance, backgroundColor: colors, borderRadius: 6, borderSkipped: false }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend:{ display:false } },
      scales: {
        x: { grid:{ color:'rgba(255,255,255,0.05)' }, max: 100, ticks:{ callback: v => v + '%' } },
        y: { grid:{ display:false } },
      },
    },
  });
}

function createCorrelationMatrix(yields) {
  const container = document.getElementById('correlationMatrix');
  if (!container) return;

  const vars = ['Rainfall','Irrigation','Soil pH','Yield'];
  const keys = ['rainfall','irrigation','soilPH','yieldPerHa'];

  function corr(xk, yk) {
    const pairs = yields.map(y => [y[xk], y[yk]]).filter(p => p[0] != null && p[1] != null);
    if (pairs.length < 2) return 0;
    const mx = pairs.reduce((s,p) => s+p[0],0)/pairs.length;
    const my = pairs.reduce((s,p) => s+p[1],0)/pairs.length;
    const num = pairs.reduce((s,p) => s+(p[0]-mx)*(p[1]-my),0);
    const dx  = Math.sqrt(pairs.reduce((s,p) => s+Math.pow(p[0]-mx,2),0));
    const dy  = Math.sqrt(pairs.reduce((s,p) => s+Math.pow(p[1]-my,2),0));
    return dx*dy === 0 ? 0 : Math.round(num/(dx*dy)*100)/100;
  }

  const matrix = keys.map(xk => keys.map(yk => corr(xk, yk)));

  function corrColor(v) {
    if (v === 1) return 'hsla(142,60%,30%,.9)';
    if (v > 0.6) return `hsla(142,60%,40%,${v})`;
    if (v > 0.3) return `hsla(142,60%,55%,${v})`;
    if (v > 0)   return `hsla(142,60%,70%,${v+.2})`;
    if (v > -0.3)return `hsla(38,90%,55%,${Math.abs(v)+.1})`;
    return `hsla(0,72%,52%,${Math.abs(v)+.2})`;
  }

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:100px repeat(${vars.length},1fr);gap:3px;max-width:600px">
      <div></div>
      ${vars.map(v => `<div style="text-align:center;font-size:.72rem;font-weight:700;color:var(--text-muted);padding:.35rem">${v}</div>`).join('')}
      ${matrix.map((row, i) => `
        <div style="display:flex;align-items:center;font-size:.72rem;font-weight:600;color:var(--text-muted)">${vars[i]}</div>
        ${row.map(v => `
          <div style="background:${corrColor(v)};border-radius:6px;padding:.6rem .25rem;text-align:center;font-size:.78rem;font-weight:700;color:${v > 0.3 || v < -0.3 ? 'white' : 'var(--text-secondary)'};transition:transform .15s" title="r = ${v}" onmouseenter="this.style.transform='scale(1.05)'" onmouseleave="this.style.transform=''">
            ${v}
          </div>
        `).join('')}
      `).join('')}
    </div>
    <p class="text-xs text-muted" style="margin-top:.75rem">Pearson correlation coefficient (r). Values closer to ±1 indicate stronger relationships. Correlation ≠ causation.</p>
  `;
}

/* ──────────────────────────────────────────────────────────────
   PAGE: COMPARISONS
────────────────────────────────────────────────────────────── */
function renderComparisons() {
  const cont = document.getElementById('pageContent');

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Comparisons</h1>
        <p class="page-desc">Side-by-side farm and crop performance analysis</p>
      </div>
    </div>

    <div class="tabs">
      <button class="tab-btn${S.compareTab === 'farm' ? ' active' : ''}" id="tabFarm" data-tab="farm">Farm vs Farm</button>
      <button class="tab-btn${S.compareTab === 'crop' ? ' active' : ''}" id="tabCrop" data-tab="crop">Crop vs Crop</button>
    </div>

    <div id="compareContent"></div>
  `;

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      S.compareTab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCompareContent(S.compareTab);
    });
  });

  renderCompareContent(S.compareTab);
}

function renderCompareContent(tab) {
  const cont = document.getElementById('compareContent');
  if (tab === 'farm') renderFarmComparison(cont);
  else renderCropComparison(cont);
}

function renderFarmComparison(cont) {
  const farms = DB.farms;
  const metrics = farms.map(f => {
    const fy = DB.yields.filter(y => y.farmId === f.id);
    const lastY = fy[fy.length-1];
    const avgY = fy.length ? fy.reduce((s, y) => s + y.yieldPerHa, 0) / fy.length : 0;
    const soil = DB.soil.find(s => s.farmId === f.id);
    return { farm: f, lastY, avgY, soil };
  });

  const maxYield = Math.max(...metrics.map(m => m.avgY));

  cont.innerHTML = `
    <div class="grid-2" style="margin-bottom:1rem">
      <div class="card" style="grid-column:1/-1">
        <div class="card-header"><div class="card-title">Farm vs Farm — All Metrics</div></div>
        <div class="table-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>Farm</th><th>Region</th><th>Area (ha)</th>
                <th>Avg Yield (t/ha)</th><th>Last Season Yield</th>
                <th>Rainfall (mm)</th><th>Irrigation (L)</th><th>Soil pH</th><th>Seasons</th>
              </tr>
            </thead>
            <tbody>
              ${metrics.map(({ farm: f, lastY, avgY, soil }) => {
                const fy = DB.yields.filter(y => y.farmId === f.id);
                const avgRain = fy.length ? Math.round(fy.reduce((s, y) => s + y.rainfall, 0) / fy.length) : '—';
                const avgIrrig = fy.length ? Math.round(fy.reduce((s, y) => s + y.irrigation, 0) / fy.length) : '—';
                const isWinner = Math.abs(avgY - maxYield) < 0.01;
                return `<tr>
                  <td><strong>${f.name}</strong></td>
                  <td>${f.region}</td>
                  <td>${f.area}</td>
                  <td class="${isWinner ? 'compare-winner' : ''}">${fmt(avgY, 2)} ${isWinner ? '🏆' : ''}</td>
                  <td>${lastY ? fmt(lastY.yieldPerHa, 2) : '—'}</td>
                  <td>${avgRain}</td>
                  <td>${avgIrrig}</td>
                  <td>${soil ? soil.ph : '—'}</td>
                  <td>${fy.length}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">Yield Radar</div></div>
        <div class="chart-wrap"><canvas id="radarChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Smart Insight</div>
          <span class="badge badge-amber">AI-generated</span>
        </div>
        <div class="card-body">
          <div class="insight-list">
            <div class="insight-item">
              <div class="insight-dot warning">!</div>
              <div class="insight-text">Green Valley Farm (Farm B) has lower yield than Riverbend Farm despite comparable rainfall conditions (510 vs 580 mm avg). Irrigation usage is significantly higher (6,100 L vs 4,500 L), suggesting diminishing returns from over-irrigation.</div>
            </div>
            <div class="insight-item">
              <div class="insight-dot info">i</div>
              <div class="insight-text">Highland Acres showed a declining yield trend over 3 seasons (4.4 → 3.8 t/ha), correlating with a drop in seasonal rainfall (620 → 490 mm). Soil pH is also shifting from 6.5 to 6.3 — approaching lower optimal threshold.</div>
            </div>
            <div class="insight-item">
              <div class="insight-dot success">✓</div>
              <div class="insight-text">Riverbend Farm consistently delivers the highest yield per hectare among all farms, with the most stable pH range (6.1–6.4). Its drip irrigation system appears to be the most water-efficient.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => createRadarChart(metrics));
}

function createRadarChart(metrics) {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;

  const normalize = (val, min, max) => ((val - min) / (max - min)) * 100;
  const colors = ['hsla(142,65%,52%,.7)','hsla(210,85%,65%,.7)','hsla(38,95%,60%,.7)','hsla(265,75%,70%,.7)'];

  const datasets = metrics.map(({ farm: f, avgY, soil }, i) => {
    const fy = DB.yields.filter(y => y.farmId === f.id);
    const avgRain = fy.length ? fy.reduce((s, y) => s + y.rainfall, 0) / fy.length : 0;
    const avgIrrig = fy.length ? fy.reduce((s, y) => s + y.irrigation, 0) / fy.length : 0;
    return {
      label: f.name,
      data: [
        normalize(avgY, 2, 7),
        normalize(avgRain, 150, 700),
        normalize(avgIrrig, 1000, 7000),
        soil ? normalize(soil.ph, 5, 8) : 50,
        normalize(f.area, 20, 100),
      ],
      borderColor: colors[i].replace('hsla', 'hsl').replace(',.7)', ')'),
      backgroundColor: colors[i],
      borderWidth: 2,
      pointRadius: 4,
    };
  });

  S.charts.radar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Avg Yield', 'Rainfall', 'Irrigation', 'Soil pH', 'Farm Size'],
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend:{ position:'top' } },
      scales: {
        r: {
          grid: { color:'rgba(255,255,255,0.08)' },
          pointLabels: { color:'#94a3b8', font:{ size:11 } },
          ticks: { display:false },
          min: 0, max: 100,
        },
      },
    },
  });
}

function renderCropComparison(cont) {
  const cropGroups = ['Rice', 'Wheat', 'Maize'];
  const stats = cropGroups.map(name => {
    const ys = DB.yields.filter(y => {
      const crop = DB.crops.find(c => c.id === y.cropId);
      return crop && crop.name === name;
    });
    return {
      name,
      count: ys.length,
      avgYield: ys.length ? ys.reduce((s, y) => s + y.yieldPerHa, 0) / ys.length : 0,
      avgRainfall: ys.length ? ys.reduce((s, y) => s + y.rainfall, 0) / ys.length : 0,
      avgIrrig: ys.length ? ys.reduce((s, y) => s + y.irrigation, 0) / ys.length : 0,
      maxYield: ys.length ? Math.max(...ys.map(y => y.yieldPerHa)) : 0,
    };
  });

  cont.innerHTML = `
    <div class="card" style="margin-bottom:1rem">
      <div class="card-header"><div class="card-title">Crop vs Crop Comparison</div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Crop</th><th>Seasons Recorded</th><th>Avg Yield (t/ha)</th><th>Max Yield (t/ha)</th><th>Avg Rainfall (mm)</th><th>Avg Irrigation (L)</th><th>Performance</th></tr></thead>
          <tbody>
            ${stats.map(s => `<tr>
              <td><strong>🌾 ${s.name}</strong></td>
              <td>${s.count}</td>
              <td>${fmt(s.avgYield, 2)}</td>
              <td>${fmt(s.maxYield, 2)}</td>
              <td>${Math.round(s.avgRainfall)}</td>
              <td>${Math.round(s.avgIrrig)}</td>
              <td>
                <div class="trend-bar-wrap">
                  <div class="trend-bar"><div class="trend-bar-fill trend-up" style="width:${Math.round(s.avgYield/7*100)}%"></div></div>
                  <span class="text-sm font-semi text-green">${Math.round(s.avgYield/7*100)}%</span>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">Yield Distribution by Crop</div></div>
      <div class="chart-wrap"><canvas id="cropCompareChart"></canvas></div>
    </div>
  `;

  requestAnimationFrame(() => {
    const ctx = document.getElementById('cropCompareChart');
    if (!ctx) return;
    S.charts.cropCompare = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stats.map(s => s.name),
        datasets: [
          { label:'Avg Yield (t/ha)', data: stats.map(s => s.avgYield.toFixed(2)), backgroundColor:'hsla(142,65%,52%,.8)', borderRadius:6, borderSkipped:false },
          { label:'Max Yield (t/ha)', data: stats.map(s => s.maxYield.toFixed(2)), backgroundColor:'hsla(210,85%,65%,.7)', borderRadius:6, borderSkipped:false },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend:{ position:'top' } },
        scales: {
          x: { grid:{ display:false } },
          y: { grid:{ color:'rgba(255,255,255,0.05)' }, title:{ display:true, text:'Yield (t/ha)', color:'#64748b' } },
        },
      },
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: IRRIGATION ANALYSIS
────────────────────────────────────────────────────────────── */
function renderIrrigation() {
  const cont = document.getElementById('pageContent');

  const data = DB.farms.map(f => {
    const fy = DB.yields.filter(y => y.farmId === f.id);
    const avgIrrig = fy.length ? fy.reduce((s, y) => s + y.irrigation, 0) / fy.length : 0;
    const avgYield = fy.length ? fy.reduce((s, y) => s + y.yieldPerHa, 0) / fy.length : 0;
    const roi = avgIrrig > 0 ? (avgYield / (avgIrrig / 1000)).toFixed(3) : 0; // t/ha per kL
    return { farm: f, avgIrrig: Math.round(avgIrrig), avgYield: avgYield.toFixed(2), roi };
  }).sort((a, b) => b.roi - a.roi);

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Irrigation Analysis</h1>
        <p class="page-desc">Water usage efficiency vs. yield performance across all farms</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm" onclick="navigate('reports')">${svgIcon('download',14)} Export Report</button>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:1rem">
      <div class="kpi-card blue">
        <div class="kpi-header"><span class="kpi-label">Avg Water Use</span><div class="kpi-icon">${svgIcon('droplets',14)}</div></div>
        <div><span class="kpi-value">${fmtN(data.reduce((s, d) => s + d.avgIrrig, 0) / data.length)}</span><span class="kpi-unit">L/season</span></div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-header"><span class="kpi-label">Best Efficiency</span><div class="kpi-icon">🏆</div></div>
        <div><span class="kpi-value">${data[0].roi}</span><span class="kpi-unit">t per kL</span></div>
        <span class="kpi-change up">${data[0].farm.name}</span>
      </div>
      <div class="kpi-card red">
        <div class="kpi-header"><span class="kpi-label">Lowest Efficiency</span><div class="kpi-icon">⚠️</div></div>
        <div><span class="kpi-value">${data[data.length-1].roi}</span><span class="kpi-unit">t per kL</span></div>
        <span class="kpi-change down">${data[data.length-1].farm.name}</span>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">Water Usage vs Yield Scatter</div></div>
        <div class="chart-wrap tall"><canvas id="irrigChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Efficiency Ranking</div>
          <span class="badge badge-green">Yield per kilolitre</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Rank</th><th>Farm</th><th>Avg Irrigation</th><th>Avg Yield</th><th>Efficiency (t/kL)</th><th>Type</th></tr></thead>
            <tbody>
              ${data.map((d, i) => `<tr>
                <td><strong>#${i+1}</strong></td>
                <td>${d.farm.name}</td>
                <td>${fmtN(d.avgIrrig)} L</td>
                <td class="${i === 0 ? 'text-green font-semi' : ''}">${d.avgYield} t/ha</td>
                <td class="${i === 0 ? 'compare-winner' : i === data.length-1 ? 'compare-loser' : ''}">${d.roi} ${i===0?'🏆':''}</td>
                <td><span class="badge badge-${d.farm.irrigationType === 'Drip' ? 'green' : d.farm.irrigationType === 'Sprinkler' ? 'blue' : 'amber'}">${d.farm.irrigationType}</span></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="card-footer">
          <div class="insight-item" style="margin-top:.5rem">
            <div class="insight-dot warning">!</div>
            <div class="insight-text text-xs">Higher water usage does not correlate with higher yield across these farms. Drip-irrigated farms show the best water-to-yield efficiency.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    const ctx = document.getElementById('irrigChart');
    if (!ctx) return;
    const colors = ['hsl(142,65%,52%)','hsl(210,85%,65%)','hsl(38,95%,60%)','hsl(265,75%,70%)'];
    S.charts.irrig = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: DB.yields.map((y, i) => {
          const fi = DB.farms.findIndex(f => f.id === y.farmId);
          const farm = DB.farms[fi];
          const crop = DB.crops.find(c => c.id === y.cropId);
          return {
            label: `${farm?.name} — ${y.season}`,
            data: [{ x: y.irrigation, y: y.yieldPerHa }],
            backgroundColor: (colors[fi] || colors[0]).replace('hsl', 'hsla').replace(')', ',.7)'),
            pointRadius: 10,
            pointHoverRadius: 13,
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: (${ctx.parsed.x}L, ${ctx.parsed.y}t/ha)` } },
        },
        scales: {
          x: { grid:{ color:'rgba(255,255,255,0.05)' }, title:{ display:true, text:'Irrigation Volume (L)', color:'#64748b' } },
          y: { grid:{ color:'rgba(255,255,255,0.05)' }, title:{ display:true, text:'Yield (t/ha)', color:'#64748b' } },
        },
      },
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: SOIL ANALYSIS
────────────────────────────────────────────────────────────── */
function renderSoil() {
  const cont = document.getElementById('pageContent');
  const soil = DB.soil.find(s => s.farmId === S.farmId) || DB.soil[0];
  const farm = DB.farms.find(f => f.id === S.farmId) || DB.farms[0];

  const phStatus = soil.ph >= 6.0 && soil.ph <= 7.0 ? 'Optimal' : soil.ph < 5.5 || soil.ph > 7.5 ? 'Poor' : 'Marginal';
  const phBadge  = { Optimal:'green', Marginal:'amber', Poor:'red' }[phStatus];

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Soil Analysis</h1>
        <p class="page-desc">${farm.name} — soil nutrient profile and fertility assessment</p>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:1rem">
      <div class="kpi-card${phStatus==='Optimal'?' green':phStatus==='Marginal'?' amber':' red'}">
        <div class="kpi-header"><span class="kpi-label">Soil pH</span><div class="kpi-icon">🌡️</div></div>
        <div><span class="kpi-value">${soil.ph}</span><span class="kpi-unit">pH</span></div>
        <span class="kpi-change ${phStatus==='Optimal'?'up':phStatus==='Marginal'?'flat':'down'}">${phStatus}</span>
      </div>
      <div class="kpi-card blue">
        <div class="kpi-header"><span class="kpi-label">Nitrogen (N)</span><div class="kpi-icon">🟦</div></div>
        <div><span class="kpi-value">${soil.nitrogen}</span><span class="kpi-unit">kg/ha</span></div>
        <span class="kpi-change ${soil.nitrogen >= 150 ? 'up' : 'down'}">${soil.nitrogen >= 150 ? 'Adequate' : 'Low'}</span>
      </div>
      <div class="kpi-card amber">
        <div class="kpi-header"><span class="kpi-label">Phosphorus (P)</span><div class="kpi-icon">🟨</div></div>
        <div><span class="kpi-value">${soil.phosphorus}</span><span class="kpi-unit">kg/ha</span></div>
        <span class="kpi-change ${soil.phosphorus >= 20 ? 'up' : 'down'}">${soil.phosphorus >= 20 ? 'Adequate' : 'Low'}</span>
      </div>
      <div class="kpi-card purple">
        <div class="kpi-header"><span class="kpi-label">Potassium (K)</span><div class="kpi-icon">🟪</div></div>
        <div><span class="kpi-value">${soil.potassium}</span><span class="kpi-unit">kg/ha</span></div>
        <span class="kpi-change up">Adequate</span>
      </div>
      <div class="kpi-card green">
        <div class="kpi-header"><span class="kpi-label">Organic Matter</span><div class="kpi-icon">🌿</div></div>
        <div><span class="kpi-value">${soil.organicMatter}</span><span class="kpi-unit">%</span></div>
        <span class="kpi-change ${soil.organicMatter >= 2.5 ? 'up' : 'flat'}">${soil.organicMatter >= 2.5 ? 'Good' : 'Moderate'}</span>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">Nutrient Profile — All Farms</div></div>
        <div class="chart-wrap"><canvas id="soilChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Soil Profiles Comparison</div>
          <span class="badge badge-${phBadge}">${phStatus} pH</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Farm</th><th>pH</th><th>N (kg/ha)</th><th>P (kg/ha)</th><th>K (kg/ha)</th><th>Org. Matter %</th><th>Texture</th></tr></thead>
            <tbody>
              ${DB.soil.map(s => {
                const f = DB.farms.find(f => f.id === s.farmId);
                const isSel = s.farmId === S.farmId;
                return `<tr${isSel ? ' style="background:hsla(142,71%,40%,.07)"' : ''}>
                  <td><strong>${f?.name || '—'}</strong>${isSel ? ' <span class="badge badge-green" style="font-size:.65rem">Selected</span>':''}</td>
                  <td class="${s.ph >= 6 && s.ph <= 7 ? 'text-green' : s.ph < 5.5 ? 'text-red' : 'text-amber'}">${s.ph}</td>
                  <td>${s.nitrogen}</td>
                  <td>${s.phosphorus}</td>
                  <td>${s.potassium}</td>
                  <td>${s.organicMatter}</td>
                  <td>${s.texture}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="card-footer">pH range 6.0–7.0 is optimal for most crops. Values outside this range reduce nutrient availability.</div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    const ctx = document.getElementById('soilChart');
    if (!ctx) return;
    const labels = DB.farms.map(f => f.name.split(' ')[0]);
    S.charts.soil = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label:'Nitrogen (÷10)', data: DB.soil.map(s => s.nitrogen/10), backgroundColor:'hsla(210,85%,65%,.8)', borderRadius:4, borderSkipped:false },
          { label:'Phosphorus',     data: DB.soil.map(s => s.phosphorus),  backgroundColor:'hsla(38,95%,60%,.8)', borderRadius:4, borderSkipped:false },
          { label:'Potassium (÷10)',data: DB.soil.map(s => s.potassium/10),backgroundColor:'hsla(265,75%,70%,.8)', borderRadius:4, borderSkipped:false },
          { label:'Org. Matter ×10',data: DB.soil.map(s => s.organicMatter*10), backgroundColor:'hsla(142,65%,52%,.8)', borderRadius:4, borderSkipped:false },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend:{ position:'top' } },
        scales: {
          x: { grid:{ display:false } },
          y: { grid:{ color:'rgba(255,255,255,0.05)' } },
        },
      },
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: DATASET UPLOAD
────────────────────────────────────────────────────────────── */
const SAMPLE_ROWS = [
  {season:'Kharif 2025',crop:'Rice',area:45.5,rainfall:610,irrigation:4500,soilPH:6.4,yieldPerHa:4.25,status:'valid'},
  {season:'Kharif 2024',crop:'Rice',area:45.5,rainfall:490,irrigation:4800,soilPH:6.1,yieldPerHa:3.90,status:'valid'},
  {season:'Kharif 2023',crop:'Rice',area:45.5,rainfall:580,irrigation:4500,soilPH:6.3,yieldPerHa:4.10,status:'valid'},
  {season:'Rabi 2025',  crop:'Wheat',area:45.5,rainfall:260,irrigation:3500,soilPH:6.5,yieldPerHa:3.70,status:'valid'},
  {season:'Rabi 2024',  crop:'Wheat',area:45.5,rainfall:240,irrigation:3600,soilPH:6.3,yieldPerHa:3.50,status:'valid'},
  {season:'Kharif 2022',crop:'Rice',area:45.5,rainfall:520,irrigation:4200,soilPH:6.2,yieldPerHa:3.80,status:'valid'},
  {season:'Rabi 2023',  crop:'Wheat',area:45.5,rainfall:'???',irrigation:3800,soilPH:6.2,yieldPerHa:3.20,status:'warning'},
  {season:'Kharif 2021',crop:'Rice',area:45.5,rainfall:-50,irrigation:4100,soilPH:6.1,yieldPerHa:-2.1,status:'error'},
];

function renderUpload() {
  const cont = document.getElementById('pageContent');

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Upload Dataset</h1>
        <p class="page-desc">Import historical yield records with automatic validation and column mapping</p>
      </div>
    </div>

    <div id="uploadStep1">
      <div class="upload-zone" id="dropZone">
        <input type="file" id="fileInput" accept=".csv,.xlsx,.xls" />
        <div class="upload-icon">${svgIcon('upload', 24)}</div>
        <h3>Drag & drop your dataset here</h3>
        <p>Supports CSV and Excel files — max 10 MB</p>
        <button class="btn btn-primary" style="margin-top:1rem;pointer-events:none">${svgIcon('upload',14)} Browse Files</button>
      </div>

      <div class="card" style="margin-top:1rem">
        <div class="card-header"><div class="card-title">Recent Uploads</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Dataset</th><th>Farm</th><th>Rows</th><th>Status</th><th>Uploaded</th><th>Errors</th></tr></thead>
            <tbody>
              ${DB.datasets.map(ds => {
                const farm = DB.farms.find(f => f.id === ds.farmId);
                return `<tr>
                  <td><strong>${ds.name}</strong></td>
                  <td>${farm?.name || '—'}</td>
                  <td>${ds.rows}</td>
                  <td><span class="badge badge-${ds.status === 'Imported' ? 'green' : 'amber'}">${ds.status}</span></td>
                  <td class="text-muted">${ds.date}</td>
                  <td>${ds.errors > 0 ? `<span class="badge badge-red">${ds.errors} error${ds.errors > 1 ? 's' : ''}</span>` : '<span class="badge badge-green">None</span>'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div id="uploadStep2" class="hidden">
      <div class="grid-2" style="margin-bottom:1rem">
        <div class="card">
          <div class="card-header"><div class="card-title">Column Mapping</div><span class="badge badge-green">Auto-detected</span></div>
          <div class="card-body">
            <p class="text-sm text-secondary" style="margin-bottom:1rem">Review the detected column mappings. Adjust any that were incorrectly identified.</p>
            <div style="display:flex;flex-direction:column;gap:.75rem">
              ${[['season','Season / Period'],['crop','Crop Name'],['area','Farm Area (ha)'],['rainfall','Seasonal Rainfall (mm)'],['irrigation','Irrigation Volume (L)'],['soilPH','Soil pH'],['yieldPerHa','Yield (t/ha)']].map(([k,label]) => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:.5rem .75rem;background:var(--bg-card2);border-radius:var(--r-md)">
                  <span class="text-sm font-semi">${label}</span>
                  <select class="form-select" style="width:auto;font-size:.8rem;padding:.3rem .6rem">
                    <option selected>${k}</option>
                    <option>raw_${k}</option>
                    <option>field_${k}</option>
                  </select>
                </div>
              `).join('')}
            </div>
            <button class="btn btn-primary btn-full" style="margin-top:1rem" id="validateBtn">${svgIcon('check',14)} Validate Data</button>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">File Info</div></div>
          <div class="card-body">
            <div style="display:flex;flex-direction:column;gap:.65rem">
              <div class="flex justify-between"><span class="text-secondary text-sm">Filename</span><span class="font-semi text-sm">farm_data_2025.csv</span></div>
              <div class="flex justify-between"><span class="text-secondary text-sm">Rows detected</span><span class="font-semi text-sm">8</span></div>
              <div class="flex justify-between"><span class="text-secondary text-sm">Columns detected</span><span class="font-semi text-sm">7</span></div>
              <div class="flex justify-between"><span class="text-secondary text-sm">File size</span><span class="font-semi text-sm">2.4 KB</span></div>
              <div class="flex justify-between"><span class="text-secondary text-sm">Encoding</span><span class="font-semi text-sm">UTF-8</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card" id="validationCard" style="display:none">
        <div class="card-header">
          <div><div class="card-title">Validation Results</div><div class="card-subtitle">Review each row before importing</div></div>
          <div style="display:flex;gap:.5rem">
            <span class="badge badge-green">6 Valid</span>
            <span class="badge badge-amber">1 Warning</span>
            <span class="badge badge-red">1 Error</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Row</th><th>Season</th><th>Crop</th><th>Rainfall</th><th>Yield (t/ha)</th><th>Status</th><th>Issue</th></tr></thead>
            <tbody>
              ${SAMPLE_ROWS.map((r, i) => `<tr>
                <td>${i + 1}</td>
                <td>${r.season}</td>
                <td>${r.crop}</td>
                <td class="${r.status === 'error' && r.rainfall < 0 ? 'row-error' : r.status === 'warning' ? 'row-warning' : ''}">${r.rainfall}</td>
                <td class="${r.status === 'error' && r.yieldPerHa < 0 ? 'row-error' : ''}">${r.yieldPerHa}</td>
                <td>
                  <span class="badge badge-${r.status === 'valid' ? 'green' : r.status === 'warning' ? 'amber' : 'red'}">
                    ${r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </td>
                <td class="text-cell text-xs text-muted">
                  ${r.status === 'warning' ? 'Missing or invalid rainfall value — row will be imported with null.' : r.status === 'error' ? 'Negative values detected in rainfall and yield — physically impossible. Row excluded.' : '—'}
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="card-footer" style="display:flex;gap:.75rem;justify-content:flex-end">
          <button class="btn btn-secondary" onclick="navigate('upload')">Cancel</button>
          <button class="btn btn-primary" id="importBtn">${svgIcon('upload',14)} Import 7 Valid/Warning Rows</button>
        </div>
      </div>
    </div>
  `;

  // File input simulation
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  function startUploadFlow() {
    document.getElementById('uploadStep1').classList.add('hidden');
    document.getElementById('uploadStep2').classList.remove('hidden');
  }

  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragover'); startUploadFlow(); });
  fileInput.addEventListener('change', () => { if (fileInput.files.length) startUploadFlow(); });

  document.addEventListener('click', e => {
    if (e.target && e.target.id === 'validateBtn') {
      const btn = document.getElementById('validateBtn');
      btn.innerHTML = `<span class="spinner"></span> Validating…`;
      btn.disabled = true;
      setTimeout(() => {
        document.getElementById('validationCard').style.display = 'block';
        btn.innerHTML = `${svgIcon('check',14)} Validation Complete`;
        showToast('Validation complete — 6 valid, 1 warning, 1 error', 'info');
      }, 1200);
    }
    if (e.target && e.target.id === 'importBtn') {
      const btn = document.getElementById('importBtn');
      btn.innerHTML = `<span class="spinner"></span> Importing…`;
      btn.disabled = true;
      setTimeout(() => {
        showToast('7 rows imported successfully!', 'success');
        navigate('dashboard');
      }, 1500);
    }
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: REPORTS
────────────────────────────────────────────────────────────── */
function renderReports() {
  const cont = document.getElementById('pageContent');

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Reports</h1>
        <p class="page-desc">Generate and export polished stakeholder-ready reports</p>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">${svgIcon('report',15)} Report Builder</div></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:1.25rem">
          <div class="form-group">
            <label class="form-label">Report Title</label>
            <input class="form-input" id="repTitle" value="Farm Performance Summary — ${S.season}" />
          </div>
          <div>
            <label class="form-label" style="margin-bottom:.65rem">Include Sections</label>
            <div style="display:flex;flex-direction:column;gap:.5rem">
              ${[['sec-summary','Farm Summary & KPIs'],['sec-trends','Historical Trend Analysis'],['sec-prediction','Yield Prediction Results'],['sec-factors','Factor Analysis & Correlations'],['sec-soil','Soil Profile Data'],['sec-comparison','Farm Comparison Table']].map(([id, label]) => `
                <label style="display:flex;align-items:center;gap:.65rem;padding:.5rem .75rem;background:var(--bg-card2);border-radius:var(--r-md);cursor:pointer">
                  <input type="checkbox" id="${id}" checked style="accent-color:var(--green-500);width:16px;height:16px" />
                  <span class="text-sm">${label}</span>
                </label>
              `).join('')}
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Format</label>
              <select class="form-select" id="repFormat">
                <option value="pdf">📄 PDF (for presentations)</option>
                <option value="excel">📊 Excel (for analysis)</option>
                <option value="csv">📝 CSV (raw data)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Date Range</label>
              <select class="form-select">
                <option>2022 – 2025 (all time)</option>
                <option>2024 – 2025</option>
                <option>2025 only</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="certificateImage">Certificate Image</label>
            <input class="form-input" type="file" id="certificateImage" accept="image/*" />
            <span class="text-xs text-muted">Add the supplied certificate artwork or institutional image to the PDF.</span>
          </div>
          <button class="btn btn-primary btn-lg btn-full" id="genReportBtn">${svgIcon('download',16)} Generate Report</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Report Preview</div></div>
        <div class="card-body" id="reportPreview">
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>No report generated yet</h3>
            <p>Configure options on the left and click Generate Report to create a downloadable report.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:1rem">
      <div class="card-header"><div class="card-title">Recent Reports</div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Report Name</th><th>Sections</th><th>Format</th><th>Generated</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><strong>Farm Comparison Q3 2025</strong></td><td>4 sections</td><td><span class="badge badge-red">PDF</span></td><td>2026-08-24</td><td><span class="badge badge-green">Ready</span></td><td><button class="btn btn-secondary btn-sm recent-report-download" data-title="Farm Comparison Q3 2025" data-format="pdf">${svgIcon('download',12)} Download</button></td></tr>
            <tr><td><strong>Regional Analysis – Central CA</strong></td><td>6 sections</td><td><span class="badge badge-green">Excel</span></td><td>2026-08-23</td><td><span class="badge badge-green">Ready</span></td><td><button class="btn btn-secondary btn-sm recent-report-download" data-title="Regional Analysis Central CA" data-format="excel">${svgIcon('download',12)} Download</button></td></tr>
            <tr><td><strong>Yield Prediction Summary</strong></td><td>2 sections</td><td><span class="badge badge-red">PDF</span></td><td>2026-08-20</td><td><span class="badge badge-green">Ready</span></td><td><button class="btn btn-secondary btn-sm recent-report-download" data-title="Yield Prediction Summary" data-format="pdf">${svgIcon('download',12)} Download</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('genReportBtn').addEventListener('click', () => {
    const btn = document.getElementById('genReportBtn');
    btn.innerHTML = `<span class="spinner"></span> Generating report…`;
    btn.disabled = true;
    setTimeout(async () => {
      btn.innerHTML = `${svgIcon('download',16)} Generate Report`;
      btn.disabled = false;
      const format = document.getElementById('repFormat').value;
      const title = document.getElementById('repTitle').value;
      const sectionInputs = $$('input[type=checkbox][id^="sec-"]');
      const sections = sectionInputs.filter(input => input.checked);
      let certificateImage = null;
      try { certificateImage = await downloadImageAsJpeg(document.getElementById('certificateImage').files[0]); }
      catch (error) { showToast('The certificate image could not be read.', 'error'); }
      document.getElementById('reportPreview').innerHTML = `
        <div style="padding:1rem;background:var(--bg-card2);border-radius:var(--r-lg);border:1px solid var(--border)">
          <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem">
            <div style="width:40px;height:40px;background:linear-gradient(135deg,var(--green-500),var(--green-400));border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;font-size:1.2rem">🌿</div>
            <div>
              <div class="font-bold">${title}</div>
              <div class="text-xs text-muted">Generated ${new Date().toLocaleDateString()} • ${sections.length} sections</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:.4rem;margin-bottom:1rem">
            ${sections.map(input => `<div class="flex gap-2 items-center text-sm"><span class="text-green">${svgIcon('check',13)}</span>${input.parentElement.textContent.trim()}</div>`).join('')}
          </div>
          <button class="btn btn-primary btn-full" id="downloadGeneratedReport">
            ${svgIcon('download',14)} Download ${format.toUpperCase()}
          </button>
        </div>
      `;
      document.getElementById('downloadGeneratedReport').addEventListener('click', () => {
        downloadReport(title, format, sectionInputs.map(input => input.checked), certificateImage);
      });
      showToast('Report generated successfully!', 'success');
    }, 2000);
  });

  cont.addEventListener('click', event => {
    const button = event.target.closest('.recent-report-download');
    if (button) downloadReport(button.dataset.title, button.dataset.format, [true, true, true, true, true, true]);
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: MODEL PERFORMANCE
────────────────────────────────────────────────────────────── */
function renderModelPerf() {
  const cont = document.getElementById('pageContent');
  const cur = DB.modelMetrics.current;
  const prev = DB.modelMetrics.previous;

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Model Performance</h1>
        <p class="page-desc">ML model metrics, versioning, and reliability assessment</p>
      </div>
      <div class="page-actions">
        <span class="badge badge-green" style="padding:.35rem 1rem;font-size:.8rem">● ${cur.status}</span>
      </div>
    </div>

    <div class="grid-3" style="margin-bottom:1rem">
      <div class="metric-box">
        <div class="metric-box-value">${cur.mae}</div>
        <div class="metric-box-label">MAE (t/ha)</div>
        <div class="metric-box-sub">Mean Absolute Error — lower is better</div>
      </div>
      <div class="metric-box">
        <div class="metric-box-value">${cur.rmse}</div>
        <div class="metric-box-label">RMSE (t/ha)</div>
        <div class="metric-box-sub">Root Mean Squared Error</div>
      </div>
      <div class="metric-box">
        <div class="metric-box-value" style="color:var(--blue-400)">${cur.r2}</div>
        <div class="metric-box-label">R² Score</div>
        <div class="metric-box-sub">Coefficient of determination (max 1.0)</div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:1rem">
      <div class="card">
        <div class="card-header"><div class="card-title">MAE Trend</div><span class="badge badge-green">Improving</span></div>
        <div class="chart-wrap"><canvas id="maeTrendChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Version Comparison</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Version</th><th>MAE</th><th>RMSE</th><th>R²</th><th>Train Size</th><th>Val Size</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>${cur.version}</strong></td>
                <td class="compare-winner">${cur.mae}</td>
                <td class="compare-winner">${cur.rmse}</td>
                <td class="compare-winner">${cur.r2}</td>
                <td>${fmtN(cur.trainSize)}</td>
                <td>${fmtN(cur.valSize)}</td>
                <td>${cur.trainedDate}</td>
                <td><span class="badge badge-green">Current</span></td>
              </tr>
              <tr>
                <td>${prev.version}</td>
                <td>${prev.mae}</td>
                <td>${prev.rmse}</td>
                <td>${prev.r2}</td>
                <td>${fmtN(prev.trainSize)}</td>
                <td>${fmtN(prev.valSize)}</td>
                <td>${prev.trainedDate}</td>
                <td><span class="badge badge-gray">Archived</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-footer">
          <div class="flex gap-2 flex-wrap">
            <button class="btn btn-secondary btn-sm">Trigger Retraining</button>
            <button class="btn btn-danger btn-sm">Rollback to ${prev.version}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Model Information</div>
        <span class="badge badge-blue">${cur.version}</span>
      </div>
      <div class="card-body">
        <div class="grid-3">
          ${[['Algorithm','Gradient Boosted Trees (XGBoost)'],['Training Records',fmtN(cur.trainSize)],['Validation Records',fmtN(cur.valSize)],['Training Date',cur.trainedDate],['Crops Covered','Rice, Wheat, Maize'],['Feature Count','14 features'],['Cross-Validation','5-fold CV'],['Prediction Interval','±13% (85% CI)']].map(([k, v]) => `
            <div class="metric-box" style="text-align:left;padding:.85rem">
              <div class="metric-box-label" style="font-size:.68rem;margin-bottom:.25rem">${k}</div>
              <div class="font-semi text-sm">${v}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    const ctx = document.getElementById('maeTrendChart');
    if (!ctx) return;
    S.charts.mae = new Chart(ctx, {
      type: 'line',
      data: {
        labels: DB.modelMetrics.maeTrend.map(m => m.label),
        datasets: [{
          label: 'MAE (t/ha)',
          data: DB.modelMetrics.maeTrend.map(m => m.val),
          borderColor: 'hsl(142,65%,52%)',
          backgroundColor: 'hsla(142,65%,52%,.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 5,
          pointHoverRadius: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display:false } },
        scales: {
          x: { grid: { color:'rgba(255,255,255,0.05)' } },
          y: {
            grid: { color:'rgba(255,255,255,0.05)' },
            title: { display:true, text:'MAE (t/ha)', color:'#64748b' },
            min: 0.2, max: 0.4,
          },
        },
      },
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   PAGE: ADMIN DASHBOARD
────────────────────────────────────────────────────────────── */
function renderAdmin() {
  const cont = document.getElementById('pageContent');

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Admin Dashboard</h1>
        <p class="page-desc">Platform management — users, datasets, model monitoring, and audit logs</p>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:1rem">
      <div class="kpi-card blue">
        <div class="kpi-header"><span class="kpi-label">Total Users</span><div class="kpi-icon">${svgIcon('users',14)}</div></div>
        <div><span class="kpi-value" id="adminKpi1">0</span><span class="kpi-unit">accounts</span></div>
        <span class="kpi-change up">${DB.users.filter(u => u.status === 'active').length} active</span>
      </div>
      <div class="kpi-card green">
        <div class="kpi-header"><span class="kpi-label">Datasets Imported</span><div class="kpi-icon">${svgIcon('upload',14)}</div></div>
        <div><span class="kpi-value" id="adminKpi2">0</span></div>
        <span class="kpi-change up">${DB.datasets.filter(d => d.status === 'Imported').length} successful</span>
      </div>
      <div class="kpi-card amber">
        <div class="kpi-header"><span class="kpi-label">Model Status</span><div class="kpi-icon">${svgIcon('cpu',14)}</div></div>
        <div><span class="kpi-value text-green" style="font-size:1.4rem">Healthy</span></div>
        <span class="kpi-change up">v2.4.1 — MAE 0.28</span>
      </div>
      <div class="kpi-card purple">
        <div class="kpi-header"><span class="kpi-label">Audit Events (7d)</span><div class="kpi-icon">${svgIcon('activity',14)}</div></div>
        <div><span class="kpi-value" id="adminKpi4">0</span></div>
        <span class="kpi-change flat">Last: 2h ago</span>
      </div>
    </div>

    <div class="tabs">
      ${[['users','Users'],['datasets','Datasets'],['model','Model Monitor'],['audit','Audit Log']].map(([k, l]) => `
        <button class="tab-btn${S.adminTab === k ? ' active' : ''}" data-admin-tab="${k}">${l}</button>
      `).join('')}
    </div>

    <div id="adminTabContent"></div>
  `;

  requestAnimationFrame(() => {
    animateCounter(document.getElementById('adminKpi1'), DB.users.length, 0);
    animateCounter(document.getElementById('adminKpi2'), DB.datasets.length, 0);
    animateCounter(document.getElementById('adminKpi4'), DB.auditLogs.length, 0);
  });

  cont.addEventListener('click', e => {
    const tabBtn = e.target.closest('[data-admin-tab]');
    if (tabBtn) {
      S.adminTab = tabBtn.dataset.adminTab;
      $$('.tab-btn').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      renderAdminTab(S.adminTab);
    }
  });

  renderAdminTab(S.adminTab);
}

function renderAdminTab(tab) {
  const cont = document.getElementById('adminTabContent');
  if (!cont) return;

  if (tab === 'users') {
    cont.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">User Management</div>
          <button class="btn btn-primary btn-sm" id="addUserBtn">${svgIcon('plus',13)} Add User</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Assigned Farms</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              ${DB.users.map(u => {
                const roleBadge = { Farmer:'green', 'Farm Manager':'blue', Researcher:'purple', Agronomist:'amber', Administrator:'red' }[u.role] || 'gray';
                const assignedFarms = u.farms.map(fid => DB.farms.find(f => f.id === fid)?.name).filter(Boolean).join(', ') || 'All (system)';
                return `<tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:.65rem">
                      <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--green-500),var(--blue-500));display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:white">${u.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
                      <strong>${u.name}</strong>
                    </div>
                  </td>
                  <td class="text-secondary">${u.email}</td>
                  <td><span class="badge badge-${roleBadge}">${u.role}</span></td>
                  <td class="text-secondary text-sm">${assignedFarms}</td>
                  <td class="text-muted text-sm">${u.lastLogin}</td>
                  <td><span class="badge badge-${u.status === 'active' ? 'green' : 'gray'}">${u.status}</span></td>
                  <td>
                    <div style="display:flex;gap:.35rem">
                      <button class="btn btn-secondary btn-sm" onclick="showToast('Edit feature coming soon','info')">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="showToast('Access revoked for ${u.name.split(' ')[0]}','warning')">Revoke</button>
                    </div>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    document.getElementById('addUserBtn')?.addEventListener('click', showAddUserModal);
  }

  else if (tab === 'datasets') {
    cont.innerHTML = `
      <div class="card">
        <div class="card-header"><div class="card-title">Dataset Management</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Dataset</th><th>Farm</th><th>Rows</th><th>Status</th><th>Errors</th><th>Uploaded By</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              ${DB.datasets.map(ds => {
                const farm = DB.farms.find(f => f.id === ds.farmId);
                const uploader = DB.users.find(u => u.id === ds.uploadedBy);
                return `<tr>
                  <td><strong>${ds.name}</strong></td>
                  <td>${farm?.name || '—'}</td>
                  <td>${ds.rows}</td>
                  <td><span class="badge badge-${ds.status === 'Imported' ? 'green' : 'amber'}">${ds.status}</span></td>
                  <td>${ds.errors > 0 ? `<span class="badge badge-red">${ds.errors} error(s)</span>` : '<span class="badge badge-green">None</span>'}</td>
                  <td class="text-secondary">${uploader?.name || '—'}</td>
                  <td class="text-muted">${ds.date}</td>
                  <td>
                    <div style="display:flex;gap:.35rem">
                      <button class="btn btn-secondary btn-sm" onclick="showToast('Viewing validation report…','info')">View Errors</button>
                      ${ds.status === 'Processing' ? `<button class="btn btn-outline btn-sm" onclick="showToast('Dataset reprocessing started','success')">Reprocess</button>` : ''}
                    </div>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  else if (tab === 'model') {
    const cur = DB.modelMetrics.current;
    cont.innerHTML = `
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div><div class="card-title">Model Monitoring</div><div class="card-subtitle">Real-time accuracy and drift indicators</div></div>
            <span class="badge badge-green">No Alerts</span>
          </div>
          <div class="chart-wrap"><canvas id="adminMaeChart"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Performance Indicators</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:1rem">
            ${[['Prediction Accuracy (R²)','0.87','87%','green'],['Data Drift Score','0.04','Low','green'],['Feature Drift','0.08','Moderate','amber'],['Prediction Coverage','100%','All farms','green'],['Alert Threshold (MAE)','0.40','Not breached','green']].map(([label, val, status, color]) => `
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:.35rem">
                  <span class="text-sm">${label}</span>
                  <span class="font-semi text-sm text-${color}">${status}</span>
                </div>
                <div class="trend-bar">
                  <div class="trend-bar-fill trend-${color === 'amber' ? 'flat' : 'up'}" style="width:${Math.min(100, parseFloat(val) * 100)}%"></div>
                </div>
              </div>
            `).join('')}
            <div style="display:flex;gap:.5rem;margin-top:.5rem">
              <button class="btn btn-outline btn-sm" onclick="showToast('Retraining scheduled for tonight 02:00 UTC','info')">Schedule Retrain</button>
              <button class="btn btn-danger btn-sm" onclick="showToast('Rollback would revert to v2.3.0 — confirm?','warning')">Rollback to v2.3.0</button>
            </div>
          </div>
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      const ctx = document.getElementById('adminMaeChart');
      if (!ctx) return;
      if (S.charts.adminMae) { S.charts.adminMae.destroy(); }
      S.charts.adminMae = new Chart(ctx, {
        type: 'line',
        data: {
          labels: DB.modelMetrics.maeTrend.map(m => m.label),
          datasets: [
            {
              label: 'MAE', data: DB.modelMetrics.maeTrend.map(m => m.val),
              borderColor:'hsl(142,65%,52%)', backgroundColor:'hsla(142,65%,52%,.12)',
              fill:true, tension:0.4, borderWidth:2.5, pointRadius:4,
            },
            {
              label: 'Alert Threshold', data: Array(8).fill(0.40),
              borderColor:'hsl(0,72%,55%)', borderDash:[6,4], pointRadius:0, borderWidth:1.5,
              backgroundColor:'transparent',
            },
          ],
        },
        options: {
          responsive:true, maintainAspectRatio:true,
          plugins:{ legend:{ position:'top' } },
          scales:{
            x:{ grid:{ color:'rgba(255,255,255,0.05)' } },
            y:{ grid:{ color:'rgba(255,255,255,0.05)' }, min:0.2, max:0.45, title:{ display:true, text:'MAE', color:'#64748b' } },
          },
        },
      });
    });
  }

  else if (tab === 'audit') {
    const actionColors = { LOGIN:'blue', CREATE_USER:'green', UPLOAD_DATASET:'green', VIEW_PREDICTION:'gray', MODIFY_PERMISSIONS:'amber', EXPORT_REPORT:'purple', EXPORT_DATASET:'purple', EDIT_FARM:'amber' };
    cont.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">Audit Log</div><div class="card-subtitle">All platform actions are traceable for compliance review</div></div>
          <button class="btn btn-secondary btn-sm">${svgIcon('download',13)} Export Log</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Target</th><th>IP Address</th></tr></thead>
            <tbody>
              ${DB.auditLogs.map(l => {
                const user = DB.users.find(u => u.id === l.userId);
                return `<tr>
                  <td class="text-muted text-sm">${fmtDate(l.ts)}</td>
                  <td>
                    <div class="flex gap-2 items-center">
                      <div style="width:22px;height:22px;border-radius:50%;background:var(--bg-card2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700">${user?.name.charAt(0) || '?'}</div>
                      <span class="text-sm">${user?.name || l.userId}</span>
                    </div>
                  </td>
                  <td><span class="badge badge-${actionColors[l.action] || 'gray'}">${l.action.replace(/_/g, ' ')}</span></td>
                  <td class="text-cell text-sm">${l.target}</td>
                  <td class="text-muted text-xs">${l.ip}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="card-footer">All entries are immutable. No record has been flagged for compliance violations in the last 30 days.</div>
      </div>
    `;
  }
}

function showAddUserModal() {
  const ov = document.createElement('div');
  ov.className = 'modal-overlay';
  ov.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">${svgIcon('plus',14)} Add New User</span>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">${svgIcon('x',14)}</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input class="form-input" id="newUserName" placeholder="e.g. Arjun Mehta" />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input class="form-input" type="email" id="newUserEmail" placeholder="user@example.com" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Role</label>
          <select class="form-select" id="newUserRole">
            <option>Farmer</option><option>Farm Manager</option><option>Researcher</option><option>Agronomist</option><option>Administrator</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Assign Farms</label>
          <div style="display:flex;flex-direction:column;gap:.35rem">
            ${DB.farms.map(f => `
              <label style="display:flex;align-items:center;gap:.5rem;font-size:.85rem;cursor:pointer">
                <input type="checkbox" style="accent-color:var(--green-500)" /> ${f.name} (${f.location})
              </label>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" id="saveUserBtn">${svgIcon('check',14)} Create User</button>
      </div>
    </div>
  `;
  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  document.getElementById('saveUserBtn').addEventListener('click', () => {
    const name = document.getElementById('newUserName').value.trim();
    if (!name) { showToast('Name is required', 'error'); return; }
    const newUser = {
      id: 'ux' + Date.now(),
      name, email: document.getElementById('newUserEmail').value,
      role: document.getElementById('newUserRole').value,
      farms: [], status: 'active', lastLogin: '—',
    };
    newUser.password = 'demo1234';
    DB.users.push(newUser);
    recordAudit('CREATE_USER', name, S.user?.id || 'u5');
    ov.remove();
    showToast(`${name} account created and audit logged!`, 'success');
    renderAdminTab('users');
  });
}

/* ──────────────────────────────────────────────────────────────
   INITIALISE
────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadDatabase();
  setupChartDefaults();
  renderAuth();
});

