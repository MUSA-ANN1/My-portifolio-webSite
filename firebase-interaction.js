// ============================================
// FIREBASE INTERACTION MODULE
// ============================================
import { initializeApp } from "./firebase-app.js";
import { getDatabase, ref, runTransaction, onValue, get } from "./firebase-database.js";

const _d = atob;
const firebaseConfig = {
    apiKey: _d("QUl6YVN5QWlPVXZQQjZjSkt1ZHRXYzdQX2RlYmVCbjJHcnlYVXBv"),
    authDomain: _d("bXktcG9ydGlmb2xpby13ZWJzaXRlLXByb2plY3QuZmlyZWJhc2VhcHAuY29t"),
    databaseURL: _d("aHR0cHM6Ly9teS1wb3J0aWZvbGlvLXdlYnNpdGUtcHJvamVjdC1kZWZhdWx0LXJ0ZGIuZmlyZWJhc2Vpby5jb20="),
    projectId: _d("bXktcG9ydGlmb2xpby13ZWJzaXRlLXByb2plY3Q="),
    storageBucket: _d("bXktcG9ydGlmb2xpby13ZWJzaXRlLXByb2plY3QuZmlyZWJhc2VzdG9yYWdlLmFwcA=="),
    messagingSenderId: _d("OTcwNDY1MzU2NDMz"),
    appId: _d("MTo5NzA0NjUzNTY0MzM6d2ViOjdjYjU2MTkwMzEyOTRkMTIxMjZkMzA="),
    measurementId: _d("Ry1RMUcxR05XMVpW")
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const viewsRef = ref(db, 'stats/site_views');
const likesRef = ref(db, 'stats/site_likes');
const usersOffsetRef = ref(db, 'stats/active_users_offset');

// Today's date string
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const dailyViewsRef = ref(db, `stats/daily/${today}/views`);
const dailyLikesRef = ref(db, `stats/daily/${today}/likes`);

// 1. AUTO-INCREMENT VIEW COUNTER (ONLY ON FIRST VISIT)
const isLocal = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1'
].some(h => window.location.hostname.includes(h)) || window.location.protocol === 'file:';

const isFirstVisitKey = 'portfolio-visited-before';

if (!isLocal && !localStorage.getItem(isFirstVisitKey)) {
    window.addEventListener('load', () => {
        // Double check within the callback for race conditions
        if (localStorage.getItem(isFirstVisitKey)) return;

        // Mark as visited IMMEDIATELY to prevent double firing on split-second loads
        localStorage.setItem(isFirstVisitKey, 'true');

        runTransaction(viewsRef, (c) => (c || 0) + 1);
        runTransaction(dailyViewsRef, (c) => (c || 0) + 1);
    });
}

// 2. REAL-TIME LISTENERS
onValue(viewsRef, (snap) => {
    const el = document.getElementById('view-count');
    if (el) el.textContent = snap.val() || 0;
});

onValue(likesRef, (snap) => {
    const el = document.getElementById('like-count');
    if (el) el.textContent = snap.val() || 0;
});

onValue(usersOffsetRef, (snap) => {
    const el = document.getElementById('stat-users-val');
    if (el) el.textContent = (snap.val() || 370) + "+";
});

// 3. LIKE BUTTON
const likeBtn = document.getElementById('like-btn');
const heartIcon = document.getElementById('heart-icon-svg');

if (localStorage.getItem('hasLiked')) {
    if (likeBtn) likeBtn.classList.add('liked');
    if (heartIcon) heartIcon.setAttribute('fill', 'currentColor');
}

if (likeBtn) {
    likeBtn.addEventListener('click', () => {
        if (localStorage.getItem('hasLiked')) {
            likeBtn.style.animation = 'shake 0.4s';
            setTimeout(() => likeBtn.style.animation = '', 400);
            return;
        }
        runTransaction(likesRef, (c) => (c || 0) + 1);
        runTransaction(dailyLikesRef, (c) => (c || 0) + 1);
        localStorage.setItem('hasLiked', 'true');
        likeBtn.classList.add('liked');
        if (heartIcon) heartIcon.setAttribute('fill', 'currentColor');
        likeBtn.style.transform = 'scale(1.2)';
        setTimeout(() => likeBtn.style.transform = '', 200);
    });
}

// ============================================
// 4. STATISTICS CHART
// ============================================
const seeStatsBtn = document.getElementById('see-stats-btn');
const wrapper = document.getElementById('reviews-wrapper');
const canvas = document.getElementById('stats-chart');
const tooltip = document.getElementById('chart-tooltip');
const legendViews = document.querySelector('.legend-views');
const legendLikes = document.querySelector('.legend-likes');

let chartData = []; // [{date, views, likes}, ...]
let scrollOffset = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartOffset = 0;
let hoveredStat = null; // 'views', 'likes', or null

// Legend Hover Interactions
if (legendViews) {
    legendViews.addEventListener('mouseenter', () => { hoveredStat = 'views'; drawChart(); });
    legendViews.addEventListener('mouseleave', () => { hoveredStat = null; drawChart(); });
}
if (legendLikes) {
    legendLikes.addEventListener('mouseenter', () => { hoveredStat = 'likes'; drawChart(); });
    legendLikes.addEventListener('mouseleave', () => { hoveredStat = null; drawChart(); });
}

// Toggle stats panel
if (seeStatsBtn) {
    seeStatsBtn.addEventListener('click', () => {
        const isExpanded = wrapper.classList.toggle('expanded');
        seeStatsBtn.classList.toggle('active', isExpanded);
        if (isExpanded) {
            loadDailyStats();
        }
    });
}

// Load daily stats from Firebase
async function loadDailyStats() {
    const dailyRef = ref(db, 'stats/daily');
    try {
        const snap = await get(dailyRef);
        const data = snap.val();

        chartData = [];
        if (data) {
            // Sort by date string (YYYY-MM-DD)
            const dates = Object.keys(data).sort();
            for (const d of dates) {
                chartData.push({
                    date: d,
                    views: data[d].views || 0,
                    likes: data[d].likes || 0
                });
            }
        }

        // Ensure there's at least one data point to avoid error
        if (chartData.length === 0) {
            // Optional: Show current state if no daily history yet
            // chartData.push({date: today, views: 0, likes: 0});
        }

        // Default scroll to show most recent data
        scrollOffset = Math.max(0, chartData.length - getVisibleCount());
        drawChart();
    } catch (err) {
        console.error("Failed to load daily stats:", err);
    }
}

function getVisibleCount() {
    if (!canvas) return 10;
    return Math.floor(canvas.clientWidth / 60);
}

function drawChart() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    // Theming
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
    const viewsColor = '#6366f1';
    const likesColor = '#c41e3a';

    ctx.clearRect(0, 0, W, H);

    const visCount = getVisibleCount();
    const startIdx = Math.max(0, Math.round(scrollOffset));
    const endIdx = Math.min(chartData.length, startIdx + visCount);
    const visible = chartData.slice(startIdx, endIdx);

    if (visible.length === 0) {
        ctx.fillStyle = textColor;
        ctx.font = '14px Space Grotesk, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No data yet', W / 2, H / 2);
        return;
    }

    const padL = 45, padR = 20, padT = 20, padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    // Find max Y
    let rawMax = 1;
    visible.forEach(d => { rawMax = Math.max(rawMax, d.views, d.likes); });

    // Ensure maxY is at least 4 (gridLines) and a multiple of gridLines 
    // to keep Y labels as clean integers (0, 1, 2, 3, 4 vs 0, 0.5, 1, 1.5, 2)
    const gridLines = 4;
    let maxY = Math.ceil(rawMax / gridLines) * gridLines;
    if (maxY < gridLines) maxY = gridLines;

    const stepX = visible.length > 1 ? chartW / (visible.length - 1) : chartW;

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridLines; i++) {
        const y = padT + (chartH / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(W - padR, y);
        ctx.stroke();

        // Y labels
        ctx.fillStyle = textColor;
        ctx.font = '11px Space Grotesk, sans-serif';
        ctx.textAlign = 'right';
        const val = Math.round(maxY - (maxY / gridLines) * i);
        ctx.fillText(val, padL - 8, y + 4);
    }

    // X labels
    ctx.fillStyle = textColor;
    ctx.font = '10px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    const labelInterval = Math.max(1, Math.floor(visible.length / 6));
    visible.forEach((d, i) => {
        if (i % labelInterval === 0 || i === visible.length - 1) {
            const x = padL + i * stepX;
            const parts = d.date.split('-');
            const label = `${parseInt(parts[1])}/${parseInt(parts[2])}`;
            ctx.fillText(label, x, H - 8);
        }
    });

    // Draw line helper
    function drawLine(data, key, color) {
        // Handle filter hover
        let opacity = 1.0;
        if (hoveredStat && hoveredStat !== key) opacity = 0.1;
        ctx.globalAlpha = opacity;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        data.forEach((d, i) => {
            const x = padL + i * stepX;
            const y = padT + chartH - (d[key] / maxY) * chartH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Area fill
        ctx.beginPath();
        data.forEach((d, i) => {
            const x = padL + i * stepX;
            const y = padT + chartH - (d[key] / maxY) * chartH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.lineTo(padL + (data.length - 1) * stepX, padT + chartH);
        ctx.lineTo(padL, padT + chartH);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
        grad.addColorStop(0, color + '30');
        grad.addColorStop(1, color + '05');
        ctx.fillStyle = grad;
        ctx.fill();

        // Points
        data.forEach((d, i) => {
            const x = padL + i * stepX;
            const y = padT + chartH - (d[key] / maxY) * chartH;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        });

        ctx.globalAlpha = 1.0;
    }

    drawLine(visible, 'views', viewsColor);
    drawLine(visible, 'likes', likesColor);

    // Store for hover
    canvas._chartMeta = { visible, padL, padT, chartW, chartH, stepX, maxY, startIdx };
}

// Tooltip on hover
if (canvas) {
    canvas.addEventListener('mousemove', (e) => {
        const meta = canvas._chartMeta;
        if (!meta || meta.visible.length === 0) { tooltip.style.display = 'none'; return; }
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const idx = Math.round((mx - meta.padL) / meta.stepX);
        if (idx >= 0 && idx < meta.visible.length) {
            const d = meta.visible[idx];
            const dateObj = new Date(d.date + 'T00:00:00');
            const formatted = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });

            tooltip.innerHTML = `
                <div style="font-weight:600;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:2px;">${formatted}</div>
                <div style="color:#6366f1;">${d.views}</div>
                <div style="color:#c41e3a;">${d.likes}</div>
            `;
            tooltip.style.display = 'block';
            // Position
            let tx = mx + 15;
            let ty = my - 10;
            if (tx + 180 > rect.width) tx = mx - 180;
            if (ty < 0) ty = 10;
            tooltip.style.left = tx + 'px';
            tooltip.style.top = ty + 'px';
        } else {
            tooltip.style.display = 'none';
        }
    });
    canvas.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

    // Drag to scroll
    function startDrag(x) {
        isDragging = true;
        dragStartX = x;
        dragStartOffset = scrollOffset;
    }
    function moveDrag(x) {
        if (!isDragging) return;
        const delta = (dragStartX - x) / 60;
        scrollOffset = Math.max(0, Math.min(chartData.length - getVisibleCount(), dragStartOffset + delta));
        drawChart();
    }
    function endDrag() { isDragging = false; }

    canvas.addEventListener('mousedown', (e) => startDrag(e.clientX));
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
    window.addEventListener('mouseup', endDrag);

    // Touch support
    canvas.addEventListener('touchstart', (e) => { startDrag(e.touches[0].clientX); }, { passive: true });
    canvas.addEventListener('touchmove', (e) => { moveDrag(e.touches[0].clientX); }, { passive: true });
    canvas.addEventListener('touchend', endDrag);
}

// Redraw on resize
window.addEventListener('resize', () => {
    if (wrapper && wrapper.classList.contains('expanded')) drawChart();
});

// Redraw on theme change (observer)
const themeObs = new MutationObserver(() => {
    if (wrapper && wrapper.classList.contains('expanded')) drawChart();
});
themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
