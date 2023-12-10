/*
 * Tests some names for the expected call numbers
 */

import { TestCase } from "./util";

import { callNumber } from "../src/lib";
import { loadTestCasesFromCSV } from "./util";
import fs from "fs";

const csvContents = fs.readFileSync("test/tests.csv", "utf-8");

const testCases: TestCase[] = loadTestCasesFromCSV(csvContents);

test.each(testCases)(
  "callNumber(%s, %s) = %d",
  ({ surname, name, expected }) => {
    expect(callNumber(surname, name)).toBe(expected);
  }
);
