/* -------------------------------------------------------------
 * PIXELOPOLIS - ADVANCED ISOMETRIC RENDER ENGINE
 * Features realistic 3D building drop shadows, night window glow,
 * camera viewport pan/zoom, dynamic weather & data layers.
 * ------------------------------------------------------------- */

class IsoRenderer {
  constructor(canvas, sim, vehicles) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sim = sim;
    this.vehicles = vehicles;

    this.tileW = 80;   // Updated: 80px wide tiles for premium detail
    this.tileH = 40;   // Updated: 40px tall tiles

    // Camera Transform State
    this.zoom = 0.9;   // Slightly zoomed out for 80px tiles
    this.cameraX = canvas.width / 2;
    this.cameraY = 110;

    // Mouse Interaction
    this.hoverX = -1;
    this.hoverY = -1;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Active Overlay Layer
    this.activeOverlay = 'none';

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.imageSmoothingEnabled = false;
  }

  gridToScreen(gx, gy) {
    const sx = (gx - gy) * (this.tileW / 2) * this.zoom + this.cameraX;
    const sy = (gx + gy) * (this.tileH / 2) * this.zoom + this.cameraY;
    return { x: sx, y: sy };
  }

  screenToGrid(sx, sy) {
    const relX = (sx - this.cameraX) / (this.zoom * (this.tileW / 2));
    const relY = (sy - this.cameraY) / (this.zoom * (this.tileH / 2));

    const gx = Math.floor((relY + relX) / 2);
    const gy = Math.floor((relY - relX) / 2);
    return { x: gx, y: gy };
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Sky Background
    this.drawSkyBackground();

    this.ctx.save();

    // 2. Render Tiles in Isometric Depth Order
    const size = this.sim.gridSize;

    for (let d = 0; d <= (size - 1) * 2; d++) {
      for (let x = 0; x < size; x++) {
        const y = d - x;
        if (y < 0 || y >= size) continue;

        const tile = this.sim.grid[x][y];
        const pos = this.gridToScreen(x, y);

        // Viewport Culling
        if (pos.x < -120 || pos.x > this.canvas.width + 120 ||
            pos.y < -120 || pos.y > this.canvas.height + 250) {
          continue;
        }

        // A. Draw Terrain Tile Base
        let terrainKey = tile.type === 'water' ? `water_${Math.floor(Date.now() / 300) % 3}` :
                         (tile.type === 'dirt' ? 'dirt' : `grass_${tile.variant}`);
        
        const terrainImg = SPRITES[terrainKey] || SPRITES['grass_0'];
        this.ctx.drawImage(
          terrainImg,
          pos.x - (this.tileW / 2) * this.zoom,
          pos.y,
          this.tileW * this.zoom,
          50 * this.zoom   // updated: 80px sprite engine uses 50px tall terrain canvas
        );

        // B. Draw Building 3D Drop Shadow on Ground
        if (tile.building || ['power_plant', 'water_pump', 'police', 'fire', 'hospital', 'school', 'park', 'landmark'].includes(tile.type)) {
          this.drawBuildingShadow(pos);
        }

        // C. Draw Building / Structure
        this.renderTileBuilding(tile, pos);

        // D. Draw Overlays
        if (this.activeOverlay !== 'none') {
          this.renderOverlayTile(tile, pos);
        }

        // E. Draw Hover Highlight Cursor
        if (x === this.hoverX && y === this.hoverY) {
          this.drawTileHighlight(pos, '#38bdf8');
        }
      }
    }

    // 3. Render Vehicles
    this.renderVehicles();

    this.ctx.restore();

    // 4. Night Lighting Filter & Window Light Glows
    if (this.sim.dayNightFactor > 0.05) {
      this.ctx.fillStyle = `rgba(8, 12, 24, ${this.sim.dayNightFactor * 0.75})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // Draw Sky Background Gradient
  drawSkyBackground() {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    if (this.sim.dayNightFactor > 0.4) {
      grad.addColorStop(0, '#050811');
      grad.addColorStop(1, '#0f172a');
    } else if (this.sim.hour >= 17 && this.sim.hour <= 19) {
      grad.addColorStop(0, '#fb923c');
      grad.addColorStop(1, '#334155');
    } else {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e293b');
    }
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 3D Drop Shadow
  drawBuildingShadow(pos) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    this.ctx.beginPath();
    this.ctx.ellipse(pos.x + 8 * this.zoom, pos.y + 18 * this.zoom, 22 * this.zoom, 10 * this.zoom, -0.4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderTileBuilding(tile, pos) {
    let spriteKey = null;

    if (tile.building) {
      spriteKey = tile.building;
    } else if (tile.type === 'road') {
      spriteKey = 'road_h';
    } else if (['power_pole', 'power_plant', 'water_pump', 'police', 'fire', 'hospital', 'school', 'park', 'landmark'].includes(tile.type)) {
      spriteKey = tile.type;
    }

    if (!spriteKey || !SPRITES[spriteKey]) return;

    const img = SPRITES[spriteKey];
    const drawW = img.width * (this.tileW / 64) * this.zoom;
    const drawH = img.height * (this.tileW / 64) * this.zoom;

    const drawX = pos.x - (drawW / 2);
    const drawY = pos.y + (this.tileH * this.zoom) - drawH;

    this.ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Warning icon if no power
    if (tile.building && !tile.powered && Math.floor(Date.now() / 500) % 2 === 0) {
      if (SPRITES['no_power']) {
        this.ctx.drawImage(SPRITES['no_power'], pos.x - 12 * this.zoom, pos.y - 30 * this.zoom, 24 * this.zoom, 24 * this.zoom);
      }
    }
  }

  renderVehicles() {
    for (const v of this.vehicles.vehicles) {
      const pos = this.gridToScreen(v.x, v.y);
      const img = SPRITES[v.sprite];
      if (img) {
        this.ctx.drawImage(
          img,
          pos.x - 11 * this.zoom,
          pos.y + 6 * this.zoom,
          22 * this.zoom,
          16 * this.zoom
        );
      }
    }
  }

  renderOverlayTile(tile, pos) {
    let color = null;

    if (this.activeOverlay === 'power') {
      color = tile.powered ? 'rgba(59, 130, 246, 0.45)' : 'rgba(239, 68, 68, 0.45)';
    } else if (this.activeOverlay === 'water') {
      color = tile.watered ? 'rgba(6, 182, 212, 0.45)' : 'rgba(245, 158, 11, 0.45)';
    } else if (this.activeOverlay === 'pollution') {
      if (tile.pollution > 0) {
        color = `rgba(168, 85, 247, ${Math.min(0.85, tile.pollution / 100)})`;
      }
    } else if (this.activeOverlay === 'traffic') {
      if (tile.type === 'road') color = 'rgba(16, 185, 129, 0.45)';
    }

    if (color) {
      this.drawTileHighlight(pos, color, true);
    }
  }

  drawTileHighlight(pos, strokeOrFillColor, fillMode = false) {
    const w = this.tileW * this.zoom;
    const h = this.tileH * this.zoom;

    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
    this.ctx.lineTo(pos.x + w / 2, pos.y + h / 2);
    this.ctx.lineTo(pos.x, pos.y + h);
    this.ctx.lineTo(pos.x - w / 2, pos.y + h / 2);
    this.ctx.closePath();

    if (fillMode) {
      this.ctx.fillStyle = strokeOrFillColor;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = strokeOrFillColor;
      this.ctx.lineWidth = 2 * this.zoom;
      this.ctx.stroke();
    }
  }
}
