# eslint-plugin-licenses

Ensures all source files have a license header

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-licenses`:

```sh
npm install eslint-plugin-licenses --save-dev
```

## Usage

Add `licenses` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "licenses"
    ]
}
```


Then configure the header you want to use

```json
{
    "rules": {
        "licenses/header": [
            2,
            {
                "comment": "line",
                "header": [
                    "Copyright (c) {YEAR} fallaciousreasoning. All rights reserved."
                ]
            }
        ]
    }
}
```

The {YEAR} placeholder will be generated as the current year when running `eslint --fix` and will match any year (including ones in the future).

If you have existing headers with different formats, you can add them as `altHeaders`

```json
{
    "rules": {
        "licenses/header": [
            2,
            {
                "comment": "line",
                "header": [
                    "Copyright (c) {YEAR} fallaciousreasoning. All rights reserved."
                ],
                "altHeaders": [
                    {
                        "comment": "block",
                        "header": [
                            "",
                            "Copyright (c) Me, always & forever",
                            ""
                        ]
                    }
                ]
            }
        ]
    }
}
```

This will match the headers

```js
// Copyright (c) 2022 fallaciousreasoning. All rights reserved
```

and

```js
/*
 * Copyright (c) Me, always & forever
 */
```

but when generating fixes will use the first format.


