"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const serviceAccount = require('./service-account.json');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: "https://cublogs-ffa92.firebaseio.com"
});
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/build')));
app.use(express_1.default.json());
const db = firebase_admin_1.default.firestore();
const postsCollection = db.collection('posts');
const usersCollection = db.collection('users');
app.get('/getPosts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postDocs = yield postsCollection.orderBy('dateTime', 'desc').get();
    const posts = postDocs.docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
        const firebasePost = doc.data();
        const { authorID } = firebasePost, postInfo = __rest(firebasePost, ["authorID"]);
        // retrieve author name
        const authorDoc = yield usersCollection.doc(authorID).get();
        const author = authorDoc.data();
        const authorName = author.firstName + ' ' + author.lastName;
        // convert Firebase Timestamp to JavaScript Date
        const timestamp = firebasePost.dateTime;
        const post = Object.assign(Object.assign({}, postInfo), { authorName: authorName, dateTime: timestamp.toDate(), id: doc.id });
        return post;
    }));
    res.send(yield Promise.all(posts));
}));
app.post('/createPost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { user } = _a, post = __rest(_a, ["user"]);
    const authorID = user.uid;
    const seconds = Math.round(new Date(post.dateTime).getTime() / 1000);
    const timestamp = new firebase_admin_1.default.firestore.Timestamp(seconds, 0);
    const firebasePost = Object.assign(Object.assign({}, post), { authorID: authorID, dateTime: timestamp });
    const newPost = yield postsCollection.add(firebasePost);
    res.send(newPost.id);
}));
app.post('/post/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedPost = req.body;
    yield postsCollection.doc(id).update(updatedPost);
}));
app.post('/createUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, firstName, lastName } = req.body;
    const firebaseUser = {
        firstName: firstName,
        lastName: lastName,
        upvotedPostIDs: [],
        downvotedPostIDs: [],
        postIDs: []
    };
    yield usersCollection.doc(uid).set(firebaseUser);
    res.send(uid);
}));
app.get('/getUser/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.query.uid;
    const userDoc = yield usersCollection.doc(uid).get();
    const user = userDoc.data();
    res.send(Object.assign(Object.assign({}, user), { uid }));
}));
app.post('/downvotePost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let change = 0;
    const uid = req.query.uid;
    const postid = req.query.postid;
    const userDoc = yield usersCollection.doc(uid).get();
    const user = userDoc.data();
    let upvotedPosts = user.upvotedPostIDs;
    let downvotedPosts = user.downvotedPostIDs;
    const postIndex = downvotedPosts.indexOf(postid);
    const removeFromIndex = upvotedPosts.indexOf(postid);
    if (postIndex !== -1) {
        downvotedPosts.splice(postIndex, 1);
        change += 1;
    }
    else {
        downvotedPosts.push(postid);
        change -= 1;
        if (removeFromIndex !== -1) {
            upvotedPosts.splice(removeFromIndex, 1);
            change -= 1;
        }
        ;
    }
    const update = { downvotedPostIDs: downvotedPosts, upvotedPostIDs: upvotedPosts };
    yield usersCollection.doc(uid).update(update).catch((err) => console.log(err));
    const postDoc = yield postsCollection.doc(postid).get();
    const post = postDoc.data();
    yield postsCollection.doc(postid).update({ upvotes: post.upvotes + change });
    res.send({ change: change });
}));
app.post('/upvotePost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let change = 0;
    const uid = req.query.uid;
    const postid = req.query.postid;
    const userDoc = yield usersCollection.doc(uid).get();
    const user = userDoc.data();
    let upvotedPosts = user.upvotedPostIDs;
    let downvotedPosts = user.downvotedPostIDs;
    const postIndex = upvotedPosts.indexOf(postid);
    const removeFromIndex = downvotedPosts.indexOf(postid);
    if (postIndex !== -1) {
        upvotedPosts.splice(postIndex, 1);
        change -= 1;
    }
    else {
        upvotedPosts.push(postid);
        change += 1;
        if (removeFromIndex !== -1) {
            downvotedPosts.splice(removeFromIndex, 1);
            change += 1;
        }
        ;
    }
    const update = { downvotedPostIDs: downvotedPosts, upvotedPostIDs: upvotedPosts };
    yield usersCollection.doc(uid).update(update).catch((err) => console.log(err));
    const postDoc = yield postsCollection.doc(postid).get();
    const post = postDoc.data();
    yield postsCollection.doc(postid).update({ upvotes: post.upvotes + change });
    res.send({ change: change });
}));
app.listen(process.env.PORT || 8080, () => console.log('Server started!'));
