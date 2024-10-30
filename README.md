# RBAC Access Control
To achieve role bases access control, I have implemented netsjs' guards to create authentication determininers.
I have implemented metadata annotations to mark protected routes in conrollers and actions based on availability of specific granted authorities in the authentication context.

My authentication context is slotted in the Express Request object and holds the currently authenticated user's identifiers like email and id as well as the authorities assigned to the user.

Each protected request determines existence of an intersection between required roles and current users roles. If the intersection is not empty, access is granted otherwise access is denied with a 403 status code.

## How to run
To easily help spin up the threes services (nestjs api, vujs frontend and mysql database) I have containerized each and managed them with docker compose.

I have also used `Taskfile` to help easy spin of the services and cleanup based on specific tasks.

### Prerequisites
1. Linux operating system
2. Docker
3. Docker Compose
4. Taskfile

### Ports
1. 5000 NestJs API
2. 4000 VueJs FrontEnd
3. 3306 Mysql Database

Visit [https://taskfile.dev/](https://taskfile.dev/) for a guide to getting up and running with `task`.

### Launch the services
```sh
    task start
```

**NOTE**  
**At initial startup the api may timeout before the database gets ready. Please consider stopping the server `CTRL + C` and try again.**

Visit [VUE FRONTEND](http://localhost:4000) to view the web interface.

***Login with the seeded admin user***
Use the following email and password
- Email: `admin@example.com`
- Password: `Password123@`

The API is also available at [http://localhost:5000](http://localhost:5000)

### Clean up
```sh
    task clean
```

Below is a link to a video demonstrating various user roles:

[Live Demo](https://drive.google.com/file/d/15wexXzJpQb3tp0hTc5qGoBkghIpj6c8L/view?usp=sharing)