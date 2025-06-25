import type { Link, Root, RootContent } from "mdast";
import type {
  MdxJsxAttribute,
  MdxJsxAttributeValueExpression,
} from "mdast-util-mdx-jsx";
import type { Transformer } from "unified";

export default function remarkAutoPageCard({
  element = defaultElement,
}: AutoPageCardOptions = {}): Transformer<Root, Root> {
  return (node) => {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (!child || !isOnlyLinkParagraph(child)) {
        continue;
      }
      const link = child.children[0];
      if (!isLocalPath(link.url) || !isMdxFile(link.url)) {
        continue;
      }
      const attributes = Object.entries(element.attributes(link)).map(
        ([key, value]) =>
          ({
            type: "mdxJsxAttribute",
            name: key,
            value:
              typeof value === "string"
                ? value
                : ({
                    type: "mdxJsxAttributeValueExpression",
                    value: JSON.stringify(value),
                  } satisfies MdxJsxAttributeValueExpression),
          }) satisfies MdxJsxAttribute,
      );
      node.children[i] = {
        type: "mdxJsxFlowElement",
        name: element.name,
        attributes,
        children: [],
      };
    }
  };
}

/**
 * Options for configuring the page card auto-transformation.
 */
type AutoPageCardOptions = {
  /**
   * Custom element configuration to override the default `PageCard` component.
   * If undefined, the default `PageCard` element will be used.
   * @example
   * {
   *   name: 'MyCard',
   *   attributes: ({ url }) => ({ href: url, customProp: 'value' })
   * }
   */
  readonly element?: undefined | Element;
};

interface Element {
  readonly name: string;
  readonly attributes: (link: { url: string }) => Attributes;
}

type Attributes = Readonly<Record<string, null | boolean | number | string>>;

const defaultElement = {
  name: "PageCard",
  attributes({ url }) {
    return { href: url };
  },
} satisfies Element;

function isOnlyLinkParagraph(
  node: RootContent,
): node is RootContent & { type: "paragraph"; children: [Link] } {
  return (
    node.type === "paragraph" &&
    node.children.length === 1 &&
    node.children[0]?.type === "link"
  );
}

function isLocalPath(path: string): boolean {
  return path.startsWith("./") || path.startsWith("../");
}

function isMdxFile(path: string): boolean {
  return path.endsWith(".mdx");
}
