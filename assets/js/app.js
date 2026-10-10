(() => {
  const artworks = window.ARTWORKS_DATA;
  const themes = ['全部主题', ...new Set(artworks.map(item => item.theme))];
  const gallery = document.getElementById('gallery');
  const navigation = document.getElementById('themes');
  const viewer = document.getElementById('viewer');
  const image = document.getElementById('viewerImage');
  const status = document.getElementById('imageStatus');
  let filtered = artworks;
  let index = 0;
  let revision = 0;
  let opener;
  const caption = item => `${item.hero} × ${item.character}`;

  function selectTheme(theme) {
    filtered = theme === themes[0] ? artworks : artworks.filter(item => item.theme === theme);
    navigation.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.textContent === theme)));
    document.getElementById('themeTitle').textContent = theme;
    document.getElementById('resultCount').textContent = `${filtered.length} 张`;
    gallery.replaceChildren(...filtered.map((item, itemIndex) => {
      const figure = document.createElement('figure');
      figure.className = 'artwork';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'image-button';
      button.setAttribute('aria-label', `查看${caption(item)}大图`);
      const thumbnail = document.createElement('img');
      thumbnail.src = item.thumbnail;
      thumbnail.alt = `${item.theme} · ${caption(item)}`;
      thumbnail.width = 960;
      thumbnail.height = 540;
      thumbnail.loading = itemIndex < 3 ? 'eager' : 'lazy';
      thumbnail.decoding = 'async';
      thumbnail.addEventListener('error', () => button.classList.add('failed'));
      thumbnail.addEventListener('load', () => button.classList.remove('failed'));
      button.append(thumbnail);
      button.addEventListener('click', () => {
        if (button.classList.contains('failed')) thumbnail.src = item.thumbnail;
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
      return figure;
    }));
  }

  async function showImage() {
    const token = ++revision;
    const item = filtered[index];
    image.src = item.thumbnail;
    image.alt = caption(item);
    document.getElementById('viewerCaption').textContent = `${item.theme} · ${caption(item)}`;
    document.getElementById('position').textContent = `${index + 1} / ${filtered.length}`;
    document.getElementById('prevImage').disabled = index === 0;
    document.getElementById('nextImage').disabled = index === filtered.length - 1;
    status.hidden = false;
    status.textContent = '正在加载大图…';
    try {
      const full = new Image();
      full.src = item.image;
      await full.decode();
      if (token !== revision || !viewer.open) return;
      image.src = full.src;
      status.hidden = true;
    } catch {
      if (token !== revision || !viewer.open) return;
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
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme';
    button.textContent = theme;
    button.addEventListener('click', () => selectTheme(theme));
    navigation.append(button);
  }
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
    image.removeAttribute('src');
    document.body.style.overflow = '';
    opener?.focus();
  });
  selectTheme(themes[0]);
})();
