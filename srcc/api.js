export const fetchSubreddits = async () => {
    try {
      const response = await fetch('https://www.reddit.com/subreddits.json');
      const json = await response.json();
      return json.data.children.map((post) => post.data);
    } catch (error) {
      throw new Error('Error fetching Reddit API data');
    }
  };
  
export const fetchSubredditPosts = async (subreddit) => {
    try {
      const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
      const json = await response.json();
      console.log(json);
      return json.data.children.map((post) => post.data);
    } catch (error) {
      throw new Error('Error fetching Reddit API data');
    }
  };
  
export const fetchPostComments = async (permalink) => {
    try {
      const response = await fetch(`https://www.reddit.com${permalink}.json`);
      const json = await response.json();
      console.log(json);

      return json[1].data.children.map((comment) => comment.data);
    } catch (error) {
        throw new Error('Error fetching subreddit comments');
    }
  ;}   