# Backend for fintech app

This is the server side for the application

## Technologies used in building this product

This product was built with **Nodejs**, **Expressjs**, **TypeScript**, **Postgres DB**,
**TypeOrm(ORM)** and a **RESTful api architecture**

## Setup

Clone the repository, then in the root project directory run **yarn** to install all dependencies, After installation create a **.env**(Environment Variables) file in the project root directory and store the following keys in there

**PORT = <9090> or Your port number**

**PAY_STACK_SECRET_KEY = Your paystack key**

**JWT_SECRET = Jwt secret should ideally be a long string value**

After adding those values create another file also in the root of your project and name it
**ormconfig.json** then add the following configurations to the file

```
{
  "type": "postgres",
  "host": "localhost",
  "port": <Your DB PORT>,
  "username": "<Your DB USERNAME>",
  "password": "<DB Password>",
  "database": "<DB NAME>",
  "synchronize": true,
  "logging": false,
  "entities": ["src/entity/**/*.ts"],
  "migrations": ["src/migration/**/*.ts"],
  "subscribers": ["src/subscriber/**/*.ts"],
    "cli": {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/migration",
    "subscribersDir": "src/subscriber"
  }
}
```

Make sure you have typeOrm and postgres database properly installed on your system

#### Start server

Run **yarn dev** in the root project directory to start the server in development

#### Testing Apis

Go to the link **https://documenter.getpostman.com/view/7155040/U16kr5WS#2bebd9b3-def8-498d-baf3-1d6d5f021b6e** to see the postman documentation.

#### Running tests

There are a few Apis you can run to test key functionalities

**${base_url}/create_user** you should create 2 or more accounts to test especially to test with different users

**${base_url}/login** You can use this endpoint to switch between user acounts if you want to test with another user, As this endpoint returns a token as response and is passed automatically in the request headers

**${base_url}/add_acct_number** use this to update user account with account number

**${base_url}/fund_account** You can use this to fund a user account by transferring money from their profile if a card was used they are stored in the DB so the user can use those cards for subsequent transactions. They are Apis to fetch user cards along with funding account using an already saved card

**${base_url}/transfer_funds** Transfering funds from one user account to another

**${base_url}/withdraw_funds** Withdraw funds from user account to their bank account

#### Potential Improvements

Timestamps were not stored in some tables..Tables should ideally have timestamp fields to query data in whatever order we want

###### Unit tests

At the point of writing this README unit test have not been added, Though i plan on adding them in the near future
