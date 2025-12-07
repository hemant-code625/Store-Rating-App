import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "mydatabase",
  port: process.env.DB_PORT || 3306,
});

const connectDB = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err.stack);
      return;
    }
    console.log("Connected to the MySQL database as id " + connection.threadId);
  });
};

export const dbQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        console.error("Error executing query:", error.stack);
        return reject(error);
      }
      resolve(results);
    });
  });
};

export default connectDB;
