# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static blog that reads Markdown files and renders them as a website. No build step, no frameworks — pure HTML, CSS, and JavaScript served directly in the browser.

## Architecture

### Core concept
The site is entirely client-side. JavaScript fetches `.md` files, parses them to HTML, and injects the result into the page. There is no server-side rendering.

### File layout
```
my-blog/
├── index.html          # Home page — lists all posts
├── post.html           # Single post reader — fetches and renders one .md file
├── css/
│   └── style.css       # All styles: layout, typography, dark mode, mobile
├── js/
│   ├── parser.js       # Markdown → HTML (custom or thin wrapper around marked.js)
│   ├── posts.js        # Post registry: metadata list used to build the index
│   └── theme.js        # Dark/light mode toggle + localStorage persistence
└── posts/
    └── *.md            # Blog post source files
```

### How a post loads
1. `post.html` reads the `?slug=` query param.
2. `js/parser.js` fetches `posts/<slug>.md` and converts it to HTML.
3. The result is injected into a `<article>` element inside `post.html`.

### Adding a new post
1. Drop a `.md` file into `posts/`.
2. Add its metadata (title, date, slug, description) to the array in `js/posts.js`.

## Design constraints

- **No frameworks, no npm** — everything must work by opening `index.html` in a browser or serving with any static file server.
- **Dark mode** — implemented via a `data-theme` attribute on `<html>` and CSS custom properties. User preference is stored in `localStorage` and initialised before first paint to prevent flash.
- **Mobile-first** — layout uses CSS Grid/Flexbox; breakpoints adjust font size and padding for narrow viewports. Tap targets are ≥ 44px.
- **Readable typography** — body text capped at ~70ch, comfortable line-height (≈1.7), system font stack.

## Running locally

Open with any static file server (required because `fetch()` needs HTTP, not `file://`):

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then open `http://localhost:8080`.

## No build, lint, or test commands

There is no build pipeline. Validate HTML/CSS manually in-browser or with the W3C validators. JavaScript can be checked with the browser console.
