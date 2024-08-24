const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Todo schema with a date field
const todoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
  date: {
    type: Date,
    default: Date.now, 
  },
});

const Todo = mongoose.model('Todo', todoSchema);

// GET all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST a new todo
app.post('/todos', async (req, res) => {
  try {
    const { title, date } = req.body;
    const newTodo = new Todo({
      title,
      completed: false,
      date: date ? new Date(date) : undefined, // Convert date string to Date object if provided
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const updateFields = req.body;

    if (updateFields.date) {
      updateFields.date = new Date(updateFields.date);
    }

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE a todo by ID
app.delete('/todos/:id', async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
