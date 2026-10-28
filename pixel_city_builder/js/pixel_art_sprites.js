/* =============================================================
 * PIXELOPOLIS - PREMIUM THEOTOWN-GRADE PIXEL ART ENGINE v3.0
 * True 16-bit bitmap sprites, drawn pixel-by-pixel with curated
 * palettes, multi-tone shading, window frames, balconies, brick
 * textures, neon signs, rooftop HVAC, and rich isometric depth.
 * Tile size: 80x40 (larger for more visual detail)
 * ============================================================= */

class SpriteGenerator {
  constructor() {
    this.tileW = 80;
    this.tileH = 40;
    this.sprites = {};

    // Curated TheoTown-style palettes
    this.P = {
      // Grass
      G0: '#2d8a47', G1: '#38a854', G2: '#4dc96b', G3: '#69e085', G4: '#a3f0b5',
      GS0: '#1a5c2e', GS1: '#245e34',
      // Dirt / Stone
      D0: '#6b4226', D1: '#8b5e3c', D2: '#a67c52',
      // Water
      W0: '#0a4a7c', W1: '#1669b0', W2: '#2289e0', W3: '#4aa8f8', W4: '#a0d4ff',
      // Road / Asphalt
      R0: '#111827', R1: '#1f2937', R2: '#374151', R3: '#6b7280', R4: '#9ca3af',
      // White / Light
      L0: '#ffffff', L1: '#e2e8f0', L2: '#cbd5e1', L3: '#94a3b8',
      // Dark / Shadow
      S0: '#000000', S1: '#0f172a', S2: '#1e293b', S3: '#334155',
      // Brick Warm
      B0: '#7c2d12', B1: '#9a3412', B2: '#c2410c', B3: '#ea580c', B4: '#fb923c',
      // Yellow / Gold
      Y0: '#78350f', Y1: '#b45309', Y2: '#d97706', Y3: '#f59e0b', Y4: '#fbbf24', Y5: '#fde68a',
      // Blue
      BL0: '#1e3a8a', BL1: '#1d4ed8', BL2: '#2563eb', BL3: '#3b82f6', BL4: '#60a5fa', BL5: '#93c5fd',
      // Cyan / Glass
      C0: '#0e4f6e', C1: '#0284c7', C2: '#0ea5e9', C3: '#38bdf8', C4: '#7dd3fc',
      // Green accent
      GA0: '#064e3b', GA1: '#065f46', GA2: '#10b981', GA3: '#34d399',
      // Red
      RE0: '#7f1d1d', RE1: '#b91c1c', RE2: '#dc2626', RE3: '#ef4444', RE4: '#f87171',
      // Purple
      PU0: '#4c1d95', PU1: '#6d28d9', PU2: '#8b5cf6', PU3: '#a78bfa',
      // Steel / Metal
      M0: '#1e293b', M1: '#334155', M2: '#475569', M3: '#64748b', M4: '#94a3b8',
      // Neon / Night glow
      N0: '#0ff',  N1: '#0f8', N2: '#ff0', N3: '#f0f', N4: '#fa0',
      // Window glow colors
      WN0: '#fffde0', WN1: '#fff3b0', WN2: '#ffe77a', WN3: '#bfdbfe',
    };
  }

  init() {
    console.log('🎨 [Pixelopolis v3] Generating Premium 80px Isometric Sprites...');
    this.generateTerrain();
    this.generateRoads();
    this.generateUtilities();
    this.generateZones();
    this.generateCivics();
    this.generateVehicles();
    this.generateOverlays();
    console.log('✅ Premium sprites ready!');
    return this.sprites;
  }

  createCanvas(w, h) {
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas: cv, ctx };
  }

  // Place a crisp pixel block
  px(ctx, x, y, w, h, col) {
    ctx.fillStyle = col;
    ctx.fillRect(~~x, ~~y, ~~w, ~~h);
  }

  // Draw 1px dashed line (for floor stripes on buildings)
  dashedH(ctx, x, y, w, col, dash = 3, gap = 3) {
    let cx = x;
    while (cx < x + w) {
      this.px(ctx, cx, y, Math.min(dash, x + w - cx), 1, col);
      cx += dash + gap;
    }
  }

  // Bright 1px highlight rim on a rect
  rim(ctx, x, y, w, h, light, dark) {
    this.px(ctx, x, y, w, 1, light);       // top
    this.px(ctx, x, y, 1, h, light);       // left
    this.px(ctx, x + w - 1, y, 1, h, dark); // right
    this.px(ctx, x, y + h - 1, w, 1, dark); // bottom
  }

  // Draw a detailed window with frame + interior glow
  window(ctx, x, y, w, h, glowCol = '#fffde0', frameCol = '#334155') {
    this.px(ctx, x, y, w, h, frameCol);    // frame
    this.px(ctx, x + 1, y + 1, w - 2, h - 2, glowCol); // interior
    // Crossed pane divider
    this.px(ctx, x + ~~(w / 2), y + 1, 1, h - 2, frameCol);
    this.px(ctx, x + 1, y + ~~(h / 2), w - 2, 1, frameCol);
  }

  // Draw a balcony rail
  balcony(ctx, x, y, w, postCol = '#475569', railCol = '#64748b') {
    this.px(ctx, x, y + 2, w, 2, railCol);
    for (let bx = x; bx < x + w; bx += 3) {
      this.px(ctx, bx, y, 1, 4, postCol);
    }
  }

  // Draw an isometric grass/ground tile base
  drawIsoBase(ctx, top, left, right, wallH = 10) {
    const W = this.tileW, H = this.tileH;
    // Left wall
    ctx.fillStyle = left;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W / 2, H);
    ctx.lineTo(W / 2, H + wallH);
    ctx.lineTo(0, H / 2 + wallH);
    ctx.closePath();
    ctx.fill();
    // Right wall
    ctx.fillStyle = right;
    ctx.beginPath();
    ctx.moveTo(W / 2, H);
    ctx.lineTo(W, H / 2);
    ctx.lineTo(W, H / 2 + wallH);
    ctx.lineTo(W / 2, H + wallH);
    ctx.closePath();
    ctx.fill();
    // Top face
    ctx.fillStyle = top;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W, H / 2);
    ctx.lineTo(W / 2, H);
    ctx.lineTo(0, H / 2);
    ctx.closePath();
    ctx.fill();
    // Edge outline
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw detailed isometric box building face:
  // cx,cy = center-bottom; bw,bd,bh = box half-width, depth, height; palette object
  drawBuilding(ctx, cx, cy, bw, bd, bh, pal) {
    const { top, left, right, highlight, shadow } = pal;

    // Concrete sidewalk pad under building
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 5);
    ctx.lineTo(cx + bw + 5, cy - bd / 2 + 2);
    ctx.lineTo(cx, cy - bd - 3);
    ctx.lineTo(cx - bw - 5, cy - bd / 2 + 2);
    ctx.closePath();
    ctx.fill();

    // Left face
    ctx.fillStyle = left;
    ctx.beginPath();
    ctx.moveTo(cx - bw, cy - bd / 2);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy - bh);
    ctx.lineTo(cx - bw, cy - bd / 2 - bh);
    ctx.closePath();
    ctx.fill();

    // Right face
    ctx.fillStyle = right;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + bw, cy - bd / 2);
    ctx.lineTo(cx + bw, cy - bd / 2 - bh);
    ctx.lineTo(cx, cy - bh);
    ctx.closePath();
    ctx.fill();

    // Top face
    ctx.fillStyle = top;
    ctx.beginPath();
    ctx.moveTo(cx, cy - bh);
    ctx.lineTo(cx + bw, cy - bd / 2 - bh);
    ctx.lineTo(cx, cy - bd - bh);
    ctx.lineTo(cx - bw, cy - bd / 2 - bh);
    ctx.closePath();
    ctx.fill();

    // Highlight rim on left top edge
    if (highlight) {
      ctx.strokeStyle = highlight;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - bw, cy - bd / 2 - bh);
      ctx.lineTo(cx, cy - bh);
      ctx.lineTo(cx + bw, cy - bd / 2 - bh);
      ctx.stroke();
    }

    // Shadow seam on left-right corner
    if (shadow) {
      ctx.strokeStyle = shadow;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - bh);
      ctx.stroke();
    }
  }

  // Draw tree with layered sprite-quality foliage
  drawTree(ctx, cx, cy, variant = 0) {
    const P = this.P;
    // Ground shadow (oval)
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx + 1, cy, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    this.px(ctx, cx - 2, cy - 16, 2, 14, P.D0);
    this.px(ctx, cx, cy - 16, 2, 14, P.D1);

    if (variant === 0) { // Oak
      // Layer 1 - dark base
      this.px(ctx, cx - 12, cy - 28, 26, 14, '#1a5c2e');
      // Layer 2 - mid green
      this.px(ctx, cx - 10, cy - 34, 22, 14, '#287a3e');
      // Layer 3 - bright
      this.px(ctx, cx - 7, cy - 39, 16, 11, '#3aad57');
      // Layer 4 - highlight tip
      this.px(ctx, cx - 4, cy - 43, 10, 7, '#52d46f');
      // Specular dots
      this.px(ctx, cx - 6, cy - 32, 3, 3, '#6ef08a');
      this.px(ctx, cx + 3, cy - 29, 3, 3, '#6ef08a');
      this.px(ctx, cx - 2, cy - 38, 2, 2, '#a3f0b5');
      // Dark nook shadows
      this.px(ctx, cx - 11, cy - 27, 4, 4, '#0d3d1e');
      this.px(ctx, cx + 7, cy - 25, 4, 4, '#0d3d1e');
    } else if (variant === 1) { // Slim Pine
      this.px(ctx, cx - 9, cy - 26, 20, 8, '#0c3520');
      this.px(ctx, cx - 7, cy - 33, 16, 8, '#155c35');
      this.px(ctx, cx - 5, cy - 39, 12, 8, '#1e8048');
      this.px(ctx, cx - 3, cy - 45, 8, 8, '#2ead61');
      this.px(ctx, cx - 1, cy - 49, 4, 5, '#4ec87a');
    } else { // Tropical Palm
      this.px(ctx, cx - 1, cy - 24, 4, 22, P.D1);
      this.px(ctx, cx - 1, cy - 23, 2, 20, P.D0);
      // Palm fronds
      const fronds = [[-14,-8],[-10,-12],[-6,-14],[4,-15],[10,-13],[14,-10]];
      fronds.forEach(([dx, dy]) => {
        this.px(ctx, cx + dx, cy + dy, 14, 3, '#2d8a47');
        this.px(ctx, cx + dx + 1, cy + dy - 1, 12, 2, '#3bb963');
      });
    }
  }

  // =============================================================
  // 1. TERRAIN TILES
  // =============================================================
  generateTerrain() {
    const P = this.P;

    // Grass variants (0=plain, 1=flowers, 2=with tree)
    ['grass_0', 'grass_1', 'grass_2'].forEach((key, idx) => {
      const { canvas, ctx } = this.createCanvas(80, 50);
      const tops    = ['#38a854', '#3aad57', '#329d4e'];
      const lefts   = ['#1d6c36', '#1a5c2e', '#175026'];
      const rights  = ['#155024', '#12441e', '#0f3a1a'];

      this.drawIsoBase(ctx, tops[idx], lefts[idx], rights[idx], 10);

      // Grass blade dither pattern
      const blades = idx === 0 ? 30 : 20;
      for (let i = 0; i < blades; i++) {
        const rx = 8 + Math.random() * 64, ry = 4 + Math.random() * 28;
        const col = Math.random() > 0.55 ? '#5ce688' : '#226b3a';
        this.px(ctx, rx, ry, 2, 2, col);
      }

      if (idx === 1) {
        // Flower patch
        const flowers = [[20,10,'#fb7185'],[24,8,'#fbbf24'],[30,14,'#c084fc'],[38,10,'#38bdf8'],[42,8,'#fb923c'],[16,16,'#4ade80']];
        flowers.forEach(([fx,fy,fc]) => {
          this.px(ctx, fx, fy, 3, 3, fc);
          this.px(ctx, fx+1, fy+1, 1, 1, '#fff');
        });
        // Short grass tufts
        for (let i = 0; i < 8; i++) {
          const rx = 12 + Math.random() * 56, ry = 6 + Math.random() * 24;
          this.px(ctx, rx, ry, 1, 4, '#4dc96b');
          this.px(ctx, rx + 2, ry + 1, 1, 3, '#2d8a47');
        }
      } else if (idx === 2) {
        this.drawTree(ctx, 40, 20, 0);
      }

      this.sprites[key] = canvas;
    });

    // Dirt tile with stone pebbles
    const dirt = this.createCanvas(80, 50);
    this.drawIsoBase(dirt.ctx, P.D1, P.D0, P.D0.replace('6b','50'), 10);
    for (let i = 0; i < 18; i++) {
      const rx = 10 + Math.random() * 60, ry = 5 + Math.random() * 26;
      dirt.ctx.fillStyle = Math.random() > 0.5 ? P.D2 : P.D0;
      dirt.ctx.beginPath(); dirt.ctx.ellipse(rx, ry, 3, 2, Math.random()*Math.PI, 0, Math.PI*2);
      dirt.ctx.fill();
    }
    this.sprites['dirt'] = dirt.canvas;

    // Water - 3 animation frames
    for (let f = 0; f < 3; f++) {
      const { canvas, ctx } = this.createCanvas(80, 50);
      this.drawIsoBase(ctx, P.W1, P.W0, P.W0, 6);
      // Deep water center
      ctx.fillStyle = P.W0;
      ctx.beginPath(); ctx.moveTo(40,10); ctx.lineTo(70,25); ctx.lineTo(40,40); ctx.lineTo(10,25); ctx.closePath(); ctx.fill();
      // Animated foam ripples
      const s = f * 6;
      [[10+s,18,18,2,P.W3],[36-s,24,20,2,P.W2],[24+s,30,16,2,P.W4]].forEach(([x,y,w,h,c]) => this.px(ctx,x,y,w,h,c));
      // Specular sparkle
      if (f === 0) { this.px(ctx,52,16,3,1,P.W4); this.px(ctx,28,28,2,1,P.W4); }
      this.sprites[`water_${f}`] = canvas;
    }

    // Sand / Beach tile
    const sand = this.createCanvas(80, 50);
    this.drawIsoBase(sand.ctx, '#d4a853', '#a67c3a', '#8c6428', 10);
    for (let i = 0; i < 20; i++) {
      const rx = 10+Math.random()*60, ry = 5+Math.random()*26;
      this.px(sand.ctx, rx, ry, 2, 1, '#e8c06a');
    }
    this.sprites['sand'] = sand.canvas;
  }

  // =============================================================
  // 2. ROADS WITH FULL DETAIL
  // =============================================================
  generateRoads() {
    const P = this.P;
    ['road_h', 'road_v', 'road_cross', 'road_intersection'].forEach(type => {
      const { canvas, ctx } = this.createCanvas(80, 50);

      // Asphalt base
      this.drawIsoBase(ctx, P.R1, P.R0, P.S0, 10);

      // Sidewalk curb strips (light concrete)
      this.px(ctx, 2, 18, 16, 4, P.M3);
      this.px(ctx, 62, 18, 16, 4, P.M3);
      this.px(ctx, 4, 20, 12, 2, P.L2);
      this.px(ctx, 64, 20, 12, 2, P.L2);

      // Asphalt texture grain
      for (let i = 0; i < 30; i++) {
        const rx = 14 + Math.random() * 52, ry = 8 + Math.random() * 24;
        this.px(ctx, rx, ry, 1, 1, P.R2);
      }

      // Road markings
      if (type === 'road_h') {
        // Horizontal centre lines (dashed yellow)
        this.dashedH(ctx, 10, 22, 14, P.Y3); this.dashedH(ctx, 28, 16, 14, P.Y3); this.dashedH(ctx, 48, 10, 14, P.Y3);
      } else if (type === 'road_v') {
        this.dashedH(ctx, 10, 10, 14, P.Y3); this.dashedH(ctx, 28, 16, 14, P.Y3); this.dashedH(ctx, 48, 22, 14, P.Y3);
      } else {
        // Crosswalk stripes
        for (let s = 0; s < 5; s++) {
          this.px(ctx, 14 + s*4, 8 + s*3, 3, 5, P.L0);
          this.px(ctx, 52 - s*4, 20 + s*3, 3, 5, P.L0);
        }
        // Intersection box
        this.px(ctx, 30, 14, 16, 8, P.Y3);
        this.px(ctx, 32, 15, 12, 6, P.Y2);
      }

      // Traffic light at corner (for intersection)
      if (type === 'road_intersection') {
        // Pole
        this.px(ctx, 65, 5, 3, 14, P.M2);
        // Signal head box
        this.px(ctx, 63, 2, 7, 6, P.S0);
        this.px(ctx, 64, 3, 5, 1, P.RE3);
        this.px(ctx, 64, 5, 5, 1, P.GA2);
      }

      this.sprites[type] = canvas;
    });
  }

  // =============================================================
  // 3. UTILITIES
  // =============================================================
  generateUtilities() {
    const P = this.P;

    // --- Power Pole ---
    const pole = this.createCanvas(80, 70);
    this.drawIsoBase(pole.ctx, P.G0, P.GS0, P.GS1, 10);
    // Wooden mast
    this.px(pole.ctx, 38, 10, 4, 32, '#4a2f14');
    this.px(pole.ctx, 39, 8, 2, 34, '#6b4226');
    // Crossarms
    this.px(pole.ctx, 28, 18, 24, 3, '#3d2510');
    this.px(pole.ctx, 30, 26, 20, 3, '#3d2510');
    // Insulators (cyan glass)
    [27,51].forEach(ix => { this.px(pole.ctx, ix, 16, 3, 4, P.C3); this.px(pole.ctx, ix+1, 17, 1, 2, P.L0); });
    [29,49].forEach(ix => { this.px(pole.ctx, ix, 24, 3, 4, P.C3); this.px(pole.ctx, ix+1, 25, 1, 2, P.L0); });
    this.sprites['power_pole'] = pole.canvas;

    // --- Power Plant (Thermal) ---
    const plant = this.createCanvas(80, 100);
    this.drawIsoBase(plant.ctx, P.M2, P.M1, P.M0, 10);
    const palPlant = { top: P.M3, left: P.M2, right: P.M1, highlight: 'rgba(255,255,255,0.15)', shadow: 'rgba(0,0,0,0.4)' };
    this.drawBuilding(plant.ctx, 28, 32, 18, 16, 38, palPlant);
    // Cooling tower (cylinder)
    this.px(plant.ctx, 47, 12, 18, 36, P.L3);
    this.px(plant.ctx, 48, 12, 16, 4, P.M2);
    // Band rings
    [20, 28, 36].forEach(ry => { this.px(plant.ctx, 48, ry, 16, 2, P.L2); });
    // Smoke puffs
    [0, 4, 8].forEach((offset, i) => {
      const sy = -8 - i * 6, sw = 12 - i * 2;
      this.px(plant.ctx, 50 + offset, sy, sw, sw * 0.7, `rgba(200,210,220,${0.9 - i*0.2})`);
    });
    // Danger stripe band on main building
    for (let x = 18; x < 38; x += 6) { this.px(plant.ctx, x, 24, 3, 6, P.RE3); this.px(plant.ctx, x+3, 24, 3, 6, P.Y3); }
    this.sprites['power_plant'] = plant.canvas;

    // --- Water Pump Station ---
    const pump = this.createCanvas(80, 85);
    this.drawIsoBase(pump.ctx, P.C2, P.C1, P.C0, 10);
    const palPump = { top: P.C3, left: P.C2, right: P.C1, highlight: 'rgba(255,255,255,0.2)', shadow: 'rgba(0,0,0,0.4)' };
    this.drawBuilding(pump.ctx, 32, 28, 20, 16, 32, palPump);
    // Water tank cylinder
    this.px(pump.ctx, 50, 8, 18, 28, P.BL3);
    this.px(pump.ctx, 50, 8, 18, 5, P.BL4);
    // Tank dome top
    pump.ctx.fillStyle = P.BL4;
    pump.ctx.beginPath(); pump.ctx.ellipse(59, 8, 9, 5, 0, 0, Math.PI * 2); pump.ctx.fill();
    // Pipe network
    this.px(pump.ctx, 16, 28, 18, 4, P.M2);
    this.px(pump.ctx, 16, 28, 18, 2, P.M3);
    this.sprites['water_pump'] = pump.canvas;
  }

  // =============================================================
  // 4. ZONE BUILDINGS - R / C / I (4 LEVELS EACH)
  // =============================================================
  generateZones() {
    const P = this.P;

    // ==== RESIDENTIAL ====

    // R1 - Classic Cottage with tiled roof, chimney, garden fence
    {
      const { canvas, ctx } = this.createCanvas(80, 78);
      this.drawIsoBase(ctx, P.G1, P.GS0, P.GS1, 10);
      // Building body
      this.drawBuilding(ctx, 40, 38, 22, 18, 24,
        { top: P.Y5, left: P.Y4, right: P.Y3, highlight: 'rgba(255,255,255,0.3)', shadow: 'rgba(0,0,0,0.4)' });
      // Pitched roof (isometric angle)
      ctx.fillStyle = P.B2;
      ctx.beginPath(); ctx.moveTo(40, 10); ctx.lineTo(62, 20); ctx.lineTo(40, 30); ctx.lineTo(18, 20); ctx.closePath(); ctx.fill();
      // Roof highlight
      ctx.strokeStyle = P.B3; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(18, 20); ctx.lineTo(40, 10); ctx.lineTo(62, 20); ctx.stroke();
      // Chimney
      this.px(ctx, 52, 4, 6, 14, P.B1);
      this.px(ctx, 53, 2, 4, 4, P.M2); // chimney top
      this.px(ctx, 54, -4, 6, 5, 'rgba(200,210,220,0.85)'); // smoke
      this.px(ctx, 56, -10, 8, 7, 'rgba(220,225,230,0.7)');
      // Windows with frames
      this.window(ctx, 24, 22, 8, 7, P.WN0, P.Y1);
      this.window(ctx, 46, 22, 8, 7, P.WN0, P.Y1);
      // Door
      this.px(ctx, 36, 26, 8, 12, P.Y0);
      this.px(ctx, 37, 27, 6, 10, P.D0);
      this.px(ctx, 39, 30, 2, 2, P.Y3); // door knob
      // Garden fence
      for (let fx = 20; fx < 62; fx += 5) { this.px(ctx, fx, 47, 2, 5, '#a16207'); }
      this.px(ctx, 20, 47, 42, 2, '#92400e');
      this.sprites['res_1'] = canvas;
    }

    // R2 - Townhouse (2 stories, brick facade, balcony)
    {
      const { canvas, ctx } = this.createCanvas(80, 96);
      this.drawIsoBase(ctx, P.G0, P.GS0, P.GS1, 10);
      // Foundation
      this.drawBuilding(ctx, 40, 36, 25, 20, 44,
        { top: P.L1, left: P.L2, right: P.L3, highlight: 'rgba(255,255,255,0.25)', shadow: 'rgba(0,0,0,0.5)' });
      // Brick pattern on left face
      for (let row = 0; row < 5; row++) {
        const off = row % 2 === 0 ? 0 : 4;
        for (let col = 0; col < 5; col++) {
          this.px(ctx, 16 + col * 7 + off, 20 + row * 7, 6, 5, P.B2);
          this.px(ctx, 15 + col * 7 + off, 19 + row * 7, 6, 5, P.B3);
        }
      }
      // 2-story windows
      [[22,12],[36,12],[22,26],[36,26]].forEach(([wx,wy]) => this.window(ctx, wx, wy, 9, 8, P.WN1, P.S2));
      // Balcony on 2nd floor
      this.px(ctx, 20, 24, 26, 3, P.M2);
      this.balcony(ctx, 21, 20, 24, P.M1, P.M3);
      // Flat roof with parapet
      this.px(ctx, 15, -8, 52, 4, P.L1);
      this.px(ctx, 14, -9, 54, 2, P.L2);
      this.drawRoofDetails(ctx, 40, -6);
      this.sprites['res_2'] = canvas;
    }

    // R3 - Mid-rise Apartment (5 floors, fire escape, courtyard)
    {
      const { canvas, ctx } = this.createCanvas(80, 120);
      this.drawIsoBase(ctx, P.BL1, P.BL0, P.BL0, 10);
      this.drawBuilding(ctx, 40, 36, 27, 20, 62,
        { top: P.L0, left: P.L1, right: P.L2, highlight: 'rgba(255,255,255,0.2)', shadow: 'rgba(0,0,0,0.5)' });
      // Floor band lines
      for (let floor = 6; floor <= 55; floor += 11) {
        this.px(ctx, 15, floor, 28, 2, P.L3);
        this.px(ctx, 44, floor - 2, 22, 2, P.L3);
      }
      // Windows per floor (left & right face)
      for (let floor = 3; floor <= 50; floor += 11) {
        [[18,floor],[28,floor],[38,floor]].forEach(([wx,wy]) => this.window(ctx, wx, wy, 8, 8, P.WN2, P.S2));
        [[46,floor-1],[56,floor-1]].forEach(([wx,wy]) => this.window(ctx, wx, wy, 8, 7, P.WN1, P.S2));
      }
      // Fire escape (left side)
      this.px(ctx, 14, 0, 2, 58, P.M1);
      for (let r = 4; r < 58; r += 9) { this.px(ctx, 12, r, 6, 1, P.M2); }
      // Roof HVAC + parapet
      this.px(ctx, 14, -12, 54, 4, P.L1);
      this.drawRoofDetails(ctx, 40, -10);
      this.sprites['res_3'] = canvas;
    }

    // R4 - Luxury Glass Skyscraper (8+ floors, neon top, helipad)
    {
      const { canvas, ctx } = this.createCanvas(80, 165);
      this.drawIsoBase(ctx, P.BL1, P.BL0, P.BL0, 10);
      this.drawBuilding(ctx, 40, 36, 28, 20, 102,
        { top: P.C2, left: P.C1, right: P.C0, highlight: 'rgba(100,210,255,0.3)', shadow: 'rgba(0,0,30,0.6)' });
      // Glass curtain wall - full window grid
      for (let floor = -58; floor <= 28; floor += 7) {
        for (let col = 14; col <= 48; col += 7) {
          const isOn = Math.random() > 0.15;
          const glow = isOn ? (Math.random() > 0.3 ? P.WN0 : P.WN3) : P.C0;
          this.px(ctx, col, floor, 5, 5, glow);
          if (isOn) this.px(ctx, col + 1, floor + 1, 3, 3, '#ffffff');
        }
      }
      // Horizontal floor band every 7px
      for (let floor = -58; floor <= 28; floor += 7) {
        this.px(ctx, 14, floor - 1, 35, 1, P.C1);
      }
      // Crown / setback near top
      this.px(ctx, 22, -70, 38, 14, P.C2);
      this.px(ctx, 24, -72, 34, 12, P.C3);
      for (let cx2 = 24; cx2 < 58; cx2 += 5) { this.px(ctx, cx2, -70, 4, 4, P.WN0); }
      // Helipad
      this.px(ctx, 25, -86, 30, 16, '#1e3a5f');
      this.px(ctx, 26, -85, 28, 14, '#1a4f7c');
      this.px(ctx, 33, -83, 14, 10, '#ef4444'); // H letter
      this.px(ctx, 36, -84, 8, 12, '#ef4444');
      this.px(ctx, 34, -80, 12, 3, '#ef4444');
      // Spire antenna
      this.px(ctx, 39, -110, 2, 26, P.L1);
      this.px(ctx, 38, -112, 4, 4, P.RE3); // aircraft light
      this.sprites['res_4'] = canvas;
    }

    // ==== COMMERCIAL ====

    // C1 - Corner Shop / Cafe (detailed awning, neon signs)
    {
      const { canvas, ctx } = this.createCanvas(80, 74);
      this.drawIsoBase(ctx, P.Y3, P.Y2, P.Y1, 10);
      this.drawBuilding(ctx, 40, 34, 22, 18, 28,
        { top: P.Y5, left: P.Y4, right: P.Y3, highlight: 'rgba(255,255,255,0.25)', shadow: 'rgba(0,0,0,0.4)' });
      // Striped awning
      const awningColors = [P.RE3, P.L0, P.RE3, P.L0, P.RE3];
      awningColors.forEach((ac, i) => { this.px(ctx, 18 + i * 5, 18, 5, 6, ac); });
      this.px(ctx, 18, 23, 26, 2, '#7f1d1d'); // awning valance
      // Large shopfront windows
      this.window(ctx, 20, 26, 14, 10, P.WN0, P.Y0);
      this.window(ctx, 42, 26, 14, 10, P.WN0, P.Y0);
      // Neon "OPEN" sign
      this.px(ctx, 28, 14, 22, 5, '#0a0a0a');
      this.px(ctx, 30, 15, 18, 3, '#00ffcc');
      this.sprites['com_1'] = canvas;
    }

    // C2 - Retail Plaza (L-shaped, parking, billboard)
    {
      const { canvas, ctx } = this.createCanvas(80, 90);
      this.drawIsoBase(ctx, P.Y2, P.Y1, P.Y0, 10);
      this.drawBuilding(ctx, 38, 34, 26, 20, 38,
        { top: P.L0, left: P.L1, right: P.L2, highlight: 'rgba(255,255,255,0.2)', shadow: 'rgba(0,0,0,0.4)' });
      // Large glass atrium face
      this.px(ctx, 16, 14, 22, 22, P.C3);
      this.px(ctx, 17, 15, 20, 20, P.C4);
      // Roof parapet
      this.px(ctx, 14, -6, 54, 4, P.L1);
      // Billboard
      this.px(ctx, 34, -20, 20, 12, P.RE3);
      this.px(ctx, 35, -19, 18, 10, '#ff6b6b');
      this.px(ctx, 37, -17, 14, 6, P.Y4);
      // Neon strip
      this.px(ctx, 14, 8, 54, 3, P.N0);
      this.sprites['com_2'] = canvas;
    }

    // C3 - Corporate Office Tower (full glass, structural exo-skeleton)
    {
      const { canvas, ctx } = this.createCanvas(80, 115);
      this.drawIsoBase(ctx, P.Y1, P.Y0, P.Y0, 10);
      this.drawBuilding(ctx, 40, 34, 26, 20, 64,
        { top: P.C2, left: P.C1, right: P.C0, highlight: 'rgba(100,210,255,0.25)', shadow: 'rgba(0,0,40,0.5)' });
      // Exo-skeleton concrete frame grid
      for (let gy = -22; gy <= 28; gy += 10) {
        this.px(ctx, 15, gy, 28, 2, P.L1);
      }
      for (let gx = 16; gx <= 40; gx += 7) { this.px(ctx, gx, -22, 2, 52, P.L1); }
      // Window panels between grid
      for (let gy = -20; gy <= 25; gy += 10) {
        [[17,gy],[24,gy],[31,gy]].forEach(([wx,wy]) => this.window(ctx, wx, wy, 5, 8, P.WN3, P.BL0));
      }
      this.drawRoofDetails(ctx, 40, -30);
      this.sprites['com_3'] = canvas;
    }

    // C4 - Cyberpunk Mega Trade Tower (dark glass, golden exo, spire + skybridge)
    {
      const { canvas, ctx } = this.createCanvas(80, 170);
      this.drawIsoBase(ctx, P.Y0, '#4a2800', '#2e1800', 10);
      this.drawBuilding(ctx, 40, 34, 28, 20, 104,
        { top: P.S2, left: P.S1, right: P.S0, highlight: 'rgba(245,158,11,0.3)', shadow: 'rgba(0,0,0,0.7)' });
      // Golden exo-skeleton diagonals
      for (let gy = -60; gy <= 28; gy += 10) {
        this.px(ctx, 14, gy, 28, 2, P.Y3);
      }
      // Window lights - night mode
      for (let gy = -62; gy <= 26; gy += 7) {
        for (let gx = 16; gx <= 38; gx += 7) {
          const isOn = Math.random() > 0.2;
          this.px(ctx, gx, gy, 5, 5, isOn ? P.WN0 : P.S2);
        }
      }
      // Crown setback tower top
      this.px(ctx, 26, -78, 26, 18, P.S1);
      this.px(ctx, 28, -76, 22, 14, P.S0);
      for (let cx2 = 28; cx2 < 50; cx2 += 5) { this.px(ctx, cx2, -76, 4, 4, P.Y3); }
      // Spire
      this.px(ctx, 38, -112, 4, 36, P.M3);
      this.px(ctx, 39, -115, 2, 6, P.RE3); // beacon
      this.sprites['com_4'] = canvas;
    }

    // ==== INDUSTRIAL ====

    // I1 - Workshop / Garage (corrugated roof)
    {
      const { canvas, ctx } = this.createCanvas(80, 74);
      this.drawIsoBase(ctx, P.PU2, P.PU1, P.PU0, 10);
      this.drawBuilding(ctx, 40, 34, 22, 18, 26,
        { top: P.M3, left: P.M2, right: P.M1, highlight: 'rgba(255,255,255,0.15)', shadow: 'rgba(0,0,0,0.5)' });
      // Corrugated roof ripple lines
      for (let cr = 0; cr < 6; cr++) { this.px(ctx, 18 + cr*7, 10, 2, 8, P.M4); }
      // Roller door
      this.px(ctx, 26, 20, 14, 16, P.M0);
      for (let rr = 2; rr < 16; rr += 3) { this.px(ctx, 27, 20+rr, 12, 2, P.M1); }
      // Window
      this.window(ctx, 42, 22, 8, 8, '#fff9c4', P.M2);
      // Wooden crates
      [[52,30],[56,28]].forEach(([cx2,cy2]) => {
        this.px(ctx, cx2, cy2, 7, 7, P.Y0);
        this.rim(ctx, cx2, cy2, 7, 7, P.Y1, P.Y0);
        this.px(ctx, cx2+3, cy2, 1, 7, P.D0);
      });
      this.sprites['ind_1'] = canvas;
    }

    // I2 - Factory with Saw-Tooth Roof & Tall Chimney
    {
      const { canvas, ctx } = this.createCanvas(80, 96);
      this.drawIsoBase(ctx, P.PU2, P.PU1, P.PU0, 10);
      this.drawBuilding(ctx, 36, 34, 24, 18, 38,
        { top: P.B1, left: P.B0, right: '#4a1a08', highlight: 'rgba(200,100,50,0.2)', shadow: 'rgba(0,0,0,0.6)' });
      // Brick texture
      for (let row = 0; row < 5; row++) {
        const off = row % 2 === 0 ? 0 : 3;
        for (let col = 0; col < 4; col++) { this.px(ctx, 14+col*6+off, 14+row*6, 5, 5, P.B2); }
      }
      // Saw-tooth roof skylights
      [[14,-2],[22,-2],[30,-2]].forEach(([sx,sy]) => {
        ctx.fillStyle = P.M2;
        ctx.beginPath(); ctx.moveTo(sx,sy+8); ctx.lineTo(sx+6,sy); ctx.lineTo(sx+8,sy+8); ctx.closePath(); ctx.fill();
        this.px(ctx, sx+2, sy+2, 3, 5, P.C3); // skylight glass
      });
      // Tall chimney
      this.px(ctx, 55, -14, 9, 42, P.RE1);
      this.px(ctx, 56, -14, 7, 42, P.RE2);
      this.px(ctx, 55, -16, 9, 4, P.M0); // cap
      // Smoke billowing
      [[57,-20,10,8],[55,-30,14,10],[58,-42,12,12]].forEach(([sx,sy,sw,sh]) => {
        this.px(ctx, sx, sy, sw, sh, `rgba(190,200,215,${0.9})`);
        this.px(ctx, sx+2, sy+2, sw-4, sh-4, `rgba(215,225,235,0.7)`);
      });
      this.sprites['ind_2'] = canvas;
    }

    // I3 - Chemical Refinery (pipes, storage tanks, catwalks)
    {
      const { canvas, ctx } = this.createCanvas(80, 106);
      this.drawIsoBase(ctx, P.PU1, P.PU0, '#2e1060', 10);
      this.drawBuilding(ctx, 30, 34, 20, 16, 40,
        { top: P.M2, left: P.M1, right: P.M0, highlight: 'rgba(255,255,255,0.12)', shadow: 'rgba(0,0,0,0.6)' });
      // Silver storage tanks
      this.px(ctx, 48, 10, 20, 34, P.L2);
      this.px(ctx, 48, 10, 20, 6, P.L0); // rim highlight
      this.px(ctx, 50, 42, 16, 4, P.M3); // tank bottom ring
      // Tank dome
      ctx.fillStyle = P.L1;
      ctx.beginPath(); ctx.ellipse(58, 10, 10, 6, 0, 0, Math.PI*2); ctx.fill();
      // Band rings on tank
      [16, 24, 32].forEach(ry => { this.px(ctx, 49, ry, 18, 2, P.L3); });
      // Horizontal pipe bridge
      this.px(ctx, 14, 30, 36, 4, P.Y3); // pipe yellow
      this.px(ctx, 14, 31, 36, 2, P.Y4); // highlight
      // Vertical pipe
      this.px(ctx, 26, 14, 4, 20, P.M3);
      // Catwalk grating
      this.px(ctx, 48, 36, 20, 3, P.M2);
      for (let gr = 48; gr < 68; gr += 3) { this.px(ctx, gr, 36, 2, 3, P.M1); }
      // Warning signs
      this.px(ctx, 18, 22, 8, 6, P.Y4);
      this.px(ctx, 20, 23, 4, 4, P.RE3);
      this.sprites['ind_3'] = canvas;
    }

    // I4 - Fusion Lab / High-Tech Research Complex
    {
      const { canvas, ctx } = this.createCanvas(80, 126);
      this.drawIsoBase(ctx, P.PU0, '#1a0a4a', '#0d0528', 10);
      this.drawBuilding(ctx, 40, 34, 28, 20, 58,
        { top: P.S2, left: P.S1, right: P.S0, highlight: 'rgba(6,182,212,0.3)', shadow: 'rgba(0,0,0,0.7)' });
      // Cyan tech stripe bands
      for (let tb = -14; tb <= 28; tb += 8) {
        this.px(ctx, 14, tb, 28, 2, P.N0);
        this.px(ctx, 42, tb - 1, 24, 2, P.N0);
      }
      // Glowing energy core sphere
      const coreY = -46;
      ctx.fillStyle = '#003344';
      ctx.beginPath(); ctx.arc(40, coreY, 18, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = P.C1;
      ctx.beginPath(); ctx.arc(40, coreY, 14, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = P.C3;
      ctx.beginPath(); ctx.arc(40, coreY, 10, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#80ffff';
      ctx.beginPath(); ctx.arc(40, coreY, 6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(38, coreY - 3, 3, 0, Math.PI*2); ctx.fill();
      // Glow halo
      const grad = ctx.createRadialGradient(40, coreY, 10, 40, coreY, 28);
      grad.addColorStop(0, 'rgba(0,255,255,0.4)');
      grad.addColorStop(1, 'rgba(0,255,255,0)');
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(40, coreY, 28, 0, Math.PI*2); ctx.fill();
      // Support struts
      this.px(ctx, 38, -28, 4, 20, P.M2);
      [[28,-30],[48,-30]].forEach(([sx,sy]) => {
        ctx.strokeStyle = P.C2; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(40, coreY); ctx.lineTo(sx, sy); ctx.stroke();
      });
      this.sprites['ind_4'] = canvas;
    }
  }

  // =============================================================
  // 5. CIVIC SERVICES & LANDMARKS
  // =============================================================
  generateCivics() {
    const P = this.P;

    // Police Station
    {
      const { canvas, ctx } = this.createCanvas(80, 94);
      this.drawIsoBase(ctx, P.BL2, P.BL1, P.BL0, 10);
      this.drawBuilding(ctx, 40, 34, 26, 20, 46,
        { top: P.S2, left: P.S1, right: P.S0, highlight: 'rgba(37,99,235,0.3)', shadow: 'rgba(0,0,0,0.6)' });
      // Horizontal blue identification band
      this.px(ctx, 14, 14, 28, 7, P.BL2);
      this.px(ctx, 14, 15, 28, 5, P.BL3);
      // Door arch
      this.px(ctx, 32, 22, 12, 16, P.S0);
      this.px(ctx, 34, 22, 8, 14, P.BL0);
      // Windows
      [[18,6],[40,6]].forEach(([wx,wy]) => this.window(ctx, wx, wy, 9, 9, P.WN3, P.S2));
      // Police shield badge
      this.px(ctx, 36, 10, 8, 5, '#fbbf24');
      this.px(ctx, 37, 11, 6, 3, P.BL2);
      // Siren lights on roof
      this.px(ctx, 28, -4, 8, 5, P.RE3);
      this.px(ctx, 28, -4, 4, 5, P.BL3);
      this.sprites['police'] = canvas;
    }

    // Fire Station
    {
      const { canvas, ctx } = this.createCanvas(80, 94);
      this.drawIsoBase(ctx, P.RE2, P.RE1, P.RE0, 10);
      this.drawBuilding(ctx, 40, 34, 26, 20, 46,
        { top: P.RE1, left: P.RE0, right: '#3d0c0c', highlight: 'rgba(239,68,68,0.2)', shadow: 'rgba(0,0,0,0.7)' });
      // Red identification band
      this.px(ctx, 14, 16, 28, 5, P.RE3);
      // Double garage doors
      this.px(ctx, 16, 22, 11, 16, P.M0);
      this.px(ctx, 28, 22, 11, 16, P.M0);
      for (let rr = 2; rr < 16; rr += 3) {
        this.px(ctx, 17, 22+rr, 9, 2, P.M1);
        this.px(ctx, 29, 22+rr, 9, 2, P.M1);
      }
      // Fire dept logo (helmet outline)
      this.px(ctx, 36, 8, 10, 6, P.RE3);
      // Bell tower
      this.px(ctx, 34, -12, 12, 12, P.Y4);
      this.px(ctx, 36, -10, 8, 5, P.RE3);
      this.sprites['fire'] = canvas;
    }

    // Hospital
    {
      const { canvas, ctx } = this.createCanvas(80, 106);
      this.drawIsoBase(ctx, P.L0, P.L1, P.L2, 10);
      this.drawBuilding(ctx, 40, 34, 28, 20, 56,
        { top: P.L0, left: P.L1, right: P.L2, highlight: 'rgba(255,255,255,0.4)', shadow: 'rgba(0,0,0,0.3)' });
      // Floor bands
      for (let fb = 8; fb <= 50; fb += 12) { this.px(ctx, 14, fb, 28, 2, P.L2); }
      // Windows
      for (let wy = 4; wy <= 44; wy += 12) {
        [[17,wy],[27,wy],[37,wy]].forEach(([wx,wwy]) => this.window(ctx, wx, wwy, 8, 9, P.WN0, P.BL2));
      }
      // Large Red Cross on facade
      this.px(ctx, 20, 16, 8, 26, P.RE3);
      this.px(ctx, 14, 22, 20, 10, P.RE3);
      this.px(ctx, 21, 17, 6, 24, P.RE4);
      this.px(ctx, 15, 23, 18, 8, P.RE4);
      // Emergency entrance canopy
      this.px(ctx, 14, 44, 28, 4, P.RE3);
      this.px(ctx, 15, 43, 26, 2, P.RE4);
      this.drawRoofDetails(ctx, 40, -26);
      this.sprites['hospital'] = canvas;
    }

    // School
    {
      const { canvas, ctx } = this.createCanvas(80, 96);
      this.drawIsoBase(ctx, P.Y3, P.Y2, P.Y1, 10);
      this.drawBuilding(ctx, 40, 34, 26, 20, 44,
        { top: P.B3, left: P.B2, right: P.B1, highlight: 'rgba(200,100,30,0.2)', shadow: 'rgba(0,0,0,0.5)' });
      // Brick facade
      for (let row = 0; row < 5; row++) {
        const off = row % 2 === 0 ? 0 : 3;
        for (let col = 0; col < 5; col++) { this.px(ctx, 14+col*6+off, 8+row*6, 5, 5, P.B3); }
      }
      // School windows
      [[17,10],[27,10],[37,10],[17,22],[27,22],[37,22]].forEach(([wx,wy]) => this.window(ctx, wx, wy, 8, 8, P.WN1, P.S2));
      // Clock tower
      this.px(ctx, 32, -16, 14, 20, P.Y4);
      this.px(ctx, 34, -14, 10, 16, P.Y5);
      // Clock face
      this.px(ctx, 35, -10, 8, 8, P.L0);
      ctx.fillStyle = P.S0; ctx.beginPath(); ctx.arc(39, -6, 4, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = P.S0; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(39,-6); ctx.lineTo(39,-9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(39,-6); ctx.lineTo(41,-6); ctx.stroke();
      // Bell
      this.px(ctx, 36, -18, 6, 4, P.Y2);
      this.sprites['school'] = canvas;
    }

    // Park
    {
      const { canvas, ctx } = this.createCanvas(80, 68);
      this.drawIsoBase(ctx, '#22c55e', '#15803d', '#166534', 10);
      // Path
      ctx.fillStyle = '#d4a853';
      ctx.beginPath(); ctx.ellipse(40, 24, 16, 10, 0, 0, Math.PI*2); ctx.fill();
      // Trees
      this.drawTree(ctx, 16, 18, 0);
      this.drawTree(ctx, 64, 18, 1);
      // Fountain
      this.px(ctx, 32, 14, 16, 16, P.C3);
      this.px(ctx, 34, 16, 12, 12, P.C2);
      this.px(ctx, 36, 18, 8, 8, P.C4);
      this.px(ctx, 37, 12, 6, 4, P.L0); // water splash up
      // Bench
      this.px(ctx, 52, 26, 12, 3, '#92400e');
      this.px(ctx, 53, 28, 10, 4, '#78350f');
      this.sprites['park'] = canvas;
    }

    // TV Tower Landmark
    {
      const { canvas, ctx } = this.createCanvas(80, 200);
      this.drawIsoBase(ctx, P.M2, P.M1, P.M0, 10);
      // Concrete base
      this.drawBuilding(ctx, 40, 36, 16, 14, 20, { top: P.M3, left: P.M2, right: P.M1, highlight: 'rgba(255,255,255,0.1)', shadow: 'rgba(0,0,0,0.5)' });
      // Steel lattice legs (4 diagonal struts)
      ctx.strokeStyle = P.M3; ctx.lineWidth = 3;
      [[24,40],[56,40]].forEach(([lx,ly]) => {
        ctx.beginPath(); ctx.moveTo(40,42); ctx.lineTo(lx,ly+50); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(40,42); ctx.lineTo(lx-10,ly+70); ctx.stroke();
      });
      // Ladder / service elevator shaft
      this.px(ctx, 38, 40, 4, 72, P.M2);
      for (let lr = 40; lr < 112; lr += 6) { this.px(ctx, 37, lr, 6, 2, P.M3); }
      // Observation deck pod
      this.px(ctx, 26, 30, 28, 14, P.BL1);
      this.px(ctx, 28, 28, 24, 12, P.BL2);
      for (let ow = 29; ow < 52; ow += 6) { this.window(ctx, ow, 30, 5, 9, P.WN3, P.BL0); }
      // Spire shaft
      this.px(ctx, 38, -76, 4, 110, P.L2);
      this.px(ctx, 39, -78, 2, 112, P.L0);
      // Red/white warning bands on spire
      for (let band = -76; band < 34; band += 20) { this.px(ctx, 38, band, 4, 8, P.RE3); }
      // Aircraft warning beacon (top)
      this.px(ctx, 37, -80, 6, 5, P.RE3);
      this.px(ctx, 38, -82, 4, 3, '#ff0000');
      this.sprites['landmark'] = canvas;
    }
  }

  // =============================================================
  // 6. VEHICLES
  // =============================================================
  generateVehicles() {
    const P = this.P;
    const vehicles = [
      { name: 'car_red',    body: P.RE3, roof: '#dc2626', glass: '#bfdbfe' },
      { name: 'car_blue',   body: P.BL3, roof: '#2563eb', glass: '#e0f2fe' },
      { name: 'car_yellow', body: P.Y3,  roof: '#d97706', glass: '#fef9c3' },
      { name: 'car_police', body: '#1e3a8a', roof: '#1d4ed8', glass: '#bfdbfe', siren: true },
      { name: 'car_fire',   body: P.RE2, roof: '#991b1b', glass: '#fee2e2', siren: true },
    ];

    vehicles.forEach(v => {
      const { canvas, ctx } = this.createCanvas(22, 16);
      // Car body
      this.px(ctx, 2, 7, 18, 7, v.body);
      // Highlight
      this.px(ctx, 3, 8, 16, 2, v.roof);
      // Windshield
      this.px(ctx, 5, 3, 11, 5, v.glass);
      this.px(ctx, 6, 4, 9, 3, P.L0);
      // Wheels
      [[2,12],[16,12]].forEach(([wx,wy]) => {
        ctx.fillStyle = P.S0; ctx.beginPath(); ctx.ellipse(wx+2, wy+1, 3, 2, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = P.M3; ctx.beginPath(); ctx.ellipse(wx+2, wy+1, 2, 1.5, 0, 0, Math.PI*2); ctx.fill();
      });
      // Headlights
      this.px(ctx, 18, 8, 3, 2, P.Y5);
      this.px(ctx, 1, 8, 3, 2, '#f87171');
      // Siren light bar
      if (v.siren) {
        this.px(ctx, 7, 0, 8, 3, P.RE3);
        this.px(ctx, 7, 0, 4, 3, P.BL3);
      }
      this.sprites[v.name] = canvas;
    });
  }

  // =============================================================
  // 7. OVERLAY ICONS
  // =============================================================
  generateOverlays() {
    const P = this.P;

    // No power warning badge
    const noPower = this.createCanvas(28, 28);
    noPower.ctx.fillStyle = 'rgba(239,68,68,0.9)';
    noPower.ctx.beginPath(); noPower.ctx.arc(14, 14, 13, 0, Math.PI*2); noPower.ctx.fill();
    noPower.ctx.strokeStyle = P.L0; noPower.ctx.lineWidth = 2;
    noPower.ctx.stroke();
    this.px(noPower.ctx, 12, 5, 4, 12, P.Y4);
    this.px(noPower.ctx, 12, 19, 4, 4, P.Y4);
    this.sprites['no_power'] = noPower.canvas;

    // Bulldoze overlay tile
    const bull = this.createCanvas(80, 50);
    this.drawIsoBase(bull.ctx, 'rgba(239,68,68,0.6)', 'rgba(185,28,28,0.7)', 'rgba(127,29,29,0.7)', 10);
    this.sprites['bulldoze'] = bull.canvas;
  }

  // Rooftop micro-detail helper
  drawRoofDetails(ctx, cx, cy) {
    const P = this.P;
    // HVAC unit
    this.px(ctx, cx - 10, cy - 4, 8, 5, P.M2);
    this.px(ctx, cx - 9, cy - 5, 6, 2, P.M3);
    this.px(ctx, cx - 8, cy - 4, 4, 3, P.M0); // fan
    // Penthouse door
    this.px(ctx, cx + 2, cy - 9, 8, 8, P.S2);
    this.px(ctx, cx + 4, cy - 7, 4, 6, P.D0);
    // Solar panels
    this.px(ctx, cx - 8, cy + 2, 10, 4, P.C2);
    this.px(ctx, cx - 7, cy + 3, 8, 2, P.C3);
    // AC unit
    this.px(ctx, cx + 4, cy + 2, 8, 4, P.M3);
    this.px(ctx, cx + 5, cy + 3, 6, 2, P.M4);
  }
}

const SPRITE_ENGINE = new SpriteGenerator();
let SPRITES = {};
