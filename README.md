# `<open-stories>`

An [OpenStoriesFeed](https://github.com/dddddddddzzzz/OpenStories) viewer. See it in action on [muan.co](https://muan.co).

## WIP

Things yet to be supported: 

- `feed._open_stories.preview`
- `feed.items[]._open_stories.preview`
- `feed.items[]._open_stories.content_warning`
- `feed.items[]._open_stories.tracks`: Changing tracks for videos

## Usage

```html
<!-- Include `OpenStoriesElement` -->
<script src="https://unpkg.com/open-stories-element@0.0.26" type="module" defer></script>

<!-- Render `<open-stories>` -->
<open-stories src="./feed.json"></open-stories>
```

This requires native [`<dialog>`](https://caniuse.com/dialog) and [Shadow DOM](https://caniuse.com/shadowdomv1) support. No polyfills included.

## Parts

Style elements with `::part` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)):

### Button

`open-stories::part(button)` is the selector for the `<button>` that opens the story modal. It would be good to style `open-stories:not(:defined)` the same way, to prevent style flashing as the script executes.

### Advanced

- `open-stories::part(dialog)`: The modal `<dialog>`.
- `open-stories::part(loading-visual)`: The loading overlay.
- `open-stories::part(story)`: The `<img>` or `<video>` element of your story. Use `::cue` to style video tracks, for example.
- `open-stories::part(metadata)`: The `<details>` for metadata.
- `open-stories::part(metadata-summary)`: The `<summary>` for expanding metadata.
- `open-stories::part(metadata-content)`: The metadata content container.

## Button text / `<slot>`

Whatever you put inside `<open-stories>HERE</open-stories>` will replace the default button text "View Stories".  ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot))

## Attributes

- `src`: Required. A [OpenStoriesFeed](https://github.com/dddddddddzzzz/OpenStories) URL.
- `loading`: Optional. Values: `lazy` or `eager`. Default to `eager`. When set to `lazy`, only the first story in the feed is loaded before user interaction.
- `duration`: Optional. Number in seconds. Default to `5`.
- `show-metadata`: Optional. Display `items[]._open_stories.caption`.
- `is-highlight`: Optional. View history does not get set.

## Classes

- `.is-loading`: Present when feed is being fetched.
- `.is-empty`: Present when no stories found.
- `.is-read`: Present when stories have all been viewed. This relies on `localStroage` and does not work cross-origin/cross-devices.
- `.is-paused`: Present autoplay is paused.
