# Backend part

This project is a fullstack application that consists of a Next.js front-end and a back-end built with microservices architecture. The application is designed to provide a seamless user experience while managing user authentication and data.

## Project Structure

```
fullstack-app

├── backend
│   ├── auth-service
│   │   ├── src
│   │   ├── package.json
│   │   └── README.md
│   ├── user-service
│   │   ├── src
│   │   ├── package.json
│   │   └── README.md
│   └── api-gateway
│       ├── src
│       ├── package.json
│       └── README.md
└── 
```


## Backend

The back-end is composed of three microservices:

1. **Auth Service**: Handles user authentication and authorization.
2. **User Service**: Manages user data and profiles.
3. **API Gateway**: Routes requests to the appropriate microservices.

### Setup Instructions

1. Navigate to each service directory (`auth-service`, `user-service`, `api-gateway`).
2. Install dependencies using `npm install`.
3. Start each service according to its specific instructions in the respective README files.

## Overall Project Setup

1. Clone the repository.
2. Navigate to the project root directory.
3. Install dependencies using `npm install`.
4. Follow the setup instructions for both the front-end and back-end services.

## Usage

After setting up the project, you can access the application in your browser at `http://localhost:3000`. The API endpoints for the back-end services can be accessed through the API gateway.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.
