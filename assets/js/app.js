// Crossover & Folk Art Gallery Application
document.addEventListener("DOMContentLoaded", () => {
  const data = window.ARTWORKS_DATA || [];
  
  // State
  let currentCategory = "all";
  let currentSubcategory = "all";
  let searchQuery = "";
  let filteredItems = [...data];
  let currentModalIndex = 0;

  // DOM Elements
  const gridEl = document.getElementById("galleryGrid");
  const resultCountEl = document.getElementById("resultCount");
  const filterDescEl = document.getElementById("filterDesc");
  const searchInput = document.getElementById("searchInput");
  const subcategoryPillsEl = document.getElementById("subcategoryPills");
  
  // Modal Elements
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

  // Dynamic Pack Modal Elements
  const packModal = document.getElementById("packProgressModal");
  const packTitle = document.getElementById("packTitle");
  const packStatus = document.getElementById("packStatus");
  const packProgressBar = document.getElementById("packProgressBar");
  const packDynamicBtn = document.getElementById("btnPackCurrent");

  // Scroll to Top
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  // Category Configuration
  const SUBCATEGORIES = {
    all: [
      { id: "all", label: "全部所有 (84)" },
      { id: "fusion_skins", label: "💎 英雄深度联动 (25/45)" },
      { id: "v2_test_skins", label: "✨ 真机画风首测 (6)" },
      { id: "folk_national_day", label: "🇨🇳 国庆盛典特辑 (3)" },
      { id: "folk_daily", label: "🌾 水乡日常民俗 (5)" },
      { id: "01_demon_slayer", label: "🔥 鬼灭之刃 (20)" },
      { id: "02_jujutsu_kaisen", label: "👁️ 咒术回战 (5)" },
      { id: "03_attack_on_titan", label: "⚔️ 进击的巨人 (5)" },
      { id: "04_naruto", label: "🍥 火影忍者 (5)" },
      { id: "05_one_piece", label: "🏴‍☠️ 海贼王 (5)" },
      { id: "06_bleach", label: "🗡️ 死神 BLEACH (5)" }
    ],
    fusion_skins: [
      { id: "all", label: "全部深度联动 (25/45)" },
      { id: "fusion_demon_slayer", label: "🔥 鬼灭之刃 (20/20)" },
      { id: "fusion_jujutsu_kaisen", label: "👁️ 咒术回战 (3/5)" },
      { id: "fusion_attack_on_titan", label: "⚔️ 进击的巨人 (1/5)" },
      { id: "fusion_naruto", label: "🍥 火影忍者 (0/5)" },
      { id: "fusion_one_piece", label: "🏴‍☠️ 海贼王 (0/5)" },
      { id: "fusion_bleach", label: "🗡️ 死神 BLEACH (1/5)" }
    ],
    v2_test_skins: [
      { id: "all", label: "全部首测 (6)" },
      { id: "v2_demon_slayer", label: "🔥 鬼灭之刃" },
      { id: "v2_jujutsu_kaisen", label: "👁️ 咒术回战" },
      { id: "v2_attack_on_titan", label: "⚔️ 进击的巨人" },
      { id: "v2_naruto", label: "🍥 火影忍者" },
      { id: "v2_one_piece", label: "🏴‍☠️ 海贼王" },
      { id: "v2_bleach", label: "🗡️ 死神 BLEACH" }
    ],
    folk_art: [
      { id: "all", label: "全部农民画 (8)" },
      { id: "folk_national_day", label: "🇨🇳 盛世国庆篇 (3)" },
      { id: "folk_daily", label: "🌾 水乡岁月日常篇 (5)" }
    ],
    wzry_skins: [
      { id: "all", label: "全部联名皮肤 (45)" },
      { id: "01_demon_slayer", label: "🔥 鬼灭之刃 (20)" },
      { id: "02_jujutsu_kaisen", label: "👁️ 咒术回战 (5)" },
      { id: "03_attack_on_titan", label: "⚔️ 进击的巨人 (5)" },
      { id: "04_naruto", label: "🍥 火影忍者 (5)" },
      { id: "05_one_piece", label: "🏴‍☠️ 海贼王 (5)" },
      { id: "06_bleach", label: "🗡️ 死神 BLEACH (5)" }
    ]
  };

  // Render Subcategory Pills
  function renderSubcategoryPills() {
    const list = SUBCATEGORIES[currentCategory] || SUBCATEGORIES.all;
    subcategoryPillsEl.innerHTML = list.map(sub => `
      <button class="pill-btn ${currentSubcategory === sub.id ? 'active' : ''}" data-sub="${sub.id}">
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

  // Filter Logic
  function filterAndRender() {
    filteredItems = data.filter(item => {
      // 1. Primary Category
      if (currentCategory !== "all" && item.category !== currentCategory) {
        return false;
      }

      // 2. Subcategory
      if (currentSubcategory !== "all") {
        if (item.subcategory !== currentSubcategory) {
          return false;
        }
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (item.title || "").toLowerCase().includes(q);
        const heroMatch = (item.hero || "").toLowerCase().includes(q);
        const roleMatch = (item.anime_role || "").toLowerCase().includes(q);
        const descMatch = (item.desc || "").toLowerCase().includes(q);
        const subNameMatch = (item.subcategory_name || "").toLowerCase().includes(q);
        const tagsMatch = (item.tags || []).some(t => t.toLowerCase().includes(q));
        if (!titleMatch && !heroMatch && !roleMatch && !descMatch && !subNameMatch && !tagsMatch) {
          return false;
        }
      }

      return true;
    });

    // Update Result Info
    resultCountEl.innerText = filteredItems.length;
    let desc = "全部作品";
    if (currentCategory === "folk_art") desc = "民间风俗农民画";
    if (currentCategory === "wzry_skins") desc = "王者荣耀联名皮肤";
    if (searchQuery) desc += `（搜索关键词："${searchQuery}"）`;
    filterDescEl.innerText = desc;

    renderGrid();
  }

  // Render Grid Cards
  function renderGrid() {
    if (filteredItems.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
          <h3 style="color: #fff; margin-bottom: 8px;">未找到匹配的作品</h3>
          <p>尝试切换分类或清空搜索关键词查看全部 53 幅原作。</p>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = filteredItems.map((item, idx) => {
      const isPortrait = item.category === "folk_art";
      let badgeClass = "badge-limited";
      if ((item.badge || "").includes("典藏")) badgeClass = "badge-glorious";
      if (item.subcategory === "folk_national_day") badgeClass = "badge-folk-nd";
      if (item.subcategory === "folk_daily") badgeClass = "badge-folk-daily";

      const tagsHtml = (item.tags || []).slice(0, 3).map(t => `<span class="tag-item">#${t}</span>`).join("");

      return `
        <div class="art-card ${isPortrait ? 'portrait' : ''}" data-index="${idx}">
          <div class="art-card-img-wrapper" onclick="openLightbox(${idx})">
            <span class="card-badge ${badgeClass}">${item.badge || '精作'}</span>
            <img class="art-card-img" src="${item.rel_thumb}" loading="lazy" alt="${item.title}" />
            <div class="card-quick-actions" onclick="event.stopPropagation()">
              <button class="btn-card-action" title="放大预览" onclick="openLightbox(${idx})">🔍</button>
              <a class="btn-card-action" href="${item.rel_img}" download="${item.title}.png" title="下载原图">⬇️</a>
            </div>
          </div>
          <div class="art-card-body">
            <div class="card-title-row">
              <div class="card-title">${item.title}</div>
              <span class="card-category-tag">${item.subcategory_name}</span>
            </div>
            ${item.quote ? `<div class="card-quote">“${item.quote}”</div>` : ''}
            <div class="card-desc">${item.desc}</div>
            <div class="card-tags">
              ${item.hero ? `<span class="tag-item">英雄: ${item.hero}</span>` : ''}
              ${item.anime_role ? `<span class="tag-item">原型: ${item.anime_role}</span>` : ''}
              ${tagsHtml}
            </div>
            <div class="card-footer">
              <span>高清原图 · ${item.file_size_formatted || '3.5MB'}</span>
              <a class="btn-card-download" href="${item.rel_img}" download="${item.title}.png">
                ⬇️ 下载原图
              </a>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Lightbox Modal Functions
  window.openLightbox = function(index) {
    currentModalIndex = index;
    updateModalContent();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  function closeLightbox() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function updateModalContent() {
    const item = filteredItems[currentModalIndex];
    if (!item) return;

    modalImg.src = item.rel_img;
    modalImg.alt = item.title;
    modalTitle.innerText = item.title;
    
    let subInfo = item.category_name + " · " + item.subcategory_name;
    if (item.hero && item.anime_role) {
      subInfo += `（${item.hero} × ${item.anime_role}）`;
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

    if (item.tags && item.tags.length > 0) {
      modalTags.innerHTML = item.tags.map(t => `<span class="tag-item">#${t}</span>`).join(" ");
    } else if (item.hero) {
      modalTags.innerHTML = `<span class="tag-item">英雄: ${item.hero}</span> <span class="tag-item">定位: ${item.hero_class || '联动'}</span>`;
    } else {
      modalTags.innerHTML = "";
    }

    modalFileSize.innerText = item.file_size_formatted || "3.5 MB";
    modalDownloadBtn.href = item.rel_img;
    modalDownloadBtn.setAttribute("download", `${item.title}.png`);
  }

  function prevImage() {
    if (filteredItems.length === 0) return;
    currentModalIndex = (currentModalIndex - 1 + filteredItems.length) % filteredItems.length;
    updateModalContent();
  }

  function nextImage() {
    if (filteredItems.length === 0) return;
    currentModalIndex = (currentModalIndex + 1) % filteredItems.length;
    updateModalContent();
  }

  // Event Listeners for Modal
  modalCloseBtn.addEventListener("click", closeLightbox);
  modalPrevBtn.addEventListener("click", prevImage);
  modalNextBtn.addEventListener("click", nextImage);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  });

  // Category Tab Switching
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-cat");
      currentSubcategory = "all";
      renderSubcategoryPills();
      filterAndRender();
    });
  });

  // Search Input
  let searchTimeout = null;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchQuery = e.target.value;
      filterAndRender();
    }, 150);
  });

  // Dynamic JSZip Packaging Feature
  if (packDynamicBtn) {
    packDynamicBtn.addEventListener("click", async () => {
      if (!window.JSZip) {
        alert("JSZip 库未就绪，请使用右侧预打包下载通道。");
        return;
      }

      const itemsToPack = filteredItems;
      if (itemsToPack.length === 0) {
        alert("当前分类下没有图片可打包。");
        return;
      }

      // Show Progress Dialog
      packModal.classList.add("active");
      packTitle.innerText = `正在打包当前分类原图 (${itemsToPack.length} 张)`;
      packStatus.innerText = "准备下载资源...";
      packProgressBar.style.width = "0%";

      const zip = new JSZip();
      let downloadedCount = 0;

      try {
        for (let i = 0; i < itemsToPack.length; i++) {
          const item = itemsToPack[i];
          packStatus.innerText = `[${i + 1}/${itemsToPack.length}] 正在抓取: ${item.title}...`;
          
          const response = await fetch(item.rel_img);
          if (!response.ok) throw new Error(`HTTP ${response.status} on ${item.rel_img}`);
          const blob = await response.blob();
          
          const cleanFileName = `${String(i + 1).padStart(2, '0')}_${item.title.replace(/[\/\\?%*:|"<>]/g, '_')}.png`;
          zip.file(cleanFileName, blob);

          downloadedCount++;
          const percent = Math.round((downloadedCount / itemsToPack.length) * 80);
          packProgressBar.style.width = `${percent}%`;
        }

        packStatus.innerText = "正在压缩生成 ZIP 压缩包 (这可能需要数秒)...";
        packProgressBar.style.width = "85%";

        const zipBlob = await zip.generateAsync({ type: "blob" }, (metadata) => {
          const p = 85 + Math.round(metadata.percent * 0.15);
          packProgressBar.style.width = `${p}%`;
        });

        packStatus.innerText = "压缩完成！即将唤起浏览器下载...";
        packProgressBar.style.width = "100%";

        // Trigger Download
        const downloadUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        const zipName = `AI_Artwork_Pack_${currentCategory}_${itemsToPack.length}files.zip`;
        a.download = zipName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        setTimeout(() => {
          packModal.classList.remove("active");
        }, 1200);

      } catch (err) {
        console.error("Packaging error:", err);
        packStatus.innerText = `打包失败: ${err.message}。建议直接点击右侧预打包下载通道。`;
        setTimeout(() => {
          packModal.classList.remove("active");
        }, 3000);
      }
    });
  }

  // Scroll to Top Listener
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Initialize
  renderSubcategoryPills();
  filterAndRender();
});
