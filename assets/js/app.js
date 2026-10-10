// ==========================================================================
// Emil Kowalski Design Engineering Gallery Application
// Multi-Variant Prototyping (Grid / Spotlight / Inspect) + Anti-AI-Slop Architecture
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const data = window.ARTWORKS_DATA || [];

  // Core State
  let currentCategory = "all";
  let currentSubcategory = "all";
  let searchQuery = "";
  let filteredItems = [...data];
  let currentModalIndex = 0;

  // Prototype Variant State ('grid' | 'spotlight' | 'inspect')
  let currentVariant = "grid";
  let spotlightIndex = 0;
  let inspectIndex = 0;

  // Progressive Image Controller (hn-image-loading-optimizer)
  function createProgressiveController(view) {
    let revision = 0;
    return {
      invalidate() { revision += 1; },
      async show({ thumbnail, detail, original, alt = "" }) {
        if (!view) return;
        const req = ++revision;
        view.alt = alt;
        if (thumbnail) view.src = thumbnail;
        const candidate = detail || original;
        if (!candidate || candidate === thumbnail) return;
        try {
          const offscreen = new Image();
          await new Promise((resolve, reject) => {
            const cleanup = () => { offscreen.onload = null; offscreen.onerror = null; };
            offscreen.onload = () => { cleanup(); resolve(); };
            offscreen.onerror = () => { cleanup(); reject(new Error("Image failed: " + candidate)); };
            offscreen.src = candidate;
            if (offscreen.complete && offscreen.naturalWidth > 0) { cleanup(); resolve(); }
          });
          if (typeof offscreen.decode === "function") {
            await offscreen.decode();
          }
          if (req === revision) {
            view.src = offscreen.src;
          }
        } catch (e) {
          // Keep thumbnail visible on failure without breaking UI
        }
      }
    };
  }

  // DOM Elements - General
  const resultCountEl = document.getElementById("resultCount");
  const filterDescEl = document.getElementById("filterDesc");
  const searchInput = document.getElementById("searchInput");
  const subcategoryPillsEl = document.getElementById("subcategoryPills");
  const categoryTabBtns = document.querySelectorAll(".segmented-tab-btn");

  // Surfaces
  const surfaceGrid = document.getElementById("viewGrid");
  const surfaceSpotlight = document.getElementById("viewSpotlight");
  const surfaceInspect = document.getElementById("viewInspect");
  const gridEl = document.getElementById("galleryGrid");

  // Spotlight Elements
  const spotlightImg = document.getElementById("spotlightImg");
  const spotlightKicker = document.getElementById("spotlightKicker");
  const spotlightTitle = document.getElementById("spotlightTitle");
  const spotlightQuote = document.getElementById("spotlightQuote");
  const spotlightQuoteBox = document.getElementById("spotlightQuoteBox");
  const spotlightDesc = document.getElementById("spotlightDesc");
  const spotlightHeroClass = document.getElementById("spotlightHeroClass");
  const spotlightBadge = document.getElementById("spotlightBadge");
  const spotlightAnimeRole = document.getElementById("spotlightAnimeRole");
  const spotlightResolution = document.getElementById("spotlightResolution");
  const spotlightDlBtn = document.getElementById("spotlightDlBtn");
  const spotlightFilmstrip = document.getElementById("spotlightFilmstrip");

  // Inspect Elements
  const inspectImg = document.getElementById("inspectImg");
  const inspectHeroAnchor = document.getElementById("inspectHeroAnchor");
  const inspectFusionAnchor = document.getElementById("inspectFusionAnchor");
  const inspectVfxAnchor = document.getElementById("inspectVfxAnchor");
  const inspectDlLink = document.getElementById("inspectDlLink");
  const inspectSelectorStrip = document.getElementById("inspectSelectorStrip");

  // Proto-Picker (Emil Kowalski spec)
  const protoPicker = document.querySelector(".proto-picker");
  const protoHighlight = document.querySelector(".proto-picker-highlight");
  const protoItems = document.querySelectorAll(".proto-picker-item[data-variant]");
  const protoReplayBtn = document.getElementById("protoReplayBtn");

  // Lightbox Modal
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalQuote = document.getElementById("modalQuote");
  const modalQuoteContainer = document.getElementById("modalQuoteContainer");
  const modalDesc = document.getElementById("modalDesc");
  const modalVfx = document.getElementById("modalVfx");
  const modalVfxContainer = document.getElementById("modalVfxContainer");
  const modalTags = document.getElementById("modalTags");
  const modalFileSize = document.getElementById("modalFileSize");
  const modalDownloadBtn = document.getElementById("modalDownloadBtn");
  const modalPrevBtn = document.getElementById("modalPrevBtn");
  const modalNextBtn = document.getElementById("modalNextBtn");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  // Dynamic Pack Modal
  const packModal = document.getElementById("packProgressModal");
  const packTitle = document.getElementById("packTitle");
  const packStatus = document.getElementById("packStatus");
  const packProgressBar = document.getElementById("packProgressBar");
  const btnPackCurrent = document.getElementById("btnPackCurrent");

  // Subcategories Configuration (No emoji spam, clean editorial naming)
  const SUBCATEGORIES = {
                                                                                          classic_skins: [
      { id: "all", label: "全部经典联动" },
      { id: "classic_dragon_ball", label: "七龙珠" },
      { id: "classic_slam_dunk", label: "灌篮高手" },
      { id: "classic_yu_yu_hakusho", label: "幽游白书" },
      { id: "classic_saint_seiya", label: "圣斗士星矢" },
      { id: "classic_kenshin", label: "浪客剑心" },
      { id: "classic_inuyasha", label: "犬夜叉" },
      { id: "classic_fma", label: "钢之炼金术师" },
      { id: "classic_hxh", label: "全职猎人" },
      { id: "classic_gintama", label: "银魂" },
      { id: "classic_jojo", label: "JOJO" },
      { id: "classic_eva", label: "新世纪福音战士" },
      { id: "classic_conan", label: "名侦探柯南" },
      { id: "classic_opm", label: "一拳超人" },
      { id: "classic_yugioh", label: "游戏王" }
    ],
      all: [
      { id: "all", label: "全部所有" },
      { id: "fusion_skins", label: `💎 英雄深度联动 (${data.filter(item => item.category === "fusion_skins").length}/45)` },
      { id: "v2_test_skins", label: "真机首测" },
      { id: "folk_national_day", label: "国庆篇" },
      { id: "folk_daily", label: "水乡日常" },
      { id: "01_demon_slayer", label: "鬼灭之刃" },
      { id: "02_jujutsu_kaisen", label: "咒术回战" },
      { id: "03_attack_on_titan", label: "进击的巨人" },
      { id: "04_naruto", label: "火影忍者" },
      { id: "05_one_piece", label: "海贼王" },
      { id: "06_bleach", label: "死神 BLEACH" }
    ],
    fusion_skins: [
      { id: "all", label: `全部深度联动 (${data.filter(item => item.category === "fusion_skins").length}/45)` },
      { id: "fusion_demon_slayer", label: "🔥 鬼灭之刃 (20/20)" },
      { id: "fusion_jujutsu_kaisen", label: "👁️ 咒术回战 (5/5)" },
      { id: "fusion_attack_on_titan", label: "⚔️ 进击的巨人 (5/5)" },
      { id: "fusion_naruto", label: "🍥 火影忍者 (5/5)" },
      { id: "fusion_one_piece", label: "🏴‍☠️ 海贼王 (4/5)" },
      { id: "fusion_bleach", label: "🗡️ 死神 BLEACH (5/5)" }
    ],
    v2_test_skins: [
      { id: "all", label: "全部首测" },
      { id: "v2_demon_slayer", label: "鬼灭之刃" },
      { id: "v2_jujutsu_kaisen", label: "咒术回战" },
      { id: "v2_attack_on_titan", label: "进击的巨人" },
      { id: "v2_naruto", label: "火影忍者" },
      { id: "v2_one_piece", label: "海贼王" },
      { id: "v2_bleach", label: "死神 BLEACH" }
    ],
    folk_art: [
      { id: "all", label: "全部农民画" },
      { id: "folk_national_day", label: "盛世华诞篇" },
      { id: "folk_daily", label: "水乡岁月篇" }
    ],
    wzry_skins: [
      { id: "all", label: "全部初版立绘" },
      { id: "01_demon_slayer", label: "鬼灭之刃" },
      { id: "02_jujutsu_kaisen", label: "咒术回战" },
      { id: "03_attack_on_titan", label: "进击的巨人" },
      { id: "04_naruto", label: "火影忍者" },
      { id: "05_one_piece", label: "海贼王" },
      { id: "06_bleach", label: "死神 BLEACH" }
    ]
  };

  // ------------------------------------------------------------------------
  // Emil Kowalski Proto-Picker Controller
  // ------------------------------------------------------------------------
  function updatePickerHighlight(activeItem) {
    if (!activeItem || !protoHighlight || !protoPicker) return;
    const itemRect = activeItem.getBoundingClientRect();
    const pickerRect = protoPicker.getBoundingClientRect();
    const leftOffset = itemRect.left - pickerRect.left;
    protoHighlight.style.width = `${itemRect.width}px`;
    protoHighlight.style.transform = `translateX(${leftOffset}px)`;
  }

  function setVariant(variantName) {
    currentVariant = variantName;

    // Update buttons
    protoItems.forEach(item => {
      if (item.getAttribute("data-variant") === variantName) {
        item.setAttribute("data-active", "");
        item.setAttribute("aria-current", "true");
        updatePickerHighlight(item);
      } else {
        item.removeAttribute("data-active");
        item.removeAttribute("aria-current");
      }
    });

    // Update surfaces
    surfaceGrid.classList.toggle("active", variantName === "grid");
    surfaceSpotlight.classList.toggle("active", variantName === "spotlight");
    surfaceInspect.classList.toggle("active", variantName === "inspect");

    if (variantName === "spotlight") {
      renderSpotlight();
    } else if (variantName === "inspect") {
      renderInspect();
    } else {
      renderGrid();
    }
  }

  // Init picker position
  const initialActive = protoPicker ? protoPicker.querySelector(".proto-picker-item[data-active]") : null;
  if (initialActive) {
    updatePickerHighlight(initialActive);
    // Enable slide transition after first paint
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (protoPicker) protoPicker.setAttribute("data-ready", "");
      }, 50);
    });
  }

  // Picker item click
  protoItems.forEach(item => {
    item.addEventListener("click", () => {
      const variant = item.getAttribute("data-variant");
      setVariant(variant);
    });
  });

  // Replay entrance transition
  if (protoReplayBtn) {
    protoReplayBtn.addEventListener("click", () => {
      const activeSurface = document.querySelector(".view-surface.active");
      if (activeSurface) {
        activeSurface.classList.remove("active");
        void activeSurface.offsetWidth; // trigger reflow
        activeSurface.classList.add("active");
      }
    });
  }

  // Window resize updates highlight
  window.addEventListener("resize", () => {
    const active = protoPicker ? protoPicker.querySelector(".proto-picker-item[data-active]") : null;
    if (active) updatePickerHighlight(active);
  });

  // ------------------------------------------------------------------------
  // Filtering & Search
  // ------------------------------------------------------------------------
  function renderSubcategoryPills() {
    const list = SUBCATEGORIES[currentCategory] || SUBCATEGORIES.all;
    subcategoryPillsEl.innerHTML = list.map(sub => `
      <button type="button" class="pill-btn ${currentSubcategory === sub.id ? 'active' : ''}" data-sub="${sub.id}">
        ${sub.label}
      </button>
    `).join("");

    subcategoryPillsEl.querySelectorAll(".pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        currentSubcategory = btn.getAttribute("data-sub");
        renderSubcategoryPills();
        filterAndRender();
      });
    });
  }

  function filterAndRender() {
    filteredItems = data.filter(item => {
      // Category match
      let matchCat = false;
      if (currentCategory === "all") {
        matchCat = true;
      } else if (currentCategory === item.category) {
        matchCat = true;
      }

      // Subcategory match
      let matchSub = false;
      if (currentSubcategory === "all") {
        matchSub = true;
      } else if (item.subcategory === currentSubcategory || item.category === currentSubcategory) {
        matchSub = true;
      }

      // Search match
      let matchSearch = true;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const str = [
          item.title,
          item.hero,
          item.anime_role,
          item.desc,
          item.quote,
          item.subcategory_name,
          ...(item.tags || [])
        ].filter(Boolean).join(" ").toLowerCase();
        matchSearch = str.includes(q);
      }

      return matchCat && matchSub && matchSearch;
    });

    // Update count & descriptions
    resultCountEl.innerText = filteredItems.length;
    let desc = "全部作品";
    if (currentCategory === "fusion_skins") desc = "英雄深度联动全集";
    else if (currentCategory === "v2_test_skins") desc = "真机画风首测";
    else if (currentCategory === "folk_art") desc = "民间农民画";
    else if (currentCategory === "wzry_skins") desc = "初版立绘存档";

    if (currentSubcategory !== "all") {
      const activePill = subcategoryPillsEl.querySelector(".pill-btn.active");
      if (activePill) desc += ` · ${activePill.innerText}`;
    }
    if (searchQuery) desc += ` (检索: "${searchQuery}")`;
    filterDescEl.innerText = desc;

    // Reset indices if out of bounds
    if (spotlightIndex >= filteredItems.length) spotlightIndex = 0;
    if (inspectIndex >= filteredItems.length) inspectIndex = 0;

    // Render active surface
    if (currentVariant === "grid") renderGrid();
    else if (currentVariant === "spotlight") renderSpotlight();
    else if (currentVariant === "inspect") renderInspect();
  }

  // ------------------------------------------------------------------------
  // Variant 1: Editorial Grid
  // ------------------------------------------------------------------------
  function renderGrid() {
    if (filteredItems.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 64px 20px; color: var(--text-tertiary);">
          <div style="font-size: 14px; margin-bottom: 6px; color: var(--text-secondary);">未找到匹配作品</div>
          <p style="font-size: 13px;">请尝试切换分类或清空检索关键词</p>
        </div>
      `;
      return;
    }

    // Progressive Image Loading Controllers (hn-image-loading-optimizer)
    if (!window._modalProgressive) {
      window._modalProgressive = createProgressiveController(modalImg);
      window._spotlightProgressive = createProgressiveController(spotlightImg);
      window._inspectProgressive = createProgressiveController(inspectImg);
    }

    gridEl.innerHTML = filteredItems.map((item, idx) => {
      const isPortrait = item.category === "folk_art";
      const isGlorious = (item.badge || "").includes("典藏");
      const isTopFold = idx < 4;

      return `
        <article class="art-card ${isPortrait ? 'portrait' : ''}" data-index="${idx}">
          <div class="art-card-img-wrapper" onclick="openLightbox(${idx})">
            <span class="card-badge ${isGlorious ? 'badge-glorious' : ''}">${item.badge || '限定'}</span>
            <img class="art-card-img" src="${item.rel_thumb}" loading="${isTopFold ? 'eager' : 'lazy'}" ${isTopFold ? 'fetchpriority="high"' : ''} decoding="async" alt="${item.title}" />
            <div class="card-quick-actions" onclick="event.stopPropagation()">
              <button type="button" class="btn-card-action" title="全屏预览" onclick="openLightbox(${idx})">↗</button>
              <a class="btn-card-action" href="${item.rel_img}" download="${item.title}.png" title="下载原图">↓</a>
            </div>
          </div>
          <div class="art-card-body">
            <div class="card-title-row">
              <h4 class="card-title">${item.title}</h4>
              <span class="card-category-tag">${item.subcategory_name || ''}</span>
            </div>
            ${item.quote ? `<div class="card-quote">“${item.quote}”</div>` : ''}
            <p class="card-desc">${item.desc || ''}</p>
            <div class="card-footer">
              <span>${item.file_size_formatted || '2.6 MB'} · 16:9 原图</span>
              <a class="btn-card-download" href="${item.rel_img}" download="${item.title}.png">下载原图</a>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  // ------------------------------------------------------------------------
  // Variant 2: Theater Spotlight
  // ------------------------------------------------------------------------
  function renderSpotlight() {
    if (filteredItems.length === 0) return;
    const item = filteredItems[spotlightIndex] || filteredItems[0];
    if (!item) return;

    if (window._spotlightProgressive) {
      window._spotlightProgressive.show({
        thumbnail: item.rel_thumb,
        detail: item.rel_detail || item.rel_img,
        original: item.rel_img,
        alt: item.title
      });
    } else {
      spotlightImg.src = item.rel_detail || item.rel_img;
      spotlightImg.alt = item.title;
    }
    spotlightKicker.innerText = `${item.category_name || 'Crossover'} · ${item.subcategory_name || ''}`;
    spotlightTitle.innerText = item.title;

    if (item.quote) {
      spotlightQuoteBox.style.display = "block";
      spotlightQuote.innerText = `“${item.quote}”`;
    } else {
      spotlightQuoteBox.style.display = "none";
    }

    spotlightDesc.innerText = item.desc || "暂无描述";
    spotlightHeroClass.innerText = item.hero_class || (item.category === "folk_art" ? "民间画" : "全能");
    spotlightBadge.innerText = item.badge || "精作";
    spotlightAnimeRole.innerText = item.anime_role || (item.category === "folk_art" ? "非遗工笔" : item.title);
    spotlightResolution.innerText = `${item.file_size_formatted || '2.6 MB'} · 无损超清`;
    spotlightDlBtn.href = item.rel_img;
    spotlightDlBtn.download = `${item.title}.png`;

    // Filmstrip
    spotlightFilmstrip.innerHTML = filteredItems.map((it, idx) => `
      <div class="filmstrip-item ${idx === spotlightIndex ? 'active' : ''}" onclick="selectSpotlight(${idx})">
        <img src="${it.rel_thumb}" loading="lazy" decoding="async" alt="${it.title}" />
      </div>
    `).join("");

    // Auto-scroll filmstrip to active item
    const activeThumb = spotlightFilmstrip.querySelector(".filmstrip-item.active");
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  window.selectSpotlight = function(idx) {
    spotlightIndex = idx;
    renderSpotlight();
  };

  window.openLightboxFromSpotlight = function() {
    openLightbox(spotlightIndex);
  };

  // ------------------------------------------------------------------------
  // Variant 3: Blueprint Inspect
  // ------------------------------------------------------------------------
  function renderInspect() {
    if (filteredItems.length === 0) return;
    const item = filteredItems[inspectIndex] || filteredItems[0];
    if (!item) return;

    if (window._inspectProgressive) {
      window._inspectProgressive.show({
        thumbnail: item.rel_thumb,
        detail: item.rel_detail || item.rel_img,
        original: item.rel_img,
        alt: item.title
      });
    } else {
      inspectImg.src = item.rel_detail || item.rel_img;
      inspectImg.alt = item.title;
    }
    inspectDlLink.href = item.rel_img;
    inspectDlLink.download = `${item.title}.png`;

    // Parse design components from description
    const desc = item.desc || "";
    let heroPart = "保留王者荣耀英雄专属成熟面容、高大体格与标志性核心武器。";
    let fusionPart = "将动漫核心技能、战袍羽织与视觉符号深度熔铸于英雄武具之中。";

    if (desc.includes("【英雄本尊×动漫深度融合】：")) {
      const parts = desc.replace("【英雄本尊×动漫深度融合】：", "").split("！");
      if (parts.length >= 2) {
        heroPart = parts[0] + "！";
        fusionPart = parts.slice(1).join("！");
      } else {
        fusionPart = desc;
      }
    } else {
      fusionPart = desc;
    }

    inspectHeroAnchor.innerText = heroPart;
    inspectFusionAnchor.innerText = fusionPart;
    inspectVfxAnchor.innerText = item.vfx || "专属全套水流、烈焰、重力光环与背景深度空间留白。";

    // Selector strip
    inspectSelectorStrip.innerHTML = filteredItems.map((it, idx) => `
      <button type="button" class="pill-btn ${idx === inspectIndex ? 'active' : ''}" onclick="selectInspect(${idx})">
        ${it.hero ? `${it.hero} × ${it.anime_role}` : it.title}
      </button>
    `).join("");

    const activeBtn = inspectSelectorStrip.querySelector(".pill-btn.active");
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  window.selectInspect = function(idx) {
    inspectIndex = idx;
    renderInspect();
  };

  window.openLightboxFromInspect = function() {
    openLightbox(inspectIndex);
  };

  // ------------------------------------------------------------------------
  // Lightbox Modal Functions
  // ------------------------------------------------------------------------
  window.openLightbox = function(index) {
    currentModalIndex = index;
    updateModalContent();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  function closeLightbox() {
    if (window._modalProgressive) window._modalProgressive.invalidate();
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function updateModalContent() {
    const item = filteredItems[currentModalIndex];
    if (!item) return;

    if (window._modalProgressive) {
      window._modalProgressive.show({
        thumbnail: item.rel_thumb,
        detail: item.rel_detail || item.rel_img,
        original: item.rel_img,
        alt: item.title
      });
    } else {
      modalImg.src = item.rel_detail || item.rel_img;
      modalImg.alt = item.title;
    }
    modalTitle.innerText = item.title;
    
    let subInfo = (item.category_name || '') + " · " + (item.subcategory_name || '');
    if (item.hero && item.anime_role) {
      subInfo += ` (${item.hero} × ${item.anime_role})`;
    }
    modalSubtitle.innerText = subInfo;

    if (item.quote) {
      modalQuoteContainer.style.display = "block";
      modalQuote.innerText = `“${item.quote}”`;
    } else {
      modalQuoteContainer.style.display = "none";
    }

    modalDesc.innerText = item.desc || "";

    if (item.vfx) {
      modalVfxContainer.style.display = "block";
      modalVfx.innerText = item.vfx;
    } else {
      modalVfxContainer.style.display = "none";
    }

    modalTags.innerHTML = (item.tags || []).map(t => `<span class="tag-item">#${t}</span>`).join("");
    modalFileSize.innerText = `${item.file_size_formatted || '2.6 MB'} · 原始无损 PNG`;
    modalDownloadBtn.href = item.rel_img;
    modalDownloadBtn.download = `${item.title}.png`;
  }

  // ------------------------------------------------------------------------
  // Category Segmented Tabs
  // ------------------------------------------------------------------------
  categoryTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-cat");
      currentSubcategory = "all";
      renderSubcategoryPills();
      filterAndRender();
    });
  });

  // Search Input
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    filterAndRender();
  });

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    // Esc to close modal
    if (e.key === "Escape") {
      if (modal.classList.contains("active")) closeLightbox();
      if (packModal.classList.contains("active")) packModal.classList.remove("active");
      return;
    }

    // Modal navigation
    if (modal.classList.contains("active")) {
      if (e.key === "ArrowLeft") {
        currentModalIndex = (currentModalIndex - 1 + filteredItems.length) % filteredItems.length;
        updateModalContent();
      } else if (e.key === "ArrowRight") {
        currentModalIndex = (currentModalIndex + 1) % filteredItems.length;
        updateModalContent();
      }
      return;
    }

    // Don't trigger shortcuts when typing in search
    if (document.activeElement === searchInput) return;

    // Search focus on '/'
    if (e.key === "/") {
      e.preventDefault();
      searchInput.focus();
      return;
    }

    // Variant switching: '1' -> grid, '2' -> spotlight, '3' -> inspect
    if (e.key === "1") setVariant("grid");
    else if (e.key === "2") setVariant("spotlight");
    else if (e.key === "3") setVariant("inspect");

    // Replay entrance: 'r' or 'R'
    if (e.key === "r" || e.key === "R") {
      if (protoReplayBtn) protoReplayBtn.click();
    }

    // In spotlight mode, Left/Right keys navigate filmstrip
    if (currentVariant === "spotlight") {
      if (e.key === "ArrowLeft") {
        spotlightIndex = (spotlightIndex - 1 + filteredItems.length) % filteredItems.length;
        renderSpotlight();
      } else if (e.key === "ArrowRight") {
        spotlightIndex = (spotlightIndex + 1) % filteredItems.length;
        renderSpotlight();
      }
    }
  });

  // Modal Buttons
  modalCloseBtn.addEventListener("click", closeLightbox);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLightbox();
  });
  modalPrevBtn.addEventListener("click", () => {
    currentModalIndex = (currentModalIndex - 1 + filteredItems.length) % filteredItems.length;
    updateModalContent();
  });
  modalNextBtn.addEventListener("click", () => {
    currentModalIndex = (currentModalIndex + 1) % filteredItems.length;
    updateModalContent();
  });

  // ------------------------------------------------------------------------
  // Client-Side Dynamic ZIP Packaging (JSZip)
  // ------------------------------------------------------------------------
  if (btnPackCurrent) {
    btnPackCurrent.addEventListener("click", async () => {
      if (filteredItems.length === 0) {
        alert("当前没有可打包的作品。");
        return;
      }

      packModal.classList.add("active");
      packTitle.innerText = `正在打包 ${filteredItems.length} 张高清原图`;
      packProgressBar.style.width = "0%";
      packStatus.innerText = "0%";

      try {
        const zip = new JSZip();
        let loaded = 0;

        for (const item of filteredItems) {
          try {
            const resp = await fetch(item.rel_img);
            if (!resp.ok) throw new Error("fetch failed");
            const blob = await resp.blob();
            const filename = `${item.title.replace(/[\/\\:*?"<>|]/g, "_")}.png`;
            zip.file(filename, blob);
          } catch (err) {
            console.warn("Failed to fetch image for zip:", item.rel_img, err);
          }

          loaded++;
          const pct = Math.round((loaded / filteredItems.length) * 100);
          packProgressBar.style.width = `${pct}%`;
          packStatus.innerText = `${pct}%`;
        }

        packTitle.innerText = "正在压缩生成 ZIP...";
        const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
          packStatus.innerText = `${Math.round(metadata.percent)}%`;
        });

        // Trigger download
        const a = document.createElement("a");
        const catName = currentCategory === "all" ? "全套大作" : (currentCategory === "fusion_skins" ? "英雄深度联动" : currentCategory);
        a.download = `王者荣耀联动原图_${catName}_${filteredItems.length}张.zip`;
        a.href = URL.createObjectURL(content);
        a.click();
        URL.revokeObjectURL(a.href);

        setTimeout(() => {
          packModal.classList.remove("active");
        }, 1000);
      } catch (err) {
        console.error("Zip packing error:", err);
        alert("打包失败，请尝试直接点击预置离线包下载。");
        packModal.classList.remove("active");
      }
    });
  }

  // Initial render
  renderSubcategoryPills();
  filterAndRender();
});
