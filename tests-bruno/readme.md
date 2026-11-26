# Example tests with Bruno

[Bruno](https://usebruno.com/) is a testing framework for REST APIs that allows you to write tests in a simple and readable way.

This folder contains a simple example of how to write tests with Bruno. The tests are written using the Bruno VS Code extension, but you can run them from the command line.

## Editing the tests

You can edit the tests using the Bruno VS Code extension. You can install the extension from the Visual Studio Code marketplace or from https://www.usebruno.com/product/ide-extension.

## Running the tests

To run the tests, you can use the Bruno CLI. First, make sure you have the Bruno CLI installed.

Install it according to the bruno installation instructions at https://www.usebruno.com/product/cli.

```bash
# global install
npm install -g @usebruno/cli

# local install
cd tests-bruno
npm install @usebruno/cli
```

After installing the CLI, you can run the tests with the following command:

```bash
# global install
bru run

# local install
npx bru run
```

## Extra: generating documentation

You can also generate documentation for your API and tests using the Bruno CLI. To do this, run the following command:

```bash
# global install
bru docs generate

# local install
npx bru docs generate
```
