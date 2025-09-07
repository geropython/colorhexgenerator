# Color Hex Web App

This project is a simple web application that allows users to upload an image (JPG, PNG) and retrieves the dominant color from the image in hexadecimal format. The application displays both the color and its hexadecimal value, along with an optional name for the color.

## Project Structure

```
color-hex-webapp
├── public
│   ├── index.html       # Main HTML file for the web application
│   ├── style.css        # Styles for the web application
│   └── script.js        # Client-side JavaScript for handling image uploads
├── src
│   └── server.js        # Server-side code for handling image uploads
├── package.json         # Configuration file for npm
└── README.md            # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd color-hex-webapp
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   node src/server.js
   ```

2. Open your web browser and navigate to `http://localhost:3000` (or the port specified in your server code).

3. Use the form to upload an image. The application will process the image and display the dominant color along with its hexadecimal value.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

## License

This project is licensed under the MIT License.