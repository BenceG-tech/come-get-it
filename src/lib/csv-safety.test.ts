import { describe, it, expect } from "vitest";
import { neutralizeCsvFormula, toCsvCell, toCsv } from "./csv-safety";

describe("CSV export formula safety", () => {
  it("neutralizes formula-leading cells already stored in the database", () => {
    expect(neutralizeCsvFormula('=HYPERLINK("http://evil","x")')).toBe(`'=HYPERLINK("http://evil","x")`);
    expect(neutralizeCsvFormula("@SUM(A1)")).toBe("'@SUM(A1)");
    expect(neutralizeCsvFormula("-2+3+cmd|' /C calc'!A0")).toBe("'-2+3+cmd|' /C calc'!A0");
    expect(neutralizeCsvFormula("+cmd|calc")).toBe("'+cmd|calc");
    expect(neutralizeCsvFormula("\t=1")).toBe("'\t=1");
  });

  it("keeps plain phone numbers readable", () => {
    expect(neutralizeCsvFormula("+36 70 585 2053")).toBe("+36 70 585 2053");
    expect(neutralizeCsvFormula("06 (1) 234-5678")).toBe("06 (1) 234-5678");
  });

  it("does not let a phone field smuggle a formula", () => {
    expect(neutralizeCsvFormula("+36=1+1")).toBe("'+36=1+1");
    expect(neutralizeCsvFormula("-1-1")).toBe("'-1-1");
  });

  it("quotes and still neutralizes cells with separators", () => {
    expect(toCsvCell('=1+1,"x"')).toBe(`"'=1+1,""x"""`);
    expect(toCsv([["Név", "Telefon"], ["=evil()", "+36 1 234 5678"]])).toBe("Név,Telefon\n'=evil(),+36 1 234 5678");
  });
});
