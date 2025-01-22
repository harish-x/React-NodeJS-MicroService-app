# Freelance Microservice Application

This repository contains a fully functional microservice-based freelance application built using Node.js and React. The application is designed to handle various aspects of a freelancing platform, including gig management, user authentication, communication, and reviews. The application leverages several technologies for efficient performance, logging, and monitoring.

# Technologies Used

<h3>Databases</h3>

- **MongoDB:** Stores gig-related information.
- **Elasticsearch:** Enables advanced search functionality for gigs and users.
- **MySQL:** Handles user authentication and authorization.
- **Redis:** Used for caching and the recommendation system.
- **PostgreSQL:** Stores review-related data.

<h3>Logging and Monitoring</h3>

- **ELK Stack (Elasticsearch, Logstash, Kibana):** Provides centralized logging and monitoring.

<h3>Event-Driven Architecture</h3>

- **RabbitMQ:** Manages event-driven communication between microservices.


# Microservices Overview

1. **API Gateway**

    - Acts as the central entry point for all APIs.

    - Handles routing, load balancing, and authentication.

2. **Notification Service**

    - Manages the sending of emails (e.g., user notifications and alerts).

    - Integrates with email providers.

3. **Auth Service**

    - Handles user authentication and authorization.

    - Uses MySQL for storing user credentials and session data.

4. **Users Service**

    - Manages user-related data and operations.

    - Provides endpoints for profile updates, fetching user data, and more.

5. **Gig Service**

    - Manages gig or work-related data.

    - Stores gig information in MongoDB and supports advanced search with Elasticsearch.

6. **Chat Service**

    - Enables real-time communication using WebSockets.

    - Manages chat history and user interactions.

7. **Order Service**

    - Handles order creation, tracking, and management.

8. **Review Service**

    - Manages reviews and ratings.

    - Uses PostgreSQL for data storage.

9. **Helper Library**

    - A private npm library used across all services.

    - Provides reusable types and functionalities like file uploads.

![Screenshot from 2025-01-19 20-05-06](https://github.com/user-attachments/assets/2c9e78c6-4d78-44e6-9cc4-1adc67d186ee)

# Features

  - Scalability: Microservice architecture allows horizontal scaling of individual components.

  - Real-Time Communication: Chat service enables seamless interaction between users.

  - Efficient Search: Elasticsearch powers advanced search capabilities for gigs and users.

  - Logging and Monitoring: Centralized logging with the ELK stack provides insights into system performance and errors.

  - Event-Driven Design: RabbitMQ facilitates asynchronous communication between services.

# Steps to Run Locally

<h3>Prerequisites</h3>

  - Node.js
  - Docker & Docker Compose
  - MongoDB, MySQL, PostgreSQL, Redis, Elasticsearch, and RabbitMQ instances

**1. Clone the Repository**

  ```
    git clone https://github.com/harish-x/React-NodeJS-MicroService-app
    cd React-NodeJS-MicroService-app
  ```

**2. Install Dependencies**

 Navigate to each service folder and install dependencies:

  ```
    cd <service-folder>
    npm install
  ```

**3. Set Up Environment Variables**

Create a ```.env``` file for each service with the required configurations (e.g., database credentials, RabbitMQ URLs).

**4. Start Services**

Use Docker Compose to start all services:

```

docker-compose up
```

Access the Application

Frontend: http://localhost:3000

API Gateway: http://localhost:4000


