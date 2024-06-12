# Use an official Node.js runtime as a parent image
FROM node:18.14.0

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
#RUN npm install -g npm@10
RUN npm install -g npm@9.5.0

#RUN npm cache clean -f
RUN npm config set registry https://registry.npmjs.org/
RUN npm i react-scripts

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
