// import the express module and create an express application
const express = require('express');
const app = express();

// middleware to parse incoming JSON requests
app.use(express.json());

// simple database
const objects = [
    { id: 1, name: 'REST API', description: 'Handles API requests' },
    { id: 2, name: 'REST API 2', description: 'Second API endpoint' }
];

// route to handle GET requests to return all objects
app.get('/api/objects', (req, res) => {
    res.send(objects);
});

// route to handle GET requests to return a specific object
app.get('/api/objects/:id', (req, res) => {
    const object = objects.find(o => o.id === parseInt(req.params.id));
    if (!object) return res.status(400).send('Object not found');
    res.send(object);
});

// route to handle POST requests to add a new object
app.post('/api/objects', (req, res) => {
    if (!req.body.name) return res.status(400).send('Name is required');
    const object = { id: objects.length + 1, name: req.body.name };
    objects.push(object);
    res.status(201).send(object);
});

// route to PUT request to update an entire object
app.put('/api/objects/:id', (req, res) => {
    const object = objects.find(o => o.id === parseInt(req.params.id));
    if (!object) return res.status(404).send('Object not found');
  
    const { name, description } = req.body;
    if (!name || !description) return res.status(400).send('Name and description are required');
  
    object.name = name;
    object.description = description;
    res.send(object);
  });

// route to PATCH request that does a partial update
app.patch('/api/objects/:id', (req, res) => {
    const object = objects.find(o => o.id === parseInt(req.params.id));
    if (!object) return res.status(404).send('Object not found');

    const { name, description } = req.body;
    if (name) object.name = name;
    if (description) object.description = description;

    res.send(object);
});

//route to DELETE request to remove an object
app.delete('/api/objects/:id', (req, res) => {
    const index = objects.findIndex(o => o.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Object not found');
  
    const deleted = objects.splice(index, 1);
    res.send(deleted[0]);
});

// route to OPTIONS request to return HTTP methods supported by the URL
app.options('/api/objects', (req, res) => {
    res.set('Allow', 'GET,POST,PUT,DELETE,OPTIONS').send();
});

// route to HEADER request to return headers no body 
app.head('/api/objects', (req, res) => {
    res.status(200).end();
});

// starting the server
app.listen(3001, () => console.log('REST API listening on port 3001'));
