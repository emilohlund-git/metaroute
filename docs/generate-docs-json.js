const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

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
            acc[attr.name.name] = attr.value ? attr.value.value : true;
          }
          return acc;
        }, {});

        const children = getTextContent(node);
        if (children) {
          props.children = children;
        }

        console.log(props);

        const subtitle = {
          title: props.text,
          content: props.children,
          url:
            `/docs/${relativePath.replace(/\\/g, "/")}`.replace(
              "/page.tsx",
              ""
            ) +
            (props.title
              ? "#" + props.title.replace(/\s+/g, "-").toLowerCase()
              : ""),
        };

        if (!docs[dirName]) {
          docs[dirName] = { subtitles: [subtitle] };
        } else {
          if (!docs[dirName].subtitles) {
            docs[dirName].subtitles = [subtitle];
          } else {
            docs[dirName].subtitles.push(subtitle);
          }
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
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath, callback, newRelativePath);
    } else if (
      path.extname(fullPath) === ".tsx" &&
      path.basename(fullPath) === "page.tsx"
    ) {
      const dirName = path.basename(dirPath);
      callback(fullPath, dirName, newRelativePath);
    }
  });
}

const docsJson = {};
traverseDirectory("./app/docs", (filePath, dirName, relativePath) => {
  const fileDocs = parseReactFile(filePath, dirName, relativePath);
  Object.assign(docsJson, fileDocs);
});

fs.writeFileSync("./docs.json", JSON.stringify(docsJson, null, 2));
