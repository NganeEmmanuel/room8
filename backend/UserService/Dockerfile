# --- Stage 1: Build the JAR ---
FROM maven:3.9.4-eclipse-temurin-21 AS builder

WORKDIR /app

COPY backend/UserService/pom.xml .
COPY backend/UserService/.mvn .mvn
COPY backend/UserService/mvnw .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY backend/UserService .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Package the app ---
FROM openjdk:21-jdk

WORKDIR /app
ENV SPRING_PROFILES_ACTIVE=prod

COPY --from=builder /app/target/UserService-0.0.1-SNAPSHOT.jar /app/userService.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "/app/userService.jar"]
