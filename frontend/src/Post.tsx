import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import TagButton from './TagButton';
import Grid from '@material-ui/core/Grid';
import './Post.css';

type PostProps = {
  title: string,
  author: string,
  dateTime: Date,
  body: string,
  tags: string[],
  upvotes: number,
  canInteract: boolean,
  id?: string
}

const Post = ({ title, author, dateTime, body, tags, upvotes, canInteract }: PostProps) => {

  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [numUpvotes, setNumUpvotes] = useState(upvotes);

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: 'numeric' };

  const upvote = () => {
    setDownvoted(false);
    if (upvoted) {
      setNumUpvotes(upvotes);
    }
    else {
      setNumUpvotes(upvotes + 1);
    }
    setUpvoted(!upvoted);
  }

  const downvote = () => {
    setUpvoted(false);
    if (downvoted) {
      setNumUpvotes(upvotes);
    }
    else {
      setNumUpvotes(upvotes - 1);
    }
    setDownvoted(!downvoted);
  }

  return <Card style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
    <h2 id="post-title">{title}</h2>
    <em id="post-info">Posted by <strong>{author}</strong> on <strong>{new Date(dateTime).toLocaleDateString("en-US", dateOptions)}</strong> at <strong>{new Date(dateTime).toLocaleTimeString("en-US", timeOptions)}</strong></em>
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
          <IconButton aria-label="downvote" onClick={downvote} color={downvoted ? "secondary" : "default"} disabled={!canInteract}>
            <ArrowDropDownIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item>
          <p id="num-upvotes">{numUpvotes}</p>
        </Grid>
        <Grid item>
          <IconButton aria-label="upvote" onClick={upvote} color={upvoted ? "secondary" : "default"} disabled={!canInteract}>
            <ArrowDropUpIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  </Card>

}

export default Post;
export type { PostProps };