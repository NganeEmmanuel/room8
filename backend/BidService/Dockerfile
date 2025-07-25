# --- Stage 1: Build the JAR ---
FROM maven:3.9.4-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy Maven wrapper files first and set permissions
COPY backend/BidService/pom.xml ./
COPY backend/BidService/.mvn .mvn
COPY backend/BidService/mvnw ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# Copy rest of the code
COPY backend/BidService ./

# Ensure mvnw is executable again just in case
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# --- Stage 2: Package the app ---
FROM openjdk:21-jdk

WORKDIR /app
ENV SPRING_PROFILES_ACTIVE=prod

COPY --from=builder /app/target/BidService-0.0.1-SNAPSHOT.jar /app/bidService.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "/app/bidService.jar"]
