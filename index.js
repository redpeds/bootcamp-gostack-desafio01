const express = require('express');
const server = express();

// Allows express to set the type of req and res we're using
server.use(express.json());

// Array that'll store our projects
const projects = [];

// Middleware to count number of requisitions
function logCount(req, res, next) {
  console.count('Número de requisições');

  next();
};

// Execute function to count requisitions
server.use(logCount);

// Middleware to check if the Project exists
function checkIfExist(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if(!project){
    return res.status(404).json({ error:`Não foi possível encontrar nenhum projeto com o id: ${id}` });
  }

  next();
};



// Returns all projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Return only the project with specified id
server.get('/projects/:id', checkIfExist, (req, res) => {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  return res.json(project);
});

// Creates a new Project
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

// Update Project title
server.put('/projects/:id', checkIfExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

// Delete Project by id
server.delete('/projects/:id', checkIfExist, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

// Creates new task for a Project
server.post('/projects/:id/tasks', checkIfExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
