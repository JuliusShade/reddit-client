import React, { useEffect, useState } from 'react';
import './Post.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLike, toggleDislike, setPosts, fetchSubredditPostsAsync } from './slices/filterSlice';
import { fetchPostComments } from './api';
import Skeleton from 'react-loading-skeleton';

export default function Post() {
  const filter = useSelector((state) => state.filter.filter);
  const posts = useSelector((state) => state.filter.posts);
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsActive, setCommentsActive] = useState(false);
  const [activeCommentButton, setActiveCommentButton] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([])
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (filter === '' || filter === null) {
      setFilteredPosts(posts); // Show all posts without filtering
    } else {
      const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase() === filter.toLowerCase()
      );
      setFilteredPosts(filteredPosts);
    }
  }, [filter, posts]);
    
  useEffect(() => {
    dispatch(fetchSubredditPostsAsync());
  }, [dispatch]);

  const handleToggleLike = (index) => {
    dispatch(toggleLike(index));
  };

  const handleToggleDislike = (index) => {
    dispatch(toggleDislike(index));
  };

  const handleToggleComments = async (post, buttonIndex) => {
    const currentPostComments = showComments.slice();
    const index = currentPostComments.indexOf(post.id);
    if (index > -1) {
      currentPostComments.splice(index, 1);
      setComments([]);
      setActiveCommentButton(null); // Reset active comment button
    } else {
      try {
        setLoadingComments(true); // Start loading comments
        const fetchedComments = await fetchPostComments(post.permalink);
        const formattedComments = fetchedComments.map((comment) => ({
          id: comment.id,
          author: comment.author,
          text: comment.body,
          timestamp: comment.created_utc,
        }));
        setComments(formattedComments);
        currentPostComments.push(post.id);
        setActiveCommentButton(buttonIndex);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoadingComments(false); // Stop loading comments
      }
    }
    setShowComments(currentPostComments);
  };

  const convertToTimeAgo = (createdUtc) => {
    const currentUtc = Math.floor(Date.now() / 1000);
    const secondsAgo = currentUtc - createdUtc;
  
    if (secondsAgo < 60) {
      return `${secondsAgo} second${secondsAgo !== 1 ? 's' : ''} ago`;
    }
  
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
      return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
    }
  
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
      return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    }
  
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  };

  return (
    <div>
      {posts.map((post, index) => (
        <div className="post-container" key={index}>
          <div className="post">
            <h2 className="post-title">{post.title}</h2>
            <p className="post-details">
              Submitted by <span className="post-author">{post.author}</span> to&nbsp;
              {post.url.endsWith(".jpg") ? (
                <img src={post.url} alt="Post Image" className="post-image" />
              ) : null}
            </p>
            <p className="post-metadata">
              Score: {post.score} | Comments: {post.num_comments} | Created at: {convertToTimeAgo(post.created_utc)}
            </p>
            <div className="post-actions">
              <button
                className={`like-button ${post.liked ? 'active' : ''}`}
                onClick={() => handleToggleLike(index)}
              >
                {post.liked ? <i className="fas fa-arrow-up"></i> : <i className="far fa-arrow-up"></i>}
              </button>
              <span className="score">{post.score}</span>
              <button
                className={`dislike-button ${post.disliked ? 'active' : ''}`}
                onClick={() => handleToggleDislike(index)}
              >
                {post.disliked ? <i className="fas fa-arrow-down"></i> : <i className="far fa-arrow-down"></i>}
              </button>
              <button
                className={`comments-button ${activeCommentButton === index ? 'active' : ''}`}
                onClick={() => handleToggleComments(post, index)}
              >
                Comments
              </button>
            </div>
          </div>
          {showComments.includes(post.id) && (
            <div className="comment-section">
              {loadingComments ? ( // Skeleton loading for comments
                <div>
                  <Skeleton count={3} height={50} />
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <p className='comment-author'>{comment.author}</p>
                    <p className='comment-text'>{comment.text}</p>
                    <p className='comment-timestamp'>{convertToTimeAgo(comment.timestamp)}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );  
}
