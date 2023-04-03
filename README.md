# GrubBE

## Grub App Backend Repo

This is the backend for the Grub mobile app. The front-end (A React Native Android App) is available on github [here](https://github.com/hja7333/GrubFe).

The Grub API endpoints are only accessible to authorised users. To create an account you must post to /api/users with the relevant user fields (username, password, location, contact) in JSON format.

Once an account has been created authorisation can be gained by sending a post request to /api/auth with the correct username and password provided in JSON format. The service will reply with a JSON that has a key 'token'. This token must be provided in the header of all subsequent API requests as a bearer token (valid for 7 days).

### Installation

Clone this repo:

`git clone https://github.com/a-stenhouse/GrubBE`

Then from the project folder run:

`npm install`

to install all the project dependencies. The back end was created with Node.js (v19.3.0), express (v4.18.2), jsonwebtoken (9.0.0), mongodb (v5.1.0), mongoose (v7.0.3), passport.js (v0.6.0) with passport-local (v1.0.0) and passport-jwt (v4.0.1).

### Environment variables

To run the backend environment variables need to be set for the MongoDB URI. These are stored in two separate files:

`.env.mongoURI.dev` (development / production)  
`.env.mondoURI.test` (for running the test suite)

Format of .env file:

```
MONGO_URI=mongodb+srv://<username>:<password>path.to.server/<db_name>?<options>
```

When running as a local instance the port will default to 10000. This can be changed by setting a PORT environment variable. Alternatively the default value can be changed in the listener.js file.

### Scripts:

To run a local instance of the backend:

`npm run start`

To seed the development/production database:

`npm run seed`

To run the test suite:

`npm test`

The test script uses Jest.

### Live instance:

A live instance of this backend is running on render and can be found [here](https://grub-group-project.onrender.com)

## API Endpoints

The following endpoints are available to unauthenticated requests:

**POST (/api/users)**

Use this endpoint to create a new user account. Requires the following parameters (JSON) :

- username (string value)
- password (string value)
- Location (in Lat./Long e.g. {latitude: 50.00, longitude: 2.0304})
- contact (string value)

The following endpoints are available to authenticated requests:

**GET (/api/users/:username)** - Returns a users details (excluding password and salt)  
**GET (/api/items)** - Returns a JSON with an array of items and total_items (the total number of items in the container)  
This end point accepts the following queries:

- limit - the maximum number of items to return (defaults to 100)
- page - the page to show, defaults to 0

**GET (/api/items/:lat/:long)** - Return a JSON with an array of items within 5 miles of the lat/long and includes a distance field (in meters) and toal_items (the total number of items that fall within the range)  
This end point accepts the following queries:

- range - (in meters) defaults to 8 statue miles
- desc - defaults to false (items are returned in ascending order)
- limit - the maximum number of items to return (defaults to 100)
- page - the page to show, defaults to 0

**GET (/api/items/:lat1/:long1/:lat2/:long2)** Returns an array of items within the region bounded by the bottom left (lat1/long1) and top right (lat2/long2) co-ordinates  
**GET (/api/items/:\_id)** - Returns the details of a single item  
**GET (/api/categories)** - Returns an array of categories

**DELETE (/api/items/:\_id)** - Deletes the item with corresponding \_id

**POST (/api/auth)** - POST used for authentication  
**POST (/api/items)** - POST used to create a new item
