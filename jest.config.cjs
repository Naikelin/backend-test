const config = {
  preset: "ts-jest",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  collectCoverage: true,
  coverageReporters: ["json", "html", "lcov", "text"],
};
module.exports = config;
