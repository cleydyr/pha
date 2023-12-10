import fs from "fs";

import createRBTree, { Tree } from "functional-red-black-tree";

interface PHATable {
  callNumber: (surname: string, name: string) => number;
}

export class RedBlackTreePHATable implements PHATable {
  #index?: Tree<string, number> = undefined;

  #loadIndex(): Tree<string, number> {
    const csvContents = fs.readFileSync("pha.csv", "utf-8");

    return csvContents
      .split("\n")
      .map((line) => line.split(","))
      .reduce(
        (tree, array) =>
          array
            .filter((_, i) => i > 0)
            .reduce((acc, cur) => acc.insert(cur, Number(array[0])), tree),
        createRBTree<string, number>((a: string, b: string) =>
          a.localeCompare(b)
        )
      );
  }

  callNumber(surname: string, name: string): number {
    if (this.#index === undefined) {
      this.#index = this.#loadIndex();
    }

    const query = `${surname} ${name[0]}`;

    return this.#index.le(query)?.value ?? -1;
  }
}
