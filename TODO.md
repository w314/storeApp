NEXT:
product_category is updated everywhere (in theory)
products api endpoint tests do not run as in the first test it creates and updates the id of the product created, if only that test is run, but if all of them run, this test fails, and the id is not updated and other tests fail because of that

LATER:
Test: add testing creation by running select queries
Fix tutorial: finish separating project setup from backend
Tutorial: explain workflow
Tutorial separate testing?

add clean script to package.json to delete dist folder before build, try:
"clean": "del-cli esm dist lib .cache", ?