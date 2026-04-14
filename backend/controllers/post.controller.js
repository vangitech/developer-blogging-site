const BlogPost = require('../models/BlogPost');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;
    let imageUrl = null;

    console.log('createPost called');
    console.log('req.file:', !!req.file);
    if (req.file) {
      console.log('req.file details:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filename: req.file.filename,
        path: req.file.path,
      });
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    console.log('Creating post:', { title, subtitle, content, hasImage: !!req.file, imageUrl });

    const post = new BlogPost({
      title,
      subtitle,
      content,
      imageUrl,
      author: req.user.userId,
    });

    await post.save();
    await post.populate('author', 'username');
    
    console.log('Post created successfully:', post._id);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;
    const updateData = { title, subtitle, content };

    // Upload new image if provided
    if (req.file) {
      console.log('Saving new image locally...');
      updateData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const post = await BlogPost.findOneAndUpdate(
      { _id: req.params.id, author: req.user.userId },
      updateData,
      { new: true }
    ).populate('author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findOneAndDelete({
      _id: req.params.id,
      author: req.user.userId,
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};