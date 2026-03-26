# Streaming_test_task
# Name of the project:
    Backend Developer Home Assessment
    Streaming Content API


## Part 1 - Fix the Broken Auth Middleware 
For the first assignment i've noticed these 3 bugs:
1. No verification of the content/value of authHeader before the split function is applied on it. It could be undefined or not existing causing an error because it's not possible to use the split function on an undefined value. The fix is to check it's value after the assignment.
2. Similarly to the first bug, there is no check if the token value exists which would cause the same error as the previous. The fix is again to check it's value once the split function has finished.
3. The error is in the if(err) block since the code will continue working even if there's an err value, while it should return the res.json and finish it's execution there. The fix i applied is simply to delete the next() and add an inline return before the res.status(401).json()


## Part 2 - Streaming Content API
The performance problem is cause by the rows with await ... findAll() and the filter, because the findAll loads all the table from the database which, in case of a large amount of data, can require some time and also the await blocks the route until it receives the answer. In the end the effects of this issue is that, depending on the size of the DB, the call could end in timeout, the server can eventually crash and the whole application will be slowed down.

To solve this, the solution could be to filter the results from the beginning and to add a pagination by adding a limit.




