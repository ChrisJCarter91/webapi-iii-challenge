const express = require('express');

const PostDb = require('./postDb');

const router = express.Router();

router.use(express.json());


router.get('/', async (req, res) => {
  try {
    const posts = await PostDb.get(req.query);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'There was an error retrieving the posts',
    });
  }
});


router.get('/:id', async (req, res) => {
  console.log(`hit /:id with ${req.id}`);

  try {
    const post = await PostDb.getById(req.params.id);

    if (post && post.length) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the requested post',
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = await PostDb.remove(req.params.id);
    if (id > 0) {
      res.status(200).json({ message: 'The post was removed successfully.' });
    } else {
      res.status(404).json({ message: 'The post could not be found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error removing the post.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      params: { id },
      body: { text },
    } = req;

    if (!req.body.text) {
      res
        .status(400)
        .json({ message: 'Please provide some text to update the post.' });
    } else {
      const updatedPost = await PostDb.update(id, { text });
      res.status(200).json(updatedPost);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'There was an error updating the post' });
  }
});

// middleware

function validatePostId(req, res, next) {}

module.exports = router;