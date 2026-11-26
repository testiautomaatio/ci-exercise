# Example tests with Robot Framework

[Robot Framework](https://robotframework.org/) is a generic open-source test automation framework that is easy to use and extensible. It can be used for test automation and robotic process automation (RPA).

This folder contains a simple example of how to write tests with Robot Framework. You can run them from the command line or with the [RobotCode](https://robotcode.io/) extension for Visual Studio Code.

## Editing the tests

You can edit the tests using any text editor or IDE. For a better experience, you can install the [RobotCode](https://robotcode.io/) extension which provides syntax highlighting and other features.

### Installation

This project uses the Robot Framework and the Requests library. The dependencies for these tests are installed using pip:

```bash
# Install Robot Framework
pip install robotframework

# Install Requests library for making HTTP requests
pip install robotframework-requests
```

### Running the tests

After installing the dependencies, you can run the tests with the following command:

```bash
robot workout-api.robot
```

## Documentation

For more information about the Requests library used in these tests, check the documentation:

[Robot Framework Requests Library Documentation](https://marketsquare.github.io/robotframework-requests/doc/RequestsLibrary.html)
