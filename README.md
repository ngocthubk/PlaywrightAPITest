# PlaywrightAPITest
### Objective
This project aims to experiment techniques to test API with Playwright and shows the skills to organize API Test and work with databases and Docker.
This does not focus on covering the behaviours of the API. The requirements are unknown.
### API Url
https://restful-booker.herokuapp.com/
### Test data
Data is read from a PostgreSQL database, which is set up in a Docker container.
### How to view the test result in Github

1. Go to the tab Actions,
   
2. Click on a workflow run you want to view,
   
3. Click on "test" to view the test results of this run.
   
### How to run the test locally
1. Clone the project to the local machine.
2. Set up the PostgreSQL database for the input data.
   Do the following steps, if the you want to run a containerized database

   2.1. Install psql command line

   2.2. Install Docker Desktop

   2.3. Pull a postgres image

   2.4. Run a new container from the image
   
   2.5. Restore the database with the command: Open the psql command line, go to the directory of the project and execute the command:
   pg_restore -p ${ DB_PORT } -U ${ DB_USER } -d ${ DB_NAME }  ./test-data/booking.tar
3. Copy the file .env.sample to .env.local
4. Open the file .env.local, input the own environment variables
5. Run the test with the standard command: npx playwright test 
### Author
<p> Name: Thu Nguyen
<p/>
<p> Email: ngocthubk@gmail.com
</p>

