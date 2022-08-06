function css(duration) {
    return `
  :host {
    display: inline-block;
    font-family: system-ui, sans-serif;
  }

  :focus {
    outline: none;
  }

  :focus-visible {
    outline: default;
  }

  ::backdrop {
    background-color: rgba(0, 0, 0, 0.9);
  }

  button {
    border: 0;
    background: 0;
    appearance: none;
    cursor: pointer;
    padding: 0;
  }

  .ring {
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    width: 50px;
    padding: 2px;
    overflow: hidden;
    border: 1px solid #ccc;
    margin: 1px;
  }

  button:not(:disabled) .ring {
    border: 2px solid #08c;
    margin: 0;
  }

  .avatar {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
  }

  dialog {
    height: 100vh;
    padding: 0;
    border: 0;
    aspect-ratio: 9/16;
    background: transparent;
    overflow: visible;
  }
  
  #images {
    overflow: hidden;
    height: 100%;
    width: 100%;
    position: absolute;
    border-radius: 10px;
    background: #000;
  }

  dialog img {
    position: absolute;
    max-height: 100%;
    aspect-ratio: 9/16;
    top: 0;
    opacity: 0;
  }

  dialog img.shown {
    opacity: 1;
  }

  .bar {
    border-radius: 3px;
    overflow: hidden;
    height: 100%;
    background: rgba(255, 255, 255, .2);
    z-index: 1;
    flex: auto;
  }

  #bars {
    left: 0; 
    right: 0;
    top: 0;
    height: 2px;
    position: absolute;
    margin: 10px;
    display: flex;
    gap: 5px;
  }

  .progress {
    height: 100%;
    animation: none;
    background-color: #fff;
  }
  
  .progressing ~ .bar .progress {
    background-color: transparent;
    width: auto;
  }

  .progressing.paused .progress {
    animation-play-state: paused;
  }

  .progressing .progress {
    width: 0;
    animation: progress ${duration}s linear;
    animation-play-state: running;
  }

  @keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }

  .loading button,
  .loading details {
    display: none;
  }

  .loading #images img {
    opacity: 0;
  }

  .loading .loading-visual {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2vh;
    aspect-ratio: 1;
    text-align: center;
    background: #fff;
    z-index: 1;
    margin-left: -1vh;
    animation: rotate 2s linear infinite;
    font-size: 14px;
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-visual {
    display: none;
  }

  details {
    position: absolute;
    bottom: 0;
    z-index: 1;
    left: 0;
    right: 0;
    color: #fff;
    padding: 10px;
  }

  summary {
    cursor: pointer;
    width: 100%;
    text-align: center;
    list-style: none;
  }

  summary::before { display: none; }
  summary::-webkit-details-marker { display: none; }

  details[open] summary {
    transform: scaleY(-1);
  }

  #metadata {
    padding: 16px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    font-size: 0.8em;
    color: #fff;
  }

  #metadata a {
    color: #000;
  }

  #goToBlock {
    left: 50%;
    transform: translate(-50%);
    width: calc(100vh * 9 / 16);
    padding: 0 2vw;
    max-width: 100vw;
    height: 100%;
    position: fixed;
    top: 0;
    box-sizing: border-box;
  }

  #back, #forward {
    position: absolute;
    height: 100%;
    z-index: 1;
    width: 3vw;
    min-width: 20px;
    padding: 0;
    font-size: 20px;
    margin: 0 -1vw;
    font-family: system-ui, sans-serif;
    color: #fff;
  }

  #back {
    left: 0;
    text-align: left;
  }

  #forward {
    right: 0;
    text-align: right;
  }
`;
}
class StoryViewElement extends HTMLElement {
    constructor() {
        super();
        this.currentIndex = -1;
        this.count = 0;
        this.timer = null;
        this.currentBar = null;
        this.currentImage = null;
        this.images = [];
        this.bars = [];
        this.promises = [];
        this.paused = false;
        this.items = [];
        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = `
      <button type="dialog"><slot></slot></button>
      <dialog class="loading">
        <div class="loading-visual"></div>
        <div id="bars"></div>
        <div id="goToBlock">
          <button id="back">←</button>
          <button id="forward">→</button>
        </div>
        <div id="images"></div>
        <details hidden><summary>⌃</summary><div id="metadata"></div></details>
      </dialog>
    `;
        this.dialog = this.root.querySelector('dialog');
        this.button = this.root.querySelector('button');
        this.meta = this.root.querySelector('#metadata');
        this.goToBinding = this.goTo.bind(this, 1);
    }
    connectedCallback() {
        this.button.addEventListener('click', () => {
            this.dialog.open ? this.dialog.close() : this.dialog.showModal();
            if (!this.dialog.open)
                return;
            this.dialog.focus();
            this.startTimer();
        });
        const src = this.getAttribute('src');
        if (src)
            this.fetchData(src);
        const style = document.createElement('style');
        style.innerText = css(this.duration);
        this.root.append(style);
        if (this.hasAttribute('metadata')) {
            this.root.querySelector('details').hidden = false;
        }
    }
    get src() {
        return this.hasAttribute('src') ? new URL(this.getAttribute('src') || '', location.href) : '';
    }
    get duration() {
        return this.hasAttribute('duration') ? Number(this.getAttribute('duration')) : 5;
    }
    bindEvents() {
        const images = this.root.querySelector('#images');
        const back = this.root.querySelector('button#back');
        const forward = this.root.querySelector('button#forward');
        back.addEventListener('click', () => {
            if (this.currentIndex === 0) {
                this.dialog.close();
            }
            else {
                this.goTo(-1);
            }
        });
        forward.addEventListener('click', () => {
            if (this.currentIndex === this.count - 1) {
                this.dialog.close();
            }
            else {
                this.goTo(1);
            }
        });
        this.dialog.addEventListener('close', () => {
            if (this.timer)
                clearTimeout(this.timer);
            this.currentIndex = 0;
        });
        images.addEventListener('click', () => {
            this.paused ? this.resume() : this.pause();
        });
        const dialog = this.dialog;
        document.addEventListener('keydown', keyboradShortcut.bind(this));
        function keyboradShortcut(event) {
            if (!dialog.open)
                return;
            if (event.key === 'ArrowRight')
                forward.click();
            if (event.key === 'ArrowLeft')
                back.click();
        }
    }
    async fetchData(url) {
        const json = await (await fetch(url)).json();
        const slot = this.root.querySelector('slot');
        slot.innerHTML = `
      <div class="ring"><img src="${json.icon}" alt="${json.title}" class="avatar"></div>
    `;
        if (this.getAttribute('ttl') !== 'infinite') {
            const ttl = this.hasAttribute('ttl') ? Number(this.getAttribute('ttl')) : 86400;
            const createdAfter = new Date();
            createdAfter.setTime(new Date().getTime() - ttl * 1000);
            this.items = json.items.filter((item) => new Date(item.date_published) >= createdAfter);
        }
        else {
            this.items = json.items;
        }
        if (this.items.length === 0) {
            this.button.disabled = true;
            this.setAttribute('empty', '');
        }
        else {
            this.appendImages();
        }
    }
    pause() {
        this.paused = true;
        this.currentBar?.classList.add('paused');
        if (this.timer)
            clearTimeout(this.timer);
    }
    resume() {
        this.paused = false;
        this.currentBar?.classList.remove('paused');
        this.currentBar?.querySelector('.progress')?.addEventListener('animationend', this.goToBinding, { once: true });
    }
    appendImages() {
        this.count = this.items.length;
        this.images = [];
        this.bars = [];
        this.promises = [];
        const bars = this.root.querySelector('#bars');
        const images = this.root.querySelector('#images');
        for (const item of this.items) {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            const progress = document.createElement('div');
            progress.classList.add('progress');
            bar.append(progress);
            bars.append(bar);
            this.bars.push(bar);
            const img = document.createElement('img');
            this.promises.push(new Promise(resolve => img.addEventListener('load', resolve)));
            img.src = item.image;
            img.alt = item.summary;
            images.append(img);
            this.images.push(img);
        }
    }
    async startTimer() {
        await this.promises[0];
        if (this.dialog.classList.contains('loading')) {
            this.dialog.classList.remove('loading');
            this.bindEvents();
        }
        this.currentIndex || (this.currentIndex = -1);
        this.goTo();
    }
    async goTo(delta = null) {
        delta || (delta = 1);
        // Reset animation
        if (this.currentBar) {
            this.currentBar.style.animation = 'none';
            this.currentBar.offsetHeight;
            this.currentBar.style.removeProperty('animation');
            this.currentBar.classList.remove('progressing');
        }
        if (this.timer)
            clearTimeout(this.timer);
        if (this.currentImage)
            this.currentImage.classList.remove('shown');
        this.currentIndex += delta;
        if (this.currentIndex === this.count) {
            this.dialog.close();
            return;
        }
        this.currentBar = this.bars[this.currentIndex];
        this.currentImage = this.images[this.currentIndex];
        this.currentBar.classList.add('progressing', 'paused');
        this.currentImage.classList.add('shown');
        this.dialog.classList.add('loading');
        await this.promises[this.currentIndex];
        this.dialog.classList.remove('loading');
        this.currentBar.classList.remove('paused');
        this.meta.textContent = this.items[this.currentIndex].summary;
        if (this.currentIndex > this.count - 1)
            this.currentIndex = 0;
        this.timer = setTimeout(this.goTo.bind(this), this.duration * 1000);
        if (this.paused)
            this.pause();
    }
}
if (!window.customElements.get('story-view')) {
    window.StoryViewElement = StoryViewElement;
    window.customElements.define('story-view', StoryViewElement);
}
export default StoryViewElement;
