# Streaming_test_task
# Name of the project:
    Backend Developer Home Assessment
    Streaming Content API


## Part 1 — Fix the Broken Auth Middleware 
For the first assignment i've noticed these 3 bugs:
1. No verification of the content/value of authHeader before the split function is applied on it. It could be undefined or not existing causing an error because it's not possible to use the split function on an undefined value. The fix is to check it's value after the assignment.
2. Similarly to the first bug, there is no check if the token value exists which would cause the same error as the previous. The fix is again to check it's value once the split function has finished.
3. The error is in the if(err) block since the code will continue working even if there's an err value, while it should return the res.json and finish it's execution there. The fix i applied is simply to delete the next() and add an inline return before the res.status(401).json()



## Installazione

Istruzioni per installare il progetto.

## Uso

Come avviare o usare il progetto.

## API / Funzionalità

Elenco delle funzioni principali.

## Struttura del progetto

Spiegazione delle cartelle.

## Licenza

Tipo di licenza (MIT, GPL, ecc.)
