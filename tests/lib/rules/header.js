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
    {
      code: `
// License Header
var react = require('react');
      `,
      options: [2, 'line', ["License Header"] ]
    },
    {
      code: `
// License Header 2022
var react = require('react');
      `,
      options: [2, 'line', ["License Header {YEAR}"] ]
    },
    {
      code: `
/* License Header */
var react = require('react');
      `,
      options: [2, 'block', ["License Header"] ]
    }
  ],

  invalid: [
    {
      code: "var react = require('react')",
      options: [2, 'line', ['License Header'] ],
      errors: [{ message: "missing license", line: 1 }],
      output: `// License Header

var react = require('react')`
    },
    {
      code: `/* License Header */
var react = require('react');`,
      options: [2, 'line', ["License Header"] ],
      errors: [{ message: "invalid comment type (expected 'line' but was 'block')" }],
      output: `// License Header
var react = require('react');`
    },
    {
      code: `
// License Header
var react = require('react');`,
      options: [2, 'block', ["License Header"] ],
      errors: [{ message: "invalid comment type (expected 'block' but was 'line')" }],
      output:`
/* License Header */
var react = require('react');`
    }
  ],
});
