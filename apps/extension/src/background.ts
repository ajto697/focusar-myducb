declare const chrome: any;
import { TabEventPayload } from '@focus-ar/types';

const DISTRACTOR_DOMAINS = [
  'facebook.com',
  'tiktok.com',
  'youtube.com',
  'instagram.com',
  'reddit.com',
  'twitter.com',
  'x.com',
];

const API_ENDPOINT = 'http://localhost:4000/events/tab';

console.log('[FocusAR Extension SW] Background service worker initialized.');

// Listen for tab active switch
chrome.tabs.onActivated.addListener(async (activeInfo: any) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url) {
      checkAndSendTabEvent(tab.url, tab.title);
    }
  } catch (err) {
    console.error('[FocusAR SW] Error getting tab:', err);
  }
});

// Listen for tab URL updates
chrome.tabs.onUpdated.addListener((tabId: any, changeInfo: any, tab: any) => {
  if (changeInfo.url && tab.active) {
    checkAndSendTabEvent(changeInfo.url, tab.title);
  }
});

// Listen for Idle State
chrome.idle.onStateChanged.addListener((newState: any) => {
  console.log('[FocusAR SW] Idle state changed to:', newState);
  if (newState === 'idle' || newState === 'locked') {
    // Notify API about user idle state
    fetch('http://localhost:4000/events/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'demo-user-id',
        isPresent: false,
        confidenceScore: 1.0,
        timestamp: new Date().toISOString(),
      }),
    }).catch((err) => console.warn('Failed to send idle event:', err));
  }
});

function checkAndSendTabEvent(url: string, title?: string) {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.replace('www.', '');

    const isDistractor = DISTRACTOR_DOMAINS.some((d) => domain.includes(d));

    const payload: TabEventPayload = {
      userId: 'demo-user-id',
      url,
      domain,
      title: title || '',
      isDistractor,
      timestamp: new Date().toISOString(),
    };

    if (isDistractor) {
      console.warn('[FocusAR SW] 🚨 Distractor Domain Detected:', domain);
    }

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn('[FocusAR SW] API offline or unreachable:', err.message);
    });
  } catch {
    // Ignore non-http URLs like chrome://
  }
}
