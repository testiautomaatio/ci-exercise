# Example tests with Vitest

[Vitest](https://vitest.dev/) is a JavaScript/TypeScript unit test framework powered by Vite. It provides a Jest-compatible API, making it easy to write and run tests for JavaScript and TypeScript projects.

This folder contains a simple example of how to write tests with Vitest. The tests are written in TypeScript, and you can run them from the command line.

## Editing the tests

You can edit the tests using any text editor or IDE. For TypeScript support and IntelliSense, VS Code with the TypeScript extension is recommended.

## Running the tests

To run the tests, you need to have Node.js and npm installed, then install Vitest as a dev dependency.

### Installation

Install the dependencies using npm:

```bash
# Install dependencies (including Vitest)
npm install
```

### Running the tests

After installing the dependencies, you can run the tests with the following command:

```bash
npx vitest
```

## Testing REST APIs with Vitest

Vitest is not specifically designed for testing REST APIs, but you can use it in combination with the `fetch` API or `axios` library to make HTTP requests and test your API endpoints. When looking for instructions on how to build requests and how to inspect the responses, you can refer to the `fetch` API documentation or the `axios` library documentation. Asserting the responses can be done using Vitest's built-in assertion methods, such as `expect`, which is explained in more detail in the Vitest documentation.

## Documentation

For more information about Vitest, check out the official documentation:

[Vitest Documentation](https://vitest.dev/)

You can also find information about testing REST APIs and using fetch or other HTTP client libraries in the Vitest guides.
