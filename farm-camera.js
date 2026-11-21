/* ============================================================
   LIVE FARM CAMERA — Browser person detection + live graph
   TensorFlow.js + COCO-SSD + Chart.js
   ============================================================ */

'use strict';

const FARM_CAMERA = {
  stream: null,
  model: null,
  active: false,
  loadingModel: false,
  facingMode: 'environment',
  timer: null,
  history: [],
  events: [],
  currentCount: 0,
  previousCount: 0,
  peakCount: 0,
  entered: 0,
  exited: 0,
  samples: 0,
  totalCount: 0,
  threshold: 0.50,
  label: 'Farmer',
  lastSampleAt: 0,
};

function renderLiveCamera() {
  const cont = document.getElementById('pageContent');
  if (!cont) return;

  cont.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Live Farm Camera</h1>
        <p class="page-desc">Detect people in the farm camera and display live farmer-count activity as a graph.</p>
      </div>
      <div class="page-actions camera-page-actions">
        <button class="btn btn-secondary btn-sm" id="cameraFullscreenBtn">⛶ Full Screen</button>
        <button class="btn btn-secondary btn-sm" id="cameraSwitchBtn">↻ Switch Camera</button>
        <button class="btn btn-primary btn-sm" id="cameraStartBtn">▶ Start Camera</button>
        <button class="btn btn-danger btn-sm" id="cameraStopBtn" disabled>■ Stop Camera</button>
      </div>
    </div>

    <div class="camera-notice">
      <span>ℹ️</span>
      <div><strong>Detection note:</strong> the AI model detects the visual class <b>person</b>. It cannot reliably determine somebody's occupation from appearance. Choose the monitoring label below (Farmer, Farm Worker, Supervisor, etc.); detected people will be counted under that selected label.</div>
    </div>

    <div class="camera-kpi-grid">
      <div class="kpi-card green">
        <div class="kpi-header"><span class="kpi-label">Current on Camera</span><div class="kpi-icon">👨‍🌾</div></div>
        <div><span class="kpi-value" id="cameraCurrentCount">0</span><span class="kpi-unit" id="cameraCurrentUnit">farmers</span></div>
        <span class="kpi-change flat" id="cameraStatusText">Camera stopped</span>
      </div>
      <div class="kpi-card blue">
        <div class="kpi-header"><span class="kpi-label">Peak Count</span><div class="kpi-icon">📈</div></div>
        <div><span class="kpi-value" id="cameraPeakCount">0</span><span class="kpi-unit">people</span></div>
        <span class="kpi-change flat">Highest simultaneous detection</span>
      </div>
      <div class="kpi-card amber">
        <div class="kpi-header"><span class="kpi-label">Approx. Entered</span><div class="kpi-icon">↘</div></div>
        <div><span class="kpi-value" id="cameraEnteredCount">0</span></div>
        <span class="kpi-change flat">Estimated from count increases</span>
      </div>
      <div class="kpi-card purple">
        <div class="kpi-header"><span class="kpi-label">Approx. Left</span><div class="kpi-icon">↗</div></div>
        <div><span class="kpi-value" id="cameraExitedCount">0</span></div>
        <span class="kpi-change flat">Estimated from count decreases</span>
      </div>
    </div>

    <div class="camera-layout">
      <section class="card camera-card">
        <div class="card-header camera-card-header">
          <div>
            <div class="card-title">Live Detection</div>
            <div class="card-subtitle">Bounding boxes are drawn around detected people.</div>
          </div>
          <div class="camera-controls-inline">
            <label class="camera-control-label">Monitoring type
              <select class="form-select camera-select" id="cameraRoleSelect">
                <option>Farmer</option>
                <option>Farm Worker</option>
                <option>Field Supervisor</option>
                <option>Visitor</option>
                <option>Person</option>
              </select>
            </label>
            <label class="camera-control-label">Confidence
              <select class="form-select camera-select" id="cameraThresholdSelect">
                <option value="0.40">40%</option>
                <option value="0.50" selected>50%</option>
                <option value="0.60">60%</option>
                <option value="0.70">70%</option>
              </select>
            </label>
          </div>
        </div>

        <div class="farm-camera-stage" id="farmCameraStage">
          <video id="farmCameraVideo" autoplay muted playsinline></video>
          <canvas id="farmCameraCanvas"></canvas>
          <div class="camera-placeholder" id="cameraPlaceholder">
            <div class="camera-placeholder-icon">📷</div>
            <strong>Camera is off</strong>
            <span>Click “Start Camera” and allow camera permission.</span>
          </div>
          <div class="camera-live-badge" id="cameraLiveBadge"><span></span> LIVE</div>
          <div class="camera-ai-badge" id="cameraAiBadge">AI: waiting</div>
          <div class="camera-count-overlay">
            <span id="cameraOverlayLabel">Farmer</span>
            <strong id="cameraOverlayCount">0</strong>
          </div>
        </div>

        <div class="camera-help-row">
          <span>🔒 Video stays in this browser for detection; this page does not upload camera frames.</span>
          <span>Camera access normally requires <b>localhost</b> or <b>HTTPS</b>.</span>
        </div>
      </section>

      <section class="card camera-events-card">
        <div class="card-header">
          <div>
            <div class="card-title">Live Activity</div>
            <div class="card-subtitle">Recent count changes</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="cameraClearEventsBtn">Clear</button>
        </div>
        <div class="camera-event-list" id="cameraEventList">
          <div class="camera-event-empty">Start the camera to see activity.</div>
        </div>
      </section>
    </div>

    <div class="card camera-chart-card">
      <div class="card-header">
        <div>
          <div class="card-title"><span id="cameraChartRole">Farmer</span> Count Graph</div>
          <div class="card-subtitle">Live people detected in the camera over time. The graph keeps the latest 60 samples.</div>
        </div>
        <div class="camera-chart-summary">
          <span>Average: <b id="cameraAverageCount">0.0</b></span>
          <button class="btn btn-secondary btn-sm" id="cameraClearGraphBtn">Clear Graph</button>
        </div>
      </div>
      <div class="chart-wrap tall"><canvas id="cameraCountChart"></canvas></div>
    </div>
  `;

  bindFarmCameraEvents();
  initFarmCameraChart();
  updateFarmCameraUi();
}

function bindFarmCameraEvents() {
  document.getElementById('cameraStartBtn')?.addEventListener('click', startFarmCamera);
  document.getElementById('cameraStopBtn')?.addEventListener('click', () => stopFarmCamera(false));
  document.getElementById('cameraSwitchBtn')?.addEventListener('click', switchFarmCamera);
  document.getElementById('cameraFullscreenBtn')?.addEventListener('click', toggleFarmCameraFullscreen);
  document.getElementById('cameraClearGraphBtn')?.addEventListener('click', clearFarmCameraGraph);
  document.getElementById('cameraClearEventsBtn')?.addEventListener('click', clearFarmCameraEvents);

  document.getElementById('cameraRoleSelect')?.addEventListener('change', e => {
    FARM_CAMERA.label = e.target.value;
    updateFarmCameraUi();
    const chart = S.charts.cameraCount;
    if (chart) {
      chart.data.datasets[0].label = `${FARM_CAMERA.label} count`;
      chart.update('none');
    }
  });

  document.getElementById('cameraThresholdSelect')?.addEventListener('change', e => {
    FARM_CAMERA.threshold = Number(e.target.value) || 0.5;
    showToast(`Detection confidence set to ${Math.round(FARM_CAMERA.threshold * 100)}%`, 'info');
  });
}

function initFarmCameraChart() {
  const ctx = document.getElementById('cameraCountChart');
  if (!ctx) return;
  S.charts.cameraCount = new Chart(ctx, {
    type: 'line',
    data: {
      labels: FARM_CAMERA.history.map(x => x.time),
      datasets: [{
        label: `${FARM_CAMERA.label} count`,
        data: FARM_CAMERA.history.map(x => x.count),
        borderColor: 'hsl(142,65%,52%)',
        backgroundColor: 'hsla(142,65%,52%,.14)',
        fill: true,
        tension: 0.28,
        borderWidth: 2.5,
        pointRadius: 2,
        pointHoverRadius: 5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: false,
      plugins: { legend: { display: true, position: 'top' } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { maxTicksLimit: 10 } },
        y: {
          beginAtZero: true,
          suggestedMax: 5,
          ticks: { precision: 0, stepSize: 1 },
          grid: { color: 'rgba(255,255,255,0.06)' },
          title: { display: true, text: 'People detected', color: '#64748b' },
        },
      },
    },
  });
}

async function loadFarmCameraModel() {
  if (FARM_CAMERA.model) return FARM_CAMERA.model;
  if (FARM_CAMERA.loadingModel) {
    while (FARM_CAMERA.loadingModel) await new Promise(r => setTimeout(r, 100));
    return FARM_CAMERA.model;
  }

  FARM_CAMERA.loadingModel = true;
  setFarmCameraStatus('Loading AI model…', 'loading');
  try {
    if (typeof cocoSsd === 'undefined') {
      throw new Error('COCO-SSD library did not load. Check the internet connection.');
    }
    FARM_CAMERA.model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
    setFarmCameraStatus('AI ready', 'ready');
    return FARM_CAMERA.model;
  } finally {
    FARM_CAMERA.loadingModel = false;
  }
}

async function startFarmCamera() {
  if (FARM_CAMERA.active) return;
  const startBtn = document.getElementById('cameraStartBtn');
  if (startBtn) startBtn.disabled = true;

  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Camera API is not supported in this browser. Open the project on localhost or HTTPS.');
    }

    setFarmCameraStatus('Preparing AI…', 'loading');
    await loadFarmCameraModel();

    FARM_CAMERA.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: FARM_CAMERA.facingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });

    const video = document.getElementById('farmCameraVideo');
    if (!video) throw new Error('Camera preview is unavailable.');
    video.srcObject = FARM_CAMERA.stream;
    await video.play();

    FARM_CAMERA.active = true;
    FARM_CAMERA.previousCount = 0;
    document.getElementById('cameraPlaceholder')?.classList.add('hidden');
    document.getElementById('cameraLiveBadge')?.classList.add('visible');
    if (document.getElementById('cameraStopBtn')) document.getElementById('cameraStopBtn').disabled = false;
    setFarmCameraStatus('Detecting people…', 'live');
    addFarmCameraEvent('Camera started', 'info');
    showToast('Live farm camera started.', 'success');

    runFarmCameraDetection();
  } catch (err) {
    console.error('Farm camera start failed:', err);
    stopFarmCamera(true);
    const message = err?.name === 'NotAllowedError'
      ? 'Camera permission was blocked. Allow camera access in your browser and try again.'
      : (err?.message || 'Unable to start the camera.');
    setFarmCameraStatus('Camera unavailable', 'error');
    showToast(message, 'error');
  } finally {
    if (startBtn) startBtn.disabled = FARM_CAMERA.active;
  }
}

function stopFarmCamera(silent = false) {
  FARM_CAMERA.active = false;
  if (FARM_CAMERA.timer) {
    clearTimeout(FARM_CAMERA.timer);
    FARM_CAMERA.timer = null;
  }

  if (FARM_CAMERA.stream) {
    FARM_CAMERA.stream.getTracks().forEach(track => track.stop());
    FARM_CAMERA.stream = null;
  }

  const video = document.getElementById('farmCameraVideo');
  if (video) video.srcObject = null;
  clearFarmCameraCanvas();

  const placeholder = document.getElementById('cameraPlaceholder');
  if (placeholder) placeholder.classList.remove('hidden');
  document.getElementById('cameraLiveBadge')?.classList.remove('visible');

  const startBtn = document.getElementById('cameraStartBtn');
  const stopBtn = document.getElementById('cameraStopBtn');
  if (startBtn) startBtn.disabled = false;
  if (stopBtn) stopBtn.disabled = true;

  FARM_CAMERA.currentCount = 0;
  FARM_CAMERA.previousCount = 0;
  updateFarmCameraUi();
  if (!silent) {
    setFarmCameraStatus('Camera stopped', 'idle');
    addFarmCameraEvent('Camera stopped', 'info');
    showToast('Camera stopped.', 'info');
  }
}

async function switchFarmCamera() {
  FARM_CAMERA.facingMode = FARM_CAMERA.facingMode === 'environment' ? 'user' : 'environment';
  const shouldRestart = FARM_CAMERA.active;
  if (shouldRestart) {
    stopFarmCamera(true);
    await startFarmCamera();
  } else {
    showToast(`Camera set to ${FARM_CAMERA.facingMode === 'environment' ? 'back' : 'front'} camera.`, 'info');
  }
}

async function toggleFarmCameraFullscreen() {
  const stage = document.getElementById('farmCameraStage');
  if (!stage) return;
  try {
    if (!document.fullscreenElement) await stage.requestFullscreen();
    else await document.exitFullscreen();
  } catch (err) {
    showToast('Full-screen mode is not available in this browser.', 'warning');
  }
}

async function runFarmCameraDetection() {
  if (!FARM_CAMERA.active) return;
  const video = document.getElementById('farmCameraVideo');
  if (!video || video.readyState < 2 || !FARM_CAMERA.model) {
    FARM_CAMERA.timer = setTimeout(runFarmCameraDetection, 250);
    return;
  }

  try {
    const predictions = await FARM_CAMERA.model.detect(video, 20, FARM_CAMERA.threshold);
    if (!FARM_CAMERA.active) return;
    const people = predictions.filter(p => p.class === 'person' && p.score >= FARM_CAMERA.threshold);
    drawFarmCameraPredictions(video, people);
    handleFarmCameraCount(people.length, people);
    setFarmCameraStatus(people.length ? `${people.length} detected` : 'No person detected', 'live');
  } catch (err) {
    console.error('Detection error:', err);
    setFarmCameraStatus('Detection retrying…', 'warning');
  }

  if (FARM_CAMERA.active) FARM_CAMERA.timer = setTimeout(runFarmCameraDetection, 450);
}

function drawFarmCameraPredictions(video, people) {
  const canvas = document.getElementById('farmCameraCanvas');
  if (!canvas) return;
  const displayWidth = video.videoWidth || 1280;
  const displayHeight = video.videoHeight || 720;
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = Math.max(3, canvas.width / 320);
  ctx.font = `${Math.max(18, Math.round(canvas.width / 42))}px Inter, sans-serif`;
  ctx.textBaseline = 'top';

  people.forEach((prediction, index) => {
    const [x, y, width, height] = prediction.bbox;
    const label = `${FARM_CAMERA.label} ${index + 1} · ${Math.round(prediction.score * 100)}%`;
    const textWidth = ctx.measureText(label).width;
    const textHeight = Math.max(26, canvas.height / 28);

    ctx.strokeStyle = '#39d98a';
    ctx.fillStyle = 'rgba(57,217,138,0.12)';
    ctx.strokeRect(x, y, width, height);
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = '#0b1f16';
    ctx.fillRect(x, Math.max(0, y - textHeight), textWidth + 18, textHeight);
    ctx.fillStyle = '#7fffc2';
    ctx.fillText(label, x + 8, Math.max(2, y - textHeight + 3));
  });
}

function clearFarmCameraCanvas() {
  const canvas = document.getElementById('farmCameraCanvas');
  if (!canvas) return;
  canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
}

function handleFarmCameraCount(count, predictions = []) {
  FARM_CAMERA.currentCount = count;
  FARM_CAMERA.peakCount = Math.max(FARM_CAMERA.peakCount, count);

  if (count > FARM_CAMERA.previousCount) {
    const delta = count - FARM_CAMERA.previousCount;
    FARM_CAMERA.entered += delta;
    addFarmCameraEvent(`${delta} ${FARM_CAMERA.label.toLowerCase()}${delta > 1 ? 's' : ''} appeared`, 'enter');
  } else if (count < FARM_CAMERA.previousCount) {
    const delta = FARM_CAMERA.previousCount - count;
    FARM_CAMERA.exited += delta;
    addFarmCameraEvent(`${delta} ${FARM_CAMERA.label.toLowerCase()}${delta > 1 ? 's' : ''} left view`, 'exit');
  }
  FARM_CAMERA.previousCount = count;

  const now = Date.now();
  if (now - FARM_CAMERA.lastSampleAt >= 900) {
    FARM_CAMERA.lastSampleAt = now;
    FARM_CAMERA.samples += 1;
    FARM_CAMERA.totalCount += count;
    FARM_CAMERA.history.push({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      count,
    });
    if (FARM_CAMERA.history.length > 60) FARM_CAMERA.history.shift();
    updateFarmCameraChart();
  }

  updateFarmCameraUi(predictions);
}

function updateFarmCameraChart() {
  const chart = S.charts.cameraCount;
  if (!chart) return;
  chart.data.labels = FARM_CAMERA.history.map(x => x.time);
  chart.data.datasets[0].data = FARM_CAMERA.history.map(x => x.count);
  chart.data.datasets[0].label = `${FARM_CAMERA.label} count`;
  chart.update('none');
}

function updateFarmCameraUi(predictions = []) {
  const current = document.getElementById('cameraCurrentCount');
  const peak = document.getElementById('cameraPeakCount');
  const entered = document.getElementById('cameraEnteredCount');
  const exited = document.getElementById('cameraExitedCount');
  const overlayCount = document.getElementById('cameraOverlayCount');
  const overlayLabel = document.getElementById('cameraOverlayLabel');
  const average = document.getElementById('cameraAverageCount');
  const chartRole = document.getElementById('cameraChartRole');
  const currentUnit = document.getElementById('cameraCurrentUnit');
  const aiBadge = document.getElementById('cameraAiBadge');

  if (current) current.textContent = FARM_CAMERA.currentCount;
  if (peak) peak.textContent = FARM_CAMERA.peakCount;
  if (entered) entered.textContent = FARM_CAMERA.entered;
  if (exited) exited.textContent = FARM_CAMERA.exited;
  if (overlayCount) overlayCount.textContent = FARM_CAMERA.currentCount;
  if (overlayLabel) overlayLabel.textContent = FARM_CAMERA.label;
  if (chartRole) chartRole.textContent = FARM_CAMERA.label;
  if (currentUnit) currentUnit.textContent = FARM_CAMERA.label.toLowerCase() + (FARM_CAMERA.currentCount === 1 ? '' : 's');
  if (average) average.textContent = FARM_CAMERA.samples ? (FARM_CAMERA.totalCount / FARM_CAMERA.samples).toFixed(1) : '0.0';

  if (aiBadge) {
    if (!FARM_CAMERA.model) aiBadge.textContent = FARM_CAMERA.loadingModel ? 'AI: loading model' : 'AI: waiting';
    else if (!FARM_CAMERA.active) aiBadge.textContent = 'AI: ready';
    else if (predictions.length) {
      const best = Math.max(...predictions.map(p => p.score));
      aiBadge.textContent = `AI: person ${Math.round(best * 100)}%`;
    } else aiBadge.textContent = 'AI: scanning';
  }
}

function setFarmCameraStatus(text, state = 'idle') {
  const status = document.getElementById('cameraStatusText');
  const badge = document.getElementById('cameraAiBadge');
  if (status) {
    status.textContent = text;
    status.className = `kpi-change camera-status-${state}`;
  }
  if (badge && state === 'error') badge.textContent = 'AI: unavailable';
}

function addFarmCameraEvent(text, type = 'info') {
  const event = {
    id: Date.now() + Math.random(),
    text,
    type,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
  FARM_CAMERA.events.unshift(event);
  FARM_CAMERA.events = FARM_CAMERA.events.slice(0, 20);
  renderFarmCameraEvents();
}

function renderFarmCameraEvents() {
  const list = document.getElementById('cameraEventList');
  if (!list) return;
  if (!FARM_CAMERA.events.length) {
    list.innerHTML = '<div class="camera-event-empty">No activity events yet.</div>';
    return;
  }
  list.innerHTML = FARM_CAMERA.events.map(e => `
    <div class="camera-event-item ${e.type}">
      <span class="camera-event-icon">${e.type === 'enter' ? '↘' : e.type === 'exit' ? '↗' : '●'}</span>
      <div><strong>${e.text}</strong><span>${e.time}</span></div>
    </div>
  `).join('');
}

function clearFarmCameraEvents() {
  FARM_CAMERA.events = [];
  renderFarmCameraEvents();
}

function clearFarmCameraGraph() {
  FARM_CAMERA.history = [];
  FARM_CAMERA.currentCount = 0;
  FARM_CAMERA.previousCount = 0;
  FARM_CAMERA.peakCount = 0;
  FARM_CAMERA.entered = 0;
  FARM_CAMERA.exited = 0;
  FARM_CAMERA.samples = 0;
  FARM_CAMERA.totalCount = 0;
  updateFarmCameraChart();
  updateFarmCameraUi();
  showToast('Camera graph and counters cleared.', 'success');
}
