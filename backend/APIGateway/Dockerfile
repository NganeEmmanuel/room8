# --- Stage 1: Build the JAR ---
FROM maven:3.9.4-eclipse-temurin-21 AS builder

WORKDIR /app

COPY backend/APIGateway/pom.xml .
COPY backend/APIGateway/.mvn .mvn
COPY backend/APIGateway/mvnw .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY backend/APIGateway .

# Re-apply executable permission (IMPORTANT)
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Package the app ---
FROM openjdk:21-jdk

WORKDIR /app

COPY --from=builder /app/target/APIGateway-0.0.1-SNAPSHOT.jar /app/apiGateway.jar

EXPOSE 8765
# Command to run the application
ENTRYPOINT ["java", "-jar", "/app/apiGateway.jar"]

RUN rm -rf ~/.m2/repository


