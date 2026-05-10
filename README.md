# CareerFlow
backend project for interviewers

CareerFlow API
Problem it solves
Tech stack
Architecture overview
Database model
Authentication flow
API routes
How to run locally
How to run with Docker
Environment variables
Swagger URL
Example curl requests
Test instructions
Future improvements

# CareerFlow API

CareerFlow API is a production-style Java Spring Boot backend for tracking job applications, recruiter contacts, interviews, notes, and follow-up activity.

## Tech Stack

- Java 21
- Spring Boot
- Spring Web
- Spring Security
- JWT authentication
- PostgreSQL
- JPA/Hibernate
- Docker
- JUnit + Mockito
- Swagger/OpenAPI
- GitHub Actions

## Core Features

- User registration and login
- JWT-protected API routes
- Job application CRUD
- Filtering and sorting
- Contact tracking
- Interview tracking
- Application notes
- Swagger documentation
- CI pipeline with GitHub Actions

## Implementation Notes

JWT tokens are signed with HS256 using Spring Security's `JwtEncoder`. The encoder requires an explicit `JwsHeader` so the signing algorithm is selected correctly.

Deleting a job application cascades deletes to associated contacts, interviews, and notes using JPA cascade and orphan removal, preventing orphaned records and foreign key violations.