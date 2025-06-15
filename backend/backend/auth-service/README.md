# Auth Service

This is the authentication microservice for the full-stack application. It handles user authentication and authorization.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ThorLex/groupe-37.git
   cd groupe-37/backend/auth-service
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root of the `auth-service` directory and add the necessary environment variables for your setup.

4. **Run the service**:
   ```bash
   npm start
   ```

## Usage Guidelines

- This service exposes endpoints for user registration, login, and token management.
- Ensure that the API gateway is configured to route authentication requests to this service.

## API Endpoints

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Authenticate a user and return a token.
- `GET /auth/verify`: Verify the authentication token.