import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSubredditPosts } from '../api';

const initialState = {
    filter: '',
    posts: [],
    filteredPosts: [],
    selectedSubreddit: '',
  };
  

export const fetchSubredditPostsAsync = createAsyncThunk(
    'filter/fetchSubredditPostsAsync',
    async (subreddit) => {
      try {
        const response = await fetchSubredditPosts(subreddit);
        return response;
      } catch (error) {
        throw new Error('Error fetching subreddit posts');
      }
    }
  );
  
  
  

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => {
        state.filter = action.payload;
        state.selectedSubreddit = action.payload;
      },
      
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.filteredPosts = action.payload;
    },
    toggleLike: (state, action) => {
      const post = state.posts[action.payload];
      if (!post.liked) {
        post.score += 1;
        post.liked = true;
        post.disliked = false;
      } else {
        post.score -= 1;
        post.liked = false;
      }
    },
    toggleDislike: (state, action) => {
      const post = state.posts[action.payload];
      if (!post.disliked) {
        post.score -= 1;
        post.liked = false;
        post.disliked = true;
      } else {
        post.score += 1;
        post.disliked = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSubredditPostsAsync.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.filteredPosts = action.payload;
      state.selectedSubreddit = state.filter;
    });
  },
  
});

export const { setFilter, setPosts, toggleLike, toggleDislike } = filterSlice.actions;

export default filterSlice.reducer;
