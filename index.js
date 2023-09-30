const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');

app.get('/api/blog-stats', async (req, res, next) => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });
    const blogData = response.data;
    res.status(200).send(blogData);
    req.blogData = blogData;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error fetching blog data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
