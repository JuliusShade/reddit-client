import React, { useState } from 'react';
import './SubReddits.css';
import logo1 from './pictures/RedditLogo.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubredditPosts } from './api';
import { setPosts, setFilter, fetchSubredditPostsAsync } from './slices/filterSlice';

export default function SubReddits({ subreddits }) {
  const dispatch = useDispatch();
  const selectedSubreddit = useSelector((state) => state.filter.selectedSubreddit);
  const [activeSubreddit, setActiveSubreddit] = useState(selectedSubreddit);

  const handleSubredditClick = async (subreddit) => {
    try {
      const posts = await fetchSubredditPosts(subreddit);
      dispatch(setPosts(posts));
      dispatch(setFilter(subreddit));
      setActiveSubreddit(subreddit);
    } catch (error) {
      console.error('Error fetching subreddit posts:', error);
    }
  };

  return (
    <div className="subreddits">
      <h2 className="subreddits-header">Subreddits</h2>
      {subreddits.map((subreddit) => (
        <div
          className={`subreddit-thread-container ${subreddit.display_name === activeSubreddit ? 'active' : ''}`}
          key={subreddit.id}
          onClick={() => handleSubredditClick(subreddit.display_name)}
        >
          <img
            src={subreddit.icon_img || `https://api.adorable.io/avatars/25/${subreddit.display_name}`}
            className="subreddit-logo"
            alt="Subreddit Logo"
          />
          <h3 className="subreddit-thread">{subreddit.display_name}</h3>
        </div>
      ))}
    </div>
  );
}
