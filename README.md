# GERIA REST CALCULATOR APP

This is a MERN application that was built solely to show case my ability to create and support applications of this nature.

It consists of 2 parts namely **frontend** and **backend** which contain the source for the front and backend respectively.

The backend was developed using Node.js and Express while the fronend is based on React.js + Bootstrap bundled using **Vite**.

In order to achieve a unified delelopment experience (eliminating proxying or CORS restriction), a custom Vite plugin was created to automatically start the express (backend) server along with the react live server. In a production scenaria, the frontend/dist folder will be deployed to a static web app server such as Azure Static Web Apps while the backed will be hosted in a nodejs server.

In order to be able to store calculation history, the backend utilizes Mongo DB. The connection string for the database is stored under the key **MONGO_CONNECTION_STRING** in the *.env* file under the root of the frontend folder and backend folders respectively. The *.env* under the backend folder is necessary if the backend will be run separately from the.

For the purpose of this demonstration, the application connects to a Share / Free cloud MongoDB cluster that I have setup for this.

Knowing that it is best practice to exclude connection string, encryption keys and secrets from the repository, I have, nevertheless, allowed it here for the sake of this demonstration. I have also included the values used in the *NOTE* section.

## APPLICATION FEATURES
- The application features a single page with a centralized component.
- The component plays host to a calculator that this able to process simple arithmetic operations like addition, subtraction, multiplication and division.
- The user is able to view the history of previous calculations by clicking the clock **toggle** button.
- The user is able to clear the history of calculations by clicking on the bin brush icon.

## HOW TO EXECUTE
To start the application in development mode:
1. Navigate to ~/backend and execute ```npm install``` to install all necessary modules.
2. Navigate to ~/frontend and execute ```npm install``` to install all necessary modules likewize.
3. Run ```npm run dev``` to start the server.

## DEVELOPMENT / TESTING
The backend utilizes jest, supertest and a live mongodb server for testing. The test script has configured in such as to enforce the use of the *.env.test* instead of the *.env* environment file.
To test the backend navigate to ~/backend and execute ```npm run test```.

The frontend utilizes vitest and jest for testing the UI components. Special care has been taken to intercept API calls
To test the frontend, navigate to ~/frontend and execute ```npm run test```.

### NOTE
A gitignore rule is in place to exclude the *.env* file which should not be committed to the repo the real world.
Ensure that the  *.env* is present in the root folder of the frontend folder.
For the purpose of testing, the file should contain the following:
```
MONGO_CONNECTION_STRING="mongodb+srv://geria:IXZFrJvYZeZWGknp@geriacluster.ejxqbdd.mongodb.net/geria_app"
PORT=5001
```
PORT is the http port underwhich the app will be served.

# THE APP
When you visit the app home page, it should look like thihs:
![App home](README/HOME.png);

When you click on the app clock icon, the calculator UI gives way for the history UI
![App history](README/HISTORY.png)



