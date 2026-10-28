/* -------------------------------------------------------------
 * PIXELOPOLIS - PIXEL TRAFFIC & VEHICLE SIMULATION ENGINE
 * Spawns pixel cars on road networks and animates their pathfinding.
 * ------------------------------------------------------------- */

class VehicleManager {
  constructor(sim) {
    this.sim = sim;
    this.vehicles = [];
    this.maxVehicles = 30;
  }

  update(dt) {
    // 1. Maintain vehicle population based on city size
    const targetVehicles = Math.min(this.maxVehicles, Math.floor(this.sim.population / 20) + 3);

    if (this.vehicles.length < targetVehicles && Math.random() < 0.1) {
      this.spawnVehicle();
    }

    // 2. Move existing vehicles
    for (let i = this.vehicles.length - 1; i >= 0; i--) {
      const v = this.vehicles[i];
      
      // Move towards target tile
      const dx = v.targetX - v.x;
      const dy = v.targetY - v.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.05) {
        // Reached target tile -> Find next adjacent road tile
        v.gridX = Math.round(v.targetX);
        v.gridY = Math.round(v.targetY);
        const nextTile = this.getNextRoadTile(v.gridX, v.gridY, v.lastX, v.lastY);

        if (nextTile) {
          v.lastX = v.gridX;
          v.lastY = v.gridY;
          v.targetX = nextTile.x;
          v.targetY = nextTile.y;
        } else {
          // Despawn car if dead end reached
          this.vehicles.splice(i, 1);
        }
      } else {
        const speed = 0.04 * this.sim.gameSpeed;
        v.x += (dx / dist) * speed;
        v.y += (dy / dist) * speed;
      }
    }
  }

  // Find a random road tile to spawn a vehicle
  spawnVehicle() {
    const roads = [];
    for (let x = 0; x < this.sim.gridSize; x++) {
      for (let y = 0; y < this.sim.gridSize; y++) {
        if (this.sim.grid[x][y].type === 'road') {
          roads.push({ x, y });
        }
      }
    }

    if (roads.length === 0) return;

    const start = roads[Math.floor(Math.random() * roads.length)];
    const types = ['car_red', 'car_blue', 'car_yellow', 'car_police', 'car_fire'];
    const carSprite = types[Math.floor(Math.random() * types.length)];

    this.vehicles.push({
      x: start.x,
      y: start.y,
      gridX: start.x,
      gridY: start.y,
      targetX: start.x,
      targetY: start.y,
      lastX: start.x,
      lastY: start.y,
      sprite: carSprite
    });
  }

  // Get next connected road tile
  getNextRoadTile(gx, gy, lastX, lastY) {
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const valid = [];

    for (const [dx, dy] of dirs) {
      const nx = gx + dx;
      const ny = gy + dy;

      // Don't immediately turn back unless required
      if (nx === lastX && ny === lastY) continue;

      const tile = this.sim.getTile(nx, ny);
      if (tile && tile.type === 'road') {
        valid.push(tile);
      }
    }

    if (valid.length > 0) {
      return valid[Math.floor(Math.random() * valid.length)];
    }

    // U-turn fallback
    const fallback = this.sim.getTile(lastX, lastY);
    if (fallback && fallback.type === 'road') return fallback;
    return null;
  }
}
