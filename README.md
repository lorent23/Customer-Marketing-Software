### IpTrack site

## Requirements

- Nodejs (v16)

Download the project and copy .env-example to .env

If you want to use your local database set NODE_ENV=local inside .env file or set it to NODE_ENV=production to connect with the test db on digitalocean

run `npm install` to install all the dependencies
run `npm run dev` to start the server
the server will open on http://localhost:8000/

To change the response language you can set the `Accept-Language` header to `en` or `it`

Language files can be found in `/lang`

Atm when the project starts we create a superadmin user with the following credentials:
email: superadmin@gmail.com
password: 123456
with the superadmin role which has access to all the permissions

In order to access user & role routes you need to be authenticated and pass the `Authorization` header with the token you get from the login route type `Bearer {token}`

To access swagger docs for api documentation go to route

`http://localhost:8000/api-docs`

Please note that some data might change in the future or might not be complete in this documentation as it is still in development

To update the documentation go to './src/utils/swagger.json' and update the swagger.json file
