import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import ejs from "ejs";
// import axios from "axios";


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Benson6969$",
  port: 5432,
});


const app = express();
const port = 3000;

// Middleware
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");      
});

app.post("/add", async(req, res) => {
  const firstname = req.body.firstName;   
    const lastname = req.body.lastName;
    // Here you would typically check the username and password against your database
    const checkResult = await db.query("SELECT * FROM users WHERE firstname = $1 AND lastname = $2", [firstname, lastname],
      );
    console.log(checkResult.rows);
    if (checkResult.rows.length > 0) {
      
        return res.send("user already exists");
    
    } else {
        //res.send("Invalid username or password.");
        db.query("INSERT INTO users (firstname, lastname) VALUES ($1, $2)", [firstname, lastname], (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).send("Internal Server Error");
            }
          console.log("Data inserted successfully");
          return res.redirect("/");  
        });
    }
});
    
    //res.render("index.ejs", { firstName: firstname, lastName: lastname }); 

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});