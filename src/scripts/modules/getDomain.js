export default (url) => {
  let domain = new URL(url);
  return domain.hostname;
};
