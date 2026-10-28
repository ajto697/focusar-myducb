/* -------------------------------------------------------------
 * PIXELOPOLIS - CITY SIMULATION ENGINE
 * Simulates city growth, RCI demand, power/water flood fills,
 * economy, population, land value, and day/night environment.
 * ------------------------------------------------------------- */

class CitySimulation {
  constructor(gridSize = 40) {
    this.gridSize = gridSize;
    this.grid = [];

    // City Stats
    this.cityName = "Pixelopolis";
    this.funds = 50000;
    this.population = 0;
    this.jobs = 0;
    this.happiness = 85;
    
    // RCI Demand (-100 to +100)
    this.rDemand = 70;
    this.cDemand = 50;
    this.iDemand = 60;

    // Taxes & Expenses
    this.rTax = 9;
    this.cTax = 9;
    this.iTax = 9;
    this.taxRevenue = 0;
    this.serviceExpenses = 0;
    this.netIncome = 0;

    // Time & Date System
    this.year = 2026;
    this.month = 1;
    this.day = 1;
    this.hour = 12; // 0 to 23
    this.gameSpeed = 1; // 0=Paused, 1=Normal, 2=Fast, 5=Ultra
    this.dayNightFactor = 0; // 0 = Day, 1 = Night

    // Infrastructure Counts
    this.powerPlants = 0;
    this.waterPumps = 0;
    this.poweredTilesCount = 0;
    this.wateredTilesCount = 0;

    this.initGrid();
  }

  // Initialize Tile Matrix
  initGrid() {
    this.grid = [];
    for (let x = 0; x < this.gridSize; x++) {
      this.grid[x] = [];
      for (let y = 0; y < this.gridSize; y++) {
        // Create natural river winding across map
        const isWater = (x > 15 && x < 20 && y > 5 && y < 35);
        const isDirt = Math.random() < 0.05;

        this.grid[x][y] = {
          x, y,
          type: isWater ? 'water' : (isDirt ? 'dirt' : 'grass'),
          variant: Math.floor(Math.random() * 3),
          building: null, // 'res_1', 'power_plant', etc.
          level: 0,
          powered: false,
          watered: false,
          residents: 0,
          jobs: 0,
          pollution: 0,
          landValue: 50,
          fireRisk: 10,
          crimeRisk: 10,
          age: 0
        };
      }
    }
  }

  // Get tile safely
  getTile(x, y) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return null;
    return this.grid[x][y];
  }

  // Main Simulation Step (Called on timer tick)
  tick() {
    if (this.gameSpeed === 0) return;

    // 1. Advance Time
    this.hour += 1;
    if (this.hour >= 24) {
      this.hour = 0;
      this.day += 1;
    }
    if (this.day > 30) {
      this.day = 1;
      this.month += 1;
      this.monthlyEconomyUpdate();
    }
    if (this.month > 12) {
      this.month = 1;
      this.year += 1;
    }

    // Calculate Day/Night Lighting Filter (Smooth transition)
    // Noon at 12 = 0.0, Midnight at 0 = 0.85
    const angle = ((this.hour - 12) / 24) * 2 * Math.PI;
    this.dayNightFactor = Math.max(0, Math.sin(angle) * 0.85);

    // 2. Run Infrastructure Flood Fill (Power & Water Grid)
    this.updatePowerAndWaterGrid();

    // 3. Update RCI Demand Metrics
    this.updateRCIDemand();

    // 4. Update Building Growth & Upgrades
    this.updateBuildingGrowth();

    // 5. Calculate Total Population & Jobs
    this.calculateStats();
  }

  // Flood Fill algorithm for Power and Water propagation
  updatePowerAndWaterGrid() {
    let totalPowerSupply = 0;
    let totalWaterSupply = 0;
    const powerSources = [];
    const waterSources = [];

    // Reset powered/watered status across map
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        const tile = this.grid[x][y];
        tile.powered = false;
        tile.watered = false;

        if (tile.type === 'power_plant') {
          totalPowerSupply += 50; // Each plant powers 50 tiles
          powerSources.push(tile);
        }
        if (tile.type === 'water_pump') {
          totalWaterSupply += 50; // Each pump supplies 50 tiles
          waterSources.push(tile);
        }
      }
    }

    // Power Flood Fill Queue
    let powerCap = totalPowerSupply;
    const pQueue = [...powerSources];
    const pVisited = new Set();

    while (pQueue.length > 0 && powerCap > 0) {
      const curr = pQueue.shift();
      const key = `${curr.x},${curr.y}`;
      if (pVisited.has(key)) continue;
      pVisited.add(key);

      curr.powered = true;
      powerCap--;

      // Neighbors (Orthogonal)
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dx, dy] of dirs) {
        const nb = this.getTile(curr.x + dx, curr.y + dy);
        if (nb && !pVisited.has(`${nb.x},${nb.y}`)) {
          // Power flows along power poles, roads, or adjacent buildings
          if (['power_pole', 'road', 'power_plant'].includes(nb.type) || nb.building) {
            pQueue.push(nb);
          }
        }
      }
    }

    // Water Flood Fill Queue
    let waterCap = totalWaterSupply;
    const wQueue = [...waterSources];
    const wVisited = new Set();

    while (wQueue.length > 0 && waterCap > 0) {
      const curr = wQueue.shift();
      const key = `${curr.x},${curr.y}`;
      if (wVisited.has(key)) continue;
      wVisited.add(key);

      curr.watered = true;
      waterCap--;

      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dx, dy] of dirs) {
        const nb = this.getTile(curr.x + dx, curr.y + dy);
        if (nb && !wVisited.has(`${nb.x},${nb.y}`)) {
          if (['water_pump', 'road'].includes(nb.type) || nb.building) {
            wQueue.push(nb);
          }
        }
      }
    }
  }

  // Update RCI Demand Formulas
  updateRCIDemand() {
    const jobRatio = (this.jobs + 10) / (this.population + 10);
    
    // High jobs -> Needs residents (R demand up)
    this.rDemand = Math.min(100, Math.max(-50, Math.floor((1 - jobRatio) * 100 + (12 - this.rTax) * 5)));
    
    // High pop -> Needs shops (C demand up)
    this.cDemand = Math.min(100, Math.max(-50, Math.floor((this.population / 20) - (this.jobs / 15) + (12 - this.cTax) * 4)));
    
    // Needs factories for industrial jobs
    this.iDemand = Math.min(100, Math.max(-50, Math.floor((this.population / 15) - (this.jobs / 10) + (12 - this.iTax) * 4)));
  }

  // Check building growth & level upgrades
  updateBuildingGrowth() {
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        const tile = this.grid[x][y];

        // 1. ZONED RESIDENTIAL GROWTH
        if (tile.type === 'zone_r') {
          if (tile.powered && tile.watered && this.rDemand > 0) {
            tile.age++;
            if (!tile.building && Math.random() < 0.15) {
              tile.building = 'res_1';
              tile.level = 1;
              tile.residents = 4;
              if (typeof AUDIO !== 'undefined') AUDIO.playBuildSound();
            } else if (tile.level > 0 && tile.level < 4 && tile.age > 20 && Math.random() < 0.08) {
              // Upgrade level!
              tile.level++;
              tile.building = `res_${tile.level}`;
              tile.residents = tile.level * 15;
              tile.age = 0;
            }
          }
        }

        // 2. ZONED COMMERCIAL GROWTH
        else if (tile.type === 'zone_c') {
          if (tile.powered && tile.watered && this.cDemand > 0) {
            tile.age++;
            if (!tile.building && Math.random() < 0.15) {
              tile.building = 'com_1';
              tile.level = 1;
              tile.jobs = 5;
              if (typeof AUDIO !== 'undefined') AUDIO.playBuildSound();
            } else if (tile.level > 0 && tile.level < 4 && tile.age > 20 && Math.random() < 0.08) {
              tile.level++;
              tile.building = `com_${tile.level}`;
              tile.jobs = tile.level * 18;
              tile.age = 0;
            }
          }
        }

        // 3. ZONED INDUSTRIAL GROWTH
        else if (tile.type === 'zone_i') {
          if (tile.powered && tile.watered && this.iDemand > 0) {
            tile.age++;
            if (!tile.building && Math.random() < 0.15) {
              tile.building = 'ind_1';
              tile.level = 1;
              tile.jobs = 8;
              tile.pollution = 20;
              if (typeof AUDIO !== 'undefined') AUDIO.playBuildSound();
            } else if (tile.level > 0 && tile.level < 4 && tile.age > 20 && Math.random() < 0.08) {
              tile.level++;
              tile.building = `ind_${tile.level}`;
              tile.jobs = tile.level * 25;
              tile.pollution = tile.level * 25;
              tile.age = 0;
            }
          }
        }
      }
    }
  }

  // Calculate Population, Total Jobs & Happiness
  calculateStats() {
    let pop = 0;
    let jobCount = 0;
    let poweredTiles = 0;
    let totalBuildings = 0;

    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        const tile = this.grid[x][y];
        if (tile.building || tile.residents > 0) {
          totalBuildings++;
          pop += tile.residents || 0;
          jobCount += tile.jobs || 0;
          if (tile.powered) poweredTiles++;
        }
      }
    }

    this.population = pop;
    this.jobs = jobCount;

    // Happiness Formula
    const powerCoverage = totalBuildings > 0 ? (poweredTiles / totalBuildings) : 1;
    const taxPenalty = Math.max(0, (this.rTax - 10) * 3);
    this.happiness = Math.floor(Math.min(100, Math.max(20, (powerCoverage * 80 + 15) - taxPenalty)));
  }

  // Monthly Financial Statement (Taxes vs Upkeep)
  monthlyEconomyUpdate() {
    // Income from taxes
    this.taxRevenue = Math.floor(
      (this.population * 2 * (this.rTax / 10)) +
      (this.jobs * 1.5 * (this.cTax / 10))
    );

    // Expenses for maintenance
    let upkeep = 0;
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        const t = this.grid[x][y];
        if (t.type === 'power_plant') upkeep += 200;
        if (t.type === 'water_pump') upkeep += 150;
        if (['police', 'fire', 'hospital', 'school'].includes(t.type)) upkeep += 100;
        if (t.type === 'road') upkeep += 1;
      }
    }

    this.serviceExpenses = upkeep;
    this.netIncome = this.taxRevenue - this.serviceExpenses;
    this.funds += this.netIncome;

    if (typeof AUDIO !== 'undefined') AUDIO.playMoneySound();
  }

  // Place a tile or building
  buildTile(x, y, toolType) {
    const tile = this.getTile(x, y);
    if (!tile || tile.type === 'water') return false;

    // Costs lookup
    const costs = {
      'road': 20,
      'power_pole': 10,
      'power_plant': 1500,
      'water_pump': 1000,
      'zone_r': 50,
      'zone_c': 50,
      'zone_i': 50,
      'police': 500,
      'fire': 500,
      'hospital': 800,
      'school': 600,
      'park': 150,
      'landmark': 5000,
      'demolish': 10
    };

    const cost = costs[toolType] || 0;
    if (this.funds < cost) return false;

    if (toolType === 'demolish') {
      tile.type = 'grass';
      tile.building = null;
      tile.level = 0;
      tile.residents = 0;
      tile.jobs = 0;
      tile.pollution = 0;
      this.funds -= cost;
      if (typeof AUDIO !== 'undefined') AUDIO.playDemolishSound();
      return true;
    }

    // Place tool
    if (['zone_r', 'zone_c', 'zone_i'].includes(toolType)) {
      tile.type = toolType;
      tile.building = null;
      tile.level = 0;
    } else {
      tile.type = toolType;
      tile.building = toolType; // Fixed civic building
    }

    this.funds -= cost;
    if (typeof AUDIO !== 'undefined') AUDIO.playBuildSound();
    return true;
  }
}
