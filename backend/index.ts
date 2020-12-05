import admin from 'firebase-admin';
import express from 'express';

const serviceAccount = require('./service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cublogs-ffa92.firebaseio.com"
});

const db = admin.firestore();

const app = express();
app.use(express.json());


type Post = {
    title: string;
    author: string;
    dateTime: Date;
    body: string;
    tags: string[];
    upvotes: number;
}

type PostWithID = Post & {
    id: string;
}

type FirebasePost = {
    title: string;
    author: string;
    dateTime: admin.firestore.Timestamp;
    body: string;
    tags: string[];
    upvotes: number;
}

type User = {
    name: string;
    upvotePosts: string[];
}

type UserWithID = User & {
    userid: string;
}

const postsCollection = db.collection('posts');

app.get('/getPosts', async (req, res) => {
    const postDocs = await postsCollection.get();
    const posts = postDocs.docs.map((doc) => {
        const firebasePost: FirebasePost = doc.data() as FirebasePost;
        const timestamp: admin.firestore.Timestamp = firebasePost.dateTime;
        const post: Post = { ...firebasePost, dateTime: timestamp.toDate() };
        const postWithID: PostWithID = { ...post, id: doc.id };
        return postWithID;
    });
    res.send(posts);
});

app.post('/createPost', async (req, res) => {
    const post = req.body as Post;
    const seconds: number = Math.round(new Date(post.dateTime).getTime() / 1000);
    const timestamp: admin.firestore.Timestamp = new admin.firestore.Timestamp(seconds, 0);
    const firebasePost: FirebasePost = { ...post, dateTime: timestamp };
    const newPost = await postsCollection.add(firebasePost);
    res.send(newPost.id);
});

app.post('/post/:id', async (req, res) => {
    const id = req.params.id;
    const updatedPost = req.body;
    await postsCollection.doc(id).update(updatedPost);
});

app.listen(8080, () => console.log('Server started!'));