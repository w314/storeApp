NEXT:
ADD primary key to order_products table
ADD NOT NULL to fields in tables
ADD UNIQUE constraint whenever needed

differences between references and constrain

LATER:
Test: add testing creation by running select queries
Fix tutorial: finish separating project setup from backend
Tutorial: explain workflow
Tutorial separate testing?

add clean script to package.json to delete dist folder before build, try:
"clean": "del-cli esm dist lib .cache", ?