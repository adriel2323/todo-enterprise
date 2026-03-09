FROM node:22-bookworm-slim

WORKDIR /usr/src/app

EXPOSE 3000

CMD ["sh", "-c", "cd backend && npm install && npm run start:dev"]