## Instructions

Determine an endpoint for each of the following use cases. Don't worry about
getting it perfect as this is just practice!

For example, to access the home page of a site, the RESTful endpoint could be
`GET /` or `GET /home`.

Remember, HTML web servers should only accept requests with methods of `GET` and
`POST` only! They cannot accept `PUT`, `PATCH` or `DELETE` requests.

- Access the home page
  - `GET /`
  - `GET /home`
- Submit a contact form
  - POST /contacts

- Access the posts page
  - GET /posts

- Access the edit page for a post
  - GET /posts/:post-id/edit

- Access the create page for a post
  - GET /posts/new

- Create a new user
  - POST /users

- Log In 
  - POST /session/login

- Log Out
  - POST /session/logout

- Access the comments for a post page
  - GET /posts/:post-id/comments

- Access the create page for a post's comment
  - GET /posts/:post-id/comments/new

- Access the edit page for a comment
  - GET /posts/:post-id/comments/:comment-id/edit

- Submit a like for a post
  - POST /posts/:post-id/likes

- Delete a like for a post
  - POST /posts/:post-id/likes/:like-id/delete

- Access all the posts of a user
  - GET /users/:user-id/posts

- Submit a search on posts
  -POST /posts/search