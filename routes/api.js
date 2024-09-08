"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const puzzle = req.body.puzzle;
    const coordinate = req.body.coordinate;
    const value = req.body.value;

    if (!puzzle || !coordinate || !value) {
      res.status(200).json({ error: "Required field(s) missing" });
      return;
    }

    if (coordinate.length !== 2) {
      res.status(200).json({ error: "Invalid coordinate" });
      return;
    }

    const row = coordinate[0];
    const column = coordinate[1];

    if (!/^[A-I]$/.test(row) || !/^[1-9]$/.test(column)) {
      res.status(200).json({ error: "Invalid coordinate" });
      return;
    }

    if (!/^[1-9]$/.test(value)) {
      res.status(200).json({ error: "Invalid value" });
      return;
    }

    try {
      const result = solver.checkPlacement(
        puzzle,
        coordinate[0],
        coordinate[1],
        Number(value),
      );

      res.status(200).json({ valid: result });
    } catch (e) {
      if (e.message === "Invalid characters in puzzle") {
        res.status(200).json({ error: "Invalid characters in puzzle" });
      } else if (e.message === "Expected puzzle to be 81 characters long") {
        res
          .status(200)
          .json({ error: "Expected puzzle to be 81 characters long" });
      } else {
        const errors = e.message.split(",");
        res.status(200).json({ valid: false, conflict: errors });
      }
    }
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;

    if (!puzzle) {
      res.status(200).json({ error: "Required field missing" });
    }

    try {
      const result = solver.solve(puzzle);

      const responsePayload = {
        solution: result,
      };

      res.status(200).json(responsePayload);
    } catch (e) {
      res.status(200).json({ error: e.message });
    }
  });
};
