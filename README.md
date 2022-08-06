# `<story-view>`

Include `StoryViewElement`.

```html
<script src="https://unpkg.com/story-view-element" type="module" defer></script>
```

Render `<story-view>`.

```html
<story-view src="./feed.json" ttl="86400"></story-view>
```

## Attributes

- `src`: Required. A [JSONfeed](https://jsonfeed.org) URL. Required fields: `title`, `icon`, `items[].date_published`, `items[].image`, `items[].summary`.
- `duration`: Optional. Number in seconds. Default to `5`.
- `ttl`: Optional. Number in seconds, or `infinite`. Default to `86400`.
- `metadata`: Optional. Display `items[].summary`.

## Classes

- `.is-empty`: Present when no stories matching `ttl` were found.

## JSON feed

[Example](/demo/feed.json).
