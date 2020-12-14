import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import TagButton from './TagButton';
import Grid from '@material-ui/core/Grid';
import './Post.css';
import axios from 'axios';

type User = {
  uid: string;
  firstName: string;
  lastName: string;
  upvotedPostIDs: string[];
  downvotedPostIDs: string[];
  postIDs: string[];
}

type PostProps = {
  title: string,
  authorName: string,
  dateTime: Date,
  body: string,
  tags: string[],
  upvotes: number,
  canInteract: boolean,
  user: User,
  id?: string,
  upvotePost?: (postid: string) => void,
  downvotePost?: (postid: string) => void
}

const Post = ({ title, authorName, dateTime, body, tags, upvotes, canInteract, user, id,
  upvotePost, downvotePost }: PostProps) => {

  const [upvoted, setUpvoted] = useState(user.upvotedPostIDs ? user.upvotedPostIDs.includes(id as string) : false);
  const [downvoted, setDownvoted] = useState(user.downvotedPostIDs ? user.downvotedPostIDs.includes(id as string) : false);
  const [numUpvotes, setNumUpvotes] = useState(upvotes);
  const [disableVote, setDisableVote] = useState(false);

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: 'numeric' };

  const upvote = () => {
    setDownvoted(false);
    setUpvoted(!upvoted);
    setDisableVote(true);
    if (upvotePost) upvotePost(id as string);
    axios.post(`/upvotePost?uid=${user.uid}&postid=${id}`)
      .then(res => res.data)
      .then(data => {
        setNumUpvotes(numUpvotes + data.change);
        setDisableVote(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const downvote = () => {
    setUpvoted(false);
    setDownvoted(!downvoted);
    setDisableVote(true);
    if (downvotePost) downvotePost(id as string);
    axios.post(`/downvotePost?uid=${user.uid}&postid=${id}`)
      .then(res => res.data)
      .then(data => {
        setNumUpvotes(numUpvotes + data.change);
        setDisableVote(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  return <Card style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
    <h2 id="post-title">{title}</h2>
    <em id="post-info">Posted by <strong>{authorName}</strong> on <strong>{new Date(dateTime).toLocaleDateString("en-US", dateOptions)}</strong> at <strong>{new Date(dateTime).toLocaleTimeString("en-US", timeOptions)}</strong></em>
    <p id="post-body">{body}</p>
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
    >
      <Grid item xs={12} sm={6} md={7} lg={9}>
        {tags.map((tag) => <TagButton key={tag} tag={tag} enabled={canInteract} />)}
      </Grid>
      <Grid item container xs={12} sm={6} md={5} lg={3} justify="space-around" alignItems="center">
        <Grid item>
          <IconButton aria-label="downvote" onClick={downvote} color={downvoted ? "secondary" : "default"} disabled={!canInteract || disableVote}>
            <ArrowDropDownIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item>
          <p id="num-upvotes">{numUpvotes}</p>
        </Grid>
        <Grid item>
          <IconButton aria-label="upvote" onClick={upvote} color={upvoted ? "secondary" : "default"} disabled={!canInteract || disableVote}>
            <ArrowDropUpIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  </Card>

}

export default Post;
export type { PostProps };