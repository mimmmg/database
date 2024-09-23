const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const uri = 'mongodb://localhost:27777/react-blog';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'your_jwt_secret_key'; // JWT 서명에 사용할 비밀 키

let db;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 데이터 초기화 함수
async function initializeData() {
  const postsCollection = db.collection('posts');
  const contactsCollection = db.collection('contacts');

  const postCount = await postsCollection.countDocuments();
  const contactCount = await contactsCollection.countDocuments();
  // postsCollection.deleteMany({})
  if (postCount === 0) {
    const posts = Array.from({ length: 10 }, (v, i) => ({
      createdAt: new Date(),
      title: `Blog Post ${i + 1}`,
      content: `
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
          when an unknown printer took a galley of type and scrambled it to make a type specimen book.

          It has survived not only five centuries, but also the leap into electronic typesetting, 
          remaining essentially unchanged. It was popularised in the 1960s with the release of 
          Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing 
          software like Aldus PageMaker including versions of Lorem Ipsum.

          Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of 
          classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin 
          professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, 
          consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical 
          literature, discovered the undoubtable source.
        `,
    }));
    await postsCollection.insertMany(posts);
  }

  if (contactCount === 0) {
    const contacts = Array.from({ length: 10 }, (v, i) => ({
      createdAt: new Date(),
      name: `Contact Name ${i + 1}`,
      email: `contact${i + 1}@example.com`,
      message: `This is a sample message from Contact Name ${i + 1}.`,
    }));
    await contactsCollection.insertMany(contacts);
  }

  console.log('Initial data inserted');
}

// MongoDB 연결 및 서버 시작
MongoClient.connect(uri)
  .then(async (client) => {
    db = client.db(); // 'react-blog' 데이터베이스에 연결
    await initializeData(); // 데이터 초기화
    app.listen(PORT, () => {
      console.log(`API Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
  });

// RESTful API 엔드포인트 설정

// Posts
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    const postsCollection = db.collection('posts');
    const newPost = {
      createdAt: new Date(),
      title,
      content,
    };
    const result = await postsCollection.insertOne(newPost);

    res.status(201).json({ message: 'Post created successfully', postId: result.insertedId });
  } catch (error) {
    console.error('Error inserting post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await db.collection('posts').find().sort({createdAt: -1}).toArray();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
});

// Contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await db.collection('contacts').find().sort({ createdAt: -1 }).toArray();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    res.status(500).json({ message: 'Failed to fetch contact requests' });
  }
});


app.post('/api/contacts', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const contactsCollection = db.collection('contacts');
    const newContact = {
      createdAt: new Date(),
      name,
      email,
      message,
    };
    const result = await contactsCollection.insertOne(newContact);

    res.status(201).json({ message: 'Contact request created successfully', contactId: result.insertedId });
  } catch (error) {
    console.error('Error creating contact request:', error);
    res.status(500).json({ message: 'Failed to create contact request' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  const contactId = req.params.id;

  try {
    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(contactId) });

    if (result.deletedCount === 1) {
      res.json({ message: 'Contact request deleted successfully' });
    } else {
      res.status(404).json({ message: 'Contact request not found' });
    }
  } catch (error) {
    console.error('Error deleting contact request:', error);
    res.status(500).json({ message: 'Failed to delete contact request' });
  }
});


//Login
// 사용자 등록 엔드포인트
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
    };
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// 로그인 엔드포인트
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

// 예시로 보호된 라우트 (사용자 인증 필요)
app.get('/api/protected', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    res.json({ message: 'You have access to this protected route', userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});