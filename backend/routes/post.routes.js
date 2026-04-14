const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/post.controller');

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', authMiddleware, upload.single('image'), createPost);
router.put('/:id', authMiddleware, upload.single('image'), updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;