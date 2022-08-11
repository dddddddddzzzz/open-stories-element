import {WebStoriesFeed} from 'webstories-ts-types'

function css(duration: number) {
  return `
  :host {
    display: inline-block;
    font-family: system-ui, sans-serif;
    --magic-h: 88vh;
    --magic-w: 88vw;
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

  #controls #close,
  #play,
  #pause {
    display: none;
  }
  
  dialog.is-paused #play {
    display: block;
  }

  dialog:not(.is-paused) #pause {
    display: block;
  }

  button {
    border: 0;
    background: 0;
    appearance: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
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
    height: min(var(--magic-h), var(--magic-w) * 16/9);
    padding: 0;
    border: 0;
    aspect-ratio: 9/16;
    background: transparent;
    overflow: hidden;
    max-height: var(--magic-h);
    max-width: var(--magic-w);
    border-radius: 10px;
  }
  
  #images {
    overflow: hidden;
    height: 100%;
    width: 100%;
    position: absolute;
    background: #000;
  }

  #images img {
    position: absolute;
    max-height: 100%;
    max-width: 100%;
    aspect-ratio: 9/16;
    top: 0;
    opacity: 0;
  }

  #images img.shown {
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

  #controls {
    left: 0; 
    right: 0;
    top: 0;
    position: absolute;
    margin: 20px 10px 10px;
    display: flex;
    gap: 10px;
    align-items: center;
    z-index: 1;
  }

  #metadata-details summary {
    align-items: center;
    font-size: 1.6vh;
  }

  #controls button,
  #controls a,
  #metadata-details summary {
    display: inline-flex;
  }

  #time,
  #metadata-details {
    flex: auto;
    font-size: 1.7vh;
    color: rgba(255, 255, 255, 0.7);
    text-shadow: 0 0 5px #000;
  }

  svg {
    width: auto;
    height: 3.5vh;
    line-height: 0;
  }

  #metadata-details,
  #open-heart {
    position: absolute;
    bottom: 0;
    z-index: 1;
    left: 0;
    right: 0;
    padding: 10px;
  }

  #open-heart {
    left: auto;
    right: 0;
    display: inline-flex;
    cursor: pointer;
    transition: transform .3s;
  }

  #open-heart .off {
    transition: opacity .3s;
  }

  #open-heart .on {
    position: absolute;
    z-index: 1;
    opacity: 0;
    transform: scale(0);
    transition: transform .3s;
  }

  #open-heart:not([disabled]):hover,
  #open-heart:not([disabled]):focus {
    transform: scale(1.2);
  }

  #open-heart[aria-pressed="true"] .on { 
    transform: scale(1);
    opacity: 1;
  }

  #open-heart[aria-pressed="true"] .off { opacity: 0; }

  #open-heart[aria-pressed="true"] path { fill: #f00; }

  #open-heart[aria-busy="true"] { animation: pulsate .4s infinite; }

  @keyframes pulsate {
    0% { transform: scale(1) }
    100% { transform: scale(1.2) }
  }

  #open-heart[errored] {
    opacity: .5;
  }

  #metadata-details[open] {
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0)  0%,  rgba(0, 0, 0, 0.5)  25px, rgba(0, 0, 0, .8) 100%);
  }

  #caret {
    transition: transform .3s;
  }

  #metadata-details[open] #caret {
    transform: rotate(90deg);
  }

  summary path {
    fill: rgba(255, 255, 255, 0.7);
  }

  summary {
    cursor: pointer;
    width: 100%;
    text-align: left;
    list-style: none;
  }

  #metadata {
    border-radius: 6px;
    color: #fff;
  }

  #metadata a {
    color: #000;
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

  .is-loading .progressing .progress,
  .is-paused .progressing .progress {
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

  .is-loading button,
  .is-loading #controls,
  .is-loading #metadata-details,
  .is-loading #open-heart {
    display: none;
  }

  .is-loading #images img {
    opacity: 0;
  }

  .is-loading .loading-visual {
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

  #goToBlock {
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 2vw;
    aspect-ratio: 9 / 16;
    height: min(var(--magic-h), var(--magic-w) * 16/9);
    position: fixed;
    top: 50%;
    z-index: 1;
    pointer-events: none;
    box-sizing: border-box;
  }

  #back, #forward {
    pointer-events: all;
    position: absolute;
    z-index: 1;
    min-width: 40px;
    height: calc(100% - 100px);
    bottom: 50px;
    padding: 0;
    font-size: 3vh;
    width: 12vh;
    font-family: system-ui, sans-serif;
    color: #fff;
  }

  #back {
    left: -1.5em;
    text-align: left;
  }

  #forward {
    right: -1.5em;
    text-align: right;
  }

  @media (max-width: 420px), screen and (orientation: portrait) {
    :host {
      --magic-h: calc(var(--mobileVh) * 97);
      --magic-w: 100vw;
    }

    ::backdrop {
      background-color: #000;
    }

    #controls #close {
      display: inline-flex;
    }
  }
`
}

class StoryViewElement extends HTMLElement {
  root: ShadowRoot
  dialog: HTMLDialogElement
  button: HTMLButtonElement
  close: HTMLButtonElement
  time: HTMLElement
  metadataDetails: HTMLElement
  meta: HTMLElement
  openHeart: HTMLButtonElement
  themeColor: HTMLMetaElement | null = null
  link: HTMLAnchorElement
  currentIndex: number = -1
  count = 0
  timer: number | null = null
  currentBar: HTMLElement | null = null
  currentImage: HTMLElement | null = null
  images: HTMLElement[] = []
  bars: HTMLElement[] = []
  promises: Promise<unknown>[] = []
  paused: boolean = false
  open: boolean = false
  goToBinding: () => void
  items: WebStoriesFeed["items"] = []

  constructor() {
    super()
    this.root = this.attachShadow({mode: 'open'})
    this.root.innerHTML = `
      <button type="dialog" id="trigger"><slot></slot></button>
      <dialog class="is-loading">
        <div class="loading-visual"></div>
        <div id="bars"></div>
        <div id="controls">
          <span id="time"></span>
          <a href id="link" aria-label="Story (copy link)">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.41489 9.17763C9.80542 8.78711 9.80542 8.15395 9.41489 7.76342V7.76342C9.02437 7.3729 8.3912 7.3729 8.00068 7.76342L6.92857 8.83553C5.757 10.0071 5.757 11.9066 6.92857 13.0782C8.10014 14.2497 9.99964 14.2497 11.1712 13.0782V13.0782C11.3254 12.924 11.3254 12.6739 11.1712 12.5197L10.3154 11.664C10.1612 11.5098 9.9112 11.5098 9.757 11.664V11.664C9.36647 12.0545 8.73331 12.0545 8.34278 11.664C7.95226 11.2734 7.95226 10.6403 8.34278 10.2497L9.41489 9.17763ZM11.5918 9.82911C11.2013 10.2196 11.2013 10.8528 11.5918 11.2433V11.2433C11.9824 11.6338 12.6155 11.6338 13.0061 11.2433L13.9996 10.2497C15.1712 9.07817 15.1712 7.17868 13.9996 6.00711C12.8281 4.83553 10.9286 4.83553 9.757 6.00711V6.00711C9.64616 6.11794 9.64616 6.29763 9.757 6.40847L10.7698 7.42132C10.8807 7.53215 11.0604 7.53215 11.1712 7.42132V7.42132C11.5617 7.03079 12.1949 7.03079 12.5854 7.42132C12.9759 7.81184 12.9759 8.44501 12.5854 8.83553L11.5918 9.82911Z" fill="white"/>
            </svg>
          </a>
          <button id="play-pause" type="button" aria-label="Play/Pause" aria-pressed="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="play">
              <path d="M7 13.0568V6.94319C7 6.12982 7.91937 5.65669 8.58124 6.12946L12.8608 9.18627C13.4191 9.58509 13.4191 10.4149 12.8608 10.8137L8.58124 13.8705C7.91937 14.3433 7 13.8702 7 13.0568Z" fill="white"/>
            </svg>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="pause">
              <rect x="7" y="6" width="2" height="8" rx="1" fill="white"/>
              <path d="M11 7C11 6.44772 11.4477 6 12 6V6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14V14C11.4477 14 11 13.5523 11 13V7Z" fill="white"/>
            </svg>
          </button>
          <button id="close" type="button" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="7.35723" width="1.91942" height="10.1014" rx="0.95971" transform="rotate(-45 6 7.35723)" fill="white"/>
              <rect x="7.35724" y="14.5" width="1.91942" height="10.1014" rx="0.95971" transform="rotate(-135 7.35724 14.5)" fill="white"/>
            </svg>
          </button>
        </div>
        <div id="goToBlock">
          <button id="back">←</button>
          <button id="forward">→</button>
        </div>
        <div id="images"></div>
        <details hidden id="metadata-details">
          <summary>
            See description 
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="caret">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.27665 6.30953C8.65799 5.91003 9.29098 5.89531 9.69048 6.27665L12.6905 9.14028C12.8825 9.32353 12.9937 9.57558 12.9997 9.8409C13.0058 10.1062 12.9061 10.3631 12.7226 10.5549L9.72264 13.6912C9.34089 14.0903 8.70788 14.1044 8.30878 13.7226C7.90968 13.3409 7.89561 12.7079 8.27736 12.3088L10.5854 9.8958L8.30953 7.72336C7.91003 7.34202 7.89531 6.70902 8.27665 6.30953Z" fill="white"/>
            </svg>
          </summary>
          <div id="metadata"></div>
        </details>
        <button type="button" id="open-heart" hidden>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="on">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.60419 6.08132C9.77084 5.51626 10.1042 8.08132 10.1042 8.08132L10.1042 13.5813C8.60419 13.5813 7.10419 12.0813 6.50161 11.0813C5.89903 10.0813 5.43754 6.64637 7.60419 6.08132ZM12.6042 6.08131C10.4375 5.51626 10.1042 8.08132 10.1042 8.08132L10.1042 13.5813C11.6042 13.5813 13.1042 12.0813 13.7068 11.0813C14.3093 10.0813 14.7708 6.64637 12.6042 6.08131Z" fill="white"/>
          </svg>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="off">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.51776 6.65626C9.99827 7.26627 10.1042 8.08132 10.1042 8.08132C10.1042 8.08132 10.2101 7.26627 10.6906 6.65626C11.0625 6.1841 11.6589 5.83478 12.6042 6.08131C14.7708 6.64637 14.3093 10.0813 13.7068 11.0813C13.1042 12.0813 11.6042 13.5813 10.1042 13.5813C8.60419 13.5813 7.10419 12.0813 6.50161 11.0813C5.89903 10.0813 5.43754 6.64637 7.60419 6.08132C8.54951 5.83478 9.14584 6.1841 9.51776 6.65626ZM9.11332 8.21616L9.11237 8.20995C9.111 8.20138 9.10825 8.18497 9.10382 8.16202C9.09487 8.11576 9.07949 8.04512 9.05555 7.95993C9.00587 7.78317 8.92824 7.57595 8.81703 7.39676C8.70614 7.2181 8.58996 7.11151 8.47666 7.0572C8.3811 7.0114 8.20033 6.95929 7.85655 7.04895C7.4012 7.1677 7.08018 7.59115 7.01156 8.494C6.97938 8.91746 7.01661 9.36612 7.09563 9.76183C7.17781 10.1734 7.28974 10.4517 7.35813 10.5652C7.5966 10.9609 8.04101 11.4942 8.58331 11.9193C9.13877 12.3547 9.67326 12.5813 10.1042 12.5813C10.5351 12.5813 11.0696 12.3547 11.6251 11.9193C12.1674 11.4942 12.6118 10.9609 12.8503 10.5652C12.9186 10.4517 13.0306 10.1734 13.1127 9.76183C13.1918 9.36612 13.229 8.91746 13.1968 8.49399C13.1282 7.59115 12.8072 7.1677 12.3518 7.04895C12.008 6.95929 11.8273 7.0114 11.7317 7.0572C11.6184 7.11151 11.5022 7.2181 11.3913 7.39676C11.2801 7.57595 11.2025 7.78317 11.1528 7.95993C11.1289 8.04512 11.1135 8.11576 11.1046 8.16202C11.1001 8.18497 11.0974 8.20138 11.096 8.20995L11.0951 8.21615C11.0277 8.71143 10.6047 9.08132 10.1042 9.08132C9.60373 9.08132 9.18068 8.71144 9.11332 8.21616Z" fill="white"/>
          </svg>
        </button>
      </dialog>
    `

    this.dialog = this.root.querySelector('dialog')!
    this.button = this.root.querySelector('button#trigger')!
    this.close = this.root.querySelector('button#close')!
    this.openHeart = this.root.querySelector('button#open-heart')!
    this.metadataDetails = this.root.querySelector('#metadata-details')!
    this.meta = this.root.querySelector('#metadata')!
    this.link = this.root.querySelector('a#link')!
    this.time = this.root.querySelector('#time')!
    this.goToBinding = this.goTo.bind(this, 1)
  }

  setThemeColor(force: boolean) {
    if (force && !this.themeColor) {
      this.themeColor = document.createElement('meta')
      this.themeColor.name = 'theme-color'
      this.themeColor.content = '#000'

      document.body.append(this.themeColor)
    }

    if (!force && this.themeColor) {
      this.themeColor.remove()
      this.themeColor = null
    }
  }

  connectedCallback() {
    this.button.addEventListener('click', () => {
      this.dialog.open ? this.dialog.close() : this.dialog.showModal()
      this.open = this.dialog.open
      if (!this.dialog.open) return
      this.dialog.tabIndex = -1
      this.dialog.focus()
      this.startTimer()
      this.setThemeColor(true)
    })

    this.close.addEventListener('click', () => {
      this.button.click()
    })

    // Backdrop click to close
    this.dialog.addEventListener('click', (event) => {
      if (!this.dialog.open || event.target !== this.dialog) return
      this.button.click()
    })

    const src = this.getAttribute('src')
    if (src) this.fetchData(src)

    const style = document.createElement('style')
    style.innerText = css(this.duration)
    this.root.append(style)

    this.style.setProperty('--mobileVh', `${window.innerHeight * 0.01}px`)

    if (this.hasAttribute('metadata')) {
      this.root.querySelector<HTMLElement>('details')!.hidden = false
    }
  }

  get src() {
    return this.hasAttribute('src') ? new URL(this.getAttribute('src') || '', location.href) : ''
  }

  get duration() {
    return this.hasAttribute('duration') ? Number(this.getAttribute('duration')) : 5
  }

  async sendHeart() {
    const item = this.items[this.currentIndex]
    const urls = this.items[this.currentIndex]._web_story.reactions?.open_heart_urls || []
    if (urls.length === 0) return

    const key = `♥︎@${item.id}`
    const promises = []
    for (const url of urls) {
      const urlWithEmoji = new URL(url)
      urlWithEmoji.searchParams.set('emoji', '♥︎')
      promises.push(fetch(urlWithEmoji.toString(), {method: 'post'}))
    }

    this.openHeart.setAttribute('aria-busy', 'true')
    await Promise.any(promises)
    this.openHeart.setAttribute('aria-busy', 'false')
    const keys = (localStorage.getItem('_open_heart') || '').split(',').filter(s => s)
    keys.push(key)
    localStorage.setItem('_open_heart' ,keys.join(','))
    this.prepareHeart()
  }

  bindEvents() {
    const images = this.root.querySelector('#images')!
    const playPause = this.root.querySelector<HTMLElement>('#play-pause')!
    const back = this.root.querySelector<HTMLElement>('button#back')!
    const forward = this.root.querySelector<HTMLElement>('button#forward')!

    this.openHeart.addEventListener('click', () => {
      this.sendHeart()
    })

    this.link.addEventListener('click', async () => {
      await navigator.clipboard.writeText(this.link.href)
    })

    back.addEventListener('click', () => {
      if (this.currentIndex === 0) {
        this.dialog.close()
      } else {
        this.goTo(-1)
      }
    })

    forward.addEventListener('click', () => {
      if (this.currentIndex === this.count - 1) {
        this.dialog.close()
      } else {
        this.goTo(1)
      }
    })

    this.dialog.addEventListener('close', () => {
      if (this.timer) clearTimeout(this.timer)
      this.currentIndex = -1
      this.setThemeColor(false)

      if (this.itemByHash()) window.location.hash = ''
    })

    playPause.addEventListener('click', () => {
      playPause.setAttribute('aria-pressed', this.paused.toString())
      this.paused ? this.resume() : this.pause()
    })

    images.addEventListener('click', () => {
      playPause.click()
    })

    const dialog = this.dialog

    document.addEventListener('keydown', keyboradShortcut.bind(this))
    function keyboradShortcut(event: KeyboardEvent) {
      if (!dialog.open) return
      if (event.key === 'ArrowRight') forward.click()
      if (event.key === 'ArrowLeft') back.click()
    }
  }

  itemByHash(): WebStoriesFeed["items"][0] | undefined {
    const hash = (location.hash || '').slice(1)
    if (hash.length === 0) return
    
    return this.items.find((item) => item.id === hash)
  }

  checkHashId() {
    // Prevent opening multiple viewer sharing the same feed on the page
    if (Array.from(document.querySelectorAll('story-view')).find(e => e !== this && e.open)) return

    const item = this.itemByHash()
    if (!item) return
    
    const index = this.items.indexOf(item)
    if (this.currentIndex === index) return

    this.currentIndex = index - 1

    if (!this.dialog.open) {
      this.button.click()
    } else {
      this.goTo(1)
    }
  }

  async fetchData(url: string) {
    const json: WebStoriesFeed = await (await fetch(url)).json()
    const slot = this.root.querySelector('slot')!
    slot.innerHTML = `
      <div class="ring"><img src="${json.icon}" alt="${json.title}" class="avatar"></div>
    `

    const now = new Date()
    this.items = json.items.filter((item) => {
      return item._web_story.type === 'image' && now <= new Date(item._web_story.expire_by)
    }).reverse()

    this.classList.toggle('is-empty', this.items.length === 0)
    if (this.items.length === 0) {
      this.button.disabled = true
    } else {
      this.appendImages()
    }

    this.checkHashId()
    window.addEventListener('hashchange', this.checkHashId.bind(this))
  }

  pause() {
    this.paused = true
    this.classList.add('is-paused')
    this.dialog.classList.add('is-paused')
    if (this.timer) clearTimeout(this.timer)
  }

  resume() {
    this.paused = false
    this.classList.remove('is-paused')
    this.dialog.classList.remove('is-paused')
    this.currentBar?.querySelector('.progress')?.addEventListener('animationend', this.goToBinding, {once: true})
  }

  appendImages() {
    this.count = this.items.length
    this.images = []
    this.bars = []
    this.promises = []

    const bars = this.root.querySelector('#bars')!
    const images = this.root.querySelector('#images')!
    for (const item of this.items) {
      const bar = document.createElement('div')
      bar.classList.add('bar')
      const progress = document.createElement('div')
      progress.classList.add('progress')
      bar.append(progress)
      bars.append(bar)
      this.bars.push(bar)
      const img = document.createElement('img')
      this.promises.push(new Promise(resolve => img.addEventListener('load', resolve)))
      img.src = item._web_story.url
      if (item._web_story.type === 'image') img.alt = item._web_story.alt
      images.append(img)
      this.images.push(img)
    }
  }
  
  async startTimer() {
    await this.promises[0]
    if (this.dialog.classList.contains('is-loading')) {
      this.dialog.classList.remove('is-loading')
      this.bindEvents()
    }

    this.goTo()
  }
  
  async goTo(delta: number | null = null) {
    delta ||= 1
    // Reset animation
    if (this.currentBar) {
      this.currentBar.style.animation = 'none'
      this.currentBar.offsetHeight
      this.currentBar.style.removeProperty('animation')
      this.currentBar.classList.remove('progressing')
    } 
    if (this.timer) clearTimeout(this.timer)
    if (this.currentImage) this.currentImage.classList.remove('shown')

    this.currentIndex += delta
    if (this.currentIndex === this.count) {
      this.dialog.close()
      return
    }

    this.currentBar = this.bars[this.currentIndex]
    this.currentImage = this.images[this.currentIndex]
    this.currentBar.classList.add('progressing', 'paused')
    this.currentImage.classList.add('shown')
    this.dialog.classList.add('is-loading')
    await this.promises[this.currentIndex]
    this.dialog.classList.remove('is-loading')
    this.currentBar.classList.remove('paused')

    const item = this.items[this.currentIndex]

    // Populate
    this.time.textContent = this.relativeTime(item.date_published!)
    const caption = item._web_story.type === 'image' ? item._web_story.caption : null
    this.metadataDetails.hidden = !caption
    this.meta.textContent = caption || ''
    this.prepareHeart()

    this.link.href = `#${item.id}`

    if (this.currentIndex > this.count - 1) this.currentIndex = 0

    this.timer = window.setTimeout(this.goTo.bind(this), this.duration * 1000)
    if (this.paused) this.pause()
  }

  prepareHeart() {
    const item = this.items[this.currentIndex]
    const hasUrl = (item._web_story.reactions?.open_heart_urls || []).length > 0
    this.openHeart.hidden = !hasUrl
    if (!hasUrl) return
    const keys = (localStorage.getItem('_open_heart') || '').split(',')
    const hearted = keys.includes(`♥︎@${item.id}`)
    this.openHeart.setAttribute('aria-pressed', hearted.toString())
    this.openHeart.disabled = hearted
  }
  
  relativeTime(time: string): string {
    const m = Math.round((new Date().getTime() - new Date(time).getTime()) / 1000 / 60)
    if (m > 60 * 24) {
      return `${Math.round(m / 60 / 24)}d`
    } else if (m > 60) {
      return `${Math.round(m / 60)}h`
    } else {
      return `${m}m`
    }
  }
}

if (!window.customElements.get('story-view')) {
  window.StoryViewElement = StoryViewElement
  window.customElements.define('story-view', StoryViewElement)
}

export default StoryViewElement

declare global {
  interface Window {
    StoryViewElement: typeof StoryViewElement
  }
  interface HTMLElementTagNameMap {
    'story-view': StoryViewElement
  }
}
