import createRBTree, { Tree } from "functional-red-black-tree";

import table from "../table";

interface PHATable {
  callNumber: (surname: string, name: string) => number;
}

export const PHATableFactory = {
  createTable: (): PHATable => new RedBlackTreePHATable(),
};

class RedBlackTreePHATable implements PHATable {
  #index?: Tree<string, number> = undefined;

  #loadIndex(): Tree<string, number> {
    return table.split("\n").reduce((acc, line) => {
      const [callNumber, ...entries] = line.split(",");

      return entries.reduce(
        (subAcc, entry) => subAcc.insert(entry, Number(callNumber)),
        acc
      );
    }, createRBTree<string, number>());
  }

  callNumber(surname: string, name: string): number {
    if (this.#index === undefined) {
      this.#index = this.#loadIndex();
    }

    const query = `${removeDiacritics(surname)} ${removeDiacritics(name[0])}`;

    return this.#index.le(query).value ?? -1;
  }
}

function removeDiacritics(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
