# Swedish Riksdag Parties CRUD API

A simple CRUD API built with **Node.js, TypeScript, and Express**.
The API stores Swedish Riksdag parties in an in-memory array.

## Routes

| Method | Route                  | Description     | Status |
| ------ | ---------------------- | --------------- | ------ |
| GET    | `/parties`             | Get all parties | 200    |
| POST   | `/parties`             | Create a party  | 201    |
| PUT    | `/parties/:id`         | Update a party  | 200    |
| DELETE | `/parties/:id`         | Delete a party  | 200    |
| GET    | `/parties/seats-total` | Get total seats | 200    |

## POST Example

{
"name": "Example Party",
"leader": "Example Leader",
"seats": 10
}

Returns `400 Bad Request` if `name` or `leader` is missing.

## PUT Example

{
"name": "Updated Party",
"leader": "New Leader",
"seats": 20
}

Returns `404 Not Found` if the party does not exist.

## Testing

All routes were tested using **Postman**, including successful requests and error cases.

## Run

npm install
npm run dev

## Branch

week5/http-express-crud
