# 📰 Interactive AI News Visualizer

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![Status](https://img.shields.io/badge/status-active-success)

An interactive web-based news analysis platform that fetches real-time articles, extracts data insights, and generates AI-powered summaries with dynamic visualizations. Users can explore multiple topics through an intuitive sidebar interface with live filtering capabilities.

## 🌟 Features

### Interactive Controls
- **Dynamic Topic Selection**: Switch between 6 news topics (Climate Change, AI, Space, Energy, Crypto, Health Tech)
- **Real-time Filtering**: Filter articles by news source and geographic coverage
- **Live Statistics**: View article counts, source distribution, and country mentions
- **One-Click Reset**: Instantly reset all filters to default state

### AI-Powered Analysis
- **Smart Summarization**: Google Gemini 2.0 Flash generates concise 2-3 sentence summaries
- **Data Extraction**: Automatically identifies numbers, percentages, and monetary values
- **Geographic Detection**: Recognizes country mentions and maps global coverage
- **Temporal Analysis**: Tracks publication patterns over time

### Interactive Visualizations
- **Source Distribution**: Horizontal bar chart showing top news sources
- **Publication Timeline**: Line graph tracking articles over time
- **Geographic Heatmap**: Interactive world map highlighting news coverage
- **Article Cards**: Clickable cards with images, descriptions, and external links

## 🚀 Live Demo

**[View Live Application](https://news-visualizer.netlify.app/)**

## 🛠️ Technologies

### Backend (Google Colab)
- **Python 3.8+**: Data processing and analysis
- **Pandas**: Data manipulation and structuring
- **Plotly**: Interactive visualization generation
- **Google Generative AI**: Gemini 2.0 Flash for text summarization
- **NewsAPI**: Real-time news article fetching

### Frontend (Static Web App)
- **HTML5**: Semantic structure and layout
- **CSS3**: Responsive design with gradient backgrounds
- **JavaScript (ES6+)**: Dynamic rendering and filter logic
- **Plotly.js**: Client-side interactive chart rendering

### Deployment
- **GitHub**: Version control and code hosting
- **Netlify**: Static site deployment with continuous integration

1. Open the provided Colab notebook
2. Add your API keys:
