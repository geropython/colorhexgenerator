const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');

const app = express();
const port = 3000;

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const image = await Jimp.read(req.file.buffer);
        const color = image.getPixelColor(0, 0); // Get the color of the first pixel
        const hexColor = Jimp.intToRGBA(color);
        const hex = `#${((1 << 24) + (hexColor.r << 16) + (hexColor.g << 8) + hexColor.b).toString(16).slice(1)}`;

        res.json({ hex: hex, colorName: req.body.colorName || 'Unnamed Color' });
    } catch (error) {
        res.status(500).send('Error processing the image.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});