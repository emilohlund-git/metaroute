const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

let pageName = "";
let pageTitle = "";

readline.question("Enter the name of the new page: ", (name) => {
  pageName = name;
  readline.question("Enter the title of the new page: ", (title) => {
    pageTitle = title;

    const dirPath = path.join(__dirname, "app", "docs", "features", pageName);
    fs.mkdirSync(dirPath);

    const filePath = path.join(dirPath, "page.tsx");
    const content = `
import DocsContainer from "@/components/DocsContainer";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import DocsPageTitle from "@/components/DocsPageTitle";
import DocsPageParagraph from "@/components/DogsPageParagraph";
import React from "react";

export default function ${pageName}() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <DocsPageTitle title="${title}">
        <DocsPageParagraph>
          // Add your content here
        </DocsPageParagraph>
      </DocsSection>
    </DocsContainer>
  );
}
`;
    fs.writeFileSync(filePath, content);

    readline.close();
  });
});
