# Use OpenJDK 21 as the base image
FROM openjdk:21-jdk

# Add a label (optional but good for metadata)
LABEL maintainer="emmanuelngane06@gmail.com"

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file to the container
COPY target/AuthService-0.0.1-SNAPSHOT.jar /app/authService.jar

# Expose the port that the service will run on
EXPOSE 8081

# Command to run the application
ENTRYPOINT ["java", "-jar", "/app/authService.jar"]