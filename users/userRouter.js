const express = require('express');

const UserDb = require('./userDb');
const PostDb = require('../posts/postDb');

const router = express.Router();


router.post('/', validateUser, async (req, res) => {
  try {
    const user = await UserDb.insert(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'There was an error adding the user',
    });
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  const {
    body: { text, user_id },
  } = req;

  try {
    const post = await PostDb.insert({ text, user_id });
    res.status(201).json(post);
  } catch (error) {

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

router.get('/:id', validateUserId, async (req, res) => {
  try {
    const { user: { id },
    } = req;

    const user = await UserDb.getById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving the user',
    });
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  const {
    user: { id },
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

router.delete('/:id', validateUserId, async (req, res) => {
  try {
    const {
      user: { id },
    } = req;

    const deleteUser = await UserDb.remove(id);

    res
      .status(200)
      .json({ message: `User with the id of ${id} was successfully deleted.` });
  } catch (error) {
    res.status(500).json({
      message: 'The user could not be deleted',
    });
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  try {
    const {
      body: { name },
      user: { id },
    } = req;
    const updatedUser = await UserDb.update(id, { name });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// middleware

async function validateUserId(req, res, next) {
  try {
    const {
      params: { id },
    } = req;
    const user = await UserDb.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res
        .status(404)
        .json({ message: `User with the id ${id} was not found.` });
    }
  } catch (error) {
    res.status(500).json({ message: 'There was an error validating the user' });
  }
}

function validateUser(req, res, next) {
  const {
    body,
    body: { name },
  } = req;
  if (!body) {
    res.status(400).json({ message: 'Missing user data' });
  } else if (!name) {
    res.status(400).json({ message: 'Missing required name field' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const {
    body: { text, user_id },
  } = req;
  if (!user_id) {
    res.status(400).json({ message: 'Missing post data' });
  } else if (!text) {
    res.status(400).json({ message: 'Missing required text field' });
  } else {
    next();
  }
}


module.exports = router;