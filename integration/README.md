## Integration

There are 3 purposes for this directory

1.  **Integration test**: All files in this directory are written like "real-life-usage", it contains tests to ensure all features are working as expectations.
2.  **Definition and Syntax test**: Because the `najs-eloquent` is implemented with Proxy and dynamic function names then we have to ensure that all classes have typed-definition correctly.
3.  **Develop and debug**: All bugs which are reproducible in model-level should be written, fixed and tested in this directory

The directory structure:

* **models**: Definition of models which are use for integration/definition/syntax testing
* **mongodb**: Setup for mongodb/mongoose driver or environment
* **mysql**: Setup for mysql driver or environment
* **test**: Setup for mysql driver or environment
* * **features**: For integration test
* * **syntax**: For definition and syntax test, if a type-definitions is wrong it's never built successfully
* **ModelFactory.ts**: Factory definition
