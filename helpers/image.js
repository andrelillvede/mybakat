const image = (cache, url, size) => {
  if (cache[url]) {
    return cache[url][size];
  } else {
    const encUrl = encodeURIComponent(url);
    return `/image/${size}/${encUrl}`;
  }
};

export default image;
