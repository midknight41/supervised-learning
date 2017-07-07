// Testing Framework
const Code = require("code");
const Lab = require("lab");
const { getCombinations } = require("../lib/combo");

const lab = exports.lab = Lab.script();
const expect = Code.expect;

lab.experiment("The getCombinations() method", () => {

  lab.test("A group of multiple items generates the correct number of combinations", done => {

    // 1, 2, 3, 4 , 5 ,  6,   7
    // 1, 3, 7, 15, 31, 63, 127

    const values = ["A", "B", "C", "D", "E", "F", "G"];
    const combos = getCombinations(values);

    expect(combos).to.be.an.array();
    expect(combos).to.have.a.length(Math.pow(2, values.length) - 1);

    return done();

  });
});
