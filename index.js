const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");
const _ = require("lodash");

const getBlogStats = _.memoize(async () => {
  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );

    const blogData = response.data;
    console.log("Fetching and calculating blog stats...");

    const totalBlogs = blogData.blogs.length;
    const longestBlog = _.maxBy(blogData.blogs, (blog) => blog.title.length);
    const blogsWithPrivacy = _.filter(blogData.blogs, (blog) =>
      _.includes(_.toLower(blog.title), "privacy")
    );
    const uniqueBlogTitles = _.uniqBy(blogData.blogs, "title");

    return {
      totalBlogs,
      longestBlog: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles: uniqueBlogTitles.map((blog) => blog.title),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}, () => "blog-stats-cache-key"); 

const searchBlogs = _.memoize(async (query) => {
  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );

    const blogData = response.data;
    console.log(`Searching for blogs with query: ${query}`);

    if (!query) {
      throw new Error('Query parameter "query" is required');
    }

    const matchingBlogs = blogData.blogs.filter((blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    );

    return matchingBlogs;
  } catch (error) {
    console.error(error);
    throw error;
  }
}, (query) => `blog-search-cache-key-${query}`);

app.get("/api/blog-stats", async (req, res) => {
  try {
    const blogStats = await getBlogStats();
    res.json(blogStats);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/blog-search", async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res
        .status(400)
        .json({ error: 'Query parameter "query" is required' });
    }

    const matchingBlogs = await searchBlogs(query);
    res.json(matchingBlogs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
