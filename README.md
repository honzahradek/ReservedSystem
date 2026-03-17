# ReservedSystem

A meeting room reservation application

## Description

This project consists of two parts:

 - Client (frontend) – user interface

 - Server (backend) – API and business logic

## Running the project

Client (frontend)

cd reserved-system-client

The application will typically run at:

 - http://localhost:5173


Server (backend)

cd reserved-system-server

mvn spring-boot:run

The server will typically run at:

- http://localhost:8080

## Communication

The client communicates with the server using REST API (HTTP requests).

## Technologies Used

Frontend: React

Backend: Spring Boot (Java)

Build Tools: npm + vite, Maven

## Project Structure

reserved-system

├ client/    # frontend application

├ server/    # backend application

└ README.md

## Notes

Folders like node_modules, target, and dist are not included in the repository (handled by .gitignore)

Dependencies must be installed before running the project

