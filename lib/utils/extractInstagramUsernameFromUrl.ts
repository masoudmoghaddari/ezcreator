export function extractInstagramUsernameFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url.trim());

    if (!parsed.hostname.includes("instagram.com")) return null;

    // Remove trailing slash
    const pathname = parsed.pathname.replace(/\/$/, "");

    // Extract the last segment of the path
    const segments = pathname.split("/");
    const username = segments[segments.length - 1];

    if (!username || username.includes(".")) return null; // Basic sanity check
    return username;
  } catch (err) {
    return null;
  }
}
