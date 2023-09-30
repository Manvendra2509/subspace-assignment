const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");
const _ = require("lodash");

app.get("/api/blog-stats", async (req, res) => {
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

    blogData = response.data;
    console.log(blogData);
    const totalBlogs = blogData.blogs.length;
    const longestBlog = _.maxBy(blogData.blogs, "title.length");
    const blogsWithPrivacy = _.filter(blogData.blogs, (blog) =>
      _.includes(_.toLower(blog.title), "privacy")
    );
    const uniqueBlogTitles = _.uniqBy(blogData.blogs, "title");

    res.json({
      totalBlogs,
      longestBlog: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles: uniqueBlogTitles.map((blog) => blog.title),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/blog-search", async (req, res) => {
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

    blogData = response.data;
    console.log(blogData);
    const query = req.query.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: 'Query parameter "query" is required' });
    }

    const matchingBlogs = blogData.blogs.filter((blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    );

    res.json(matchingBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
