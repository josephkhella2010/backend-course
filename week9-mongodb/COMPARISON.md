# MongoDB: Referencing vs. Embedding

## Referencing

Referencing stores the ID of another document.

Example from this project: a book references an author using an ObjectId.

```js
author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Author"
}
```

**Advantages**

- Avoids duplicating author information across many books.
- Author information can be updated in one place.
- Useful when multiple books share the same author.

**Disadvantages**

- May require additional queries or Mongoose `populate()`.
- Retrieving related data can be more complex.

## Embedding

Embedding stores related information directly inside a document.

Example:

```js
const bookSchema = new mongoose.Schema({
  title: String,
  author: {
    name: String,
    birthYear: Number,
  },
});
```

**Advantages**

- Related information can be retrieved in one query.
- Simple when related data is small and belongs to one document.

**Disadvantages**

- Author information may be duplicated across books.
- Updating duplicated information can be difficult.
- Documents can grow larger.

## Conclusion

Referencing is a good choice when authors can write multiple books and their information should be maintained in one place. Embedding can be useful when related information is small, rarely changes, and is usually accessed together with its parent document.
