NEXT:
ADD new api endpoint /orders/:userId/active/:productId to add new product


add test to check that model doesn't allow to add new item to completed order?

find problem with orderList order handler, endpoint test fails.

add test to order_api_spect to test that no item can be added to completed order


LATER:
Test: add testing creation by running select queries
Fix tutorial: finish separating project setup from backend
Tutorial: explain workflow
Tutorial separate testing?

add clean script to package.json to delete dist folder before build, try:
"clean": "del-cli esm dist lib .cache", ?