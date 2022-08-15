# `<open-stories>`

Completely self-serving* Instagram-esque [JSONfeed](https://jsonfeed.org) "story" media viewer. See it in action on [muan.co](https://muan.co).

Under development. Everything is subjected to changes. Make sure to specify a version number if you wish to try it out. 

This requires native [`<dialog>`](https://caniuse.com/dialog) and [Shadow DOM](https://caniuse.com/shadowdomv1) support. No polyfills included.

*Note: not accepting issues/PRs; but if we are close friends, maybe.

## Usage

```html
<!-- Include `StoryViewElement` -->
<script src="https://unpkg.com/open-stories-element@0.0.14" type="module" defer></script>

<!-- Render `<open-stories>` -->
<open-stories src="./feed.json"></open-stories>
```

## Parts

Style elements with `::part` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)):

- `open-stories::part(button)`: The `<button>` that opens the story viewer modal.
- `open-stories::part(dialog)`: The modal `<dialog>`.
- `open-stories::part(loading-visual)`: The loading overlay.
- `open-stories::part(metadata)`: The `<details>` for metadata.
- `open-stories::part(metadata-summary)`: The `<summary>` for expanding metadata.
- `open-stories::part(metadata-content)`: The metadata content container.

*Note: when defining `open-stories::part(button)` it would be good to style `open-stories:not(:defined)` the same way, to prevent styles flash when the script is executed.

## Button text / `<slot>`

Whatever you put inside `<open-stories>HERE</open-stories>` will replace the default button text "View Stories".  ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot))

## Attributes

- `src`: Required. A [JSONfeed](https://jsonfeed.org) URL. Required fields: `title`, `icon`, `items[].date_published`, `items[].image`, `items[].summary`.
- `duration`: Optional. Number in seconds. Default to `5`.
- `show-metadata`: Optional. Display `items[].summary`.
- `is-highlight`: Optional. View history does not get set.

## Classes

- `.is-empty`: Present when no stories found.
- `.is-read`: Present when stories have all been viewed. This relies on `localStroage` and does not work cross-origin/cross-devices.
- `.is-paused`: Present autoplay is paused.

## JSON feed

[Example](/demo/feed.json).
