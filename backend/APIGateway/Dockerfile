# Use OpenJDK 21 as the base image
FROM openjdk:21-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file to the container
COPY target/APIGateway-0.0.1-SNAPSHOT.jar /app/apiGateway.jar

# Expose the port that the service will run on
EXPOSE 8765

# Command to run the application
ENTRYPOINT ["java", "-jar", "/app/apiGateway.jar"]
