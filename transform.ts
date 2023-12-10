import fs from "fs";

const csvContents = fs.readFileSync("pha.csv", "utf-8");

const csvLines = csvContents.split("\n");

const json = csvLines.reduce((json, line) => {
  const [callNumber, ...rest] = line.split(",");

  return {
    ...json,
    [callNumber]: rest.filter((x) => x !== ""),
  };
}, {} as Record<string, string[]>);

fs.writeFileSync("pha.json", JSON.stringify(json));
