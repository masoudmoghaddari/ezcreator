import { extractIdentifier } from "./extractIdentifier"; // Adjust the import path as needed

describe("extractIdentifier", () => {
  it("should extract channel ID from a YouTube channel URL", () => {
    const input = "https://www.youtube.com/channel/UC1234567890123456789012";
    const result = extractIdentifier(input);
    expect(result).toEqual({ id: "UC1234567890123456789012", handle: "" });
  });

  it("should extract handle from a YouTube handle URL", () => {
    const input = "https://www.youtube.com/@exampleHandle";
    const result = extractIdentifier(input);
    expect(result).toEqual({ id: "", handle: "exampleHandle" });
  });

  it("should extract handle from a raw handle input", () => {
    const input = "@exampleHandle";
    const result = extractIdentifier(input);
    expect(result).toEqual({ id: "", handle: "exampleHandle" });
  });

  it("should extract handle from a handle without '@'", () => {
    const input = "exampleHandle";
    const result = extractIdentifier(input);
    expect(result).toEqual({ id: "", handle: "exampleHandle" });
  });

  it("should extract channel ID from a raw channel ID input", () => {
    const input = "UC1234567890123456789012";
    const result = extractIdentifier(input);
    expect(result).toEqual({ id: "UC1234567890123456789012", handle: "" });
  });

  it("should return empty id and handle for invalid input", () => {
    const input = "invalid-input";
    const result = extractIdentifier(input);
    expect(result).toEqual({ id: "", handle: "" });
  });

  it("should handle URLs with query parameters after the channel ID", () => {
    const input =
      "https://www.youtube.com/channel/UC1234567890123456789012?param=value";
    const result = extractIdentifier(input);
    expect(result).toEqual({ id: "UC1234567890123456789012", handle: "" });
  });

  it("should handle URLs with query parameters after the handle", () => {
    const input = "https://www.youtube.com/@exampleHandle?param=value";
    const result = extractIdentifier(input);
    expect(result).toEqual({ id: "", handle: "exampleHandle" });
  });

  it("should handle URLs with fragments after the channel ID", () => {
    const input =
      "https://www.youtube.com/channel/UC1234567890123456789012#fragment";
    const result = extractIdentifier(input);
    expect(result).toEqual({ id: "UC1234567890123456789012", handle: "" });
  });

  it("should handle URLs with fragments after the handle", () => {
    const input = "https://www.youtube.com/@exampleHandle#fragment";
    const result = extractIdentifier(input);
    expect(result).toEqual({ id: "", handle: "exampleHandle" });
  });

  it("should trim whitespace from input", () => {
    const input = "  https://www.youtube.com/@exampleHandle  ";
    const result = extractIdentifier(input);
    expect(result).toEqual({ id: "", handle: "exampleHandle" });
  });
});
