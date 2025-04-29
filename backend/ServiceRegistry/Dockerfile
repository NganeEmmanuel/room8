FROM openjdk:21-jdk
# Add a label (optional but good for metadata)
LABEL maintainer="emmanuelngane06@gmail.com"
WORKDIR /app
COPY target/ServiceRegistry-0.0.1-SNAPSHOT.jar /app/serviceRegistry.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "/app/serviceRegistry.jar"]
