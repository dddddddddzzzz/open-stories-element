import {OpenStoriesFeed} from 'openstories-types'

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
  toggleMute: HTMLButtonElement
  share: HTMLButtonElement
  themeColor: HTMLMetaElement | null = null
  link: HTMLAnchorElement
  currentIndex: number = -1
  count = 0
  timer: number | null = null
  currentBar: HTMLElement | null = null
  currentStory: HTMLImageElement | HTMLVideoElement | null = null
  stories: Array<HTMLImageElement | HTMLVideoElement> = []
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
      <dialog class="is-loading is-muted" part="dialog">
        <div class="loading-visual" part="loading-visual"></div>
        <div class="error-visual" part="error-visual"></div>
        <div id="bars"></div>
        <span id="time"></span>
        <div id="goToBlock">
          <button id="back">←</button>
          <button id="forward">→</button>
        </div>
        <div id="stories"></div>
        <div id="bottom-controls">
          <div id="metadata-details">
            <div id="metadata" part="metadata-content"></div>
            <button type="button" id="more" part="metadata-summary">
            [more]
            </button>
          </div>
          <div class="side-controls">
            <button id="close" class="action" type="button" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="7.35723" width="1.91942" height="10.1014" rx="0.95971" transform="rotate(-45 6 7.35723)" fill="white"/>
                <rect x="7.35724" y="14.5" width="1.91942" height="10.1014" rx="0.95971" transform="rotate(-135 7.35724 14.5)" fill="white"/>
              </svg>
            </button>
            <button id="toggleMute" class="action" type="button" aria-label="Mute/Unmute" aria-pressed="false">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="mute">
                <path fill="#fff" fill-rule="evenodd" d="M11.434 7.934a.8.8 0 0 1 1.132 0l.934.935.934-.935a.8.8 0 0 1 1.132 1.132L14.63 10l.935.934a.8.8 0 0 1-1.132 1.132l-.934-.935-.934.935a.8.8 0 0 1-1.132-1.132L12.37 10l-.935-.934a.8.8 0 0 1 0-1.132ZM10 7.002v5.73a1 1 0 0 1-1.64.768l-2.028-1.69a.998.998 0 0 1-.332.057H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1c.116 0 .228.02.332.056l2.028-1.69a1 1 0 0 1 1.64.769Z" clip-rule="evenodd"/>
              </svg>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="unmute">
                <path fill="#fff" fill-rule="evenodd" d="M10 7.002v5.73a1 1 0 0 1-1.64.768l-2.028-1.69a.998.998 0 0 1-.332.057H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1c.116 0 .228.02.332.056l2.028-1.69a1 1 0 0 1 1.64.769ZM12.35 8.208a.783.783 0 0 1 1.008-.458l-.275.733.275-.733h.001l.002.001.003.001.008.004a1.2 1.2 0 0 1 .077.032 2.53 2.53 0 0 1 .658.444c.365.343.737.905.737 1.718s-.372 1.375-.737 1.717a2.534 2.534 0 0 1-.715.47l-.02.007-.008.004h-.004l-.001.001c-.001 0-.002.001-.276-.732l.274.733a.783.783 0 0 1-.56-1.461l.003-.002a.97.97 0 0 0 .236-.162.74.74 0 0 0 .242-.575.74.74 0 0 0-.241-.575.969.969 0 0 0-.237-.162l-.004-.002a.783.783 0 0 1-.446-1.003Zm.457 2.477Zm0 0Z" clip-rule="evenodd"/>
              </svg>
            </button>
            <button type="button" class="action" id="open-heart" part="open-heart" hidden>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="on">
                <path fill="#fff" d="M12.267 5.5C10.567 5.5 10 7.767 10 7.767S9.433 5.5 7.733 5.5 5.467 7.2 5.467 8.333C5.467 11.733 8.3 14 10 14c1.7 0 4.533-2.267 4.533-5.667 0-1.7-.566-2.833-2.266-2.833Z"/>
              </svg>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="off">
                <path fill="#fff" fill-rule="evenodd" d="M7.905 8.01c-.165.264-.25.64-.25.96 0 1.072.445 1.97 1.036 2.607.623.67 1.288.931 1.609.931.321 0 .986-.26 1.609-.931a3.818 3.818 0 0 0 1.036-2.607c0-.598-.106-.923-.218-1.08-.068-.094-.2-.225-.64-.225-.197 0-.398.119-.61.457a2.56 2.56 0 0 0-.277.628l-.001.003a.928.928 0 0 1-1.798 0V8.75a2.557 2.557 0 0 0-.278-.627c-.212-.34-.413-.458-.61-.458-.296 0-.469.122-.608.345Zm1.497.744ZM9.4 8.749Zm.9-2.129c.395-.423.977-.81 1.786-.81.899 0 1.66.315 2.15 1.002.447.625.564 1.417.564 2.158a5.673 5.673 0 0 1-1.532 3.869c-.828.892-1.95 1.524-2.968 1.524s-2.14-.632-2.968-1.524A5.673 5.673 0 0 1 5.8 8.97c0-.573.139-1.314.532-1.943.418-.67 1.14-1.217 2.182-1.217.809 0 1.391.387 1.786.81Z" clip-rule="evenodd"/>
              </svg>
            </button>
            <button type="button" class="action" id="share" part="share" hidden>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.30953 9.32336C6.91003 8.94202 6.89531 8.30902 7.27665 7.90953L9.14028 5.90952C9.32353 5.71755 9.57558 5.60629 9.8409 5.60026C10.1062 5.59423 10.3631 5.69391 10.5549 5.87736L12.6912 7.87736C13.0903 8.25911 13.1044 8.89212 12.7226 9.29122C12.3409 9.69033 11.7079 9.70439 11.3088 9.32264L11 9.03679V11.6H9V8.98942L8.72336 9.29048C8.34202 9.68997 7.70902 9.7047 7.30953 9.32336ZM7.8 11.6C7.8 11.1582 7.44183 10.8 7 10.8C6.55817 10.8 6.2 11.1582 6.2 11.6V13.6C6.2 14.0418 6.55817 14.4 7 14.4H13C13.4418 14.4 13.8 14.0418 13.8 13.6V11.6C13.8 11.1582 13.4418 10.8 13 10.8C12.5582 10.8 12.2 11.1582 12.2 11.6V12.8H7.8V11.6Z" fill="white"/>
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
    this.toggleMute = this.root.querySelector('button#toggleMute')!
    this.share = this.root.querySelector('button#share')!
    this.metadataDetails = this.root.querySelector('#metadata-details')!
    this.meta = this.root.querySelector('#metadata')!
    this.moreMetadata = this.root.querySelector('#more')!
    this.link = this.root.querySelector('a#link')!
    this.time = this.root.querySelector('#time')!
    this.goToBinding = this.goTo.bind(this, 1)
		
    this._src = this.hasAttribute('src')
      ? this.formatSrc(this.getAttribute('src'))
      : ''

    this._duration = this.hasAttribute('duration')
      ? Number(this.getAttribute('duration'))
      : 5
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
      if (this.currentStory instanceof HTMLVideoElement) this.currentStory.pause()
      if (!this.dialog.open) return
      this.dialog.tabIndex = -1
      this.dialog.focus()
      if (this.paused) this.resume()
      this.startTimer()
      this.setThemeColor(true)
    })

    this.close.addEventListener('click', () => {
      this.button.click()
    })

    this.share.addEventListener('click', async () => {
      if (!this.paused) this.pause()
      const promise = navigator.share({url: this.items[this.currentIndex].url})
      try {
        await promise
      } catch {
        if (this.paused) this.resume()
      }
    })

    // Backdrop click to close
    this.dialog.addEventListener('click', (event) => {
      if (!this.dialog.open || event.target !== this.dialog) return
      this.button.click()
    })

    const src = this.src
    if (src) this.fetchData(src)

    const stylesheet = new CSSStyleSheet()
    stylesheet.replaceSync(css(this.duration))
    this.root.adoptedStyleSheets = [stylesheet]

    this.style.setProperty('--mobileVh', `${window.innerHeight * 0.01}px`)

    this.moreMetadata.addEventListener('click', () => {
      this.metadataDetails.classList.add('is-expanded')
      this.metadataDetails.classList.remove('is-collapsed')
    })
  }

  set src(path: string) {
    this.setAttribute('src', path)
    this._src = this.formatSrc(path)
  }

  get src(): string {
    return this._src
  }

  set duration(value: number) {
    this._duration = Number(value)
  }

  get duration(): number {
    return this._duration
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
    const stories = this.root.querySelector('#stories')!
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
      this.pause()
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

    this.toggleMute.addEventListener('click', () => {
      const currentlyMuted = this.dialog.classList.contains('is-muted')
      this.dialog.classList.toggle('is-muted', !currentlyMuted)
      playPause.setAttribute('aria-pressed', (!currentlyMuted).toString())

      for (const element of this.stories) {
        if (element instanceof HTMLVideoElement) {
          element.muted = !currentlyMuted
          element.volume = currentlyMuted ? 1 : 0
        } else {
          continue
        }
      }
    })

    stories.addEventListener('click', () => {
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
      return !item._open_stories.date_expired || now <= new Date(item._open_stories.date_expired)
    }).reverse()

    this.classList.toggle('is-empty', this.items.length === 0)
    if (this.items.length === 0) {
      this.button.disabled = true
    } else {
      this.appendStories()
    }
    
    window.addEventListener('hashchange', this.checkHashId.bind(this))
    if (this.checkHashId()) return
    this.setIndexToUnread()
  }

  /**
   * Format a path to a valid URL. 
   * @param path - The path to format.
   * @returns - The formatted path.
   */
  formatSrc(path: string | null): string {
    return new URL(path || '', location.href).toString()
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
    if (this.currentStory instanceof HTMLVideoElement) this.currentStory.pause()
    if (this.timer) clearTimeout(this.timer)
  }

  resume() {
    this.paused = false
    this.classList.remove('is-paused')
    this.dialog.classList.remove('is-paused')
    this.currentBar?.querySelector('.progress')?.addEventListener('animationend', this.goToBinding, {once: true})
    this.playStory(this.currentStory)
  }

  appendStories() {
    this.count = this.items.length
    this.stories = []
    this.bars = []
    this.promises = []

    const bars = this.root.querySelector('#bars')!
    const stories = this.root.querySelector('#stories')!

    for (const item of this.items) {
      const bar = document.createElement('button')
      bar.type = 'button'
      bar.classList.add('bar')
      const idx = this.stories.length
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
      let el: HTMLVideoElement | HTMLImageElement | null = null
      if (item._open_stories.mime_type.startsWith('image/')) {
        el = document.createElement('img')
        this.promises.push(new Promise(resolve => el!.addEventListener('load', resolve)))
        if (this.promises.length !== 1 && this.lazyLoad) {
          el.setAttribute('data-src', item._open_stories.url)
        } else {
          el.src = item._open_stories.url
        }
        if ('alt' in item._open_stories) el.alt = item._open_stories.alt
      } else if (item._open_stories.mime_type.startsWith('video/')) {
        el = document.createElement('video')
        el.src = item._open_stories.url
        el.toggleAttribute('loop', true)
        el.toggleAttribute('muted', true)
        el.toggleAttribute('playsinline', true)
        el.volume = 0
        this.promises.push(new Promise((resolve, reject) => {
          el!.addEventListener('canplay', resolve)
          el!.addEventListener('error', reject)
        }))
        if (this.promises.length !== 1 && this.lazyLoad) {
          el.preload = 'metadata'
        } else {
          el.preload = 'auto'
        }
        if ('title' in item._open_stories) el.setAttribute('title', item._open_stories.title)
        const tracks = 'tracks' in item._open_stories ? (item._open_stories.tracks || []) : []
        for (const track of tracks) {
          const trackEl = document.createElement('track')
          trackEl.default = track === tracks[0]
          trackEl.src = track.url
          trackEl.label = track.label || ''
          trackEl.srclang = track.srclang || ''
          trackEl.kind = track.kind || 'captions'
          el.append(trackEl)
        }
      }

      if (el) {
        el.setAttribute('part', 'story')
        el.classList.add('story')
        stories.append(el)
        this.stories.push(el)
      }
    }
  }
  
  async startTimer() {
    this.playStory(this.stories[0])
    await this.handleRejection(this.promises[0])

    if (this.dialog.classList.contains('is-loading')) {
      this.dialog.classList.remove('is-loading')
      this.bindEvents()
    }

    if (this.lazyLoad) {
      for (const story of this.stories) {
        if (story.src || story.getAttribute('preload') === 'auto' || !story.hasAttribute('data-src')) continue
        story.src = story.getAttribute('data-src') || ''
        if (story instanceof HTMLVideoElement) story.preload = 'auto'
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
      this.style.removeProperty('--duration')
    } 
    if (this.timer) clearTimeout(this.timer)
    if (this.currentStory) this.currentStory.classList.remove('shown')
    if (this.currentStory instanceof HTMLVideoElement) this.currentStory.pause()

    this.currentIndex += delta
    if (this.currentIndex === this.count) {
      this.dialog.close()
      return
    }

    this.currentBar = this.bars[this.currentIndex]
    this.currentStory = this.stories[this.currentIndex]
    this.currentBar.classList.add('progressing', 'paused')
    this.currentStory.classList.add('shown')
    this.dialog.classList.add('is-loading')
    this.dialog.classList.remove('has-error')
    // Trigger play so video starts to load
    this.playStory(this.currentStory)
    await this.handleRejection(this.promises[this.currentIndex])
    this.dialog.classList.remove('is-loading')
    this.currentBar.classList.remove('paused')

    const item = this.items[this.currentIndex]
    if (!this.isHighlight) this.setViewed(item.id)

    // Populate
    this.time.textContent = this.relativeTime(item.date_published)
    this.metadataDetails.classList.remove('is-expanded', 'is-collapsed')
    let caption = null
    if ('caption' in item._open_stories) caption = item._open_stories.caption || ''
    if ('title' in item._open_stories) caption = item._open_stories.title || ''
    if (this.currentStory instanceof HTMLVideoElement) {
      this.currentStory.currentTime = 0
      if (!this.paused) this.playStory(this.currentStory)
    }

    this.meta.textContent = caption || ''
    if (this.meta.clientWidth > this.metadataDetails.clientWidth) {
      this.metadataDetails.classList.add('is-collapsed')
    }

    this.prepareHeart()

    if (item.url) {
      this.link.hidden = false
      this.link.href = item.url
      if ('share' in navigator) this.share.hidden = false
    } else {
      this.link.hidden = true
      if ('share' in navigator) this.share.hidden = true
      this.link.removeAttribute('href')
    }

    if (this.currentIndex > this.count - 1) this.currentIndex = 0

    const videoLength = this.currentStory instanceof HTMLVideoElement ? this.currentStory.duration : null
    const duration = Number(this.getAttribute('duration')) || item._open_stories.duration_in_seconds || videoLength || this.duration
    this.style.setProperty('--duration', `${duration}s`)
    this.timer = window.setTimeout(this.goTo.bind(this), duration * 1000)
    if (this.paused) {
      this.pause()
    }
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
  
  async handleRejection(promise: Promise<any>) {
    try {
      await promise
    } catch (error) {
      this.dialog.classList.add('has-error')
      console.error('Encountered error trying to load story', error)
    }
  }

  playStory(story: HTMLImageElement | HTMLVideoElement | null) {
    if (!(story instanceof HTMLVideoElement)) return
    try {
      story.play()
    } catch (error) {
      console.error('Encountered error trying to play the video story', error)
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

function css(duration: number) {
  return `
  :host {
    display: inline-block;
    font-family: system-ui, sans-serif;
    --magic-h: 88vh;
    --magic-w: 88vw;
    --duration: ${duration}s;
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

  dialog:focus:not(:focus-visible) {
    outline: none;
  }
  
  .side-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.7vh;
  }

  #close,
  #toggleMute,
  #play,
  #pause,
  .mute,
  .unmute {
    display: none;
  }

  dialog:has(video.shown) #toggleMute {
    display: block;
  }
  
  dialog.is-muted .mute {
    display: block;
  }

  dialog:not(.is-muted) .unmute {
    display: block;
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
  
  #stories {
    overflow: hidden;
    height: 100%;
    width: 100%;
    position: absolute;
    background: #000;
    border-radius: 10px;
  }

  #stories .story {
    position: absolute;
    max-height: 100%;
    max-width: 100%;
    width: 100%;
    aspect-ratio: 9/16;
    object-fit: contain;
    top: 0;
    opacity: 0;
    pointer-events: none;
  }

  #stories .story.shown {
    pointer-events: auto;
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

  .side-controls button,
  .side-controls a {
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
    animation: progress var(--duration) linear;
    animation-play-state: running;
  }

  @keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }

  .is-loading #controls,
  .is-loading #open-heart {
    display: none;
  }

  .is-loading .story {
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

  .has-error .error-visual {
    display: block;
  }
  
  .error-visual:before {
    content: "Failed to load story"
  }

  .error-visual {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #ccc;
    transform: translateX(-50%) translateY(-50%);
    text-align: center;
    z-index: 1;
    font-size: 1.5vh;
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-visual,
  .error-visual {
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

    .side-controls #close {
      display: inline-flex;
    }
  }

  [hidden] {
    display: none !important;
  }
`
}
