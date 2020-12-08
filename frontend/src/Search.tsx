import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import './Search.css';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

type SearchType = | 'None' | 'Keyword' | 'Tag' | 'Author' | 'Upvoted' | 'Downvoted';

type SearchProps = {
  setFilterType: (newType: SearchType) => void,
  setFilterInput: (newInput: string) => void,
}

const Search = ({ setFilterType, setFilterInput }: SearchProps) => {
  const [searchType, setSearchType] = useState<SearchType>('Keyword');
  const [searchInput, setSearchInput] = useState('');

  const handleDropdownSelect = (event: any) => {
    setSearchType(event.target.value as SearchType);
  };

  const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSearchInput(event.target.value as string);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      updateFilter();
    }
  }

  const preventRefresh = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const updateFilter = () => {
    setFilterType(searchType);
    setFilterInput(searchInput);
  }

  return <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
    preventRefresh(event);
    updateFilter();
  }}>
    <Grid container spacing={2} alignItems="baseline">
      <Grid item xs={3}>
        <div className="dropdown">
          <button className="dropdown-button" disabled={true}>
            <Grid container alignItems="center">
              <Grid item xs={10}>
                {searchType}
              </Grid>
              <Grid item xs={2}>
                <ArrowDropDownIcon fontSize="small" />
              </Grid>
            </Grid>
          </button>
          <div className="dropdown-content">
            <button type="button" value="Keyword" onClick={handleDropdownSelect}>Keyword</button>
            <button type="button" value="Tag" onClick={handleDropdownSelect}>Tag</button>
            <button type="button" value="Author" onClick={handleDropdownSelect}>Author</button>
            <button type="button" value="Upvoted" onClick={handleDropdownSelect}>Upvoted</button>
            <button type="button" value="Downvoted" onClick={handleDropdownSelect}>Downvoted</button>
          </div>
        </div>
      </Grid>
      <Grid item xs={6}>
        <input
          className="search-bar"
          placeholder={searchType === "Upvoted" || searchType === "Downvoted" ? `Show posts you've ${searchType.toLowerCase()}` : `Search by ${searchType.toLowerCase()}`}
          value={searchType === "Upvoted" || searchType === "Downvoted" ? `Show posts you've ${searchType.toLowerCase()}` : searchInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={searchType === "Upvoted" || searchType === "Downvoted"}></input>
      </Grid>
      <Grid item xs={3}>
        <button type="submit" className="search-button">Search</button>
      </Grid>
    </Grid>
  </form>
}

/* Material-UI versions of each component, probably won't use because of styling
<FormControl variant="filled" style={{ width: '100%' }}>
        <Select
          value={searchType}
          onChange={handleDropdownSelect}
        >
          <MenuItem value={'Keyword'}>Keyword</MenuItem>
          <MenuItem value={'Tag'}>Tag</MenuItem>
          <MenuItem value={'Author'}>Author</MenuItem>
        </Select>
      </FormControl>

      <TextField id="filled-basic" placeholder={`Search by ${searchType.toLowerCase()}`} value={searchInput} onChange={handleInputChange} style={{ width: '100%' }} /

  <Button variant="contained" color="primary" size="large" style={{ width: '100%' }}>Search</Button>
  */

export { Search };
export type { SearchType };