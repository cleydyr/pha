import fs from "fs";

const csvContents = fs.readFileSync("pha.csv", "utf-8");

const content = `export default \`${csvContents}\`;`;

fs.writeFileSync("./table.ts", content);
