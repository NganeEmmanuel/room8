# --- Stage 1: Build the JAR ---
FROM maven:3.9.4-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy the essential Maven wrapper files
COPY backend/RoomService/pom.xml .
COPY backend/RoomService/.mvn .mvn
COPY backend/RoomService/mvnw .

# Ensure the Maven wrapper script is executable
RUN chmod +x mvnw

# Pre-download dependencies to leverage Docker cache
RUN ./mvnw dependency:go-offline

# Copy the rest of the source code
COPY backend/RoomService .

# Re-apply executable permission (IMPORTANT)
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Package the app ---
FROM openjdk:21-jdk

WORKDIR /app

# Inject profile and env secrets at runtime (not baked into image)
ENV SPRING_PROFILES_ACTIVE=prod

# Copy the JAR built in the previous stage
COPY --from=builder /app/target/RoomService-0.0.1-SNAPSHOT.jar /app/roomService.jar

EXPOSE 8083

# Run the application
ENTRYPOINT ["java", "-jar", "/app/roomService.jar"]
