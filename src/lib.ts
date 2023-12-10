import fs from "fs";

interface PHATable {
  callNumber: (surname: string, name: string) => number;
}

type Entry = {
  name: string;
  callNumber: number;
};

type Index = Record<string, Entry[]>;

export class LinearPHATable implements PHATable {
  #index?: Index = undefined;

  #loadIndex(): Index {
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

    return index;
  }

  callNumber(surname: string, name: string): number {
    if (this.#index === undefined) {
      this.#index = this.#loadIndex();
    }

    const query = `${surname} ${name[0]}`;

    const entries = this.#index[query[0]];

    let last = entries[0];

    for (const entry of entries) {
      if (entry.name > query) {
        break;
      }

      last = entry;
    }

    return last.callNumber;
  }
}
