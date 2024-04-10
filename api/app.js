const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');

const { List, Task } = require('./db/models');

app.use(bodyParser.json());

app.get('/lists',  (req, res) => {
    // We want to return an array of all the lists that belong to the authenticated user 
    List.find({}).then((lists) => {
        res.send(lists);
    });
});


app.post('/lists', (req, res) => {
    let title = req.body.title;

    let newList = new List({
        title
    });
    newList.save().then(listDoc => {
        res.send(listDoc);
    });
});

app.patch('/lists/:id', (req, res) => {
    // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
    List.findOneAndUpdate({ _id: req.params.id}, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});


app.delete('/lists/:id', (req, res) => {
    
    List.findOneAndDelete({
        _id: req.params.id,
    }).then((removedListDoc) => {
        res.send(removedListDoc);
})
});

//Get tasks from list
app.get('/lists/:listID/tasks', (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    Task.find({
        
        _listID: req.params.listID
    }).then((tasks) => {
        res.send(tasks);
    })
});

//get one task from list
app.get('/lists/:listID/tasks/:taskID', (req, res) => {
    // We want to return all tasks that belong to a specific list (specified by listId)
    Task.findOne({
        _id: req.params.taskID,
        _listID: req.params.listID
    }).then((task) => {
        res.send(task);
    })
});

// Create task for list
app.post('/lists/:listID', (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        _listID: req.params.listID
    });
    newTask.save().then((newtaskDoc) => {
        res.send(newtaskDoc);
    });
});

app.patch('/lists/:listID/tasks/:taskID', (req, res) => {
    Task.findOneAndUpdate({
        _id: req.params.taskID,
        _listID: req.params.listID
    },{
        $set: req.body
    }).then(()=> {
        res.sendStatus(200);
    });
});

app.delete('/lists/:listID/tasks/:taskID', (req, res) => {
    Task.findOneAndDelete({
        _id: req.params.taskID,
        _listID: req.params.listID
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
});

app.listen(3000,() => {
    console.log('listening on port 3000');
})