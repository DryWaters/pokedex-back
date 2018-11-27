# Pokedex Backend API Project
Pokedex Backend API Node/Express application that uses Postgres and Redis (for
caching) database to serve Pokemon data that can be used with the frontend 
companion React application for retrieving information on Pokemon 1-807.

The project was one half of the end of the year CS 160 (Software Engineering)
project.

* [Instructions](#instructions)
* [Getting Started](#getting-started)
* [Prerequisites](#prerequisites)
* [Built With](#built-with)
* [Contributing](#contributing)
* [Example](#example)
* [Authors](#authors)

## Instructions

1. Install or Enable a remote Postgres/Redis DB, ex. Heroku application
2. Create a database inside Posgres for the Pokemon data location
3. Create a .env file.  Includes DB login information and which DB name

``` Shell
#Example of .env file

DB_HOST=localhost
DB_USER=postgres
DB_PASS=password
DB_DATABASE=pokemon
DB_PORT=5432

LOCAL=TRUE
REBUILD_DATA=TRUE
DATABASE_URL=postgres://somePostgresUrl
REDIS_URL=redis://someRedisURL

```

4. Install NPM Packages using ``` npm install ```
5. Run with ``` npm start ```

Pokemon data is stored locally in CSV files, and upon start up with the flag
REBUILD_DATA=TRUE, it will parse the CSV files and load the data into the
selected database.  The information only needs to be rebuilt once, and can
be set to FALSE to speed up start up times.

## Getting Started
All needed NPM packages are included in the package.json file. 

If you are using with a Heroku application, the application will pull
from the environment variables the DATABASE_URL and REDIS_URL without being
set within your .env files.

## Prerequisites
All needed NPM packages are included in the package.json file.

Local or remote PostGres and Redis (for caching) database URL to start the 
application.

## Built With
[NodeJS](https://nodejs.org/en/)

[ExpressJS](https://expressjs.com/)

[csv-parser](https://github.com/mafintosh/csv-parser)

[pg-promise](https://github.com/vitaly-t/pg-promise)

and other great NPM packages.  See package.json for full list.

Pokemon data is from publically available data from places such as 
[PokeAPI](https://pokeapi.co/)

## Contributing
Feel free to fork into your own repo to add additional features.

## Example
As of this writing an example of the application can be located at:

Frontend Application
https://pokedex-e972f.firebaseapp.com/

Backend Application
https://pokedex-backend-server.herokuapp.com/

Public API Documentation is located at 
https://documenter.getpostman.com/view/5517807/RzZFBvca

## Authors
[Daniel Waters](https://www.watersjournal.com)

[Hovsep Lalikian](mailto:hovsep.lalikian@sjsu.edu)

