(() => {
  const artworks = window.ARTWORKS_DATA;
  const themes = ['全部主题', ...new Set(artworks.map(item => item.theme))];
  const gallery = document.getElementById('gallery');
  const navigation = document.getElementById('themes');
  const viewer = document.getElementById('viewer');
  const image = document.getElementById('viewerImage');
  const status = document.getElementById('imageStatus');
  const more = document.getElementById('loadMore');
  const imageSizes = '(min-width:1800px) 345px, (min-width:1504px) 467px, (min-width:1001px) calc((100vw - 104px) / 3), (min-width:601px) calc((100vw - 84px) / 2), calc(100vw - 32px)';
  const decodedImages = new Map();
  let filtered = artworks;
  let rendered = 0;
  let selectedTheme;
  let observer;
  let imageObserver;
  let index = 0;
  let revision = 0;
  let request;
  let opener;
  const caption = item => `${item.hero} × ${item.character}`;

  function loadThumbnail(thumbnail) {
    thumbnail.sizes = imageSizes;
    thumbnail.srcset = thumbnail.dataset.srcset;
    thumbnail.src = thumbnail.dataset.src;
  }

  function appendBatch() {
    const end = Math.min(rendered + 12, filtered.length);
    const fragment = document.createDocumentFragment();
    const eagerCount = matchMedia('(max-width:600px)').matches ? 1 : matchMedia('(max-width:1000px)').matches ? 2 : 3;
    for (let itemIndex = rendered; itemIndex < end; itemIndex++) {
      const item = filtered[itemIndex];
      const figure = document.createElement('figure');
      figure.className = 'artwork';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'image-button';
      button.setAttribute('aria-label', `查看${caption(item)}大图`);
      const thumbnail = document.createElement('img');
      thumbnail.alt = `${item.theme} · ${caption(item)}`;
      thumbnail.width = item.width;
      thumbnail.height = item.height;
      thumbnail.loading = itemIndex < eagerCount ? 'eager' : 'lazy';
      thumbnail.fetchPriority = itemIndex === 0 ? 'high' : 'auto';
      thumbnail.decoding = 'async';
      thumbnail.dataset.src = item.thumbnail;
      thumbnail.dataset.srcset = `${item.thumbnail} 480w, ${item.thumbnailLarge} 960w`;
      if (itemIndex < eagerCount || !imageObserver) loadThumbnail(thumbnail);
      else imageObserver.observe(thumbnail);
      thumbnail.addEventListener('error', () => button.classList.add('failed'));
      thumbnail.addEventListener('load', () => button.classList.remove('failed'));
      button.append(thumbnail);
      button.addEventListener('click', () => {
        if (button.classList.contains('failed')) {
          loadThumbnail(thumbnail);
          return;
        }
        opener = button;
        index = itemIndex;
        viewer.showModal();
        document.body.style.overflow = 'hidden';
        showImage();
      });
      const label = document.createElement('figcaption');
      const hero = document.createElement('span');
      hero.textContent = item.hero;
      const character = document.createElement('span');
      character.className = 'character';
      character.textContent = `× ${item.character}`;
      label.append(hero, character);
      figure.append(button, label);
      fragment.append(figure);
    }
    gallery.append(fragment);
    rendered = end;
    more.hidden = rendered === filtered.length;
    if (more.hidden) observer?.disconnect();
  }

  function selectTheme(theme) {
    if (theme === selectedTheme) return;
    observer?.disconnect();
    imageObserver?.disconnect();
    imageObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        loadThumbnail(entry.target);
        imageObserver.unobserve(entry.target);
      }
    }, {rootMargin:'200px 0px'}) : null;
    selectedTheme = theme;
    filtered = theme === themes[0] ? artworks : artworks.filter(item => item.theme === theme);
    rendered = 0;
    navigation.value = theme;
    document.getElementById('themeTitle').textContent = theme;
    document.getElementById('resultCount').textContent = `${filtered.length} 张`;
    gallery.replaceChildren();
    appendBatch();
    if ('IntersectionObserver' in window && !more.hidden) {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          // Reobserve after each batch so a tall viewport can request another batch.
          observer.unobserve(more);
          appendBatch();
          if (!more.hidden) observer.observe(more);
        }
      }, { rootMargin:'400px 0px' });
      observer.observe(more);
    }
  }

  async function loadDecoded(url) {
    const full = new Image();
    const loaded = new Promise((resolve, reject) => {
      full.onload = resolve;
      full.onerror = () => reject(new Error('Image failed to load'));
    });
    full.src = url;
    await loaded;
    if (typeof full.decode === 'function') await full.decode();
    return full;
  }

  async function showImage() {
    const token = ++revision;
    request?.abort();
    const item = filtered[index];
    image.src = item.thumbnail;
    image.alt = caption(item);
    document.getElementById('viewerCaption').textContent = `${item.theme} · ${caption(item)}`;
    document.getElementById('position').textContent = `${index + 1} / ${filtered.length}`;
    document.getElementById('prevImage').disabled = index === 0;
    document.getElementById('nextImage').disabled = index === filtered.length - 1;
    if (decodedImages.has(item.image)) {
      const cached = decodedImages.get(item.image);
      decodedImages.delete(item.image);
      decodedImages.set(item.image, cached);
      image.src = cached;
      status.hidden = true;
      return;
    }
    status.hidden = false;
    status.textContent = '正在加载大图…';
    const controller = new AbortController();
    request = controller;
    let objectUrl;
    try {
      const response = await fetch(item.image, {signal:controller.signal});
      if (!response.ok) throw new Error('Image request failed');
      objectUrl = URL.createObjectURL(await response.blob());
      await loadDecoded(objectUrl);
      if (token !== revision || !viewer.open) {
        URL.revokeObjectURL(objectUrl);
        return;
      }
      decodedImages.set(item.image, objectUrl);
      image.src = objectUrl;
      status.hidden = true;
      while (decodedImages.size > 3) {
        const oldest = decodedImages.keys().next().value;
        URL.revokeObjectURL(decodedImages.get(oldest));
        decodedImages.delete(oldest);
      }
    } catch (error) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (error.name === 'AbortError' || token !== revision || !viewer.open) return;
      status.textContent = '大图加载失败，当前显示预览图';
    }
  }

  function move(step) {
    const next = index + step;
    if (next < 0 || next >= filtered.length) return;
    index = next;
    showImage();
  }
  for (const theme of themes) {
    const option = document.createElement('option');
    option.value = theme;
    option.textContent = theme;
    navigation.append(option);
  }
  navigation.addEventListener('change', () => selectTheme(navigation.value));
  more.addEventListener('click', appendBatch);
  document.getElementById('closeViewer').addEventListener('click', () => viewer.close());
  document.getElementById('prevImage').addEventListener('click', () => move(-1));
  document.getElementById('nextImage').addEventListener('click', () => move(1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  viewer.addEventListener('close', () => {
    revision++;
    request?.abort();
    image.removeAttribute('src');
    for (const url of decodedImages.values()) URL.revokeObjectURL(url);
    decodedImages.clear();
    document.body.style.overflow = '';
    opener?.focus();
  });
  selectTheme(themes[0]);
})();
