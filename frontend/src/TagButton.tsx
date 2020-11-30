import React from 'react';
import Chip from '@material-ui/core/Chip';
import './Post.css';

type TagButtonProps = {
  tag: string;
  enabled: boolean;
}
const TagButton = ({ tag, enabled }: TagButtonProps) => {
  return <Chip
    className="tag-button"
    style={{ margin: 4 }}
    variant="outlined"
    label={tag}
    clickable={enabled}
    color="secondary" />
}

export default TagButton;

