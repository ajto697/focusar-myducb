console.log('[FocusAR Content Script] Loaded on page.');

const DISTRACTOR_DOMAINS = ['facebook.com', 'tiktok.com', 'youtube.com', 'instagram.com'];

const currentHost = window.location.hostname.replace('www.', '');
const isDistractor = DISTRACTOR_DOMAINS.some((d) => currentHost.includes(d));

if (isDistractor) {
  // Inject subtle top banner reminder
  const banner = document.createElement('div');
  banner.id = 'focus-ar-guardian-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, #064e3b, #059669);
    color: #ffffff;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 16px;
    text-align: center;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  `;

  banner.innerHTML = `
    <span>🌱 <strong>FocusAR Guardian:</strong> Bạn đang trong giờ học! Chỉ cần 2 phút tập trung thôi nào.</span>
    <a href="http://localhost:3000/focus" target="_blank" style="background: #ffffff; color: #064e3b; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 800;">Quay Lại Học Ngay</a>
  `;

  document.body.appendChild(banner);
}
