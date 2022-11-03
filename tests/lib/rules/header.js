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
      options: [2, 'line', ["License Header"]]
    },
    {
      code: `
// License Header 2022
var react = require('react');
      `,
      options: [2, 'line', ["License Header {YEAR}"]]
    },
    {
      code: `
// License Header 1999
var react = require('react');
      `,
      options: [2, 'line', ["License Header {YEAR}"]]
    },
    {
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
      code: `
/* License Header */
var react = require('react');
      `,
      options: [2, 'block', ["License Header"]]
    },
    {
      code: `
/* License Header */
var react = require('react');
      `,
      options: [2, 'both', ["License Header"]]
    },
    {
      code: `
// License Header
var react = require('react');
      `,
      options: [2, 'both', ["License Header"]]
    },
    {
      code: `
// License Header
var react = require('react');
      `,
      options: [2, { prefer: 'line', allow: 'both' }, ["License Header"]]
    },
    {
      code: `
// License Header
var react = require('react');
      `,
      options: [2, { prefer: 'block', allow: 'both' }, ["License Header"]]
    }
  ],

  invalid: [
    {
      code: "var react = require('react')",
      options: [2, 'line', ['License Header']],
      errors: [{ message: "missing license", line: 1 }],
      output: `// License Header

var react = require('react')`
    },
    {
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
