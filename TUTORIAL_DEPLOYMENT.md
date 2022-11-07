# Deployment 
## Using `AWS` `RDS` for database

### Setup `AWS` `RDS` database
- do not use easy setup, to be able to make database public at setup (easy setup sets it automatically to private)
- select free tier database
- set database to public

### Adjust environmental variales in `.env` file in project
- use `end-point` of database in `aws` as `host` (just copy the exact string over)
- use `postgres` for `DATABASE_NAME` **NOT** the database name you chose in `aws`
- use `postgres` or whatever you chose as `DATABASE_USER`
- use the `password` you created as `DATABASE PASSWORD`

## Using `AWS EB` Elastic Beanstalk to host web server

- go to Elastic Beanstalk page
- click on `Create Application`
- enter `Application name`
- select `node.js` as `platfrom`
- select `upload your code` in the `Applicatin code` section
- upload zipped application code


