# User Service

This microservice is responsible for managing user data and profiles in the full-stack application. It handles operations related to user creation, retrieval, updating, and deletion.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ThorLex/groupe-37.git
   cd groupe-37/backend/user-service
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Service**
   ```bash
   npm start
   ```

## Usage Guidelines

- The user service exposes a RESTful API for managing user data.
- Ensure that the authentication service is running, as this service may depend on it for user authentication.

## API Endpoints

- `POST /users`: Create a new user
- `GET /users/:id`: Retrieve user details by ID
- `PUT /users/:id`: Update user information
- `DELETE /users/:id`: Delete a user by ID

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.