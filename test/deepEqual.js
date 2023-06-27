"use strict";
const chai = require("chai");
const dayjs = require("dayjs");

function deepEqualArray(expected, actual, path) {
  for (let i = 0; i < expected.length; i++) {
    _deepEqual(expected[i], actual[i], `${path}[${i}]`);
  }
}

function deepEqualObject(expected, actual, path) {
  Object.keys(expected).forEach((key) =>
    _deepEqual(expected[key], actual[key], `${path}.${key}`)
  );
}

function _deepEqual(expected, actual, path = "actual") {
  if (expected instanceof Date) {
    chai.assert.isTrue(actual instanceof Date, `${path} is not Date`);
    chai.assert.isTrue(
      dayjs(expected).isSame(dayjs(actual)),
      `${dayjs(expected).toISOString()} !== ${dayjs(actual).toISOString()}`
    );
    return;
  }
  if (expected instanceof Array) {
    chai.assert.isTrue(actual instanceof Array, `${path} is not Array`);
    if (expected.length !== actual.length) {
      chai.expect(expected).deep.equal(actual, path);
    }
    deepEqualArray(expected, actual, path);
  }
  if (typeof expected === "object") {
    chai.assert.isTrue(typeof actual === "object", `${path} is not Object`);
    return deepEqualObject(expected, actual, path);
  }
  chai.expect(expected).to.equal(actual, path + " !== " + expected);
}

function deepEqual(expected, actual) {
  _deepEqual(expected, actual);
}

module.exports = deepEqual;
