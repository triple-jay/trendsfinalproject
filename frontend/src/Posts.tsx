import React, { useEffect, useState } from 'react';
import './Posts.css';
import Post, { PostProps } from './Post';
import { Search, SearchType } from './Search';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CreatePost from './CreatePost';
import axios from 'axios';
import firebase from 'firebase';
import { User } from './Authenticated';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2e23ad',
    },
    secondary: {
      main: '#1ad4e0',
    },
  },
});


type PostWithID = PostProps & {
  id: string;
}

const Posts = (user: User) => {
  const [filterType, setFilterType] = useState<SearchType>('None');
  const [filterInput, setFilterInput] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [posts, setPosts] = useState<PostWithID[]>([]);
  const [upvotedPosts, setUpvotedPosts] = useState<string[]>(user.upvotedPostIDs);
  const [downvotedPosts, setDownvotedPosts] = useState<string[]>(user.downvotedPostIDs);

  const getPosts: () => void = async () => {
    const posts = await axios.get<PostWithID[]>('/getPosts');
    let userVoteInit = new Map();
    posts.data.forEach((post) => {
      userVoteInit.set(post.id, user.upvotedPostIDs.includes(post.id) ? 1 : user.downvotedPostIDs.includes(post.id) ? -1 : 0);
    })
    setPosts(posts.data.map((post) => {
      return ({ ...post, user, canInteract: true });
    }));

  }

  useEffect(() => getPosts(), []);

  const addPost = (post: PostProps) => {
    const { authorName, canInteract, ...postInfo } = post;
    axios.post('/createPost', postInfo)
      .then(res => res.data)
      .then(id => setPosts([...posts, { ...post, id, user, canInteract: true }]));
  }

  const upvotePost = (postid: string) => {
    const upvotes = [...upvotedPosts]
    const upvoteIndex = upvotes.findIndex(elt => elt === postid);
    if (upvoteIndex !== -1) {
      upvotes.splice(upvoteIndex, 1)
    } else {
      upvotes.push(postid as string);
    }
    setUpvotedPosts(upvotes);
  }

  const downvotePost = (postid: string) => {
    const downvotes = [...downvotedPosts]
    const downvoteIndex = downvotes.findIndex(elt => elt === postid);
    if (downvoteIndex !== -1) {
      downvotes.splice(downvoteIndex, 1)
    } else {
      downvotes.push(postid as string);
    }
    setDownvotedPosts(downvotes);
  }

  const filterPosts = () => {
    if (filterInput === '') {
      return posts;
    }
    const lowercaseInput = filterInput.toLowerCase();
    switch (filterType) {
      case ('Keyword'): return posts.filter((post) => post.body.toLowerCase().includes(lowercaseInput));
      case ('Author'): return posts.filter((post) => post.authorName.toLowerCase().includes(lowercaseInput));
      case ('Tag'): return posts.filter((post) => post.tags.map((tag) => tag.toLowerCase()).includes(lowercaseInput));
      case ('Upvoted'): return posts.filter((post) => upvotedPosts.includes(post.id));
      case ('Downvoted'): return posts.filter((post) => downvotedPosts.includes(post.id));
      default: return posts;
    }
  }

  const clearFilter = () => {
    setFilterType('Keyword');
    setFilterInput('');
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Grid container spacing={2} justify="space-between" alignItems="center">
          <Grid item xs={9}>
            <h1>CUBlogs</h1>
            <button onClick={() => {
              firebase.auth().signOut().then(function () {
                // Sign-out successful.
              }).catch(function (error) {
                // An error happened.
              });
            }}>Sign out</button>
          </Grid>
          <Grid item xs={3}>
            <button id="new-post-button" onClick={() => setCreateDialogOpen(true)}>+ Create post</button>
          </Grid>
        </Grid>
        <div className="search">
          <Search setFilterType={(newType: SearchType) => setFilterType(newType)} setFilterInput={(newInput: string) => setFilterInput(newInput)}></Search>
          {filterInput ?
            <div>
              <p style={{ display: "inline-block" }}>{"Filtered by " + (filterType === "Upvoted" || filterType === "Downvoted" ? "posts you've " + filterType.toLowerCase() : filterType.toLowerCase() + ": " + filterInput)}</p>
              <p style={{ display: "inline-block" }} id="clear-button" onClick={clearFilter}>Clear filter</p>
            </div>
            : <p>Viewing all posts</p>}
        </div>
        <div className="posts">
          {filterPosts().map((post) => <Post key={post.id} {...post} canInteract={true} upvotePost={upvotePost} downvotePost={downvotePost} />)}
        </div>
      </div>
      <CreatePost isOpen={createDialogOpen} setOpen={setCreateDialogOpen} addPost={addPost} user={user}></CreatePost>
    </ThemeProvider>
  );
}

export default Posts;