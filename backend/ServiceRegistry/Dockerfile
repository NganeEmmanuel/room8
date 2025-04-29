# --- Stage 1: Build the JAR ---
FROM maven:3.9.4-eclipse-temurin-21 AS builder

WORKDIR /app

COPY backend/ServiceRegistry/pom.xml .
COPY backend/ServiceRegistry/.mvn .mvn
COPY backend/ServiceRegistry/mvnw .
RUN ./mvnw dependency:resolve

COPY backend/ServiceRegistry .
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Package the app ---
FROM openjdk:21-jdk

WORKDIR /app

COPY --from=builder /app/target/ServiceRegistry-0.0.1-SNAPSHOT.jar /app/serviceRegistry.jar

EXPOSE 8761
ENTRYPOINT ["java", "-jar", "/app/serviceRegistry.jar"]
