const s = 5
const style = `
  :host {
    display: inline-block;
  }

  :focus {
    outline: none;
  }

  :focus-visible {
    outline: default;
  }

  ::backdrop {
    background-color: #343434;
  }

  button {
    border: 0;
    background: 0;
    appearance: none;
    cursor: pointer;
  }

  .ring {
    border-radius: 50%;
    aspect-ratio: 1;
    width: 50px;
    border: 2px solid #08c;
    padding: 2px;
    overflow: hidden;
  }

  .avatar {
    width: 100%;
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

  #bar {
    border-radius: 3px;
    overflow: hidden;
    position: absolute;
    margin: 10px;
    height: 3px;
    left: 0; 
    right: 0;
    top: 0;
    background: rgba(0, 0, 0, .4);
    z-index: 1;
  }

  #progress {
    height: 3px;
    background-color: #08c;
    animation: progress ${s}s linear;
    animation-play-state: paused;
  }

  #progress.running {
    animation-play-state: running;
  }

  @keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }

  #back, #forward {
    position: absolute;
    height: 100%;
    z-index: 1;
    width: 40px;
    font-size: 20px;
    font-family: system-ui, sans-serif;
  }

  #back {
    left: -40px;
    text-align: left;
  }

  #forward {
    right: -40px;
    text-align: right;
  }
`

class StoryViewElement extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.root = this.attachShadow({mode: 'open'})
    this.root.innerHTML = `
      <style>${style}</style>
      <button type="dialog"><slot></slot></button>
      <dialog>
        <div id="bar"><div id="progress"></div></div>
        <button id="back" class="paginate">←</button>
        <button id="forward" class="paginate">→</button>
        <div id="images"></div>
      </dialog>
    `

    this.progress = this.root.querySelector('#progress')

    this.bindEvents()
    if (this.hasAttribute('src')) {
      this.fetchData(this.getAttribute('src'))
    }
  }

  bindEvents() {
    const button = this.root.querySelector('button')
    const dialog = this.root.querySelector('dialog')
    const images = this.root.querySelector('#images')
    const back = this.root.querySelector('#back')
    const forward = this.root.querySelector('#forward')
    this._rotate = this.rotate.bind(this)

    button.addEventListener('click', () => {
      dialog.open ? dialog.close() : dialog.showModal()
      if (dialog.open) this.startTimer()
    })

    back.addEventListener('click', () => {
      this.currentIndex -= 1
      if (this.currentIndex < 0) this.currentIndex = 0
      this.rotate()
    })

    forward.addEventListener('click', () => {
      this.currentIndex += 1
      if (this.currentIndex > this.images.length - 1) {
        dialog.close()
      } else {
        this.rotate()
      }
    })

    dialog.addEventListener('close', () => {
      if (this.timer) clearTimeout(this.timer)
      this.currentIndex = 0
    })

    images.addEventListener('mousedown', () => {
      this.progress.classList.remove('running')
      clearTimeout(this.timer)
    })

    images.addEventListener('mouseup', () => {
      this.progress.classList.add('running')
      this.progress.addEventListener('animationend', this._rotate, {once: true})
    })
  }

  async fetchData(url) {
    const json = await (await fetch(url)).json()
    this.root.querySelector('slot').innerHTML = `
      <div class="ring"><img src="${json.icon}" alt="${json.title}" class="avatar"></div>
    `
    this.appendImages(json.items)
  }

  appendImages(items) {
    this.count = items.length
    this.images = []
    const container = this.root.querySelector('#images')
    for (const item of items) {
      const img = document.createElement('img')
      img.src = item.image
      img.alt = item.summray
      container.append(img)
      this.images.push(img)
    }
  }
  
  startTimer() {
    this.currentIndex ||= 0
    this.rotate()
  }
  
  rotate() {
    // Reset animation
    this.progress.style.animation = 'none'
    this.progress.offsetHeight
    this.progress.style.animation = null
    this.progress.classList.add('running')
    clearTimeout(this.timer)
    
    if (this.currentImage) this.currentImage.classList.remove('shown')
    this.currentImage = this.images[this.currentIndex]
    this.currentImage.classList.add('shown')
    this.currentIndex += 1
    if (this.currentIndex > this.images.length - 1) this.currentIndex = 0

    this.timer = setTimeout(this.rotate.bind(this), s * 1000)
  }
}

window.StoryViewElement = StoryViewElement
window.customElements.define('story-view', StoryViewElement)
