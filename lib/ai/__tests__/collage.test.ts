import { describe, expect, it } from "vitest";
import { detectSegments } from "../collage";

// 1.0 = fully background, 0.0 = fully content.
describe("detectSegments", () => {
  it("finds a single content block surrounded by background", () => {
    const line = [1, 1, 0.2, 0.1, 0.2, 1, 1];
    expect(detectSegments(line, 0.9)).toEqual([[2, 4]]);
  });

  it("finds two blocks separated by a gutter", () => {
    const line = [1, 0.2, 0.2, 1, 1, 0.1, 0.1, 1];
    expect(detectSegments(line, 0.9)).toEqual([
      [1, 2],
      [5, 6],
    ]);
  });

  it("returns the whole line when there is no gutter", () => {
    const line = [0.3, 0.2, 0.1, 0.2];
    expect(detectSegments(line, 0.9)).toEqual([[0, 3]]);
  });

  it("returns nothing for an all-background line", () => {
    expect(detectSegments([1, 1, 1, 1], 0.9)).toEqual([]);
  });

  it("drops segments shorter than minLen", () => {
    const line = [0.2, 1, 1, 0.1, 0.1, 0.1];
    // first block is length 1, dropped when minLen=2
    expect(detectSegments(line, 0.9, 2)).toEqual([[3, 5]]);
  });
});
