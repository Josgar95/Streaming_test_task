# Streaming_test_task

# Name of the project:
    Backend Developer Home Assessment
    Streaming Content API

## 1. Setup Instructions & Database Schema
### Prerequisites
Before running the project, ensure the following tools are installed:
- **Node.js** (v18 or later recommended)
- **npm**
- **PostgreSQL** installed locally
- **pgAdmin** (optional, for managing the database visually)
- **VS Code** or any preferred editor

### Repository cloning
```bash
git clone <repo-url>
cd <name-project-folder>

Install Dependencies
- npm install

Environment Configuration
- create a .env file in the project root with the following lines:
PORT=3000
PGUSER=<your_postgres_user>
PGPASSWORD=<your_postgres_password>
PGHOST=localhost
PGPORT=5432
PGDATABASE=streaming_db
JWT_SECRET=your_jwt_secret_here

Replace <your_postgres_user> and <your_postgres_password> with your actual PostgreSQL credentials.

Database Setup
- The project uses a PostgreSQL database named streaming_db.
You can create it using pgAdmin or the PostgreSQL CLI:
- CREATE DATABASE streaming_db;
The application uses two tables: users and streaming_content.
Table users:
    - id --> type:serial, primary key
    - email --> type:varchar, unique (required)
    - password_hash --> type:varchar, hashed password
    - created_at --> type:timestamp, default:now()

Table streaming_content:
    - id --> type:serial, primary key
    - title --> type:varchar,  required
    - description --> type:text,  required
    - thumbnail_url --> type:text,  required
    - video_url --> type:text,  required
    - created_at --> type:timestamp, default:now()
    - updated_at --> type:timestamp, default:now()

Start the server
- node index.js

The server runs on port 3000.  
The available endpoints are exposed under `/api/*` and the API documentation is available at `/docs`
Swagger UI:
- http://localhost:3000/docs
to test the APIs

## 2. Authentication Flow
This project uses **JWT (JSON Web Tokens)** for authentication.  
All protected endpoints require a valid JWT passed through the `Authorization` header.

## 2.1 User Registration (Required Before Login)
Before logging in, a user must exist in the database.
You can create a user in one of the following ways:

### **Option A - Using the registration endpoint**
POST /api/auth/register

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "your_password"
}

### **Option B - Create the user manually in pgAdmin:
INSERT INTO users (email, password_hash)
VALUES ('user@example.com', '<hashed_password>');

Note: The password must be hashed using the same hashing algorithm used in the application (bcrypt).

### Login Endpoint
To obtain a token, send a POST request to:
POST /api/auth/login

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "your_password"
}

#### Successful Response
{
  "token": "<jwt_token_here>"
}

The token is signed using the secret defined in your .env file
- JWT_SECRET=your_jwt_secret_here

Using the Token
All protected endpoints require the following header:
- Authorization: Bearer <jwt_token_here>

You can authenticate directly from the Swagger UI:
Step 1 — Login via Swagger
- Open /docs
- Locate the POST /api/auth/login endpoint
- Click Try it out
- Enter your email and password
- Click Execute
- Copy the returned JWT token

Step 2 — Authorize Swagger
- Click the Authorize button (top-right)
- Paste the token in the field as:
    Bearer <jwt_token_here>
- Click Authorize
Swagger will now automatically attach the token to all protected requests.

Step 3 — Call Protected Endpoints
You can now use Try‑It‑Out on any protected route.
If the token is valid, the request will succeed.
If the token is missing or invalid, the API returns:
401 Unauthorized

## 3. How to Run Tests
This project includes automated tests written using **Jest** and **Supertest**.  
The test suite covers authentication, protected routes, and CRUD operations for streaming content.

### Install Dev Dependencies
If not already installed, ensure the following dev dependencies are present:
```bash
npm install --save-dev jest supertest

### Running the Test Suite
To execute all tests:
 - npm test

Jest will automatically detect all test files inside the tests/ directory (or any file ending with .test.js)
The tests run against the same PostgreSQL database used for development.

### Important:
Running the test suite will insert and delete data from the database.
It is recommended to use a clean database before running tests.
The tests rely on the environment variables defined in your main .env file

The test suite includes:
 Authentication
- Login with valid credentials
- Login with invalid credentials
- Missing fields
- Token generation
 Protected Routes
- Access without token → 401 Unauthorized
- Access with invalid token → 401 Unauthorized
- Access with valid token → success
 Streaming Content CRUD
- Create new streaming content
- Fetch all content
- Fetch by ID
- Update content
- Delete content
- Validation errors
- Not found errors
 Error Handling
- Invalid payloads
- Missing required fields
- Database errors 

You can run a specific test file using
npx jest tests/<fileName>.test.js

## 4. Minimal UI (Swagger UI)

This project uses **Swagger UI** as the minimal interface for interacting with the API  
(**Option A** from the assessment requirements).

Swagger provides an interactive environment where reviewers can:

- explore all available endpoints  
- read request/response schemas  
- authenticate using JWT  
- execute API calls directly from the browser  

---

### Accessing Swagger UI
Once the server is running, open:
- http://localhost:3000/docs


This page displays the full OpenAPI documentation and allows interactive testing.

---

## 4.1 Using Swagger UI
### Step 1 — Register a User (if required)

If you wish to create your own new user, the `/api/auth/register` endpoint is available:

1. Open the **Auth** section  
2. Select **POST /api/auth/register**  
3. Click **Try it out**  
4. Provide an email and password  
5. Execute the request  

Otherwise you can create the user manually in PostgreSQL.

---

### Step 2 — Login to Obtain a JWT

1. Open **POST /api/auth/login**  
2. Click **Try it out**  
3. Enter your email and password  
4. Execute the request  
5. Copy the returned token from the response body  

Example response:

```json
{
  "token": "<jwt_token_here>"
}

### Step 3 — Authorize Swagger
- Click the Authorize button (top-right)
- Paste the token in the field as
Bearer <jwt_token_here>
- Click Authorize
- Close the modal
Swagger will now automatically attach the token to all protected endpoints.

You can now use Try it out on any protected route, such as:
- GET /api/streaming
- POST /api/streaming
- PUT /api/streaming/{id}
- DELETE /api/streaming/{id}
If the token is valid, the request will succeed.
If the token is missing or invalid, the API will return:
- 401 Unauthorized


## 7. Key Decisions

This section highlights the most important technical decisions made during the development of the project, including the alternatives considered and the tradeoffs involved.

---

### **Decision 1 — Using Manual SQL Queries Instead of an ORM**

**Choice:**  
The project uses **manual SQL queries** (via `pg` library) instead of an ORM such as Sequelize.

**Why:**  
- Full control over the SQL being executed  
- Easier to debug queries step-by-step  
- No abstraction layer hiding what happens under the hood  
- Faster iteration when adjusting filters, joins, or conditions  

**Alternatives Considered:**  
- Sequelize  
- TypeORM  

**Tradeoffs:**  
- Requires deeper SQL knowledge  
- Validation and model structure must be handled manually  

Despite the tradeoffs, manual queries provided the flexibility needed for this project.

---

### Decision 2 — Using JWT for Authentication

**Choice:**  
The project uses **JWT (JSON Web Tokens)** for authentication.

**Why this choice:**  
I previously worked with token‑based authentication, and JWT was already shown in the course examples.  
Additionally, JWT is explicitly required for Part 3 of the assessment, so choosing it ensured consistency with the project requirements.

**Benefits of JWT:**  
- Stateless authentication (no session storage needed)  
- Easy to attach to requests via `Authorization: Bearer <token>`  
- Well‑supported in Node.js  
- Integrates seamlessly with Swagger UI  
- Works perfectly for REST APIs  

---

### Alternatives Considered

#### **1. Manual Token Generation (Custom String Tokens)**
This would involve:
- Generating random strings manually  
- Storing them in a database table  
- Validating them on each request  
- Expiring or revoking them manually  

**Pros:**  
- Full control over token lifecycle  
- Simple to understand conceptually  

**Cons:**  
- Requires a database lookup on every request  
- Requires building your own expiration logic  
- Requires building your own revocation logic  
- Much more code to maintain  
- Less secure unless implemented very carefully  

**Why not chosen:**  
It adds unnecessary complexity and is less secure than JWT unless implemented with great care.

---

#### **2. Server‑Side Sessions**
Using express‑session or similar.

**Pros:**  
- Easy to revoke sessions  
- Centralized session store  

**Cons:**  
- Requires server‑side storage (Redis, DB, memory)  
- Not ideal for stateless REST APIs  
- Harder to integrate with Swagger  

**Why not chosen:**  
The project is API‑only and stateless; sessions would add overhead without real benefit.

---

#### **3. OAuth2 / External Identity Providers**
Examples: Google, GitHub, Auth0.

**Pros:**  
- Very secure  
- No password handling in the backend  

**Cons:**  
- Overkill for this project  
- Requires external configuration  
- Not aligned with the assessment requirements  

**Why not chosen:**  
Too complex for the scope of the assignment.

---

### Tradeoffs of Using JWT

- Token revocation is not built‑in  
- Requires careful handling of secret keys  
- Token size is larger than a simple session ID  
- Expired tokens must be handled explicitly  

Despite these tradeoffs, JWT provided the best balance between **simplicity**, **security**, **compatibility with the assessment**, and **developer experience**.

### Decision 3 — Choosing PostgreSQL as the Database

**Choice:**  
The project uses **PostgreSQL** as the primary database.

**Why this choice:**  
PostgreSQL is explicitly included in the assessment’s required stack, so adopting it ensures full alignment with the expected technologies.  
I also preferred PostgreSQL because I already had experience with relational databases, and it provides a very predictable and robust environment for building APIs that require structured data, authentication, and filtering logic.

PostgreSQL offers strong relational integrity, excellent performance for filtered queries, and advanced indexing options — all essential for the Streaming Content API.  
Its behavior is consistent, easy to debug, and well‑suited for manual SQL queries, which I chose to use throughout the project.

---

### Why PostgreSQL is Preferable to SQL Server

Although i've considered SQL Server as an alternative, PostgreSQL is a better fit for this project for several reasons:

#### **1. PostgreSQL is open‑source and lightweight to set up**
SQL Server is enterprise‑grade but heavier, more resource‑intensive, and often requires a more complex installation process.  
PostgreSQL is easier to install, configure, and run locally — ideal for an assessment project.

#### **2. PostgreSQL integrates more naturally with the Node.js ecosystem**
The `pg` library is lightweight, stable, and widely used.  
SQL Server requires additional drivers and configuration, and its tooling is less common in Node.js projects.

#### **3. PostgreSQL excels at complex queries and indexing**
PostgreSQL supports:
- functional indexes  
- advanced filtering  
- powerful query planning  
- native JSONB support  

These features make it ideal for search, filtering, and performance optimization — all required in the Streaming Content API.

SQL Server is strong too, but PostgreSQL offers these features with less overhead and more flexibility for developers.

#### **4. PostgreSQL aligns with the assessment’s expectations**
Since PostgreSQL is explicitly listed in the required stack, using SQL Server would have been a deviation from the guidelines and potentially confusing for reviewers.

---

### Tradeoffs

- Requires installation and configuration  
- Schema migrations must be handled manually  
- Slightly more setup than a lightweight DB like SQLite  

Despite these tradeoffs, PostgreSQL offered the best balance of **reliability**, **performance**, **developer experience**, and **alignment with the assessment requirements**.


### **Decision 4 — Using Swagger UI as the Minimal Interface**

**Choice:**  
The project uses **Swagger UI** as the minimal UI required by the assessment.

**Alternatives Considered:**  
- Custom HTML/JS frontend  
- Postman collections  

**Why Swagger UI:**  
- Fully satisfies the assessment requirement  
- Allows reviewers to authenticate and test endpoints easily  
- Automatically documents request/response schemas  
- Integrates seamlessly with JWT authentication  

**Tradeoffs:**  
- Not a user-facing interface  
- Requires maintaining OpenAPI annotations  
- Limited customization compared to a full frontend  


## 8. Bug Fix Documentation

This section documents the main bugs identified during development and the fixes applied.  
It includes issues related to the **authentication middleware** and **performance problems** in the Streaming Content API.

---

# Part 1 — Fixing the Broken Auth Middleware

During the first assignment, three issues were identified in the authentication middleware:

---

### **Bug 1 — Missing Validation of `authHeader` Before Splitting**

**Issue:**  
The middleware attempted to execute `authHeader.split(" ")` without verifying whether `authHeader` actually existed.  
If the header was missing or undefined, this caused a runtime error because `.split()` cannot be called on `undefined`.

**Fix:**  
A defensive check was added immediately after reading the header:

- If `authHeader` is missing → return `401 Unauthorized`
- Only proceed to `.split()` when the header is valid

**Result:**  
The server no longer crashes when the header is missing, and the client receives a proper `401` response.

---

### **Bug 2 — Missing Validation of the Extracted Token**

**Issue:**  
Even when `authHeader` existed, the extracted token could still be `undefined` (e.g., malformed header).  
Calling `jwt.verify()` on an undefined token caused another runtime error.

**Fix:**  
After splitting the header, the middleware now checks whether the token exists.  
If not, it returns `401 Unauthorized`.

**Result:**  
Malformed or incomplete Authorization headers are handled gracefully.

---

### **Bug 3 — Incorrect Error Handling Inside `jwt.verify()`**

**Issue:**  
Inside the `jwt.verify()` callback, the code checked `if (err)` but still executed `next()` afterward.  
This meant that even when verification failed, the request continued to the protected route.

**Fix:**  
Removed the `next()` call inside the error block and added an inline `return` before sending the `401` response.

**Result:**  
Invalid tokens now correctly stop the request flow and return a proper error.

---

# Part 2 — Streaming Content API Performance Fixes

Two performance issues were identified in the Streaming Content API implementation.

---

### **Bug 4 — Using `findAll()` and Filtering in Memory**

**Issue:**  
The original implementation used:

```js
await StreamingContent.findAll();

followed by filtering in JavaScript.
This caused:
- The entire table to be loaded into memory
- Slow response times on large datasets
- Potential timeouts
- Increased memory usage
- Risk of server slowdown or crash
Fix:
- Move filtering logic into the database query itself.
- Let PostgreSQL handle the filtering using WHERE clauses.
Result:
- Faster queries
- Lower memory usage
- Better scalability
- No unnecessary data transfer from DB to Node.js

### Bug 5 — Lack of Pagination (Optional but Recommended)
Issue:
- Returning all rows at once does not scale.
- Even with filtering, large datasets can still cause slow responses.
Fix:
- Implement pagination using LIMIT and OFFSET.
Result:
- Improved performance
- Predictable response sizes
- Better user experience for large datasets
