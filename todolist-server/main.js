const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Mongodb 연결 URI
const uri = 'mongodb://localhost:5001';
const client = new MongoClient(uri);

// db이름
const dbName = 'todolist';

// CORS 미들웨어 설정
app.use(cors());
app.use(express.json());

async function connectToDb() {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
}

// 모든 Todo 가져오기
app.get('/todos', async (req, res) => {
    const db = await connectToDb();
    const todos = await db.collection('todos').find({}).toArray(); // 모든 Todo 가져오기
    res.json(todos); // Todo 목록 응답
});

// Todo 추가
app.post('/todos', async (req, res) => {
    const db = await connectToDb();
    const newTodo = {
        task: req.body.task,
        completed: false    
    };
    const result = await db.collection('todos').insertOne(newTodo);
    res.status(201).json({ _id: result.insertedId, task: newTodo.task, completed: newTodo.completed });
});

// Todo 삭제
app.delete('/todos/:id', async (req,res) => {
    const db = await connectToDb();
    const { id } = req.params;
    await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Todo deleted successfully'});
});

// Todo 체크상태 변경 (완료/미완료)
app.post('/todos/:id/check', async (req,res) => {
    const db = await connectToDb();
    const { id }  = req.params;
    const { completed } = req.body;
    const result = await db.collection('todos').updateOne({ _id: new ObjectId(id) }, { $set: {completed: completed} } );

    res.json({ message: 'Todo status updated successfully', modifiedCount: result.modifiedCount }); 
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});