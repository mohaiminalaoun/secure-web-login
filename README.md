# secure-web-login
A secure web login implemented using MongoDB, Node, Express and Crypto.

This Node application allows users to signup with a username and a password. The server hashes the password with crypto's sha512 hash, and calculates a unique salt for each username, and this info is used to create a new user account. This account is saved in the Mongo database.
