# IV1201 Design of Global Applications

Welcome to the backend repository for our project! This repository contains the server-side code responsible for handling data processing, authentication, and communication with the database for the web-based recruitment tool designed for an amusement park.

## Technologies Used

- **Node.js and Express**: For backend development, providing a robust and scalable server environment.
- **TypeScript**: Utilized for its static typing capabilities, enhancing code quality and developer productivity.
- **PostgreSQL**: Our primary database solution, ensuring data integrity and reliability.

## Development Workflow

### Server Initiation
- Use `npm run dev` to seamlessly launch the server, utilizing nodemon and ts-node for automated restarts upon file modifications.

### Compiled Code Execution
- Execute the compiled JavaScript code using `npm start`.

## API Architecture

- Endpoints are organized within the `src/controllers` directory.
- These endpoints invoke DAO (Data Access Object) functions for database interactions.
- Results are elegantly returned in HTTP responses.
- Middleware functions in `src/middleware` validate HTTP request data.

## Authentication and Security

- Dedicated middleware handles user registration and login.
- Integration with DAO functions ensures validation of JSON request structures.
- Security is prioritized by sequestering credentials away from frontend code.
- Robust backend validation and adherence to secure communication protocols are implemented.

## Getting Started

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up your PostgreSQL database and update configuration in `db.ts`.
4. Execute queries from `table.sql` and `testInput.sql`.
5. Ensure you have a `.env` file with the `JWT_SECRET` variable for JWT token encryption.
6. Run the server using `npm run dev`.

## Frontend Repository

You can find the frontend repository for this project [here](https://github.com/danti58/Frontend_IV1201).


## Contributing
We welcome contributions from everyone! If you'd like to contribute to the frontend development, please follow these guidelines:

1. Fork the repository and create your branch from `main`.
2. Make your changes, ensuring code quality and adherence to coding standards.
3. Test your changes thoroughly.
4. Submit a pull request, describing your changes in detail.
