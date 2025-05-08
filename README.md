# LLM Chatbot

Chatbot built using React and Spring, LLM is hosted and accessed via the OpenRouterAPI. 

Motivation: Wanted to gain exposure to Spring, and thought that I should learn about building a REST API and also consuming an API, so this is what arose.

# Tech Stack

- Client/Frontend: React + TailWindCSS
- Backend: Java Spring
- API: OpenRouterAPI

# Setup
- Java 21
- Node.js and NPM/PNPM
- OpenRouter API Key (See [backend/README.md](./backend/README.md))

# Running the application
**We need two terminals**
1. Head to `./frontend` and run :
    - `pnpm/npm run dev`
    - To run in production:
        - `pnpm/npm run build` followed by
        - `pnpm/npm preview`
2. Head to `./backend` and run:
    - `./mvnw spring-boot:run` (Mac/Linux) / ... (Have to check how to run in Windows)