import { expect, test } from "bun:test";
import type { Root } from "mdast";
import { u } from "unist-builder";
import { VFile } from "vfile";
import remarkAutoPageCard from "./index.js";

test("should transform a paragraph with only a local MDX link to a PageCard component", () => {
  const tree = u("root", [
    u("paragraph", [
      u("link", { url: "./example.mdx", title: null }, [
        u("text", "Example Page"),
      ]),
    ]),
  ]) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "attributes": [
            {
              "name": "path",
              "type": "mdxJsxAttribute",
              "value": "./example.mdx",
            },
          ],
          "children": [],
          "name": "PageCard",
          "type": "mdxJsxFlowElement",
        },
      ],
      "type": "root",
    }
  `);
});

test("should transform a paragraph with only a local MDX link using relative path", () => {
  const tree = u("root", [
    u("paragraph", [
      u("link", { url: "../docs/page.mdx", title: null }, [
        u("text", "Documentation Page"),
      ]),
    ]),
  ]) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "attributes": [
            {
              "name": "path",
              "type": "mdxJsxAttribute",
              "value": "../docs/page.mdx",
            },
          ],
          "children": [],
          "name": "PageCard",
          "type": "mdxJsxFlowElement",
        },
      ],
      "type": "root",
    }
  `);
});

test("should not transform non-local links", () => {
  const tree = u("root", [
    u("paragraph", [
      u("link", { url: "https://example.com", title: null }, [
        u("text", "External Link"),
      ]),
    ]),
  ]) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "children": [
                {
                  "type": "text",
                  "value": "External Link",
                },
              ],
              "title": null,
              "type": "link",
              "url": "https://example.com",
            },
          ],
          "type": "paragraph",
        },
      ],
      "type": "root",
    }
  `);
});

test("should not transform non-MDX file links", () => {
  const tree = u("root", [
    u("paragraph", [
      u("link", { url: "./example.md", title: null }, [
        u("text", "Markdown File"),
      ]),
    ]),
  ]) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "children": [
                {
                  "type": "text",
                  "value": "Markdown File",
                },
              ],
              "title": null,
              "type": "link",
              "url": "./example.md",
            },
          ],
          "type": "paragraph",
        },
      ],
      "type": "root",
    }
  `);
});

test("should not transform paragraphs with multiple children", () => {
  const tree = u("root", [
    u("paragraph", [
      u("link", { url: "./example.mdx", title: null }, [
        u("text", "Example Page"),
      ]),
      u("text", " and some text"),
    ]),
  ]) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "children": [
                {
                  "type": "text",
                  "value": "Example Page",
                },
              ],
              "title": null,
              "type": "link",
              "url": "./example.mdx",
            },
            {
              "type": "text",
              "value": " and some text",
            },
          ],
          "type": "paragraph",
        },
      ],
      "type": "root",
    }
  `);
});

test("should not transform paragraphs without links", () => {
  const tree = u("root", [
    u("paragraph", [u("text", "Just some text")]),
  ]) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "type": "text",
              "value": "Just some text",
            },
          ],
          "type": "paragraph",
        },
      ],
      "type": "root",
    }
  `);
});

test("should not transform non-paragraph nodes", () => {
  const tree = u("root", [
    u("heading", { depth: 1 as const }, [
      u("link", { url: "./example.mdx", title: null }, [
        u("text", "Example Page"),
      ]),
    ]),
  ]) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "children": [
                {
                  "type": "text",
                  "value": "Example Page",
                },
              ],
              "title": null,
              "type": "link",
              "url": "./example.mdx",
            },
          ],
          "depth": 1,
          "type": "heading",
        },
      ],
      "type": "root",
    }
  `);
});

test("should transform multiple paragraphs with local MDX links", () => {
  const tree = u("root", [
    u("paragraph", [
      u("link", { url: "./page1.mdx", title: null }, [u("text", "Page 1")]),
    ]),
    u("paragraph", [u("text", "Some text in between")]),
    u("paragraph", [
      u("link", { url: "./page2.mdx", title: null }, [u("text", "Page 2")]),
    ]),
  ]) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "attributes": [
            {
              "name": "path",
              "type": "mdxJsxAttribute",
              "value": "./page1.mdx",
            },
          ],
          "children": [],
          "name": "PageCard",
          "type": "mdxJsxFlowElement",
        },
        {
          "children": [
            {
              "type": "text",
              "value": "Some text in between",
            },
          ],
          "type": "paragraph",
        },
        {
          "attributes": [
            {
              "name": "path",
              "type": "mdxJsxAttribute",
              "value": "./page2.mdx",
            },
          ],
          "children": [],
          "name": "PageCard",
          "type": "mdxJsxFlowElement",
        },
      ],
      "type": "root",
    }
  `);
});

test("should use custom element name and attributes", () => {
  const tree = u("root", [
    u("paragraph", [
      u("link", { url: "./example.mdx", title: null }, [
        u("text", "Example Page"),
      ]),
    ]),
  ]) satisfies Root;
  const result = apply(tree, {
    element: {
      name: "CustomCard",
      attributes: ({ url }) => ({ href: url, customProp: "value" }),
    },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "attributes": [
            {
              "name": "href",
              "type": "mdxJsxAttribute",
              "value": "./example.mdx",
            },
            {
              "name": "customProp",
              "type": "mdxJsxAttribute",
              "value": "value",
            },
          ],
          "children": [],
          "name": "CustomCard",
          "type": "mdxJsxFlowElement",
        },
      ],
      "type": "root",
    }
  `);
});

test("should handle links with titles", () => {
  const tree = u("root", [
    u("paragraph", [
      u("link", { url: "./example.mdx", title: "Example Title" }, [
        u("text", "Example Page"),
      ]),
    ]),
  ]) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "attributes": [
            {
              "name": "path",
              "type": "mdxJsxAttribute",
              "value": "./example.mdx",
            },
          ],
          "children": [],
          "name": "PageCard",
          "type": "mdxJsxFlowElement",
        },
      ],
      "type": "root",
    }
  `);
});

test("should handle complex link text", () => {
  const tree = u("root", [
    u("paragraph", [
      u("link", { url: "./example.mdx", title: null }, [
        u("text", "Example "),
        u("strong", [u("text", "Bold")]),
        u("text", " Page"),
      ]),
    ]),
  ]) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "attributes": [
            {
              "name": "path",
              "type": "mdxJsxAttribute",
              "value": "./example.mdx",
            },
          ],
          "children": [],
          "name": "PageCard",
          "type": "mdxJsxFlowElement",
        },
      ],
      "type": "root",
    }
  `);
});

test("should handle empty root", () => {
  const tree = u("root", []) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [],
      "type": "root",
    }
  `);
});

test("should handle root with only non-paragraph nodes", () => {
  const tree = u("root", [
    u("heading", { depth: 1 as const }, [u("text", "Title")]),
    u("code", "console.log('hello')"),
  ]) satisfies Root;
  const result = apply(tree);
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "type": "text",
              "value": "Title",
            },
          ],
          "depth": 1,
          "type": "heading",
        },
        {
          "type": "code",
          "value": "console.log('hello')",
        },
      ],
      "type": "root",
    }
  `);
});

test("should handle custom attributes with different value types", () => {
  const tree = u("root", [
    u("paragraph", [
      u("link", { url: "./example.mdx", title: null }, [
        u("text", "Example Page"),
      ]),
    ]),
  ]) satisfies Root;
  const result = apply(tree, {
    element: {
      name: "TestCard",
      attributes: ({ url }) => ({
        href: url,
        disabled: false,
        count: 42,
        title: null,
      }),
    },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "attributes": [
            {
              "name": "href",
              "type": "mdxJsxAttribute",
              "value": "./example.mdx",
            },
            {
              "name": "disabled",
              "type": "mdxJsxAttribute",
              "value": {
                "type": "mdxJsxAttributeValueExpression",
                "value": "false",
              },
            },
            {
              "name": "count",
              "type": "mdxJsxAttribute",
              "value": {
                "type": "mdxJsxAttributeValueExpression",
                "value": "42",
              },
            },
            {
              "name": "title",
              "type": "mdxJsxAttribute",
              "value": {
                "type": "mdxJsxAttributeValueExpression",
                "value": "null",
              },
            },
          ],
          "children": [],
          "name": "TestCard",
          "type": "mdxJsxFlowElement",
        },
      ],
      "type": "root",
    }
  `);
});

function apply(
  input: Root,
  options?: Parameters<typeof remarkAutoPageCard>[0],
): Root {
  const transformer = remarkAutoPageCard(options);
  transformer(input, new VFile(), () => {});
  return input;
}
