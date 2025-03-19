FROM node:20-alpine

WORKDIR /app

# Install build tools needed for bcrypt
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt specifically for the Alpine environment
RUN npm rebuild bcrypt --build-from-source

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/main"]