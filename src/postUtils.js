export const mapPosts = (response) => {
    const posts = response.data.children.map((child) => {
      const { data } = child;
      return {
        id: data.id,
        title: data.title,
        author: data.author,
        subreddit: data.subreddit,
        thumbnail: data.thumbnail,
        url: data.url,
        num_comments: data.num_comments,
        created_utc: data.created_utc,
      };
    });
    return posts;
  };
  