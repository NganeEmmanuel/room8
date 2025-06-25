# --- Stage 1: Build the JAR ---
FROM maven:3.9.4-eclipse-temurin-21 AS builder

WORKDIR /app

COPY backend/NotificationService/pom.xml ./
COPY backend/NotificationService/.mvn .mvn
COPY backend/NotificationService/mvnw ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY backend/NotificationService ./

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# --- Stage 2: Package the app ---
FROM openjdk:21-jdk

WORKDIR /app
ENV SPRING_PROFILES_ACTIVE=prod

COPY --from=builder /app/target/NotificationService-0.0.1-SNAPSHOT.jar /app/notificationService.jar

EXPOSE 8087

ENTRYPOINT ["java", "-jar", "/app/notificationService.jar"]
