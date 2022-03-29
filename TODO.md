NEXT:
(In Master index method and its test works without token.)
Created admin branch to add user_type for user to be able to build an app, where there are admins
and where only admins are allowed to see user list.

user_type is setup, but the migration does not work it looks like migration doesn't delete user type (and user table as it looks like) before testing as it should be.

(Probably the resason testuser id is 3 for fist user???)

When creating deleting all users from users table in a beforeAll in testing user_api_spec, the user created gets id 3. If not using beforeAll tests fail. (?)

LATER:
Test: add testing creation by running select queries
Fix tutorial: finish separating project setup from backend
Tutorial: explain workflow
Tutorial separate testing?
expend user model test, add more users when testng

add clean script to package.json to delete dist folder before build, try:
"clean": "del-cli esm dist lib .cache", ?