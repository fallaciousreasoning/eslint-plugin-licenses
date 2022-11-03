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
      name: "Single line header is valid",
      code: `
// License Header
var react = require('react');
      `,
      options: [2, 'line', ["License Header"]]
    },
    {
      name: "Single line header with year is valid",
      code: `
// License Header 2022
var react = require('react');
      `,
      options: [2, 'line', ["License Header {YEAR}"]]
    },
    {
      name: "Single line header with year from a while back is valid",
      code: `
// License Header 1999
var react = require('react');
      `,
      options: [2, 'line', ["License Header {YEAR}"]]
    },
    {
      name: "Multi line header with year is valid (line comments)",
      code: `
// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.
var react = require('react');
      `,
      options: [2, 'line', [
        "Copyright (c) {YEAR} The Brave Authors. All rights reserved.",
        "This Source Code Form is subject to the terms of the Mozilla Public",
        "License, v. 2.0. If a copy of the MPL was not distributed with this file,",
        "you can obtain one at http://mozilla.org/MPL/2.0/."
      ]]
    },
    {
      name: "Mult line header with year is valid (block comments)",
      code: `
/*
 * Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you can obtain one at http://mozilla.org/MPL/2.0/.
 */
var react = require('react');
      `,
      options: [2, 'block', [
        "",
        "* Copyright (c) {YEAR} The Brave Authors. All rights reserved.",
        "* This Source Code Form is subject to the terms of the Mozilla Public",
        "* License, v. 2.0. If a copy of the MPL was not distributed with this file,",
        "* you can obtain one at http://mozilla.org/MPL/2.0/.",
        ""
      ]]
    },
    {
      name: "Single line header is valid (block comment)",
      code: `
/* License Header */
var react = require('react');
      `,
      options: [2, 'block', ["License Header"]]
    },
    {
      name: "Single line header with non-preferred style is valid (block comment)",
      code: `
/* License Header */
var react = require('react');
      `,
      options: [2, 'both', ["License Header"]]
    },
    {
      name: "Single line header with non-preferred style is valid (line comment)",
      code: `
// License Header
var react = require('react');
      `,
      options: [2, 'both', ["License Header"]]
    },
    {
      name: "Single line header with non-preferred style is valid (line comment) (pref & allow)",
      code: `
// License Header
var react = require('react');
      `,
      options: [2, { prefer: 'line', allow: 'both' }, ["License Header"]]
    },
    {
      name: "Single line header with non-preferred style is valid (block comment) (pref & allow)",
      code: `
// License Header
var react = require('react');
      `,
      options: [2, { prefer: 'block', allow: 'both' }, ["License Header"]]
    }
  ],

  invalid: [
    {
      name: "Can add missing single line header",
      code: "var react = require('react')",
      options: [2, 'line', ['License Header']],
      errors: [{ message: "missing license", line: 1 }],
      output: `// License Header

var react = require('react')`
    },
    {
      name: "Can convert single line header to line comments",
      code: `
/* License Header */
var react = require('react');`,
      options: [2, 'line', ["License Header"]],
      errors: [{ message: "invalid comment type (expected 'line' but was 'block')" }],
      output: `
// License Header
var react = require('react');`
    },
    {
      name: "Can convert single line header to block",
      code: `
// License Header
var react = require('react');`,
      options: [2, 'block', ["License Header"]],
      errors: [{ message: "invalid comment type (expected 'block' but was 'line')" }],
      output: `
/* License Header */
var react = require('react');`
    },
    {
      name: "Can convert multi line header to block comments",
      code: `
// License Header Line 1
// License Header Line 2
var react = require('react');`,
      options: [2, 'block', ["License Header"]],
      errors: [{ message: "invalid comment type (expected 'block' but was 'line')" }],
      output: `
/* License Header Line 1
 License Header Line 2 */
var react = require('react');`
    },
    {
      name: "Can convert multi line block to line comments",
      code: `
/* License Header Line 1
 License Header Line 2 */
var react = require('react');`,
      options: [2, 'line', ["License Header"]],
      errors: [{ message: "invalid comment type (expected 'line' but was 'block')" }],
      output: `
// License Header Line 1
// License Header Line 2
var react = require('react');`
    },
    {
      name: "Can fix wrong header in line comment",
      code: `
// Not the right header
var react = require('react');`,
      options: [2, 'line', ["License Header"]],
      errors: [{ message: "incorrect license line" }],
      output: `
// License Header
var react = require('react');`
    },
    {
      name: "Can fix wrong header in block comment",
      code: `
/* Not the right header */
var react = require('react');`,
      options: [2, 'block', ["License Header"]],
      errors: [{ message: "incorrect license line" }],
      output: `
/* License Header */
var react = require('react');`
    },
    {
      name: "Can fix wrong line in line comment",
      code: `
// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// Line is wrong
// you can obtain one at http://mozilla.org/MPL/2.0/.
var react = require('react');
`,
      options: [2, 'line', [
        "Copyright (c) {YEAR} The Brave Authors. All rights reserved.",
        "This Source Code Form is subject to the terms of the Mozilla Public",
        "License, v. 2.0. If a copy of the MPL was not distributed with this file,",
        "you can obtain one at http://mozilla.org/MPL/2.0/."
      ]],
      errors: [{ message: "incorrect license line" }],
      output: `
// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.
var react = require('react');
`
    },
    {
      name: "Can fix missing year in line comment",
      code: `
// Copyright (c) The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.
var react = require('react');
`,
      options: [2, 'line', [
        "Copyright (c) {YEAR} The Brave Authors. All rights reserved.",
        "This Source Code Form is subject to the terms of the Mozilla Public",
        "License, v. 2.0. If a copy of the MPL was not distributed with this file,",
        "you can obtain one at http://mozilla.org/MPL/2.0/."
      ]],
      errors: [{ message: "incorrect license line" }],
      output: `
// Copyright (c) 2022 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.
var react = require('react');
`
    },
    {
      name: "Can fix missing {YEAR} in block comment",
      code: `
/*
 * Copyright (c) The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you can obtain one at http://mozilla.org/MPL/2.0/.
 */
var react = require('react');
`,
      options: [2, 'block', [
        "",
        "* Copyright (c) {YEAR} The Brave Authors. All rights reserved.",
        "* This Source Code Form is subject to the terms of the Mozilla Public",
        "* License, v. 2.0. If a copy of the MPL was not distributed with this file,",
        "* you can obtain one at http://mozilla.org/MPL/2.0/.",
        ""
      ]],
      errors: [{ message: "incorrect license line" }],
      output: `
/*
 * Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you can obtain one at http://mozilla.org/MPL/2.0/.
 */
var react = require('react');
`
    },
  ],
});
