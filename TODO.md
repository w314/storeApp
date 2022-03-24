NEXT:
Add new test to check if test fails when userIdInToken != userIdInUrl in testing user api show

When creating deleting all users from users table in a beforeAll in testing user_api_spec, the user created gets id 3. If not using beforeAll tests fail. (?)

LATER:
Test: add testing creation by running select queries
Fix tutorial: finish separating project setup from backend
Tutorial: explain workflow
Tutorial separate testing?
expend user model test, add more users when testng

add clean script to package.json to delete dist folder before build, try:
"clean": "del-cli esm dist lib .cache", ?