# `<story-view>`

Completely self-serving* Instagram-esque [JSONfeed](https://jsonfeed.org) "story" media viewer. See it in action on [muan.co](https://muan.co).

Under development. Everything is subjected to changes. Make sure to specify a version number if you wish to try it out. 

This requires native [`<dialog>`](https://caniuse.com/dialog) and [Shadow DOM](https://caniuse.com/shadowdomv1) support. No polyfills included.

*Note: not accepting issues/PRs; but if we are close friends, maybe.

## Usage

```html
<!-- Include `StoryViewElement` -->
<script src="https://unpkg.com/story-view-element@0.0.14" type="module" defer></script>

<!-- Render `<story-view>` -->
<story-view src="./feed.json"></story-view>
```

## Parts

Style elements with `::part` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)):

- `story-view::part(button)`: The `<button>` that opens the story viewer modal.
- `story-view::part(dialog)`: The modal `<dialog>`.
- `story-view::part(loading-visual)`: The loading overlay.
- `story-view::part(metadata)`: The `<details>` for metadata.
- `story-view::part(metadata-summary)`: The `<summary>` for expanding metadata.
- `story-view::part(metadata-content)`: The metadata content container.

*Note: when defining `story-view::part(button)` it would be good to style `story-view:not(:defined)` the same way, to prevent styles flash when the script is executed.

## Button text / `<slot>`

Whatever you put inside `<story-view>HERE</story-view>` will replace the default button text "View Stories".  ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot))

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
