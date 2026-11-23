# Exercise 1 –: Create the client with Vite

## Question 1: Your project now has two package.json files: one for the API and one for the client. Why? What would go wrong if you installed React in the API's package.json?

- Answer:

We have two package.json files because the frontend and backend are separate applications with different dependencies. The backend uses packages like Express and Sequelize, while the frontend uses React and Vite. Installing React in the backend's package.json would mix frontend and backend dependencies and make the project less organized.

## Question 2: What does Vite do for you while you run npm run dev? Try changing a text in App.tsx and saving. What happens in the browser?

- Answer:

Vite starts a development server that allows us to run and test our React application in the browser. It also updates the browser automatically when we change and save our code. This means we can see our changes immediately without restarting the server.

# Exercise 2: Fetch the books and fix CORS

### Question 1: What is CORS, and why did the browser block the request? Why did the same request work fine in Postman?

- Answer: CORS stands for Cross-Origin Resource Sharing. It is a security system that controls which websites can access a server. The browser blocked my request because my frontend was running on port 5174, while my backend initially allowed requests only from port 5173. The same request worked in Postman because Postman does not follow the browser's CORS security rules.

### Question 2: Why do we write `origin: "http://localhost:5173"` instead of allowing every origin? What would you have to change when the frontend is put online?

- Answer: We specify an origin to allow only our own frontend to access the backend. This makes the application more secure because not every website can send requests to our API through a browser. When the frontend is put online, I would have to change the origin to the actual URL of my deployed frontend.

# Exercise 3: Show the books on the page

### Question 1: Why does React need a key on every item in a list? Why is book.id a better key than the index, especially once you can delete books?

- Answer: React needs a key to identify each item in a list. It helps React keep track of items when the list changes. book.id is better than the index because every book has a unique ID that stays the same. If we delete a book, the indexes of the other books can change, which can confuse React and cause it to update the wrong item.

### Question 2: Explain in your own words what useState and useEffect do in this component. What would happen if you removed the empty array [] from useEffect?

- Answer: useState stores information that can change, such as the list of books and authors. When the state changes, React updates the page. useEffect is used to fetch the books and authors from the API when the component first loads. The empty array [] makes the effect run only after the first render (apart from an extra development run in StrictMode). If we remove the empty array, the effect runs after every render. This would cause repeated API requests because fetching the data updates the state and makes the component render again.

## Exercise 4: Add a book with POST

## Question 1: What does event.preventDefault() do? Remove it and test. What happens, and why?

- Answer: event.preventDefault() stops the browser from doing its default form submission. Without it, the browser reloads the page when the form is submitted. This can interrupt the React application and clear the form state. We use it because we want React to handle the submission and send the data to the API using Axios.

## Question 2: Why does the dropdown use the author's id as value and not the name? What could go wrong if the user typed the author_id by hand?

- Answer: The dropdown displays the author's name so it is easy for the user to understand, but it sends the author's ID to the API. The ID uniquely identifies the author in the database. If the user typed the ID by hand, they could enter an incorrect ID or an ID that does not belong to an existing author.

## Question 3: Your book rules now live in two places. What could go wrong when someone changes one and forgets the other? Can you think of a way to keep them in one place?

- Answer: If someone changes the validation rules in the backend but forgets to update the frontend, the two sides might validate books differently. The frontend might accept information that the backend rejects. One solution is to keep the schemas in a shared folder or separate shared package and import the same schema in both the frontend and backend.


# Exercise 5: Delete a book with DELETE



### Question: Explain what books.filter((book) => book.id !== id) does, step by step. Why do we make a new array instead of removing the book from the old one?

- Answer:
1. books is the array containing all the books.
2. .filter() checks each book in the array.
3. (book) => book.id !== id checks whether the book's ID is different from the ID we want to delete.
4. If the IDs are different, the book stays in the result.
5. If the IDs are the same, the book is left out.
We create a new array because React works best when we update state without changing the original array. React can detect the new array and update the page correctly. This is called immutability.


### Question: What happened when you deleted a book with a loan, and why? What should the user see on the page in that case?

- Answer:

When I tried to delete book number 5, the API returned the message "Error deleting book". The book was not deleted and remained in the database.

This happened because the book had an active loan. The database uses a foreign key constraint (ON DELETE RESTRICT) to prevent deleting books that are borrowed.

The user should see a clear message on the page, for example:

"This book cannot be deleted because it has an active loan."

The book should remain visible in the book list.


# Exercise 6: Edit a book with PUT


### Question: What's the difference between PUT and PATCH? What happens with PUT if the client forgets to send genre? And with PATCH?
- Answer: PUT replaces all the fields of a book, so the client must send all required fields. If the client forgets to send genre, the API returns a 400 Bad Request error because the field is required.

PATCH updates only the fields that are sent. If the client forgets to send genre, the existing genre stays unchanged.


### Question: Why does the edit form fit PUT better than PATCH? Can you think of a button on the page where PATCH would fit better?
- Answer: The edit form fits PUT better because it contains all the book fields, and when the user clicks Save, the complete book information is sent to the API.

PATCH would fit better for a button that changes only one field, for example, a button that changes a book's status from available to unavailable without changing its title, genre, or author.