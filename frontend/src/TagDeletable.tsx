import React from 'react';
import Chip from '@material-ui/core/Chip';
import './Post.css';

type TagDeletableProps = {
  tag: string;
  handleDelete: (tag: string) => void;
}
const TagDeletable = ({ tag, handleDelete }: TagDeletableProps) => {
  return <Chip
    className="tag-button"
    style={{ margin: 4 }}
    variant="outlined"
    label={tag}
    onDelete={() => { handleDelete(tag) }}
    color="secondary" />
}

export default TagDeletable;

