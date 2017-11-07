# Zipcode Service

This example illustrates the use of Carbon.io to implement a simple
microservice for managing zipcodes.

## Installing the service

We encourage you to clone the git repository so you can play around
with the code. 

```
$ git clone -b carbon-0.7 git@github.com:carbon-io-examples/example__zipcode-service.git
$ cd example__zipcode-service
$ npm install
```

## Running the service

To run the service:

```sh
$ node lib/ZipcodeService
```

For cmdline help:

```sh
$ node lib/ZipcodeService -h
```

## Running the unit tests

This example comes with a simple unit test written in Carbon.io's test framework called TestTube. It is located in the `test` directory. 

```
$ node test/ZipcodeServiceTest
```

or 

```
$ npm test
```

## Generating API documentation (aglio flavor)

To generate documentation using aglio, install it as a devDependency:

```
$ npm install -D --no-optional aglio
```

Using `--no-optional` speeds up aglio's install time significantly. Then generate the docs using this command:

```sh
$ node lib/ZipcodeService gen-static-docs --flavor aglio --out docs/index.html
```

* [View current documentation](
http://htmlpreview.github.io/?https://raw.githubusercontent.com/carbon-io-examples/example__zipcode-service/blob/carbon-0.7/docs/index.html)
