// bookClient.js
// Node.js client implementing the assignment tasks using axios.
// Usage: node bookClient.js
// Set BASE_URL to your API root.

// Required packages: axios
// Install: npm install axios

const axios = require('axios');

// -- CONFIGURE THIS --
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'; // change to your API
// ----------------------

/**
 * Utility axios instance
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

/**
 * TASK 1: Get the book list available in the shop. - General user
 * GET /books
 */
async function getBookList() {
  const res = await api.get('/books');
  return res.data;
}

/**
 * TASK 2: Get the books based on ISBN. - General user
 * GET /books/isbn/:isbn
 */
async function getBookByISBN(isbn) {
  const res = await api.get(`/books/isbn/${encodeURIComponent(isbn)}`);
  return res.data;
}

/**
 * TASK 3: Get all books by Author. - General user
 * GET /books/author/:author
 */
async function getBooksByAuthor(author) {
  const res = await api.get(`/books/author/${encodeURIComponent(author)}`);
  return res.data;
}

/**
 * TASK 4: Get all books based on Title - General user
 * GET /books/title/:title
 */
async function getBooksByTitle(title) {
  const res = await api.get(`/books/title/${encodeURIComponent(title)}`);
  return res.data;
}

/**
 * TASK 5: Get book Review - General user
 * GET /books/:isbn/reviews
 */
async function getBookReviews(isbn) {
  const res = await api.get(`/books/${encodeURIComponent(isbn)}/reviews`);
  return res.data;
}

/**
 * TASK 6: Register New user – 3 Points
 * POST /auth/register { username, password }
 */
async function registerUser(username, password) {
  const res = await api.post('/auth/register', { username, password });
  return res.data; // expect success message or user object
}

/**
 * TASK 7: Login as a Registered user - 3 Points
 * POST /auth/login { username, password } => { token }
 */
async function loginUser(username, password) {
  const res = await api.post('/auth/login', { username, password });
  // Expect the backend to return a JWT or token in res.data.token
  return res.data;
}

/**
 * TASK 8: Add/Modify a book review (Registered Users) - 2 Points
 * POST /books/:isbn/review { rating, review } (add)
 * PUT  /books/:isbn/review { rating, review } (modify)
 *
 * Both endpoints require Authorization header: Bearer <token>
 */
async function addOrUpdateReview(isbn, token, { rating, review }) {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  // Try to POST (add). If your API uses PUT for both add/modify, modify accordingly.
  try {
    const res = await api.post(
      `/books/${encodeURIComponent(isbn)}/review`,
      { rating, review },
      config
    );
    return res.data;
  } catch (err) {
    // If server expects PUT for update, try PUT as fallback
    if (err.response && err.response.status === 409) {
      const res = await api.put(
        `/books/${encodeURIComponent(isbn)}/review`,
        { rating, review },
        config
      );
      return res.data;
    }
    throw err;
  }
}

/**
 * TASK 9: Delete book review added by that particular user - Registered Users
 * DELETE /books/:isbn/review (auth)
 */
async function deleteReview(isbn, token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const res = await api.delete(`/books/${encodeURIComponent(isbn)}/review`, config);
  return res.data;
}

/**
 * ----------
 * NODE.JS program with 4 methods (Tasks 10-13)
 * Use Async/Await or Promises with Axios in Node.js for all four methods.
 * ----------
 */

/**
 * TASK 10: Get all books – Using async callback function – 2 Points
 * We'll implement an async function that accepts a callback(err, data).
 */
function getAllBooksCallback(callback) {
  // Use an IIFE async to allow await inside and then call the callback
  (async () => {
    try {
      const res = await api.get('/books');
      // first arg null for no error, second arg is data per Node callback convention
      callback(null, res.data);
    } catch (err) {
      callback(err);
    }
  })();
}

/**
 * TASK 11: Search by ISBN – Using Promises – 2 Points
 * Return an explicit Promise that resolves to book data or rejects with error
 */
function searchByISBNPromises(isbn) {
  return new Promise((resolve, reject) => {
    api
      .get(`/books/isbn/${encodeURIComponent(isbn)}`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

/**
 * TASK 12: Search by Author – using async/await – 2 Points
 */
async function searchByAuthorAsync(author) {
  const res = await api.get(`/books/author/${encodeURIComponent(author)}`);
  return res.data;
}

/**
 * TASK 13: Search by Title – using async/await – 2 Points
 */
async function searchByTitleAsync(title) {
  const res = await api.get(`/books/title/${encodeURIComponent(title)}`);
  return res.data;
}

/**
 * Example usage (you can comment/uncomment to run the parts you want)
 *
 * NOTE:
 * - For registered actions, loginUser returns token object. Adapt to your backend response shape.
 */
async function exampleRun() {
  try {
    console.log('BASE_URL =', BASE_URL);

    // TASK 10: getAllBooksCallback
    getAllBooksCallback((err, books) => {
      if (err) {
        console.error('Callback error (getAllBooks):', err.message || err);
      } else {
        console.log('Task 10 - All books (callback):', Array.isArray(books) ? `${books.length} books received` : books);
      }
    });

    // Wait a little to avoid interleaving prints badly (not required)
    await new Promise((r) => setTimeout(r, 300));

    // TASK 11: searchByISBNPromises
    const isbnSample = '9783161484100';
    searchByISBNPromises(isbnSample)
      .then((book) => {
        console.log(`Task 11 - Book for ISBN ${isbnSample}:`, book);
      })
      .catch((err) => {
        console.error('Task 11 error (searchByISBNPromises):', err.response?.data || err.message || err);
      });

    // TASK 12: searchByAuthorAsync
    const authorSample = 'J. K. Rowling';
    const booksByAuthor = await searchByAuthorAsync(authorSample);
    console.log(`Task 12 - Books by "${authorSample}":`, Array.isArray(booksByAuthor) ? `${booksByAuthor.length} results` : booksByAuthor);

    // TASK 13: searchByTitleAsync
    const titleSample = 'The Great Gatsby';
    const booksByTitle = await searchByTitleAsync(titleSample);
    console.log(`Task 13 - Books with title "${titleSample}":`, Array.isArray(booksByTitle) ? `${booksByTitle.length} results` : booksByTitle);

    // Example: Register + Login + Add Review + Delete Review
    const username = `testuser_${Date.now()}`;
    const password = 'Test@123';

    // TASK 6 & 7: Register then Login
    try {
      const registerRes = await registerUser(username, password);
      console.log('Task 6 - registerUser response:', registerRes);
    } catch (err) {
      console.warn('Register error (maybe user exists):', err.response?.data || err.message);
    }

    const loginRes = await loginUser(username, password);
    console.log('Task 7 - loginUser response:', loginRes);
    const token = loginRes.token || loginRes.accessToken || null;
    if (!token) {
      console.warn('No token returned from login; aborting auth-only tasks (8/9).');
      return;
    }

    // TASK 8: Add/Modify a book review (for the sample isbn)
    const reviewRes = await addOrUpdateReview(isbnSample, token, {
      rating: 5,
      review: 'Excellent book! Test review added via client.'
    });
    console.log('Task 8 - addOrUpdateReview response:', reviewRes);

    // TASK 9: Delete the review
    const deleteRes = await deleteReview(isbnSample, token);
    console.log('Task 9 - deleteReview response:', deleteRes);
  } catch (err) {
    console.error('exampleRun error:', err.response?.data || err.message || err);
  }
}

// If run directly, execute exampleRun
if (require.main === module) {
  exampleRun();
}

// Export functions for tests or import in other modules
module.exports = {
  getBookList,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getBookReviews,
  registerUser,
  loginUser,
  addOrUpdateReview,
  deleteReview,
  getAllBooksCallback,
  searchByISBNPromises,
  searchByAuthorAsync,
  searchByTitleAsync
};
