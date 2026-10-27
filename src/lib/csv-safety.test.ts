import { describe, it, expect } from "vitest";
import { neutralizeCsvFormula, toCsvCell, toCsv } from "./csv-safety";

describe("CSV export formula safety", () => {
  it("neutralizes formula-leading cells already stored in the database", () => {
    expect(neutralizeCsvFormula('=HYPERLINK("http://evil","x")')).toBe(`'=HYPERLINK("http://evil","x")`);
    expect(neutralizeCsvFormula("@SUM(A1)")).toBe("'@SUM(A1)");
    expect(neutralizeCsvFormula("-2+3+cmd|' /C calc'!A0")).toBe("'-2+3+cmd|' /C calc'!A0");
    expect(neutralizeCsvFormula("+cmd|calc")).toBe("'+cmd|calc");
  });

  it("prefixes phone-shaped formulas such as +1/0 and +1-1", () => {
    expect(neutralizeCsvFormula("+1/0")).toBe("'+1/0");
    expect(neutralizeCsvFormula("+1-1")).toBe("'+1-1");
    expect(neutralizeCsvFormula("-1-1")).toBe("'-1-1");
    expect(neutralizeCsvFormula("+36=1+1")).toBe("'+36=1+1");
  });

  it("prefixes genuine +36 phones, keeping them readable as text", () => {
    expect(neutralizeCsvFormula("+36 70 585 2053")).toBe("'+36 70 585 2053");
  });

  it("handles tab/CR/LF and whitespace-leading formulas without trimming data", () => {
    expect(neutralizeCsvFormula("\t=1")).toBe("'\t=1");
    expect(neutralizeCsvFormula("\r=1")).toBe("'\r=1");
    expect(neutralizeCsvFormula("\n=1")).toBe("'\n=1");
    expect(neutralizeCsvFormula("  =1+1")).toBe("'  =1+1");
    expect(neutralizeCsvFormula(" +1-1")).toBe("' +1-1");
  });

  it("leaves ordinary values untouched", () => {
    expect(neutralizeCsvFormula("06 (1) 234-5678")).toBe("06 (1) 234-5678");
    expect(neutralizeCsvFormula("  Teszt Bár  ")).toBe("  Teszt Bár  ");
    expect(neutralizeCsvFormula("a=b")).toBe("a=b");
    expect(neutralizeCsvFormula("")).toBe("");
  });

  it("quotes and still neutralizes cells with separators", () => {
    expect(toCsvCell('=1+1,"x"')).toBe(`"'=1+1,""x"""`);
    expect(toCsvCell("\n=1")).toBe(`"'\n=1"`);
    expect(toCsv([["Név", "Telefon"], ["=evil()", "+36 1 234 5678"]])).toBe("Név,Telefon\n'=evil(),'+36 1 234 5678");
  });
});
