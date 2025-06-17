# --- Stage 1: Build the JAR ---
FROM maven:3.9.4-eclipse-temurin-21 AS builder

WORKDIR /app

COPY backend/AuthService/pom.xml .
COPY backend/AuthService/.mvn .mvn
COPY backend/AuthService/mvnw .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY backend/AuthService .

# Re-apply executable permission
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Package the app ---
FROM openjdk:21-jdk

WORKDIR /app
ENV SPRING_PROFILES_ACTIVE=prod

COPY --from=builder /app/target/AuthService-0.0.1-SNAPSHOT.jar /app/authService.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app/authService.jar"]
