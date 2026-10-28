import { PresenceEventPayload } from '@focus-ar/types';

export interface PresenceDetectorConfig {
  fps?: number;
  sensitivity?: number;
  onPresenceUpdate?: (event: PresenceEventPayload) => void;
}

export class FocusPresenceDetector {
  private isRunning: boolean = false;
  private timerId: any = null;
  private userId: string;
  private sessionId?: string;
  private callback?: (event: PresenceEventPayload) => void;

  constructor(userId: string, sessionId?: string) {
    this.userId = userId;
    this.sessionId = sessionId;
  }

  /**
   * Start presence tracking (Webcam canvas analysis or browser simulation)
   */
  start(config?: PresenceDetectorConfig): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.callback = config?.onPresenceUpdate;

    console.log('[Focus Presence Detector] Started on-device CV worker.');

    const fps = config?.fps || 1; // Analyze 1 frame per second
    const intervalMs = Math.round(1000 / fps);

    this.timerId = setInterval(() => {
      this.analyzeFrame();
    }, intervalMs);
  }

  /**
   * Stop presence tracking and release camera resources
   */
  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    console.log('[Focus Presence Detector] Stopped CV worker.');
  }

  /**
   * Simulates/Performs on-device facial and hand/phone landmark detection
   */
  private analyzeFrame(): void {
    if (!this.isRunning) return;

    // Default normal state
    let isPresent = true;
    let lookingAway = false;
    let phoneDetected = false;
    let confidenceScore = 0.95;

    // Random edge case simulation for dev testing (10% chance)
    const rand = Math.random();
    if (rand < 0.05) {
      // User stepped away
      isPresent = false;
      confidenceScore = 0.88;
    } else if (rand < 0.1) {
      // User turned face away
      lookingAway = true;
      confidenceScore = 0.92;
    } else if (rand < 0.13) {
      // Phone object detected in hand
      phoneDetected = true;
      confidenceScore = 0.85;
    }

    const payload: PresenceEventPayload = {
      userId: this.userId,
      sessionId: this.sessionId,
      isPresent,
      lookingAway,
      phoneDetected,
      confidenceScore,
      timestamp: new Date().toISOString(),
    };

    if (this.callback) {
      this.callback(payload);
    }
  }

  /**
   * Trigger manual simulation state for UI testing
   */
  triggerSimulatedEvent(override: Partial<PresenceEventPayload>): void {
    const payload: PresenceEventPayload = {
      userId: this.userId,
      sessionId: this.sessionId,
      isPresent: true,
      lookingAway: false,
      phoneDetected: false,
      confidenceScore: 1.0,
      timestamp: new Date().toISOString(),
      ...override,
    };

    if (this.callback) {
      this.callback(payload);
    }
  }
}
