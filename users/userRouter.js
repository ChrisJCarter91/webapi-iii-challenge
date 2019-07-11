const express = require('express');

const UserDb = require('./userDb');
const PostDb = require('../posts/postDb');

const router = express.Router();

router.use(express.json());


router.post('/', async (req, res) => {
  try {
    const user = await UserDb.insert(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'There was an error adding the user',
    });
  }
});

router.post('/:id/posts', async (req, res) => {
  const {
    body: { text, user_id },
  } = req;

  try {
    if (!user_id || !text) {
      res
        .status(400)
        .json({ message: 'Please include a user id and post text.' });
    } else {
      const post = await PostDb.insert({ text, user_id });
      res.status(201).json(post);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'There was an error adding the post',
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await UserDb.get(req.query);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: 'There was an error retrieving the users',
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await UserDb.getById(req.params.id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving the user',
    });
  }
});

router.get('/:id/posts', async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const usersPosts = await UserDb.getUserPosts(id);
    if (usersPosts && usersPosts.length) {
      res.status(200).json(usersPosts);
    } else {
      res.status(404).json({ message: 'No posts for this users.' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'There was an error retrieving this users posts.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const deleteUser = await UserDb.remove(id);

    deleteUser > 0
      ? res
          .status(200)
          .json({ message: `User ${id} was successfully deleted.` })
      : res.status(404).json({ message: `User ${id} was not found.` });
  } catch (error) {
    res.status(500).json({
      message: 'The user could not be deleted',
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      params: { id },
      body: { name },
    } = req;
    const updatedUser = await UserDb.update(id, { name });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// middleware

function validateUserId(req, res, next) {}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;