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
- `duration`: Optional. Default to `5` seconds.
- `ttl`: Optional. Default to `86400` seconds.

## JSON feed

[Example](/demo/feed.json).
