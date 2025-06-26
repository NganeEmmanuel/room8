# Real Estate House-Hunting Application

## Project Description
This project aims to provide a real estate house-hunting solution that enables individuals, particularly students and low-income earners, to find suitable roommates and shared accommodations. The platform allows users to list available rooms, search for roommates based on preferences, and manage bids on listings.

The application is designed using a **microservices architecture**, ensuring scalability, flexibility, and maintainability. It consists of a **React-Vite frontend** and a **Java Spring Boot backend** with multiple microservices. The deployment is handled using **CI/CD pipelines and cloud-based VPS hosting**, ensuring high availability and automated updates.

## Project Impact
- **Affordable Housing**: Helps students and low-income individuals find affordable shared accommodations.
- **Efficient Matching**: Uses advanced search and recommendation algorithms to connect compatible roommates.
- **Security & Verification**: Implements authentication and fraud detection to ensure a safe user experience.
- **Automation**: Simplifies roommate search and agreement management through digital workflows.

---

## 🗂️ GitHub Repository Structure

```
room8/
├── backend/
│   ├── ApiGateway/         # single access for applciation
│   ├── ServiceRegistry/    # Eureka service register for service descovery
│   ├── UserService/        # Handles User related logic
│   ├── AuthService/        # Handles uthentication and authorization Logic
│   ├── ListingService/     # Listing service handling room listings (RoomService)
│   ├── BidService/         # Handles the biding logic on listings
│   └── ContactService/     # Handles contacting users via email and phone number
│   ├── FeedbackService/    # Handle feedback logic like rating and reviews
│   ├── SearchService/      # Handles search related logic including filtering search
│   ├── NotificationService/   # Handles notification logic
├── frontend/
│   ├── room8               # fronend react application
├── devops/
│   ├── ci/                 # Jenkinsfiles, pipelines
│   ├── terraform/          # Terraform scripts for infra
│   ├── ansible/            # Playbooks and roles
│   ├── Readme.md           # information about this directory and devops workflow
├── Documentation
├── e2e-tests/              # Selenium-based full-stack E2E tests
│   ├── tests/              # Your actual test scripts (e.g., login_test.java, bidding_test.java)
│   ├── utils/              # Helper functions (e.g., login helpers, setup browser)
│   ├── requirements.txt    #  Maven config
│   └── README.md      
└── README.md
```

## Overall Architectural Overview
The project follows a **microservices-based architecture**, where different services handle distinct functionalities. The key components include:

### 1. **Frontend** (React-Vite)
- Developed using **React.js** with **Vite** for fast builds and optimized performance.
- Implements a **component-based architecture**, ensuring reusability and maintainability.
- Communicates with the backend via **RESTful APIs**.
- Uses **React Router** for navigation.

### 2. **Backend** (Spring Boot Microservices)
- Built using **Spring Boot** and follows a **microservices architecture**.
- Implements communication between microservices using **Spring Cloud Feign Clients**.
- Service discovery is managed by **Spring Cloud Eureka**.
- API gateway uses **Spring Cloud Gateway** for request routing.
- Authentication is handled using **Spring Security and JWT**.
- Uses **PostgreSQL and MongoDB** for data storage.
- hello guys i

### 3. **DevOps & Deployment**
- **CI/CD Pipeline**: Implemented using **GitHub Actions, Jenkins, and ArgoCD**.
- **Containerization**: Uses **Docker** to package and deploy services.
- **Orchestration**: Kubernetes is used for managing containerized applications.
- **VPS Setup**: The application is hosted on a **Cloud VPS**, configured using **Terraform**.

---

## Backend Architecture
The backend consists of several microservices, each handling a specific functionality:

### **1. API Gateway**
- Serves as the entry point for all requests.
- Routes requests to appropriate microservices.
- Ensures security and rate limiting.

### **2. Service Registry**
- Uses **Eureka Server** for service discovery.
- Allows services to register and locate each other dynamically.

### **3. Authentication Service**
- Handles user authentication and authorization.
- Uses **JWT tokens** for secure communication.
- Uses Redis for temporal token storage and management
- Integrates with **Spring Security**.

### **4. User Service**
- Manages user profiles and preferences.
- Stores user data in **MYSQL**.

### **5. Listing Service**
- Manages property and roommate listings.
- Uses **MSQL** for storage of listings.

### **6. Bid Service**
- Manages tenant bids on listings.
- Uses **MYSQL** for storage of listings.

### **7. Feedback Service**
- Handles user reviews and ratings.
- Uses **MYSQL** to store feedback data.

### **8. Contact Service**
- Handles sending emails and text related information to users

### **9. Search Service**
- Provides search functionality for rooms and roommates.
- Uses **Elasticsearch** for fast querying.

### **10. Notification Service**
- Handles user notifications within the applications
- uses message que (Apache Kafka)
---

## Frontend Architecture
- Built with **React.js** and **Vite** for optimized performance.
- Follows a **component-based architecture**.
- Uses **React Query** for API data fetching and caching.
- Implements **Tailwind CSS** for styling.

---

## Technology Stack
### **Frontend:**
- React.js (Vite)
- React Router
- Tailwind CSS
- Axios (API calls)

### **Backend:**
- Java (Spring Boot)
- Spring Cloud Gateway (API Gateway)
- Spring Security & JWT (Authentication)
- Spring Cloud Eureka (Service Discovery)
- PostgreSQL & MongoDB (Database)
- Elasticsearch (Search Service)

### **DevOps:**
- GitHub Actions (CI/CD)
- Jenkins & ArgoCD (Deployment Automation)
- Docker & Kubernetes (Containerization)
- Terraform (Infrastructure as Code)
- Cloud VPS (Hosting)

---

## Setup Guide
### **Frontend Setup**
#### Prerequisites:
- Node.js (v18+)

#### Installation:
```sh
# Clone repository
git clone https://github.com/your-repo.git
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Backend Setup**
#### Prerequisites:
- Java 21+
- Maven
- PostgreSQL & MongoDB (Installed & Configured)

#### Installation:
```sh
# Clone repository
git clone https://github.com/NganeEmmanuel/room8
cd backend

# Build and run services
mvn clean install
mvn spring-boot:run
```

#### Individual service setup
For setting up individual services locally, see their respective readme files for instructions

### **VPS Setup**
- Provision a **Virtual Private Server (VPS)** using Terraform.
- Install **java, Docker, Kubernetes, and necessary dependencies**.
- Deploy services using **Kubernetes manifests and Helm charts**.

---

## Contribution Guidelines & Code Standards
We follow industry-standard best practices for writing clean, maintainable, and efficient code.

### **General Guidelines**
- Follow a **modular** approach to separate concerns.
- Ensure **clear, concise, and well-documented** code.
- Use meaningful **variable and function names**.
- Avoid code duplication by following **DRY (Don't Repeat Yourself)** principles.
- Follow **SOLID principles** for object-oriented programming.

### **Backend Code Standards (Java Spring Boot)**
- Use **Spring Boot's built-in features** like Feign clients, Eureka, and Gateway for service communication.
- Follow **RESTful API design principles**.
- Use **DTOs (Data Transfer Objects)** to separate entity logic.
- Implement **exception handling** with meaningful error responses.
- Write **unit and integration tests** using JUnit and Mockito.
- Format code using **Google Java Format**.

### **Frontend Code Standards (React.js)**
- Use a **component-based architecture** for UI design.
- Follow the **Single Responsibility Principle (SRP)** when structuring components.
- Manage state using **React Context API or Redux** when necessary.
- Keep UI logic **separate from business logic**.
- Write clean and reusable CSS using **Tailwind CSS**.

---

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`feature-branch-name`).
3. Commit your changes with descriptive messages.
4. Push to your fork and submit a pull request.

**NB**: All contributions must follow the code standard as defined in the **contribution guidelines and code standard** section 

---

## License
This project is licensed under the MIT License.

---

## Contact
For any inquiries, please reach out via email or open an issue on GitHub.
