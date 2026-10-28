/* -------------------------------------------------------------
 * PIXELOPOLIS - MAIN BOOTSTRAP & GAME LOOP
 * Initializes modules, binds mouse/touch controls & runs render loop.
 * ------------------------------------------------------------- */

window.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 Bootstrapping Pixelopolis City Builder...");

  // 1. Generate & Cache all Isometric Pixel Art Sprites
  SPRITES = SPRITE_ENGINE.init();

  // 2. Initialize Core Game Modules
  const sim = new CitySimulation(40);
  const vehicles = new VehicleManager(sim);
  const canvas = document.getElementById('gameCanvas');
  const renderer = new IsoRenderer(canvas, sim, vehicles);
  const ui = new UIController(sim, renderer);

  // Load Metropolis Preset by default for instant visual WOW!
  ui.loadMetropolisPreset();

  // 3. Mouse Controls for Isometric Camera Pan, Zoom & Tile Clicks
  let isPointerDown = false;
  let startX = 0;
  let startY = 0;
  let moved = false;

  canvas.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    startX = e.clientX;
    startY = e.clientY;
    moved = false;
  });

  canvas.addEventListener('pointermove', (e) => {
    // Update Hover Grid Tile
    const grid = renderer.screenToGrid(e.clientX, e.clientY);
    renderer.hoverX = grid.x;
    renderer.hoverY = grid.y;

    if (isPointerDown) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        moved = true;
        renderer.cameraX += dx;
        renderer.cameraY += dy;
        startX = e.clientX;
        startY = e.clientY;
      }
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    if (isPointerDown && !moved) {
      // Tile Click Action!
      const grid = renderer.screenToGrid(e.clientX, e.clientY);
      const tile = sim.getTile(grid.x, grid.y);

      if (tile) {
        if (ui.activeTool === 'info') {
          ui.inspectTile(tile);
        } else {
          const success = sim.buildTile(grid.x, grid.y, ui.activeTool);
          if (success) {
            sim.updatePowerAndWaterGrid();
            sim.calculateStats();
          } else {
            ui.showToast("⚠️ Không đủ ngân sách hoặc không thể xây ở đây!");
          }
        }
      }
    }
    isPointerDown = false;
  });

  // Mouse Wheel Zoom
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.max(0.5, Math.min(2.5, renderer.zoom * zoomFactor));

    // Zoom towards mouse cursor
    renderer.cameraX = e.clientX - (e.clientX - renderer.cameraX) * (newZoom / renderer.zoom);
    renderer.cameraY = e.clientY - (e.clientY - renderer.cameraY) * (newZoom / renderer.zoom);
    renderer.zoom = newZoom;
  }, { passive: false });

  // 4. Simulation Ticker Loop (Runs every 400ms)
  setInterval(() => {
    sim.tick();
    vehicles.update(0.4);
    ui.updateTopBar();
  }, 400);

  // 5. High-FPS Render Loop (RequestAnimationFrame)
  function animLoop() {
    renderer.render();
    requestAnimationFrame(animLoop);
  }
  animLoop();

  console.log("🎮 Pixelopolis Game Engine is Running!");
});
