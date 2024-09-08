const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("SOLVE", function () {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
      const bodyPayload = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      };

      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send(bodyPayload)
        .end((_err, res) => {
          assert.equal(res.status, 200);

          assert.isObject(res.body);
          assert.property(res.body, "solution");
          assert.equal(
            res.body.solution,
            "769235418851496372432178956174569283395842761628713549283657194516924837947381625",
          );

          done();
        });
    });

    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
      const bodyPayload = {};

      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send(bodyPayload)
        .end((_err, res) => {
          assert.equal(res.status, 200);

          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field missing");

          done();
        });
    });

    test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
      const bodyPayload = {
        puzzle:
          "AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      };

      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send(bodyPayload)
        .end((_err, res) => {
          assert.equal(res.status, 200);

          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");

          done();
        });
    });

    test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
      const bodyPayload1 = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.",
      };

      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send(bodyPayload1)
        .end((_err, res) => {
          assert.equal(res.status, 200);

          assert.isObject(res.body);
          assert.property(res.body, "error");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long",
          );

          const bodyPayload2 = {
            puzzle:
              "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...",
          };

          chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send(bodyPayload2)
            .end((_err, res) => {
              assert.equal(res.status, 200);

              assert.isObject(res.body);
              assert.property(res.body, "error");
              assert.equal(
                res.body.error,
                "Expected puzzle to be 81 characters long",
              );

              done();
            });
        });

      test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
        const bodyPayload = {
          puzzle:
            "9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        };

        chai
          .request(server)
          .keepOpen()
          .post("/api/solve")
          .send(bodyPayload)
          .end((_err, res) => {
            assert.equal(res.status, 200);

            assert.isObject(res.body);
            assert.property(res.body, "error");
            assert.equal(res.body.error, "Puzzle cannot be solved");

            done();
          });
      });
    });
  });

  suite("CHECK", function () {
    test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
      const bodyPayload = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: "7",
      };

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(bodyPayload)
        .end((_err, res) => {
          assert.equal(res.status, 200);

          assert.isObject(res.body);
          assert.property(res.body, "valid");
          assert.isTrue(res.body.valid);

          done();
        });
    });

    test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
      const bodyPayload = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "E6",
        value: "5",
      };

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(bodyPayload)
        .end((_err, res) => {
          assert.equal(res.status, 200);

          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          assert.property(res.body, "conflict");
          assert.include(res.body.conflict, "column");

          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
      const bodyPayload = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: "1",
      };

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(bodyPayload)
        .end((_err, res) => {
          assert.equal(res.status, 200);

          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          assert.property(res.body, "conflict");
          assert.include(res.body.conflict, "row");
          assert.include(res.body.conflict, "column");

          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
      const bodyPayload = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "E6",
        value: "9",
      };

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(bodyPayload)
        .end((_err, res) => {
          assert.equal(res.status, 200);

          assert.property(res.body, "valid");
          assert.isFalse(res.body.valid);
          assert.property(res.body, "conflict");
          assert.include(res.body.conflict, "row");
          assert.include(res.body.conflict, "column");
          assert.include(res.body.conflict, "region");

          done();
        });
    });

    test("If value submitted to /api/check is already placed in puzzle on that coordinate, the returned value will be an object containing a valid property with true if value is not conflicting.", function (done) {
      const bodyPayload = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "C3",
        value: "2",
      };

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(bodyPayload)
        .end((_err, res) => {
          assert.equal(res.status, 200);

          assert.property(res.body, "valid");
          assert.isTrue(res.body.valid);

          done();
        });
    });

    // Failed: 10. ' }

    test("If the puzzle submitted to /api/check contains values which are not numbers or periods, the returned value will be { error: 'Invalid characters in puzzle", function (done) {
      const bodyPayload = {
        puzzle:
          "AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: "1",
      };

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(bodyPayload)
        .end((_err, res) => {
          assert.equal(res.status, 200);

          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");

          done();
        });
    });

    test("If the puzzle submitted to /api/check is greater or less than 81 characters, the returned value will be { error: 'Expected puzzle to be 81 characters long' }", function (done) {
      const puzzles = [
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.",
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...",
      ];

      const bodyPayload = {
        coordinate: "A1",
        value: "1",
      };

      const requests = puzzles.map((p) =>
        chai
          .request(server)
          .keepOpen()
          .post("/api/check")
          .send({
            puzzle: p,
            ...bodyPayload,
          })
          .then((res) => {
            assert.equal(res.status, 200);
            assert.equal(
              res.body.error,
              "Expected puzzle to be 81 characters long",
            );
          }),
      );

      Promise.all(requests).then(() => done());
    });

    test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
      const bodyPayload1 = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: "1",
      };

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(bodyPayload1)
        .end((_err, res) => {
          assert.equal(res.status, 200);

          assert.equal(res.body.error, "Required field(s) missing");

          const bodyPayload2 = {
            puzzle:
              "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A1",
          };

          chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send(bodyPayload2)
            .end((_err, res) => {
              assert.equal(res.status, 200);

              assert.equal(res.body.error, "Required field(s) missing");

              done();
            });
        });
    });

    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
      const coordinates = ["A0", "A10", "J1", "A", "1", "XZ18"];

      const bodyPayload = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        value: "7",
      };

      const requests = coordinates.map((c) =>
        chai
          .request(server)
          .keepOpen()
          .post("/api/check")
          .send({
            ...bodyPayload,
            coordinate: c,
          })
          .then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid coordinate");
          }),
      );

      Promise.all(requests).then(() => done());
    });

    test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
      const values = ["0", "10", "A"];

      const bodyPayload = {
        puzzle:
          "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
      };

      const requests = values.map((v) =>
        chai
          .request(server)
          .keepOpen()
          .post("/api/check")
          .send({
            ...bodyPayload,
            value: v,
          })
          .then((res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid value");
          }),
      );

      Promise.all(requests).then(() => done());
    });
  });
});
