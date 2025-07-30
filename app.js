const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        description: 'Description of Homepage',
        pageClass: "homePage",
        cssFile: "style.css",
        jsFile: "script.js",
        fileExtension: ''
    });
});

// Start the server and dynamically import 'open'
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    try {
        // Use dynamic import for ES module 'open'
        const open = await import('open');
        await open.default(`http://localhost:${PORT}`);
        console.log('Browser opened successfully');
    } catch (err) {
        console.error('Failed to open browser:', err);
    }
});