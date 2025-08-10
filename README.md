# 🎨 SoraPalette

**SoraPalette** is an AI-powered web application that extracts beautiful color palettes from images using OpenAI's GPT-4V model. Perfect for designers, developers, and anyone who needs to identify and extract colors from images quickly and accurately.

🌐 **Live Demo**: [sorapalette.haithamamireh.com](https://sorapalette.haithamamireh.com)

![SoraPalette Demo](images/logo.png)

## ✨ Features

- **AI-Powered Color Extraction**: Uses OpenAI's GPT-4V to intelligently identify and name colors
- **Instant Results**: Get color names, RGB values, and HEX codes in seconds
- **Beautiful UI**: Clean, modern interface with image preview
- **Multiple Formats**: Export colors in RGB and HEX formats
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Fast Processing**: Optimized for quick color analysis

## 🛠 Tech Stack

### Frontend
- **HTML5/CSS3/JavaScript** - Core web technologies
- **Parcel** - Build tool and bundler
- **Custom CSS** - Styled with modern UI/UX principles

### Backend
- **Python 3.11** - Core backend language
- **FastAPI** - Modern, fast web framework
- **OpenAI API** - GPT-4V for image analysis
- **Python Multipart** - File upload handling

### Infrastructure & Deployment
- **Docker** - Backend containerization
- **Nginx** - Web server and reverse proxy
- **Amazon S3 + CloudFront** - Frontend hosting
- **Amazon EC2** - Backend hosting
- **GitHub Actions** - CI/CD pipeline

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **Python** (3.11 or higher)
- **Docker** (optional, for containerized deployment)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/SoraPalette.git
cd SoraPalette
```

#### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:1234`

#### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirement.txt

# Create .env file with your OpenAI API key
echo "OPENAI_API_KEY=your_api_key_here" > .env

# Start the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

#### 4. Update Frontend Configuration
For local development, update the API endpoint in `script.js`:
```javascript
// Change from production URL to local
const response = await fetch("http://localhost:8000/process-image/", {
    method: "POST",
    body: formData,
});
```

## 🐳 Docker Deployment

### Backend Deployment with Docker
```bash
# Build the Docker image
docker build -t sorapalette-backend --build-arg OPENAI_API_KEY=your_api_key_here .

# Run the container
docker run -p 8001:8001 sorapalette-backend
```

### Production Deployment with Nginx

#### Nginx Configuration Example
```nginx
# Frontend (served as static files)
server {
    listen 80;
    server_name sorapalette.haithamamireh.com;
    
    location / {
        root /var/www/sorapalette/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}

# Backend API
server {
    listen 80;
    server_name sorapalette-back.haithamamireh.com;
    
    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📁 Project Structure

```
SoraPalette/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application file
│   ├── requirement.txt     # Python dependencies
│   ├── venv/              # Virtual environment
│   └── __pycache__/       # Python cache
├── images/                 # Static images and assets
│   ├── logo.png           # App logo
│   ├── favicon.ico        # Favicon
│   └── background-main.jpg # Background image
├── dist/                  # Production build files
├── node_modules/          # Node.js dependencies
├── index.html            # Main HTML file
├── script.js            # Frontend JavaScript
├── styles.css           # CSS styles
├── package.json         # Node.js dependencies and scripts
├── package-lock.json    # Lock file for npm
├── Dockerfile          # Docker configuration
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🔌 API Endpoints

### POST `/process-image/`
Processes an uploaded image and extracts color palette.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Image file

**Response:**
```json
{
  "colors": [
    {
      "name": "Sky Blue",
      "rgb": "135, 206, 235",
      "hex": "#87CEEB"
    },
    {
      "name": "Forest Green",
      "rgb": "34, 139, 34",
      "hex": "#228B22"
    }
  ]
}
```

## 🎯 Usage

1. **Visit the Application**: Open [sorapalette.haithamamireh.com](https://sorapalette.haithamamireh.com) in your browser
2. **Upload an Image**: Click "Choose Image" and select an image file (PNG, JPG, JPEG, GIF)
3. **Process the Image**: Click "Upload Image" to start color extraction
4. **View Results**: See the extracted colors with their names, RGB, and HEX values
5. **Use the Colors**: Copy the color values for use in your projects

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🚦 Build Commands

### Development
```bash
# Start frontend development server
npm start

# Start backend development server
cd backend && uvicorn main:app --reload
```

### Production Build
```bash
# Build frontend for production
npm run build-prod

# The built files will be in the 'dist' directory
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Requirements

### Frontend Dependencies
- `parcel-bundler`: Build tool and bundler
- `dotenv`: Environment variable management
- `openai`: OpenAI API client (for potential client-side usage)

### Backend Dependencies
- `fastapi`: Web framework
- `python-multipart`: File upload handling
- `openai`: OpenAI API client
- `python-dotenv`: Environment variable management
- `uvicorn`: ASGI server

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend allows requests from your frontend domain
2. **API Key Issues**: Verify your OpenAI API key is correctly set in the `.env` file
3. **File Upload Errors**: Check file size limits and supported formats
4. **Build Issues**: Clear node_modules and reinstall dependencies

### Support

If you encounter any issues, please:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure your OpenAI API key has sufficient credits
4. Open an issue on the GitHub repository

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4V model
- **FastAPI** for the excellent Python web framework
- **Parcel** for the build tooling
- All contributors and users of SoraPalette

---

**Made with ❤️ by [Haitham Amireh](https://haithamamireh.com)**