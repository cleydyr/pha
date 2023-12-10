/*
 * Tests some names for the expected call numbers
 */

import { TestCase } from "./util";

import { LinearPHATable } from "../src/lib";
import { loadTestCasesFromCSV } from "./util";
import fs from "fs";

const csvContents = fs.readFileSync("test/tests.csv", "utf-8");

const testCases: TestCase[] = loadTestCasesFromCSV(csvContents);

const phaTable = new LinearPHATable();

test.each(testCases)(
  "callNumber(%s, %s) = %d",
  ({ surname, name, expected }) => {
    expect(phaTable.callNumber(surname, name)).toBe(expected);
  }
);
