0. If you don't have a ssh key in your github accout, generate and add it. 
Here's a quick tutorial on how to do it : https://www.youtube.com/watch?v=X40b9x9BFGo
1. Clone or update your project from github
2. change your config file credentials in dbConfig.js
mine is:
const dbConfig = {
    host: 'localhost',
    user: 'teamproject_user',
    password: 'teamproject_user',
    database: 'mydb',
};
3. copy the contents of TeamProject.sql and paste them in sql file in MyWorkBench
![Alt text](ImagesForREADME/image.png)

4. add roles in role table for id's 1,2 and 3 (administrator/moderator, customer, employee)
5. Open http://localhost:3000/registration.html
6. Register and then log in with the Username and Password you have created.
7. If you want to create employees, make an entry in the firm table for id 1 as well.
