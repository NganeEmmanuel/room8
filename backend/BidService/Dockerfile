# --- Stage 1: Build the JAR ---
FROM maven:3.9.4-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy build configuration files and prepare dependencies
COPY backend/BidService/pom.xml ./
COPY backend/BidService/.mvn .mvn
COPY backend/BidService/mvnw ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Copy source code
COPY backend/BidService ./

# Package the application
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Package the app ---
FROM openjdk:21-jdk

WORKDIR /app
ENV SPRING_PROFILES_ACTIVE=prod

COPY --from=builder /app/target/BidService-0.0.1-SNAPSHOT.jar /app/bidService.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "/app/bidService.jar"]
