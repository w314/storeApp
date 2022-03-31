NEXT:
USE admin type
in user handler modify show method to allow admin to see any user
in user handler modify index method to only allow admins to see user list
in test store admin token
create test that admin can use GET /users/:id
modify test that only admin can use GET /users


(In Master index method and its test works without token.)
Created admin branch to add user_type for user to be able to build an app, where there are admins
and where only admins are allowed to see user list.



LATER:
Test: add testing creation by running select queries
Fix tutorial: finish separating project setup from backend
Tutorial: explain workflow
Tutorial separate testing?
expend user model test, add more users when testng

add clean script to package.json to delete dist folder before build, try:
"clean": "del-cli esm dist lib .cache", ?