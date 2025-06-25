# @suin/auto-page-card

> A remark plugin that automatically transforms local MDX links into customizable page card components

[![npm version](https://img.shields.io/npm/v/@suin/auto-page-card.svg)](https://www.npmjs.com/package/@suin/auto-page-card)
[![npm downloads](https://img.shields.io/npm/dm/@suin/auto-page-card.svg)](https://www.npmjs.com/package/@suin/auto-page-card)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/suin/auto-page-card/actions/workflows/ci.yml/badge.svg)](https://github.com/suin/auto-page-card/actions/workflows/ci.yml)
[![Publish](https://github.com/suin/auto-page-card/actions/workflows/publish.yml/badge.svg)](https://github.com/suin/auto-page-card/actions/workflows/publish.yml)

## 🚀 Features

- **Automatic Transformation**: Converts local MDX links to page card components automatically
- **Smart Detection**: Only transforms links that point to local `.mdx` files
- **Customizable**: Supports custom component names and attributes
- **TypeScript Ready**: Full TypeScript support with comprehensive type definitions
- **Zero Dependencies**: Lightweight with no runtime dependencies
- **MDX Compatible**: Works seamlessly with MDX and remark ecosystem

## 📦 Installation

```bash
npm install @suin/auto-page-card
```

Or using yarn:

```bash
yarn add @suin/auto-page-card
```

Or using bun:

```bash
bun add @suin/auto-page-card
```

## ⚠️ Important: Required Component

**This package transforms markdown links into `<PageCard>` components by default.** You'll need to provide the actual PageCard component in your MDX setup. We strongly recommend using **[@suin/fumadocs-page-card](https://github.com/suin/fumadocs-page-card)** - a React component that renders beautiful page cards with automatic metadata extraction from MDX frontmatter.

```bash
npm install @suin/fumadocs-page-card
```

## 🎯 Usage

### Basic Usage

```javascript
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkAutoPageCard from "@suin/auto-page-card";
import remarkStringify from "remark-stringify";

const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkAutoPageCard)
  .use(remarkStringify);

const result = await processor.process(`
# My Documentation

[Getting Started](./getting-started.mdx)

[Advanced Topics](../docs/advanced.mdx)
`);
```

### With Custom Component

```javascript
import remarkAutoPageCard from "@suin/auto-page-card";

const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkAutoPageCard, {
    element: {
      name: "CustomCard",
      attributes: ({ url }) => ({
        href: url,
        className: "my-custom-card",
        showPreview: true,
      }),
    },
  })
  .use(remarkStringify);
```

## 🔧 API

### `remarkAutoPageCard(options?)`

The main plugin function that transforms local MDX links into page card components.

#### Options

| Option    | Type                   | Default          | Description                  |
| --------- | ---------------------- | ---------------- | ---------------------------- |
| `element` | `Element \| undefined` | `defaultElement` | Custom element configuration |

#### Element Configuration

```typescript
interface Element {
  readonly name: string;
  readonly attributes: (link: { url: string }) => Attributes;
}

type Attributes = Readonly<Record<string, null | boolean | number | string>>;
```

- `name`: The component name to use (e.g., `'PageCard'`, `'CustomCard'`)
- `attributes`: A function that returns the attributes object for the component

### Default Behavior

By default, the plugin transforms links like this:

**Input:**

```markdown
[Getting Started](./getting-started.mdx)
```

**Output:**

```jsx
<PageCard path="./getting-started.mdx" />
```

## 📝 Examples

### Example 1: Basic Transformation

**Input:**

```markdown
# Documentation

[Installation Guide](./installation.mdx)

[API Reference](../docs/api.mdx)
```

**Output:**

```jsx
<h1>Documentation</h1>

<PageCard path="./installation.mdx" />

<PageCard path="../docs/api.mdx" />
```

### Example 2: Custom Component with Rich Attributes

```javascript
.use(remarkAutoPageCard, {
  element: {
    name: 'DocumentationCard',
    attributes: ({ url }) => ({
      href: url,
      className: 'doc-card',
      showMetadata: true,
      layout: 'horizontal'
    })
  }
})
```

**Input:**

```markdown
[User Guide](./user-guide.mdx)
```

**Output:**

```jsx
<DocumentationCard
  href="./user-guide.mdx"
  className="doc-card"
  showMetadata={true}
  layout="horizontal"
/>
```

### Example 3: Integration with Next.js

```javascript
// next.config.mjs
import remarkAutoPageCard from "@suin/auto-page-card";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      [
        remarkAutoPageCard,
        {
          element: {
            name: "PageCard",
            attributes: ({ url }) => ({
              href: url,
              className: "page-card",
            }),
          },
        },
      ],
    ],
  },
});

export default withMDX({
  pageExtensions: ["js", "jsx", "mdx"],
});
```

## 🎨 What Gets Transformed

The plugin only transforms paragraphs that contain:

- A single link element
- Links that point to local paths (starting with `./` or `../`)
- Links that point to `.mdx` files

### ✅ Will Transform

```markdown
[Page Title](./page.mdx)
[Documentation](../docs/guide.mdx)
```

### ❌ Won't Transform

```markdown
[External Link](https://example.com)
[Markdown File](./file.md)
[Page Title](./page.mdx) with additional text
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

This project uses [Devbox](https://www.jetpack.io/devbox/) for consistent development environments. Devbox automatically installs and manages all the necessary tools and dependencies.

1. Clone the repository:

```bash
git clone https://github.com/suin/auto-page-card.git
cd auto-page-card
```

2. Install Devbox (if not already installed):

```bash
curl -fsSL https://get.jetpack.io/devbox | bash
```

3. Start the development environment:

```bash
devbox shell
```

4. Install dependencies:

```bash
bun install
```

5. Build the project:

```bash
bun run build
```

6. Run tests:

```bash
bun test
```

### Code Style

This project uses:

- [Biome](https://biomejs.dev/) for code formatting and linting
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Bun](https://bun.sh/) for testing and package management
- [Devbox](https://www.jetpack.io/devbox/) for development environment management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [unified](https://unifiedjs.com/) and [remark](https://remark.js.org/)
- Inspired by the need for automatic page card generation in documentation sites
- Thanks to the MDX and remark communities for their excellent tooling

## 📞 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/suin/auto-page-card/issues)
- 🐛 **Bugs**: Please report bugs on GitHub
- 💡 **Feature Requests**: Open an issue to discuss new features
- 📖 **Documentation**: Check the examples above or open an issue for clarification

---

Made with ❤️ by [suin](https://github.com/suin)
