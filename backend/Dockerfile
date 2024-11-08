FROM node:20

WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker caching
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 5000

# Use `npm start` for production and `npm run dev` for development
CMD ["npm", "run", "dev"]
