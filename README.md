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


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "licenses/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


