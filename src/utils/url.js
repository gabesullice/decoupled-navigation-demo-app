function newURLWithOrigin(url, originURL) {
  return new URL(`${url.pathname}${url.search}${url.hash}`, originURL);
}

export { newURLWithOrigin };
