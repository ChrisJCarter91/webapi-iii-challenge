const express = require('express');

const PostDb = require('./postDb');

const router = express.Router();



router.get('/', async (req, res) => {
  try {
    const posts = await PostDb.get(req.query);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: 'There was an error retrieving the posts',
    });
  }
});


router.get('/:id', validatePostId, async (req, res) => {
  console.log(`hit /:id with ${req.post.id}`);
  try {
    const {
      post: { id },
    } = req;
    const post = await PostDb.getById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving the requested post',
    });
  }
});

router.delete('/:id', validatePostId, async (req, res) => {
  try { const { post: { id },
    } = req;

    const deletePost = await PostDb.remove(id);
    if (id > 0) {
      res.status(200).json({ message: 'The post was removed successfully.' });
    } else {
      res.status(404).json({ message: 'The post could not be found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error removing the post.' });
  }
});

router.put('/:id', validatePostId, validatePost, async (req, res) => {
  try {
    const {
      post: { id },
      body: { text },
    } = req;

    const updatedPost = await PostDb.update(id, { text });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'There was an error updating the post' });
  }
});

// middleware

async function validatePostId(req, res, next) {
  try {
    const {
      params: { id },
    } = req;
    const post = await PostDb.getById(id);
    if (post) {
      req.post = post;
      next();
    } else {
      res
        .status(404)
        .json({ message: `Post with the id of ${id} was not found.` });
    }
  } catch (error) {
    res.status(500).json({ message: 'There was an error validating the post' });
  }
}

function validatePost(req, res, next) {
  const {
    body,
    body: { text },
  } = req;
  if (!body) {
    res.status(400).json({ message: 'Missing post data' });
  } else if (!text) {
    res.status(400).json({ message: 'Missing required text field' });
  } else {
    next();
  }
}

module.exports = router;