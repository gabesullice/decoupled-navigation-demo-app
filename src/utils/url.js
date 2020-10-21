export function backendURL(input) {
  const url = new URL(input.href);
  url.searchParams.set("_format", "api_json");
  return url;
}

export function frontendURL(input) {
  const url = new URL(input.href);
  url.searchParams.delete("_format");
  return url;
}
