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
    authorName: string;
    body: string;
    dateTime: Date;
    tags: string[];
    title: string;
    upvotes: number;
}

type PostWithID = Post & {
    id: string;
}

type FirebasePost = {
    authorID: string;
    body: string;
    dateTime: admin.firestore.Timestamp;
    tags: string[];
    title: string;
    upvotes: number;
}

type FirebaseUser = {
    downvotedPostIDs: string[];
    firstName: string;
    lastName: string;
    postIDs: string[];
    upvotedPostIDs: string[];
}

type User = FirebaseUser & {
    uid: string;
}

const postsCollection = db.collection('posts');
const usersCollection = db.collection('users');

app.get('/getPosts', async (req, res) => {
    const postDocs = await postsCollection.orderBy('dateTime', 'desc').get();
    const posts = postDocs.docs.map(async (doc) => {
        const firebasePost: FirebasePost = doc.data() as FirebasePost;
        const { authorID, ...postInfo } = firebasePost;

        // retrieve author name
        const authorDoc = await usersCollection.doc(authorID).get();
        const author = authorDoc.data() as FirebaseUser;
        const authorName = author.firstName + ' ' + author.lastName;

        // convert Firebase Timestamp to JavaScript Date
        const timestamp: admin.firestore.Timestamp = firebasePost.dateTime;

        const post: PostWithID = { ...postInfo, authorName: authorName, dateTime: timestamp.toDate(), id: doc.id };
        return post;
    });
    res.send(await Promise.all(posts));
});

app.post('/createPost', async (req, res) => {
    const { user, ...post } = req.body;
    const authorID: string = user.uid;
    const seconds: number = Math.round(new Date(post.dateTime).getTime() / 1000);
    const timestamp: admin.firestore.Timestamp = new admin.firestore.Timestamp(seconds, 0);
    const firebasePost: FirebasePost = { ...post, authorID: authorID, dateTime: timestamp } as FirebasePost;
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
    let change: number = 0;
    const uid = req.query.uid as string;
    const postid = req.query.postid as string;
    const userDoc = await usersCollection.doc(uid).get();
    const user = userDoc.data() as User;
    let upvotedPosts = user.upvotedPostIDs;
    let downvotedPosts = user.downvotedPostIDs;
    const postIndex = downvotedPosts.indexOf(postid);
    const removeFromIndex = upvotedPosts.indexOf(postid);
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
    await usersCollection.doc(uid).update(update).catch((err) => console.log(err));
    const postDoc = await postsCollection.doc(postid).get();
    const post: FirebasePost = postDoc.data() as FirebasePost;
    await postsCollection.doc(postid).update({ upvotes: post.upvotes + change });
    res.send({ change: change });
});

app.post('/upvotePost', async (req, res) => {
    let change: number = 0;
    const uid = req.query.uid as string;
    const postid = req.query.postid as string;
    const userDoc = await usersCollection.doc(uid).get();
    const user = userDoc.data() as User;
    let upvotedPosts = user.upvotedPostIDs;
    let downvotedPosts = user.downvotedPostIDs;
    const postIndex = upvotedPosts.indexOf(postid);
    const removeFromIndex = downvotedPosts.indexOf(postid);
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
    await usersCollection.doc(uid).update(update).catch((err) => console.log(err));
    const postDoc = await postsCollection.doc(postid).get();
    const post: FirebasePost = postDoc.data() as FirebasePost;
    await postsCollection.doc(postid).update({ upvotes: post.upvotes + change });
    res.send({ change: change });
});

app.listen(8080, () => console.log('Server started!'));