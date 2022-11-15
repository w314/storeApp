# Deployment 
## Using `AWS` `RDS` for database

### Setup `AWS` `RDS` database
- do not use easy setup, to be able to make database public at setup (easy setup sets it automatically to private)
- under `Engine Options` select `PostgreSQL`
- under `Templates` select `Free tier`
- under `Credential Settings`
    - set and remember `Master username` (`DATABASE_USER` in `.env` file)
    - set and remember `Master password` (`DATABASE_PASSWORD` in `.env` file)
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

### Prepare code for uploading
After uploading `EB` will run the following commands:
- npm install --production
- npm start

The application has to be ready to be started by running those commands.

Can you try deleting the node_modules, and package-lock.json and run these ^ command locally and see if it works? Ensure to have the same Node.js version as you have chosen for the EB environment.
- upload zipped application code
- click `Create application` button


