/**
 * @fileoverview Ensures that source files have a license header
 * @author Jay
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/header"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("header", rule, {
  valid: [
    // give me some code that won't trigger a warning
    {
      code: `
// License Header
var react = require('react');
      `,
      options: [2, 'line', ["License Header"] ]
    }
  ],

  invalid: [
    {
      code: "var react = require('react')",
      errors: [{ message: "missing header", line: 1 }],
    },
  ],
});
