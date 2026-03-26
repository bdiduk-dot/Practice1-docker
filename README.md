## Student
- Name: [Your Full Name]
- Group: [Your Group]

## Docker Environment Setup

### Docker Installation Verification
```text
docker --version
Docker version 29.3.0, build 5927d80

docker compose version
Docker Compose version v5.1.0

docker run --rm hello-world
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
```

### Docker Compose + Latest npm
```text
docker compose run --rm npm npm -v
11.12.0

docker compose run --rm npm node --version
v25.8.2
```

## Repository structure
- Dockerfile
- docker-compose.yml
- README.md
