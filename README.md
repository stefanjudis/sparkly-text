# `sparkly-text`

A small zero-dependency Web Component to add sparkles to text fragments.

## Examples

```html
<!-- Add sparkles  -->
<sparkly-text>Hello sparkles</sparkly-text>

<!-- Increase the number of sparkles  -->
<sparkly-text number-of-sparkles="5">Hello sparkles</sparkly-text>

<!-- Color the sparkles  -->
<sparkly-text style="--sparkly-text-color: orange">Hello sparkles</sparkly-text>

<!-- Increase the sparkle size  -->
<sparkly-text style="--sparkly-text-size: 2.5em">Hello sparkles</sparkly-text>
```

## Installation

You have a few options (choose one of these):

- Install via [npm](https://www.npmjs.com/package/@stefanjudis/sparkly-text): npm install @stefanjudis/sparkly-text
- [Download the source](https://github.com/stefanjudis/sparkly-text/blob/main/sparkly-text.js) manually from GitHub into your project.
- Skip this step and use the script directly via a 3rd party CDN (not recommended for production use)

### Usage

```html
<!-- Host yourself -->
<script type="module" src="sparkly-text.js"></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script
  type="module"
  src="https://www.unpkg.com/@stefanjudis/sparkly-text"
></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script type="module" src="https://esm.sh/@stefanjudis/sparkly-text"></script>
```

## Kudos

Big thanks goes to [Zach Leatherman](https://www.zachleat.com/) for all [his fancy components such as `table-saw`](https://github.com/zachleat/table-saw).
