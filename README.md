# Scooter Rent Simple
## Description
A minimalistic project that allows users to rent scooters. 

## Features
- Users can rent only one scooter at a time.
- A scooter can only be rented by one user at a time.
- Only administrators have the permissions to add or modify scooter details.
- Users can only return their own rental orders.
- All users can view the current list of available scooters.

## Installation

```bash
$ npm install
```
### Environment Configuration
For different environments, the application uses different environment files:

- Development: .env.development
- Testing: .env.test

with
```
DB_NAME=
API_PREFIX=
SESSION_SECRET=
```

## Running the app

```bash
# development
$ npm run start
```

## Test

```bash
# unit tests
$ npm run test:watch

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Technologies Used
- NestJS for building efficient and scalable server-side applications.
- TypeORM as an ORM to handle database operations.
- SQLite as the database.
- Class-transformer and class-validator for validation and transformation of data.
## License

Nest is [MIT licensed](LICENSE).
