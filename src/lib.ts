import fs from "fs";

const csvContents = fs.readFileSync("pha.csv", "utf-8");

const csvLines = csvContents.split("\n");

const firstRow = csvLines[0].split(",");

firstRow.shift();

type Entry = {
  name: string;
  callNumber: number;
};

const index = firstRow.reduce((acc, cur) => {
  acc[cur[0]] = [];
  return acc;
}, {} as Record<string, Entry[]>);

csvLines.forEach((line) => {
  const cells = line.split(",");

  const callNumber = cells.shift();

  cells.forEach((cell, i) => {
    if (cell === "") {
      return;
    }

    index[firstRow[i][0]].push({
      name: cell,
      callNumber: Number(callNumber),
    });
  });
});

export function callNumber(surname: string, name: string): number {
  const query = `${surname} ${name[0]}`;

  const initial = surname[0];

  let last = index[initial][0];

  for (const entry of index[initial]) {
    if (entry.name > query) {
      return last.callNumber;
    }

    last = entry;
  }

  return last.callNumber;
}
