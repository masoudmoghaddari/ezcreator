export function extractIdentifier(input: string) {
  let id = "";
  let handle = "";

  const cleaned = input.trim();

  if (cleaned.includes("/channel/")) {
    id = cleaned.split("/channel/")[1]?.split(/[/?&#]/)[0];
  } else if (cleaned.includes("/@")) {
    handle = cleaned.split("/@")[1]?.split(/[/?&#]/)[0];
  } else if (/^[A-Za-z0-9_-]{24}$/.test(cleaned)) {
    id = cleaned; // raw channel ID
  } else if (
    /^@?[a-zA-Z0-9](?:[a-zA-Z0-9._]{1,28}[a-zA-Z0-9])?$/.test(cleaned)
  ) {
    handle = cleaned.replace(/^@/, "");
  }

  return { id, handle };
}
