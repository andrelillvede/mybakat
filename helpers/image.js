const image = (cache, url, size) => {
  if (cache[url]) {
    return cache[url][size];
  } else {
    const encUrl = encodeURIComponent(url);
    fetch(`/image/${encUrl}`).catch(err => {
      console.error('could not get imgix url');
    });
    return url;
  }
};

export default image;
