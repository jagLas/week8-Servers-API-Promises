#### create a post
POST
curl --location 'http://localhost:5000/posts/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'title=Did it work?' \
--data-urlencode 'description=I sure hope it did'

confirmed with:

GET /posts/3 HTTP/1.1
Host: localhost:5000

#### leave two comments on the post
POST /posts/3/comments HTTP/1.1
Host: localhost:5000
Content-Type: application/x-www-form-urlencoded
Content-Length: 25

text=Yipee%2C%20it%20did!

Found. Redirecting to /posts/3

POST /posts/3/comments HTTP/1.1
Host: localhost:5000
Content-Type: application/x-www-form-urlencoded
Content-Length: 24

text=Oh%20boy%20oh%20boy

Found. Redirecting to /posts/3

confirmed with:

GET /posts/3 HTTP/1.1
Host: localhost:5000

#### edit the post
GET /posts/3/edit HTTP/1.1
Host: localhost:5000

POST /posts/3 HTTP/1.1
Host: localhost:5000
Content-Type: application/x-www-form-urlencoded
Content-Length: 50

title=Look%20at%20me&description=I'm%20a%20chimera

Found. Redirecting to /posts/3

GET /posts/3 HTTP/1.1
Host: localhost:5000

#### delete one of the comments on the post
POST /comments/3/delete HTTP/1.1
Host: localhost:5000
Content-Type: application/x-www-form-urlencoded

Found. Redirecting to /posts/1

GET /posts/1 HTTP/1.1
Host: localhost:5000

DID NOT WORK

POST /comments/3/delete HTTP/1.1
Host: localhost:5000

Found. Redirecting to /posts/3

confirmed work with: 

GET /posts/3 HTTP/1.1
Host: localhost:5000