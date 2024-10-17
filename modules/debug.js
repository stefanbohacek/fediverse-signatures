import util from "util";

export default (title, observed) => {
  console.log(
    title,
    util.inspect(observed, { showHidden: false, depth: null, colors: true })
  );
};
