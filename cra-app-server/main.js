const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const uri = 'mongodb://localhost:5001/react-blog';

let db;

// 미들웨어 설정: 기능,환경,변수 다다르니까 많은 미들설정 할수있음 but 우리가 그걸 다할수는 없으니까
// 일반적인 설정덩어리 만들어서 넣어준거다.
app.use(cors());
app.use(express.json());

//데이터 초기화 함수  //하나의 큰 데이터베이스 안에서 콜렉션을 여러개 만들어서 한다..
async function initializeData() {
  const postsCollection = db.collection('posts');   //여기서 바로 콜렉션 만든거임.명명하는 순간 쓸수 있게됨.
  const contactsCollection = db.collection('contacts');

  const postCount = await postsCollection.countDocuments();
  const contactCount = await contactsCollection.countDocuments();   //await 기다리는 일 발생.여기선 비동기아냐
  // postsCollection.deleteMany({})
  if (postCount === 0) {                            //0개일때 최초만 넣어주자.
    const posts = Array.from({ length: 10 }, (v, i) => ({
      createdAt: new Date(),
      title: `Blog Post ${i + 1}`,
      content: `
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      `,
    }));
    await postsCollection.insertMany(posts);
  }
  if (contactCount === 0) {
    const contacts = Array.from({ length: 10 }, (v, i) => ({
      createdAt: new Date(),
      name: `Contact Name ${i + 1}`,
      email: `contact${i + 1}`,
      message: `This is a sample message from Contact Name ${i + 1}.`,
    }));
    await contactsCollection.insertMany(contacts);
  }

  console.log('Initial data inserted');
}

// MongoDB 연결 및 서버 시작
MongoClient.connect(uri)
   .then(async (client) => {  //.then .catch 패턴식으로 db를 비동기가 아니라 동기식 처리
    db = client.db();  // 'react-blog' 데이터베이스에 연결
    await initializeData(); // 데이터 초기화
    app.listen(PORT, () => {
      console.log(`API Server is running on http://localhost:${PORT}`);
    });
   })
   .catch((error) => {
    console.error('Failed to connect to the database', error);
   });
 
 
   // api 등록(호출한거지 실행한건 아니니까)
app.get('/api/posts', async(req, res) => {
  try {
    const posts = await db.collection('posts').find().sort({createdAt: -1}).toArray();
    res.json(posts);
  } catch(error) {   // 예외상황 에러처리
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts'});
  }
});

app.get('/api/posts/:id', async (req, res)=>{
  const postId = req.params.id;

  try {
    const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
    if(post) {
       res.json(post);
    } else {
      res.status(404).json({message: 'Post not found'});
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({message: 'Error fetching post'});
  }
});

app.post('/api/posts', async (req, res) => {
  const {title,content} = req.body;
  console.log(title)
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.'});
  }

  try{
    const postsCollection = db.collection('posts');
    const newPost = {
      createdAt: new Date(),
      title,
      content,
    };
    const result = await postsCollection.insertOne(newPost);

    res.status(201).json({message: 'Post created successfully', postId: result.insertedId});
  } catch (error) {
    console.error('Error inserting post:',error);
    res.status(500).json({ message: 'Failed to create post'});
  }
});

//Contacts
app.get('/api/contacts', async (req,res) =>{
  try {
    const contacts = await db.collection('contacts').find().sort({ createdAt: -1}).toArray();
    res.json(contacts);
  } catch(error) {
    console.error('Error fetching contact requests:', error);
    res.status(500).json({message: 'Failed to fetch contact requests'});
  }
});

app.post('/api/contacts', async (req, res)=> {
  const{name, email, message2} = req.body;

  if (!name || !email || !message2) {
    return res.status(400).json({message: 'All fields are required.'});
  }

  try{
    const contactsCollection = db.collection('contacts');
    const newContact = {
      createdAt: new Date(),
      name,
      email,
      message2,
    };
    const result= await contactsCollection.insertOne(newContact);

    res.status(201).json({message: 'Contact request created successfully', contactId: result.insertedId});
  } catch (error) {
    console.error('Error creating contact request:', error);
    res.status(500).json({message: 'Failed to create contact request' });
  }
});

app.delete('/api/contacts/:id', async (req, res) =>{
  const contactId = req.params.id;

  try {
    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(contactId)});
  
    if (result.deletedCount === 1) {
      res.json({message: 'Contact request deleted successfully'});
    } else {
      res.status(404).json({ message: 'Contact request not found'});
    }
  } catch(error) {
    console.error('Error deleting contact request:', error);
    res.status(500).json({ message: 'Failed to delete contact request'});
  } 
});
