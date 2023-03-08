//model, populate

const advancedResults = (model, populate) => {
  return (req, res, next) => {
    console.log("Advanced result middleware");
    next();
  };
};

module.exports = advancedResults;
