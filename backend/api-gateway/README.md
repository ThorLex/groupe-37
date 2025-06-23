# API Gateway

This is the API Gateway for the fullstack application. It serves as the single entry point for all client requests and routes them to the appropriate microservices.

## Features

- Centralized routing for microservices
- Load balancing and request forwarding
- Authentication and authorization handling
- API versioning support

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/ThorLex/groupe-37.git
   cd fullstack-app/backend/api-gateway
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the API Gateway:
   ```bash
   npm start
   ```

## Usage

The API Gateway listens for incoming requests and forwards them to the respective microservices based on the defined routes. Ensure that all microservices are running for the API Gateway to function correctly.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.