import {OpenStoriesFeed} from 'openstories-types'

function css(duration: number) {
  return `
  :host {
    display: inline-block;
    font-family: system-ui, sans-serif;
    --magic-h: 88vh;
    --magic-w: 88vw;
  }

  ::backdrop {
    background-color: rgba(0, 0, 0, 0.9);
  }

  dialog button {
    border: 0;
    background: 0;
    appearance: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
  }
  
  #side-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.7vh;
  }

  #side-controls #close,
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

  :host(open-stories.is-empty) .ring {
    opacity: 0.5;
  }

  :host(open-stories:not(.is-read):not(.is-empty)) .ring {
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
    overflow: visible;
    max-height: var(--magic-h);
    max-width: var(--magic-w);
  }
  
  #images {
    overflow: hidden;
    height: 100%;
    width: 100%;
    position: absolute;
    background: #000;
    border-radius: 10px;
  }

  #images img {
    position: absolute;
    max-height: 100%;
    max-width: 100%;
    width: 100%;
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
    background: rgba(200, 200, 200, .2);
    z-index: 1;
    flex: auto;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    transition: all 200ms;
  }

  #bars:hover .bar {
    height: 4px;
    transform: translateY(-1px);
    background: rgba(200, 200, 200, .5);
  }

  .bar:hover {
    transform: translateY(-1px);
    flex-shrink: 0;
    transform-origin: center;
    min-width: 20px;
    height: 4px;
  }

  #bars:hover {
    gap: 2px;
  }

  #bars {
    left: 0; 
    right: 0;
    top: 0;
    height: 2px;
    position: absolute;
    padding: 10px;
    display: flex;
    gap: 3px;
    z-index: 2;
  }

  #side-controls button,
  #side-controls a {
    display: inline-flex;
  }

  #time {
    position: absolute;
    margin: 10px;
    top: 0; 
    left: 0;
    z-index: 1;
  }

  #time, {
    color: rgba(255, 255, 255, 0.7);
  }

  #time,
  #metadata,
  #more {
    color: #fff;
    font-size: 1.7vh;
    font-weight: 600;
    text-shadow: 0 0 2px black;;
  }

  svg {
    width: auto;
    height: 3.5vh;
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, .5));
    line-height: 0;
  }

  #bottom-controls {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    display: flex;
    align-items: end;
    overflow: hidden;
    pointer-events: none;
    gap: 1vh;
  }

  .action {
    cursor: pointer;
    transition: transform .3s;
  }

  .action:not([disabled]):hover,
  .action:not([disabled]):focus {
    transform: scale(1.2);
  }

  #open-heart {
    left: auto;
    right: 0;
    display: inline-flex;
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

  #metadata-details {
    display: flex;
    flex: 1 1 auto;
    align-items: end;
    overflow: hidden;
    padding: 0.7vh 0;
    gap: 0.7vh; 
  }

  #metadata,
  #more {
    line-height: 1.5em;
  }

  .is-collapsed #more {
    display: block;
  }
  
  #more {
    display: none;
    cursor: pointer;
  }

  #more,
  .action {
    pointer-events: auto;
  }

  #metadata {
    flex: 1 1 auto;
    white-space: nowrap;
  }
  
  .is-collapsed #metadata {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .is-expanded #metadata {
    white-space: normal;
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

  .is-loading button:not(.bar),
  .is-loading #controls,
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
    position: absolute;
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

    #side-controls #close {
      display: inline-flex;
    }
  }

  [hidden] {
    display: none !important;
  }
`
}

class OpenStoriesElement extends HTMLElement {
  root: ShadowRoot
  dialog: HTMLDialogElement
  button: HTMLButtonElement
  close: HTMLButtonElement
  time: HTMLElement
  metadataDetails: HTMLElement
  moreMetadata: HTMLButtonElement
  meta: HTMLElement
  openHeart: HTMLButtonElement
  themeColor: HTMLMetaElement | null = null
  link: HTMLAnchorElement
  currentIndex: number = -1
  count = 0
  timer: number | null = null
  currentBar: HTMLElement | null = null
  currentImage: HTMLImageElement | null = null
  images: HTMLImageElement[] = []
  bars: HTMLElement[] = []
  promises: Promise<unknown>[] = []
  paused: boolean = false
  open: boolean = false
  goToBinding: () => void
  items: OpenStoriesFeed["items"] = []
	_src: string
	_duration: number

  constructor() {
    super()
    this.root = this.attachShadow({mode: 'open'})
    this.root.innerHTML = `
      <button type="dialog" id="trigger" part="button"><slot>View stories</slot></button>
      <dialog class="is-loading" part="dialog">
        <div class="loading-visual" part="loading-visual"></div>
        <div id="bars"></div>
        <span id="time"></span>
        <div id="goToBlock">
          <button id="back">←</button>
          <button id="forward">→</button>
        </div>
        <div id="images"></div>
        <div id="bottom-controls">
          <div id="metadata-details">
            <div id="metadata" part="metadata-content"></div>
            <button type="button" id="more" part="metadata-summary">
            [more]
            </button>
          </div>
          <div id="side-controls">
            <button id="close" class="action" type="button" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="7.35723" width="1.91942" height="10.1014" rx="0.95971" transform="rotate(-45 6 7.35723)" fill="white"/>
                <rect x="7.35724" y="14.5" width="1.91942" height="10.1014" rx="0.95971" transform="rotate(-135 7.35724 14.5)" fill="white"/>
              </svg>
            </button>
            <button type="button" class="action" id="open-heart" part="open-heart" part="open-heart" hidden>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="on">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.60419 6.08132C9.77084 5.51626 10.1042 8.08132 10.1042 8.08132L10.1042 13.5813C8.60419 13.5813 7.10419 12.0813 6.50161 11.0813C5.89903 10.0813 5.43754 6.64637 7.60419 6.08132ZM12.6042 6.08131C10.4375 5.51626 10.1042 8.08132 10.1042 8.08132L10.1042 13.5813C11.6042 13.5813 13.1042 12.0813 13.7068 11.0813C14.3093 10.0813 14.7708 6.64637 12.6042 6.08131Z" fill="white"/>
              </svg>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="off">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.51776 6.65626C9.99827 7.26627 10.1042 8.08132 10.1042 8.08132C10.1042 8.08132 10.2101 7.26627 10.6906 6.65626C11.0625 6.1841 11.6589 5.83478 12.6042 6.08131C14.7708 6.64637 14.3093 10.0813 13.7068 11.0813C13.1042 12.0813 11.6042 13.5813 10.1042 13.5813C8.60419 13.5813 7.10419 12.0813 6.50161 11.0813C5.89903 10.0813 5.43754 6.64637 7.60419 6.08132C8.54951 5.83478 9.14584 6.1841 9.51776 6.65626ZM9.11332 8.21616L9.11237 8.20995C9.111 8.20138 9.10825 8.18497 9.10382 8.16202C9.09487 8.11576 9.07949 8.04512 9.05555 7.95993C9.00587 7.78317 8.92824 7.57595 8.81703 7.39676C8.70614 7.2181 8.58996 7.11151 8.47666 7.0572C8.3811 7.0114 8.20033 6.95929 7.85655 7.04895C7.4012 7.1677 7.08018 7.59115 7.01156 8.494C6.97938 8.91746 7.01661 9.36612 7.09563 9.76183C7.17781 10.1734 7.28974 10.4517 7.35813 10.5652C7.5966 10.9609 8.04101 11.4942 8.58331 11.9193C9.13877 12.3547 9.67326 12.5813 10.1042 12.5813C10.5351 12.5813 11.0696 12.3547 11.6251 11.9193C12.1674 11.4942 12.6118 10.9609 12.8503 10.5652C12.9186 10.4517 13.0306 10.1734 13.1127 9.76183C13.1918 9.36612 13.229 8.91746 13.1968 8.49399C13.1282 7.59115 12.8072 7.1677 12.3518 7.04895C12.008 6.95929 11.8273 7.0114 11.7317 7.0572C11.6184 7.11151 11.5022 7.2181 11.3913 7.39676C11.2801 7.57595 11.2025 7.78317 11.1528 7.95993C11.1289 8.04512 11.1135 8.11576 11.1046 8.16202C11.1001 8.18497 11.0974 8.20138 11.096 8.20995L11.0951 8.21615C11.0277 8.71143 10.6047 9.08132 10.1042 9.08132C9.60373 9.08132 9.18068 8.71144 9.11332 8.21616Z" fill="white"/>
              </svg>
            </button>
            <a href id="link" class="action" aria-label="Story (copy link)">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.41489 9.17763C9.80542 8.78711 9.80542 8.15395 9.41489 7.76342V7.76342C9.02437 7.3729 8.3912 7.3729 8.00068 7.76342L6.92857 8.83553C5.757 10.0071 5.757 11.9066 6.92857 13.0782C8.10014 14.2497 9.99964 14.2497 11.1712 13.0782V13.0782C11.3254 12.924 11.3254 12.6739 11.1712 12.5197L10.3154 11.664C10.1612 11.5098 9.9112 11.5098 9.757 11.664V11.664C9.36647 12.0545 8.73331 12.0545 8.34278 11.664C7.95226 11.2734 7.95226 10.6403 8.34278 10.2497L9.41489 9.17763ZM11.5918 9.82911C11.2013 10.2196 11.2013 10.8528 11.5918 11.2433V11.2433C11.9824 11.6338 12.6155 11.6338 13.0061 11.2433L13.9996 10.2497C15.1712 9.07817 15.1712 7.17868 13.9996 6.00711C12.8281 4.83553 10.9286 4.83553 9.757 6.00711V6.00711C9.64616 6.11794 9.64616 6.29763 9.757 6.40847L10.7698 7.42132C10.8807 7.53215 11.0604 7.53215 11.1712 7.42132V7.42132C11.5617 7.03079 12.1949 7.03079 12.5854 7.42132C12.9759 7.81184 12.9759 8.44501 12.5854 8.83553L11.5918 9.82911Z" fill="white"/>
              </svg>
            </a>
            <button id="play-pause" class="action" type="button" aria-label="Play/Pause" aria-pressed="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="play">
                <path d="M7 13.0568V6.94319C7 6.12982 7.91937 5.65669 8.58124 6.12946L12.8608 9.18627C13.4191 9.58509 13.4191 10.4149 12.8608 10.8137L8.58124 13.8705C7.91937 14.3433 7 13.8702 7 13.0568Z" fill="white"/>
              </svg>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="pause">
                <rect x="7" y="6" width="2" height="8" rx="1" fill="white"/>
                <path d="M11 7C11 6.44772 11.4477 6 12 6V6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14V14C11.4477 14 11 13.5523 11 13V7Z" fill="white"/>
              </svg>
            </button>
          </div>
        </div>
      </dialog>
    `

    this.dialog = this.root.querySelector('dialog')!
    this.button = this.root.querySelector('button#trigger')!
    this.close = this.root.querySelector('button#close')!
    this.openHeart = this.root.querySelector('button#open-heart')!
    this.metadataDetails = this.root.querySelector('#metadata-details')!
    this.meta = this.root.querySelector('#metadata')!
    this.moreMetadata = this.root.querySelector('#more')!
    this.link = this.root.querySelector('a#link')!
    this.time = this.root.querySelector('#time')!
    this.goToBinding = this.goTo.bind(this, 1)
		
		this._src = ""
		this._duration = 5
  }

  get isHighlight() {
    return this.hasAttribute('is-highlight')
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

    const src = this.src
    if (src) this.fetchData(src)

    const style = document.createElement('style')
    style.innerText = css(this.duration)
    this.root.append(style)

    this.style.setProperty('--mobileVh', `${window.innerHeight * 0.01}px`)

    this.moreMetadata.addEventListener('click', () => {
      this.metadataDetails.classList.add('is-expanded')
      this.metadataDetails.classList.remove('is-collapsed')
    })
  }

  set src(path: string) {
    this._src = new URL(path || "", location.href).toString()
  }

  get src(): string {
    return this._src;
  }

  set duration(value: number) {
    this._duration = Number(value) || 5;
  }

  get duration(): number {
    return this._duration;
  }

  async sendHeart() {
    const item = this.items[this.currentIndex]
    const urls = this.items[this.currentIndex]._open_stories.reactions?.open_heart_urls || []
    if (urls.length === 0) return

    const key = `♥︎@${item.id}`
    const promises = []
    for (const url of urls) {
      promises.push(fetch(url, {method: 'post', body: '❤️'}))
    }

    this.openHeart.setAttribute('aria-busy', 'true')
    let response: Response | null = null

    try {
      response = await Promise.any(promises)
    } catch { 
      // noop
    } finally {
      this.openHeart.setAttribute('aria-busy', 'false')
      if (!response) return
    }

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
      if (this.paused) this.resume()
      if (this.timer) clearTimeout(this.timer)
      if (this.currentIndex >= this.items.length - 1) this.currentIndex = -1
      this.checkIfAllRead()
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

  itemByHash(): OpenStoriesFeed["items"][0] | undefined {
    const hash = (location.hash || '').slice(1)
    if (hash.length === 0) return
    
    return this.items.find((item) => item.id === hash)
  }

  checkHashId(): boolean {
    // Prevent opening multiple viewer sharing the same feed on the page
    if (Array.from(document.querySelectorAll('open-stories')).find(e => e !== this && e.open)) return false

    const item = this.itemByHash()
    if (!item) return false
    
    const index = this.items.indexOf(item)
    if (this.currentIndex === index) return false

    this.currentIndex = index - 1

    if (!this.dialog.open) {
      this.button.click()
    } else {
      this.goTo(1)
    }

    return true
  }

  checkIfAllRead() {
    if (this.isHighlight) return false

    const lastItem = this.items[this.items.length - 1]
    const id = this.getViewedId()
    const allRead = lastItem && lastItem.id === id
    this.classList.toggle('is-read', allRead)
    return allRead
  }

  async fetchData(url: string) {
    this.classList.add('is-loading')
    const json: OpenStoriesFeed = await (await fetch(url)).json()
    this.classList.remove('is-loading')

    const now = new Date()
    this.items = json.items.filter((item) => {
      return item._open_stories.mime_type.startsWith('image') && (!item._open_stories.date_expired || now <= new Date(item._open_stories.date_expired))
    }).reverse()

    this.classList.toggle('is-empty', this.items.length === 0)
    if (this.items.length === 0) {
      this.button.disabled = true
    } else {
      this.appendImages()
    }
    
    window.addEventListener('hashchange', this.checkHashId.bind(this))
    if (this.checkHashId()) return
    this.setIndexToUnread()
  }

  setIndexToUnread() {
    if (this.isHighlight) return false

    const viewedId = this.getViewedId()
    if (!viewedId) return

    const viewedItemIndex = this.items.findIndex(item => item.id === viewedId)
    if (viewedItemIndex < 0) return
    if (this.checkIfAllRead()) return

    this.currentIndex = viewedItemIndex
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
      const bar = document.createElement('button')
      bar.type = 'button'
      bar.classList.add('bar')
      const idx = this.images.length
      bar.addEventListener('click', () => {
        const delta = idx - this.currentIndex
        if (delta !== 0) this.goTo(delta)
      })
      const progress = document.createElement('div')
      progress.classList.add('progress')
      bar.setAttribute('aria-label', `${idx + 1} of ${this.items.length} ${this.items.length === 1 ? 'stroy' : 'stories'}`)
      bar.setAttribute('title', `${idx + 1} of ${this.items.length} ${this.items.length === 1 ? 'stroy' : 'stories'}`)
      bar.append(progress)
      bars.append(bar)
      this.bars.push(bar)
      const img = document.createElement('img')
      this.promises.push(new Promise(resolve => img.addEventListener('load', resolve)))
      if (this.promises.length !== 1 && this.lazyLoad) {
        img.setAttribute('data-src', item._open_stories.url)
      } else {
        img.src = item._open_stories.url
      }
      if ('alt' in item._open_stories) img.alt = item._open_stories.alt
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

    if (this.lazyLoad) {
      for (const image of this.images) {
        if (image.src || !image.hasAttribute('data-src')) continue
        image.src = image.getAttribute('data-src') || ''
      }
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
      this.meta.textContent = ''
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
    if (!this.isHighlight) this.setViewed(item.id)

    // Populate
    this.time.textContent = this.relativeTime(item.date_published)
    const caption = 'caption' in item._open_stories ? item._open_stories.caption : null
    this.metadataDetails.classList.remove('is-expanded', 'is-collapsed')
    this.meta.textContent = caption || ''
    if (this.meta.clientWidth > this.metadataDetails.clientWidth) {
      this.metadataDetails.classList.add('is-collapsed')
    }
    this.prepareHeart()

    if (item.url) {
      this.link.hidden = false
      this.link.href = item.url
    } else {
      this.link.hidden = true
      this.link.removeAttribute('href')
    }

    if (this.currentIndex > this.count - 1) this.currentIndex = 0

    this.timer = window.setTimeout(this.goTo.bind(this), this.duration * 1000)
    if (this.paused) this.pause()
  }

  get viewedKey() {
    return this.src
  }

  get lazyLoad() {
    return this.getAttribute('loading') === 'lazy'
  }

  setViewed(id: string) {
    const lastViewedIndex = this.items.findIndex(item => item.id === this.getViewedId())
    const newViewedIndex = this.items.findIndex(item => item.id === id)
    if (newViewedIndex < lastViewedIndex) return

    const viewedByFeed = JSON.parse(localStorage.getItem('_open_stories') || '{}')
    viewedByFeed[this.viewedKey] = id
    localStorage.setItem('_open_stories', JSON.stringify(viewedByFeed))
  }

  getViewedId() {
    const viewedByFeed = JSON.parse(localStorage.getItem('_open_stories') || '{}')
    return viewedByFeed[this.viewedKey]
  }

  prepareHeart() {
    const item = this.items[this.currentIndex]
    const hasUrl = (item._open_stories.reactions?.open_heart_urls || []).length > 0
    this.openHeart.hidden = !hasUrl
    if (!hasUrl) return
    const keys = (localStorage.getItem('_open_heart') || '').split(',')
    const hearted = keys.includes(`♥︎@${item.id}`)
    this.openHeart.setAttribute('aria-pressed', hearted.toString())
    this.openHeart.disabled = hearted
  }
  
  relativeTime(time: string | undefined): string {
    if (!time) return ''
    const published = new Date(time)
    if (published.toString() === 'Invalid Date') return ''

    const m = Math.round((new Date().getTime() - published.getTime()) / 1000 / 60)
    if (m > 60 * 24) {
      return `${Math.round(m / 60 / 24)}d`
    } else if (m > 60) {
      return `${Math.round(m / 60)}h`
    } else {
      return `${m}m`
    }
  }
}

if (!window.customElements.get('open-stories')) {
  window.OpenStoriesElement = OpenStoriesElement
  window.customElements.define('open-stories', OpenStoriesElement)
}

export default OpenStoriesElement

declare global {
  interface Window {
    OpenStoriesElement: typeof OpenStoriesElement
  }
  interface HTMLElementTagNameMap {
    'open-stories': OpenStoriesElement
  }
}
