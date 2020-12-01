import React, { useEffect, useState } from 'react';
import './Posts.css';
import Post, { PostProps } from './Post';
import { Search, SearchType } from './Search';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CreatePost from './CreatePost';
import axios from 'axios';

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

const Posts = () => {
    const [filterType, setFilterType] = useState<SearchType>('None');
  const [filterInput, setFilterInput] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [posts, setPosts] = useState<PostWithID[]>([]);

  const getPosts: () => void = async () => {
    const posts = await axios.get<PostWithID[]>('/getPosts');
    setPosts(posts.data);
  }

  useEffect(() => getPosts(), []);

  const addPost = (post: PostProps) => {
    axios.post('/createPost', post).then(res => res.data).then(id => setPosts([...posts, {...post, id}]));
  }

  const filterPosts = () => {
    if (filterInput === '') {
      return posts;
    }
    const lowercaseInput = filterInput.toLowerCase();
    switch (filterType) {
      case ('Keyword'): return posts.filter((post) => post.body.toLowerCase().includes(lowercaseInput));
      case ('Author'): return posts.filter((post) => post.author.toLowerCase().includes(lowercaseInput));
      case ('Tag'): return posts.filter((post) => post.tags.map((tag) => tag.toLowerCase()).includes(lowercaseInput));
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
          </Grid>
          <Grid item xs={3}>
            <button id="new-post-button" onClick={() => setCreateDialogOpen(true)}>+ Create post</button>
          </Grid>
        </Grid>
        <div className="search">
          <Search setFilterType={(newType: SearchType) => setFilterType(newType)} setFilterInput={(newInput: string) => setFilterInput(newInput)}></Search>
          {filterInput ?
            <div>
              <p style={{ display: "inline-block" }}>{`Filtered by ${filterType.toLowerCase()} "${filterInput}"`}</p>
              <p style={{ display: "inline-block" }} id="clear-button" onClick={clearFilter}>Clear filter</p>
            </div>
            : <p>Viewing all posts</p>}
        </div>
        <div className="posts">
          {filterPosts().map((post) => <Post {...post} />)}
        </div>
      </div>
      <CreatePost isOpen={createDialogOpen} setOpen={setCreateDialogOpen} addPost={addPost}></CreatePost>
    </ThemeProvider>
  );
}

export default Posts;