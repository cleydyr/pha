import { KEYS, VALS } from "./pha-data.js";

export function foldQueryPart(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function callNumber(surname, name) {
  const query = `${foldQueryPart(surname)} ${foldQueryPart(name)[0] ?? ""}`;
  let lo = 0;
  let hi = KEYS.length - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (KEYS[mid] <= query) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans === -1 ? -1 : VALS[ans];
}
