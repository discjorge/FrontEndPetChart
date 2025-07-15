# Capstone My PetChart FrontEnd Repo

## Overview

Welcome to My PetChart! We noticed that pet parents often struggle to remember or understand details from vet visits, so we built a web app to help streamline communication between vets & pet parents. 

PetChart MVP allows our vet users and pet parent users to create and read messages back and forth, view abd create appointments, and view pet and vet details. 

Our user goals include: 
* Both Users: Communicate directly through the app (ex. message replies) to clarify questions.

## Core Features
1. Unified Login 
- Instead of asking a user if they are a vet or pet-parent, our unified login form uses a /check-user-type route based on the email address to determined which protected route to send the user.  During the register process, a user registers as a vet or as a pet parent, so the email address becomes associated with an user type.  Using a unified login increases the user experience and cuts down on user input at the time of login.

2. Protected route dashboards 
- Depending on your user type (vet or pet-parent), your dashboard will be tailored to your experience. Vet users will see all their pet patients, messages with all patients, and all patient appointments. 

3. 2-Way Messaging 
- Vet and pet-parents can two-way communicate through the app.  As a logged-in vet user, you will see all patient messages and be able to create messages for any patient. As a logged-in pet parent user, you will see all messages from your vet about your pet. 

4. Appointments
- Pet-parents are able to create appointments with a vet for their pet.  These appointments appear on the vet dashboard so the vet can see their upcoming schedule. Additionally, when a pet parent creates an appointment, we are making an user association between that pet parent and vet.  This user assoication is displayed on both dashboards. 

5. Vanity Fun Cards
- No pet app is complete without some fun pet trivia facts and a 'Pet of the Day' card! We integrated two free public APIs to add some fun to our pet parent dashboard.  


## Technologies

Package Dependencies: 
1. npm install
2. npm install react-router-dom
3. npm install express pg dotenv
4. npm install bcrypt
5. npm install jsonwebtoken
6. npm install cors
7. npm install multer

Additional Setup Notes:
* Database is "petchart"
* Remember to chance username and passowrd in .env DATABASE_URL

Frontend Tech Stack:
* React (w/Vite) & react router for navigation
* Token-based authentication storage in localStorage 

Backend Tech Stack: 
* Express server with REST API endpoints 
* PostgresSQL for database
* JWT sessions with user type access 
* Protected routes based on auth state

## Architecture Overview

1. Frontend
- Overall, we utilized a component approach
- Register page renders two components, used as a smooth toggle UX
- 2 Dashboard components: Vet Dashboard & Pet Parent Dashboard. Components are rendered on each dashboard passing through the useAuth hook to determine what type of user is logged in.  
- Shared components: Most components are rendered on both dashboards with the use of useAuth hook to know which route to hit based on user type.
- Larger components have dedicated style sheet: For larger components with an advanced styling goal, we used a dedicated styling sheet to help keep files organized.  

2. Backend 
- Classic folder structure: API, DB, MIDDLEWARE, ROOT
- API folder contains all routes based on 4 main features: appointments, messages, users, vets. 
- Backend user table represents the pet parents and vet table represents the veterinarian doctors. 
- DB folder contains all querie files for database SQL code, along with the client, schema, and seed files. 
- Seed file has several dummy data for two test users so that the frontend components could populate with data. 

Test Users: 
1. Vet User: "email": "vet@petchart.com", "password": "password123"

2. Pet Parent User: "email": "pyka.ashley@gmail.com", "password": password123


## Project Resources
Frontend Repo: https://github.com/BerleLBowen/Front-End-PetChart

Backend Repo: https://github.com/BerleLBowen/Back-End-PetChart

PRD: https://docs.google.com/document/d/1teqXBeSxKBi2js6rNIV44Us80EBa3o4HN3rUv0I2dH0/edit?tab=t.0

Designs: https://www.figma.com/design/i2q5XsiTpHznkxLarcKexb/FullStack-%7C-Capstone-PetChart?node-id=0-1&t=YeWn9MMJ5IHvWxmp-1

BE Planning: https://docs.google.com/spreadsheets/d/1wl1KlCidafww0ZcUf208xOIFUUJTLGu_mJjxw5az54M/edit?gid=0#gid=0 

Project Board: https://trello.com/b/fzqw0VSG/petchart-capstone 
