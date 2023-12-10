import fs from "fs";

import createRBTree, { Tree } from "functional-red-black-tree";

interface PHATable {
  callNumber: (surname: string, name: string) => number;
}

export const PHATableFactory = {
  createTable: (): PHATable => new RedBlackTreePHATable(),
};

class RedBlackTreePHATable implements PHATable {
  #index?: Tree<string, number> = undefined;

  #loadIndex(): Tree<string, number> {
    const csvContents = fs.readFileSync("pha.csv", "utf-8");

    return csvContents
      .split("\n")
      .map((line) => line.split(","))
      .reduce(
        (tree, cells) =>
          cells.reduce(
            (tree_, cur, i) =>
              i > 0 && cur !== "" ? tree_.insert(cur, Number(cells[0])) : tree_,
            tree
          ),
        createRBTree<string, number>((a: string, b: string) =>
          a.localeCompare(b)
        )
      );
  }

  callNumber(surname: string, name: string): number {
    if (this.#index === undefined) {
      this.#index = this.#loadIndex();
    }

    const query = `${removeDiacritics(surname)} ${removeDiacritics(name[0])}`;

    return this.#index.le(query)?.value ?? -1;
  }
}

function removeDiacritics(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
