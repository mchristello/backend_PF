# Ecommerce with backend functionality

    A ecommerce with some backend functionalities such as database in MongoDB for Users, Sessions (also hashed, and storaged in cookies along with JWT tokens), Products and Carts. 

    Along the way, I've beeen developing an API Rest containing all the information about products and carts.

## <u>Demo</u>

<!-- TODO: Inser GIF DEMO -->
![Demo de la web page.](https://firebasestorage.googleapis.com/v0/b/padel-market-2259b.appspot.com/o/GIF_ecommerce.gif?alt=media&token=e17b26d7-5865-4c09-a11b-c331fd373d9d)

-------------------------


## <u>Used Technologies:</u>
- Javascript
- CSS
- MongoDB
- Express
- NodeJS
- CRUD Op.
- API Rest.
- Testing 
- Custom Errors
- Docker
- Kubernetes & Minikube

-------------------------

## <u>Framework Dependencies:</u>
- Bootstrap
- Dotenv
- Passport
- JsonWebToken
- Handlebars
- SweetAlert
- AUTH: Passport Local || GitHub || Google || JWT
- Mongoose Paginate
- Express Sessions
- CookieParser
- Bcryptjs
- Winston
- Nodemailer
- @faker-js/faker
- Swagger Documentation
- Testing: Chai; Mocha; Supertest

-------------------------

## <u>Directories</u>
- /src
    - config
    - controllers
    - dao
    - docs
    - middleware
    - public
    - repository
    - routers
    - utils
    - views
- /test
    - users
    - carts
    - products

-------------------------

## <u>API Endpoints</u>

- "/api/products", brings all the products in the DB. [Try it here.](localhost:8080/api/products)
- "/api/carts", brings all the carts existents in the DB. [Try it here.](localhost:8080/api/carts)
- "/api/users", brings the list of users of the DB. Only admin users. [Try it here.](localhost:8080/api/users)
- "/api/users/current", brings the current user logged in the website. [Try it here.](localhost:8080/api/users/current)
- "/api/logger", tests the Logger in the console.
- "/api/mail"
- "/api/mockingproducts", generate random users & products with @faker-js/faker.

-------------------------

## <u>Available Scripts</u>

1° Run "npm run start" script to start the server.

2° Open [LocalHost](http://localhost:8080/home) here, to view it in your browser.

OR  ---- > Visit -> [THIS](https://backendpf-production.up.railway.app/home) <- URL.

-------------------------

## <u>Docker Info </u>

 - Docker Hub: (https://hub.docker.com/repository/docker/matiaschristello/ecommerce/tags?page=1&ordering=last_updated)
 - Pull Comand : docker pull matiaschristello/ecommerce:1.0.0

-------------------------

## <u>Developer Profile</u>

[Matias Christello - GitHub Profile](https://github.com/mchristello)
