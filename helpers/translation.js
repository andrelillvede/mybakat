const t = (lang, sv, en) => {
  if (lang === 'en') return en;
  return sv;
};

const l = (lang, parent, fieldname) => {
  if (lang === 'en') return parent[`${fieldname}_en`];
  return parent[fieldname];
};

const link = (lang, sv) => {
  if (lang === 'en') return `/en${sv}`;
  return sv || '/';
};
export { t, l, link };
