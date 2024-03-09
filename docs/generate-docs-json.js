const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function parseReactFile(filePath, dirName, relativePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const docs = {};

  function getTextContent(node) {
    if (node.type === "JSXText") {
      return node.value.replace(/\s+/g, " ").trim();
    } else if (node.type === "JSXElement") {
      return node.children.map(getTextContent).join("");
    } else if (node.type === "JSXExpressionContainer") {
      return getTextContent(node.expression);
    } else {
      return "";
    }
  }

  traverse(ast, {
    JSXElement(path) {
      const { node } = path;
      const component = node.openingElement.name.name;

      if (component === "DocsHeader") {
        const props = node.openingElement.attributes.reduce((acc, attr) => {
          if (attr.type === "JSXAttribute") {
            const value =
              attr.value.type === "StringLiteral"
                ? attr.value.value
                : getTextContent(attr.value);
            acc[attr.name.name] = value;
          }
          return acc;
        }, {});

        const children = getTextContent(node);
        if (children) {
          props.children = children;
        }

        // Remove the "page.tsx" and adjust URL format
        const basePath = `/pages/${relativePath
          .replace(/\\/g, "/")
          .replace("page.tsx", "")}`;
        const url =
          basePath +
          (props.text || children ? `#${slugify(props.text || children)}` : "");

        const subtitle = { title: props.text || children, url };

        if (!docs[dirName]) {
          docs[dirName] = { subtitles: [subtitle] };
        } else {
          docs[dirName].subtitles = [
            ...(docs[dirName].subtitles || []),
            subtitle,
          ];
        }
      }

      if (component === "DocsPageTitle" || component === "DocsPageParagraph") {
        const props = node.openingElement.attributes.reduce((acc, attr) => {
          if (attr.type === "JSXAttribute") {
            acc[attr.name.name] = attr.value ? attr.value.value : true;
          }
          return acc;
        }, {});

        const children = path.node.children.find(
          (child) => child.type === "JSXText"
        );
        if (children) {
          let formattedChildren = children.value.replace(/\s+/g, " ").trim();
          props.children = formattedChildren;
        }

        if (!docs[dirName]) {
          docs[dirName] = {
            title: component === "DocsPageTitle" ? props.title : undefined,
            content:
              component === "DocsPageParagraph" ? props.children : undefined,
            url: `/docs/${relativePath.replace(/\\/g, "/")}`.replace(
              "/page.tsx",
              ""
            ),
          };
        } else {
          if (component === "DocsPageTitle") {
            docs[dirName].title = props.title;
          } else if (component === "DocsPageParagraph") {
            if (!docs[dirName].content) {
              docs[dirName].content = props.children;
            }
          }
        }
      }
    },
  });

  return docs;
}

function traverseDirectory(dirPath, callback, relativePath = "") {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const newRelativePath = path.join(relativePath, file);

    if (path.extname(fullPath) === ".tsx") {
      callback(
        fullPath,
        file.replace(/\.tsx$/, ""),
        newRelativePath.replace(/\.tsx$/, "")
      );
    }
  });
}

const docsJson = {};
traverseDirectory("./components/pages", (filePath, dirName, relativePath) => {
  const fileDocs = parseReactFile(filePath, dirName, relativePath);
  console.log(fileDocs);
  Object.assign(docsJson, fileDocs);
});

fs.writeFileSync("./docs.json", JSON.stringify(docsJson, null, 2));
