const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function (done) {
    puzzlesAndSolutions.forEach((ps) => {
      const input = ps[0];
      const output = solver.validate(input);
      const expectedOutput = true;
      assert.equal(output, expectedOutput);
    });

    assert.equal(true, true);

    done();
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function (done) {
    const input1 = puzzlesAndSolutions[0][0].replace("1", "a");
    assert.throws(
      () => solver.validate(input1),
      Error,
      "Invalid characters in puzzle",
    );

    const input2 = puzzlesAndSolutions[0][0].replace(".", "a");
    assert.throws(
      () => solver.validate(input2),
      Error,
      "Invalid characters in puzzle",
    );

    assert.equal(true, true);

    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
    const input1 = puzzlesAndSolutions[0][0].slice(0, 80);
    assert.throws(
      () => solver.validate(input1),
      Error,
      "Expected puzzle to be 81 characters long",
    );

    const input2 = puzzlesAndSolutions[0][0] + ".";
    assert.throws(
      () => solver.validate(input2),
      Error,
      "Expected puzzle to be 81 characters long",
    );

    assert.equal(true, true);

    done();
  });

  test("Logic handles a valid row placement", function (done) {
    const input1 = puzzlesAndSolutions[0][0];
    const output1 = solver.checkRowPlacement(input1, "A", "2", 7);
    const expectedOutput1 = true;

    assert.equal(output1, expectedOutput1);

    const input2 = puzzlesAndSolutions[0][0];
    const output2 = solver.checkRowPlacement(input2, "A", "3", 5);
    const expectedOutput2 = true;

    assert.equal(output2, expectedOutput2);

    done();
  });

  test("Logic handles a invalid row placement", function (done) {
    const input1 = puzzlesAndSolutions[0][0];
    const output1 = solver.checkRowPlacement(input1, "A", "2", 1);
    const expectedOutput1 = false;

    assert.equal(output1, expectedOutput1);

    const input2 = puzzlesAndSolutions[0][0];
    const output2 = solver.checkRowPlacement(input2, "A", "1", 2);
    const expectedOutput2 = false;

    assert.equal(output2, expectedOutput2);

    done();
  });

  test("Logic handles a valid column placement", function (done) {
    const input1 = puzzlesAndSolutions[0][0];
    const output1 = solver.checkColPlacement(input1, "B", "1", 5);
    const expectedOutput1 = true;

    assert.equal(output1, expectedOutput1);

    const input2 = puzzlesAndSolutions[0][0];
    const output2 = solver.checkColPlacement(input2, "A", "1", 1);
    const expectedOutput2 = true;

    assert.equal(output2, expectedOutput2);

    done();
  });

  test("Logic handles a invalid column placement", function (done) {
    const input1 = puzzlesAndSolutions[0][0];
    const output1 = solver.checkColPlacement(input1, "A", "1", 2);
    const expectedOutput1 = false;

    assert.equal(output1, expectedOutput1);

    const input2 = puzzlesAndSolutions[0][0];
    const output2 = solver.checkColPlacement(input2, "B", "1", 3);
    const expectedOutput2 = false;

    assert.equal(output2, expectedOutput2);

    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", function (done) {
    const input = puzzlesAndSolutions[0][0];
    const output = solver.checkRegionPlacement(input, "A", "2", 3);
    const expectedOutput = true;

    assert.equal(output, expectedOutput);

    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", function (done) {
    const input = puzzlesAndSolutions[0][0];
    const output = solver.checkRegionPlacement(input, "A", "2", 2);
    const expectedOutput = false;

    assert.equal(output, expectedOutput);

    done();
  });

  test("Valid puzzle strings pass the solver", function (done) {
    puzzlesAndSolutions.forEach((ps) => {
      const input = ps[0];
      const output = solver.solve(input);

      assert.isString(output);
    });

    assert.equal(true, true);

    done();
  });

  test("Invalid puzzle strings fail the solver", function (done) {
    const input =
      puzzlesAndSolutions[0][0].substring(0, 1) +
      "1" +
      puzzlesAndSolutions[0][0].substring(2);

    assert.throws(() => solver.solve(input), Error, "Puzzle cannot be solved");

    assert.equal(true, true);

    done();
  });

  test("Solver returns the expected solution for an incomplete puzzle", function (done) {
    puzzlesAndSolutions.forEach((ps, index) => {
      if (index > 0) {
        return;
      }
      const input = ps[0];
      const output = solver.solve(input);
      const expectedOutput = ps[1];
      assert.equal(output, expectedOutput);
    });

    assert.equal(true, true);

    done();
  });
});
