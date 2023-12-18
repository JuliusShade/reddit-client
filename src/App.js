import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './Header';
import SubReddits from './SubReddits';
import Post from './Post';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, fetchSubredditPostsAsync } from './slices/filterSlice';
import { fetchSubreddits } from './api';
import '@fortawesome/fontawesome-free/css/all.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faArrowUp, faArrowDown);

function App() {
  const selectedSubreddit = useSelector((state) => state.filter.selectedSubreddit); // Updated selector
  const dispatch = useDispatch();
  const [subreddits, setSubreddits] = useState([]);

  useEffect(() => {
    // Fetch initial subreddits and set the first one as the selected subreddit
    fetchSubreddits()
      .then((data) => {
        console.log('Fetched subreddits:', data);
        setSubreddits(data);

        // Set the first subreddit as the selected subreddit
        if (data.length > 0) {
          dispatch(setFilter(data[0].display_name));
        }
      })
      .catch((error) => {
        console.error('Error fetching subreddits:', error);
      });
  }, [dispatch]);

  useEffect(() => {
    // Fetch subreddit posts based on the selected subreddit
    if (selectedSubreddit) {
      dispatch(fetchSubredditPostsAsync(selectedSubreddit))
        .then((data) => {
          console.log('Fetched subreddit posts:', data);
        })
        .catch((error) => {
          console.error('Error fetching subreddit posts:', error);
        });
    }
  }, [selectedSubreddit, dispatch]);

  const handleSubredditClick = (subreddit) => {
    console.log('Subreddit clicked:', subreddit);
    dispatch(setFilter(subreddit));
  };

  return (
    <div className="App">
      <Header />
      <Post />
      <SubReddits subreddits={subreddits} onSubredditClick={handleSubredditClick} />
    </div>
  );
}

export default App;
