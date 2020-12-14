import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import './CreatePost.css';
import TextareaAutosize from 'react-textarea-autosize';
import TagDeletable from './TagDeletable';
import Post, { PostProps } from './Post';
import 'firebase/auth';
import { User } from './Authenticated';

type CreatePostProps = {
  isOpen: boolean,
  setOpen: (open: boolean) => void,
  addPost: (post: PostProps) => void,
  user: User,
}

const CreatePost = ({ isOpen, setOpen, addPost, user }: CreatePostProps) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [titleErrorText, setTitleErrorText] = useState("Don't forget a title!");
  const [bodyErrorText, setBodyErrorText] = useState("Don't forget a post body!");

  const updateTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (event.target.value.length === 0) {
      setTitleErrorText('Please add a title!');
    }
    else {
      setTitleErrorText('');
    }
  }

  const updateBody = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
    if (event.target.value.length === 0) {
      setBodyErrorText('Please add a post body!');
    }
    else {
      setBodyErrorText('');
    }
  }

  const updateTagInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  }

  const addTag = () => {
    setTags([...tags, tagInput]);
    setTagInput('');
  }

  const deleteTag = (tag: string) => {
    const tagsCopy = [...tags];
    const tagIndex = tagsCopy.indexOf(tag);
    tagsCopy.splice(tagIndex, 1);
    setTags(tagsCopy);
    setTagInput('');
  }

  const clearInputs = () => {
    setTitle('');
    setBody('');
    setTags([]);
    setTagInput('');
  }

  const postInfo = {
    title: title,
    authorName: user.firstName + ' ' + user.lastName,
    dateTime: new Date(),
    body: body,
    tags: tags,
    upvotes: 0,
    canInteract: false
  };

  return <Dialog disableBackdropClick open={isOpen} onClose={() => setOpen(false)} maxWidth="md" fullWidth={true} >
    <div id="open-dialog" style={{ padding: 36 }}>
      <h1>Create a new post</h1>
      <h2>Title</h2>
      <input value={title} className="input-box" onChange={updateTitle}></input>
      <p className="error-text">{titleErrorText}</p>
      <h2>Body</h2>
      <TextareaAutosize className="input-box" value={body} onChange={updateBody} />
      <p className="error-text">{bodyErrorText}</p>
      <h2>Tags</h2>
      {tags.length === 0 ? <p>No tags yet!</p> : tags.map((tag) => <TagDeletable tag={tag} handleDelete={deleteTag}></TagDeletable>)}
      <Grid container spacing={1} alignItems="baseline">
        <Grid item xs={4}>
          <input value={tagInput} className="input-box" onChange={updateTagInput}></input>
        </Grid>
        <Grid item xs={2}>
          <button id="add-tag-button" onClick={addTag}>+ Add tag</button>
        </Grid>
      </Grid>
      <h2>Preview</h2>
      <Post {...postInfo} user={user}></Post>
      <Grid container spacing={1} alignItems="baseline">
        <Grid item xs={6}>
          <button id="cancel-button" onClick={() => {
            clearInputs();
            setOpen(false);
          }}>Cancel</button>
        </Grid>
        <Grid item xs={6}>
          <button id="create-button" onClick={() => {
            if (title.length > 0 && body.length > 0) {
              postInfo.canInteract = true;
              addPost({ ...postInfo, user });
              clearInputs();
              setOpen(false);
            }
          }}>Create</button>
        </Grid>
      </Grid>
    </div>
  </Dialog>
}

export default CreatePost;