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

## `<slot>`

Whatever you put inside `<story-view>HERE</story-view>` will replace the default button.

## Attributes

- `src`: Required. A [JSONfeed](https://jsonfeed.org) URL. Required fields: `title`, `icon`, `items[].date_published`, `items[].image`, `items[].summary`.
- `duration`: Optional. Number in seconds. Default to `5`.
- `ttl`: Optional. Number in seconds, or `infinite`. Default to `86400`.
- `metadata`: Optional. Display `items[].summary`.

## Classes

- `.is-empty`: Present when no stories matching `ttl` were found.
- `.is-paused`: Present autoplay is paused.

## JSON feed

[Example](/demo/feed.json).
