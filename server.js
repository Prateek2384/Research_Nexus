const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/articles', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema and model for articles
const articleSchema = new mongoose.Schema({
    name: String,
    topic: String,
    subtopic: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

// API endpoints
app.post('/api/articles', async (req, res) => {
    const { name, topic, subtopic, content } = req.body;
    const article = new Article({ name, topic, subtopic, content });
    await article.save();
    res.status(201).send(article);
});

app.get('/api/articles', async (req, res) => {
    const articles = await Article.find();
    res.send(articles);
});

app.delete('/api/articles/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
