# 🔐 DockerHub Credentials in Jenkins

- Go to Jenkins dashboard → Manage Jenkins → Credentials → (select domain/global) → Add Credentials

Choose:

- Username and password
- ID: ``dockerhub-cred``
- Username: your Docker Hub username
- Password: your Docker Hub password or personal access token
- You'll use this ID in your Jenkinsfile to authenticate when pushing.