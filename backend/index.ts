import admin from 'firebase-admin';
import express from 'express';
import path from 'path';
import cors from 'cors';

const serviceAccount = require('./service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cublogs-ffa92.firebaseio.com"
});

const app = express();
app.use(cors());
//app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.json());
const db = admin.firestore();

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
    uid: string;
    firstName: string;
    lastName: string;
    upvotedPostIDs: string[];
    downvotedPostIDs: string[];
    postIDs: string[];
}

const postsCollection = db.collection('posts');
const usersCollection = db.collection('users');

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

app.post('/createUser', async (req, res) => {
    const { uid, firstName, lastName } = req.body;
    const firebaseUser = {
        firstName: firstName,
        lastName: lastName,
        upvotedPostIDs: [],
        downvotedPostIDs: [],
        postIDs: []
    }
    await usersCollection.doc(uid as string).set(firebaseUser);
    res.send(uid);
});

app.get('/getUser/', async (req, res) => {
    const uid = req.query.uid as string;
    const userDoc = await usersCollection.doc(uid).get();
    const user = userDoc.data() as User;
    res.send({ ...user, uid });
});

app.post('/downvotePost', async (req, res) => {
    let change: number = 0
    const uid = req.query.uid as string;
    const postid = req.query.postid as string;
    const userDoc = await usersCollection.doc(uid).get();
    const user = userDoc.data() as User;
    const upvotedPosts = user.upvotedPostIDs;
    const downvotedPosts = user.downvotedPostIDs;
    const postIndex = downvotedPosts ? downvotedPosts.findIndex(id => postid === id) : -1;
    const removeFromIndex = upvotedPosts ? upvotedPosts.findIndex(id => postid === id) : -1;
    if (postIndex !== -1) {
        downvotedPosts.splice(postIndex, 1);
        change += 1;
    } else {
        downvotedPosts.push(postid);
        change -= 1;
        if (removeFromIndex !== -1) {
            upvotedPosts.splice(removeFromIndex, 1);
            change -= 1;
        };
    }
    const update = { downvotedPostIDs: downvotedPosts, upvotedPostIDs: upvotedPosts }
    await usersCollection.doc(uid as string).update(update);
    res.send(change);
});

app.post('/upvotePost', async (req, res) => {
    let change: number = 0;
    const uid = req.query.uid as string;
    const postid = req.query.postid as string;
    const userDoc = await usersCollection.doc(uid).get();
    const user = userDoc.data() as User;
    const upvotedPosts = user.upvotedPostIDs;
    const downvotedPosts = user.downvotedPostIDs;
    const postIndex = upvotedPosts ? upvotedPosts.findIndex(id => postid === id) : -1;
    const removeFromIndex = downvotedPosts ? downvotedPosts.findIndex(id => postid === id) : -1;
    if (postIndex !== -1) {
        upvotedPosts.splice(postIndex, 1);
        change -= 1;
    } else {
        upvotedPosts.push(postid);
        change += 1;
        if (removeFromIndex !== -1) {
            downvotedPosts.splice(removeFromIndex, 1);
            change += 1;
        };
    }
    const update = { downvotedPostIDs: downvotedPosts, upvotedPostIDs: upvotedPosts }
    await usersCollection.doc(uid as string).update(update);
    res.send(change);
});

app.listen(8080, () => console.log('Server started!'));