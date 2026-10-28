/* -------------------------------------------------------------
 * PIXELOPOLIS - USER INTERFACE CONTROLLER & PRESETS
 * Manages category submenus, toolbar selections, inspector drawer,
 * budget modals, preset city maps, and toast notifications.
 * ------------------------------------------------------------- */

class UIController {
  constructor(sim, renderer) {
    this.sim = sim;
    this.renderer = renderer;
    this.activeTool = 'info';

    this.toolsConfig = {
      info: [
        { id: 'info', icon: '🔍', name: 'Soi chi tiết', cost: 0 }
      ],
      demolish: [
        { id: 'demolish', icon: '🚜', name: 'Phá hủy', cost: 10 }
      ],
      infra: [
        { id: 'road', icon: '🛣️', name: 'Đường nhựa', cost: 20 }
      ],
      utility: [
        { id: 'power_pole', icon: '🪵', name: 'Cột điện', cost: 10 },
        { id: 'power_plant', icon: '⚡', name: 'Nhà máy điện', cost: 1500 },
        { id: 'water_pump', icon: '💧', name: 'Trạm bơm nước', cost: 1000 }
      ],
      zones: [
        { id: 'zone_r', icon: '🏡', name: 'Vùng Dân cư (R)', cost: 50 },
        { id: 'zone_c', icon: '🏪', name: 'Vùng Thương mại (C)', cost: 50 },
        { id: 'zone_i', icon: '🏭', name: 'Vùng Công nghiệp (I)', cost: 50 }
      ],
      services: [
        { id: 'police', icon: '🚔', name: 'Đồn Công an', cost: 500 },
        { id: 'fire', icon: '🚒', name: 'Trạm Cứu hỏa', cost: 500 },
        { id: 'hospital', icon: '🏥', name: 'Bệnh viện', cost: 800 },
        { id: 'school', icon: '🏫', name: 'Trường học', cost: 600 }
      ],
      parks: [
        { id: 'park', icon: '🌲', name: 'Công viên', cost: 150 },
        { id: 'landmark', icon: '🗼', name: 'Tháp Landmark', cost: 5000 }
      ]
    };

    this.bindEvents();
    this.renderCategoryItems('info');
  }

  bindEvents() {
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderCategoryItems(btn.dataset.cat);
      });
    });

    document.querySelectorAll('.speed-btn[data-speed]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.sim.gameSpeed = parseInt(btn.dataset.speed);
      });
    });

    document.getElementById('pauseBtn').addEventListener('click', (e) => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      this.sim.gameSpeed = 0;
    });

    document.querySelectorAll('.overlay-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.overlay-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderer.activeOverlay = btn.dataset.overlay;
      });
    });

    document.getElementById('audioToggleBtn').addEventListener('click', () => {
      const enabled = AUDIO.toggle();
      document.getElementById('audioToggleBtn').innerText = enabled ? '🔊' : '🔇';
      this.showToast(enabled ? "Đã bật Âm thanh" : "Đã tắt Âm thanh");
    });

    document.getElementById('startAudioBtn').addEventListener('click', () => {
      AUDIO.init();
      document.getElementById('audioOverlay').style.display = 'none';
    });

    const bModal = document.getElementById('budgetModal');
    document.getElementById('budgetModalBtn').addEventListener('click', () => {
      this.updateBudgetUI();
      bModal.classList.remove('hidden');
    });
    document.getElementById('closeBudgetBtn').addEventListener('click', () => {
      bModal.classList.add('hidden');
    });

    ['rTax', 'cTax', 'iTax'].forEach(taxKey => {
      const slider = document.getElementById(`${taxKey}Slider`);
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.sim[taxKey] = val;
        document.getElementById(`${taxKey}Label`).innerText = `${val}%`;
        this.updateBudgetUI();
      });
    });

    // Gallery Modal
    const gModal = document.getElementById('galleryModal');
    document.getElementById('artGalleryBtn').addEventListener('click', () => {
      gModal.classList.remove('hidden');
    });
    document.getElementById('closeGalleryBtn').addEventListener('click', () => {
      gModal.classList.add('hidden');
    });

    const pModal = document.getElementById('presetModal');
    document.getElementById('presetBtn').addEventListener('click', () => {
      pModal.classList.remove('hidden');
    });
    document.getElementById('closePresetBtn').addEventListener('click', () => {
      pModal.classList.add('hidden');
    });

    document.getElementById('presetEmpty').addEventListener('click', () => {
      this.sim.initGrid();
      pModal.classList.add('hidden');
      this.showToast("Đã tải bản đồ hoang sơ New Hope Valley!");
    });

    document.getElementById('presetCity').addEventListener('click', () => {
      this.loadMetropolisPreset();
      pModal.classList.add('hidden');
      this.showToast("Đã tải bản đồ siêu đô thị Pixel Metropolis!");
    });

    document.getElementById('closeDrawerBtn').addEventListener('click', () => {
      document.getElementById('inspectorDrawer').classList.add('hidden');
    });

    document.getElementById('renameCityBtn').addEventListener('click', () => {
      const newName = prompt("Nhập tên mới cho thành phố:", this.sim.cityName);
      if (newName && newName.trim() !== '') {
        this.sim.cityName = newName.trim();
        document.getElementById('cityNameDisplay').innerText = this.sim.cityName;
      }
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
      localStorage.setItem('pixelopolis_save', JSON.stringify({
        sim: {
          cityName: this.sim.cityName,
          funds: this.sim.funds,
          year: this.sim.year,
          month: this.sim.month,
          day: this.sim.day,
          grid: this.sim.grid
        }
      }));
      this.showToast("💾 Đã lưu thành phố thành công!");
    });

    document.getElementById('loadBtn').addEventListener('click', () => {
      const dataStr = localStorage.getItem('pixelopolis_save');
      if (!dataStr) {
        this.showToast("⚠️ Không tìm thấy bản lưu!");
        return;
      }
      const data = JSON.parse(dataStr);
      this.sim.cityName = data.sim.cityName;
      this.sim.funds = data.sim.funds;
      this.sim.year = data.sim.year;
      this.sim.month = data.sim.month;
      this.sim.day = data.sim.day;
      this.sim.grid = data.sim.grid;
      document.getElementById('cityNameDisplay').innerText = this.sim.cityName;
      this.showToast("📂 Đã tải lại bản lưu thành phố!");
    });
  }

  renderCategoryItems(categoryKey) {
    const container = document.getElementById('toolItems');
    container.innerHTML = '';

    const items = this.toolsConfig[categoryKey] || [];
    items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = `tool-item-btn ${this.activeTool === item.id ? 'active' : ''}`;
      btn.innerHTML = `<span class="item-icon">${item.icon}</span><span class="item-label">${item.name}</span>`;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-item-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTool = item.id;
        document.getElementById('toolNameDisplay').innerText = item.name;
        document.getElementById('toolCostDisplay').innerText = `Chi phí: $${item.cost}`;
        AUDIO.playClick();
      });

      container.appendChild(btn);
    });
  }

  updateTopBar() {
    document.getElementById('fundsVal').innerText = `$${this.sim.funds.toLocaleString()}`;
    document.getElementById('popVal').innerText = this.sim.population.toLocaleString();
    document.getElementById('happyVal').innerText = `${this.sim.happiness}%`;

    const months = ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6", "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"];
    document.getElementById('dateVal').innerText = `${months[this.sim.month - 1]}, N${this.sim.year}`;

    document.getElementById('rDemandBar').style.height = `${Math.max(10, (this.sim.rDemand + 50) * 0.7)}%`;
    document.getElementById('cDemandBar').style.height = `${Math.max(10, (this.sim.cDemand + 50) * 0.7)}%`;
    document.getElementById('iDemandBar').style.height = `${Math.max(10, (this.sim.iDemand + 50) * 0.7)}%`;
  }

  inspectTile(tile) {
    const drawer = document.getElementById('inspectorDrawer');
    const title = document.getElementById('inspectTitle');
    const body = document.getElementById('inspectContent');

    title.innerText = `Ô đất (${tile.x}, ${tile.y})`;

    const names = {
      grass: 'Thảm cỏ tự nhiên',
      dirt: 'Đất trống',
      water: 'Dòng sông cuộn sóng',
      road: 'Đường nhựa 2 làn',
      power_plant: 'Nhà máy Điện hạt nhân',
      power_pole: 'Cột điện cao thế',
      water_pump: 'Trạm bơm Nước sạch',
      zone_r: 'Phân vùng Dân cư (R)',
      zone_c: 'Phân vùng Thương mại (C)',
      zone_i: 'Phân vùng Công nghiệp (I)',
      police: 'Đồn Cảnh sát Thành phố',
      fire: 'Trạm Cứu hỏa PCCC',
      hospital: 'Bệnh viện Đa khoa',
      school: 'Trường học Thành phố',
      park: 'Công viên cây xanh & Đài phun nước',
      landmark: 'Tháp truyền hình Landmark'
    };

    const tileName = names[tile.building] || names[tile.type] || tile.type;

    body.innerHTML = `
      <div class="info-row"><span>Công trình:</span><span>${tileName}</span></div>
      <div class="info-row"><span>Cấp độ:</span><span>Level ${tile.level || 1}</span></div>
      <div class="info-row"><span>Nguồn Điện:</span><span style="color:${tile.powered ? '#4ade80':'#ef4444'}">${tile.powered ? 'Đã cấp điện ⚡' : 'Chưa có điện 🚫'}</span></div>
      <div class="info-row"><span>Nguồn Nước:</span><span style="color:${tile.watered ? '#38bdf8':'#ef4444'}">${tile.watered ? 'Đã cấp nước 💧' : 'Chưa có nước 🚫'}</span></div>
      <div class="info-row"><span>Cư dân:</span><span>${tile.residents || 0} người</span></div>
      <div class="info-row"><span>Việc làm:</span><span>${tile.jobs || 0} chỗ</span></div>
      <div class="info-row"><span>Giá trị đất:</span><span>$${tile.landValue}/m²</span></div>
      <div class="info-row"><span>Ô nhiễm:</span><span>${tile.pollution}%</span></div>
      <button class="btn btn-primary" style="margin-top:12px; width:100%; background:var(--accent-red);" id="demolishTileBtn">🚜 Phá hủy ô này ($10)</button>
    `;

    document.getElementById('demolishTileBtn').addEventListener('click', () => {
      this.sim.buildTile(tile.x, tile.y, 'demolish');
      drawer.classList.add('hidden');
      this.showToast("Đã phá hủy công trình!");
    });

    drawer.classList.remove('hidden');
  }

  updateBudgetUI() {
    this.sim.monthlyEconomyUpdate();
    document.getElementById('taxRevenueVal').innerText = `+$${this.sim.taxRevenue.toLocaleString()}`;
    document.getElementById('serviceCostVal').innerText = `-$${this.sim.serviceExpenses.toLocaleString()}`;

    const net = this.sim.netIncome;
    const netEl = document.getElementById('netIncomeVal');
    netEl.innerText = `${net >= 0 ? '+' : ''}$${net.toLocaleString()}`;
    netEl.className = net >= 0 ? 'text-green' : 'text-red';
  }

  showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // Load High-Density "Pixel Metropolis" Mega City Scenario
  loadMetropolisPreset() {
    this.sim.initGrid();
    this.sim.cityName = "Pixel Metropolis";
    this.sim.funds = 250000;

    const g = this.sim.grid;

    // Road Avenues & Grid Streets
    for (let i = 4; i <= 36; i++) {
      if (i !== 17 && i !== 18) {
        g[i][8].type = 'road';
        g[i][16].type = 'road';
        g[i][24].type = 'road';
        g[8][i].type = 'road';
        g[16][i].type = 'road';
        g[24][i].type = 'road';
      }
    }

    // Infrastructure Power & Water
    g[5][5].type = 'power_plant'; g[5][5].building = 'power_plant';
    g[6][5].type = 'power_pole';
    g[7][5].type = 'power_pole';
    g[5][25].type = 'water_pump'; g[5][25].building = 'water_pump';

    // Civics & Public Services
    g[9][9].type = 'police'; g[9][9].building = 'police';
    g[10][9].type = 'fire'; g[10][9].building = 'fire';
    g[11][9].type = 'hospital'; g[11][9].building = 'hospital';
    g[12][9].type = 'school'; g[12][9].building = 'school';
    g[13][9].type = 'park'; g[13][9].building = 'park';
    g[20][12].type = 'landmark'; g[20][12].building = 'landmark';

    // High Density Residential Skyscrapers Block
    for (let r = 9; r <= 15; r++) {
      for (let c = 10; c <= 15; c++) {
        if (g[r][c].type !== 'road') {
          g[r][c].type = 'zone_r';
          const lvl = ((r + c) % 4) + 1;
          g[r][c].level = lvl;
          g[r][c].building = `res_${lvl}`;
          g[r][c].residents = lvl * 25;
        }
      }
    }

    // High Density Commercial Mega Towers Block
    for (let r = 9; r <= 15; r++) {
      for (let c = 17; c <= 23; c++) {
        if (g[r][c].type !== 'road') {
          g[r][c].type = 'zone_c';
          const lvl = ((r * c) % 4) + 1;
          g[r][c].level = lvl;
          g[r][c].building = `com_${lvl}`;
          g[r][c].jobs = lvl * 30;
        }
      }
    }

    // Industrial High-Tech Complex Block
    for (let r = 25; r <= 30; r++) {
      for (let c = 17; c <= 23; c++) {
        if (g[r][c].type !== 'road') {
          g[r][c].type = 'zone_i';
          const lvl = ((r + c) % 4) + 1;
          g[r][c].level = lvl;
          g[r][c].building = `ind_${lvl}`;
          g[r][c].jobs = lvl * 35;
          g[r][c].pollution = lvl * 20;
        }
      }
    }

    this.sim.updatePowerAndWaterGrid();
    this.sim.calculateStats();
  }
}
