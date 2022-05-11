const express = require("express");
const pg = require("pg");
const pool = require("./db");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

// Create todo
app.post("/todos", async (req, res)=>{
    try{
        const {description} = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES ($1) RETURNING *", 
            [description]
        );
        
        console.log(newTodo)
        res.status(201).json(newTodo.rows);
        // if todo was not added or created successfully, the status code is 400
    }
    catch(err){
        return res.status(500).json(err);
    }
});


// Get all todos
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.status(201).json(allTodos.rows);
    }
    catch(err){
        return res.status(500).json(err);
    }
});


// Get a specific todo
app.get("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.status(201).json(todo.rows);
    }
    catch(err){
        return res.status(500).json(err);
    }
});


// Update a todo
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try{
        await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
        res.status(200).json("Todo was updated");
    }
    catch(err){
        return res.status(500).json(err);
    }
});

app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        if(todo.rows.length === 1){
            await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        }
        else {
            return res.status(404).json("Delete was not successful");
        }

        res.status(200).json("Delete was succeessful");
    }
    catch(err){
        return res.status.json(err);
    }
});


app.listen(3000, ()=>{
    console.log("Server is running");
});