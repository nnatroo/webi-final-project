const express = require('express');
const router = express.Router();
const Blog = require("../models/blog");

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        console.log('No user found.');
        res.redirect('/login');
    }
}

router.get('/', requireAuth, async function (req, res, next) {
    const blogs = await Blog.find({});
    blogs.reverse();
    const email = req.session.user.email;

    res.render('blogs', {blogs, email});
});

router.get('/new', requireAuth, function (req, res, next) {
    const email = req.session.user.email;
    res.render('new_blog', {error: null, email});
});

router.post('/new', requireAuth, async function (req, res, next) {
    const { title, description, content } = req.body;

    if (!title || !content) {
        return res.render("new_blog", { error: "Missing title or content" });
    }

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthString = months[currentMonth];
    const formatedDate = `${currentDay} ${currentMonthString} ${currentYear}`;

    try {
        const imageUrl = await fetchImageFromUnsplash(title);
        const imageName = `blog-${Date.now()}.jpg`;
        const savedImagePath = await downloadImage(imageUrl, imageName);

        const newBlogData = {
            id: String(Date.now()),
            title,
            description,
            content,
            author: req.session.user.email,
            date: new Date().toLocaleString(),
            formatedDate,
            image: savedImagePath
        };

        const newBlog = new Blog(newBlogData);
        await newBlog.save();

        res.redirect('/blogs');
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

router.get('/:blogId', requireAuth, async function (req, res, next) {
    const email = req.session.user.email;
    const {blogId} = req.params

    try {
        const blogs = await Blog.find();
        const blog = await Blog.findOne({id: blogId});
        res.render('blog', {email, blogs, blog});
    } catch (err) {
        console.log(err);
        res.redirect('/404')
    }
});

module.exports = router;

const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function downloadImage(imageUrl, imageName) {
    const imagePath = path.join(__dirname, '..', 'public', 'uploads', imageName);

    const writer = fs.createWriteStream(imagePath);
    const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(`/uploads/${imageName}`));
        writer.on('error', reject);
    });
}

async function fetchImageFromUnsplash(query) {
    const accessKey = "Pfz1OtAbEct3vF7PmfioMrui1l_2N-Dif1bC09l6qXE";
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${accessKey}`;

    const response = await axios.get(url);
    return response.data.urls.small; // or full, regular, etc.
}


