# Pizza Ordering Application

## Overview
This application allows users to order pizzas, track their orders in real time, and modify them as needed. It features role-based access, with administrators managing orders and customers placing and updating their orders.

## Prerequisites
Before starting the application, ensure you have the following installed:

- **PostgreSQL** (Server name: `postgres`, Password: `admin`)
    - If you wish to use different credentials, update `application.properties` accordingly.
- **Docker**
- **Kafka** (Uses default port `9092`, configurable in `docker-compose.yaml`)

## Setup Instructions
### **Backend Setup**
1. Navigate to the directory containing `docker-compose.yaml`.
2. Run the following command to start required services:
   ```sh
   docker-compose up -d
   ```
3. Start the backend Java application. It should run on `localhost:8080`.

### **Frontend Setup**
1. Navigate to the frontend directory.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the application:
   ```sh
   npm start
   ```
4. The frontend will be available at `http://localhost:3000`.

## Features
### **Role-Based Access**
- **ADMIN Users:**
    - Track all incoming orders.
    - Update order statuses in real time.
    - View sales insights.
- **CUSTOMER Users:**
    - Browse the menu and add items to the cart.
    - Modify items before and after submitting orders.
    - Track their order status in real time.

## Architecture
- **Backend:** Java Spring Boot application
    - Handles business logic through dedicated services.
    - Routes all requests via controllers.
    - Uses repositories for database persistence.
- **Frontend:** React application
    - Provides different views based on user roles.
    - Uses WebSockets for real-time updates.

## Additional Notes
- Ensure Kafka and PostgreSQL are running before starting the application.
- Configuration files may need adjustments based on your environment.

