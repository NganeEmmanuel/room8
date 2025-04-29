# --- Stage 1: Build the JAR ---
FROM maven:3.9.4-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy the essential Maven wrapper files
COPY backend/ServiceRegistry/pom.xml .
COPY backend/ServiceRegistry/.mvn .mvn
COPY backend/ServiceRegistry/mvnw .

# Ensure the Maven wrapper script is executable
RUN chmod +x mvnw

# Pre-download dependencies to leverage Docker cache
RUN ./mvnw dependency:go-offline

# Copy the rest of the source code
COPY backend/ServiceRegistry .

# Build the application
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Package the app ---
FROM openjdk:21-jdk

WORKDIR /app

# Copy the JAR built in the previous stage
COPY --from=builder /app/target/ServiceRegistry-0.0.1-SNAPSHOT.jar /app/serviceRegistry.jar

EXPOSE 8761

# Run the application
ENTRYPOINT ["java", "-jar", "/app/serviceRegistry.jar"]
