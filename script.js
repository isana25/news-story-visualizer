// Load and display news data
async function loadNewsData() {
    try {
        const response = await fetch('./data/news_data.json');
        const data = await response.json();
        
        console.log('Data loaded successfully:', data);
        
        // Update stats
        updateStats(data);
        
        // Display AI summary
        displaySummary(data.summary);
        
        // Render visualizations
        renderVisualizations(data.visualizations);
        
        // Display articles
        displayArticles(data.articles);
        
        // Update generation date
        document.getElementById('generation-date').textContent = 
            new Date(data.metadata.generated_at).toLocaleString();
        
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('ai-summary').textContent = 
            'Error loading news data. Please check console for details.';
    }
}

function updateStats(data) {
    document.getElementById('total-articles').textContent = 
        data.metadata.total_articles || '0';
    document.getElementById('data-points').textContent = 
        data.stats.total_numbers_extracted || '0';
    document.getElementById('countries-count').textContent = 
        data.stats.countries_mentioned.length || '0';
}

function displaySummary(summary) {
    const summaryBox = document.getElementById('ai-summary');
    summaryBox.textContent = summary || 'No summary available.';
}

function renderVisualizations(visualizations) {
    // Render each visualization
    for (const [name, vizData] of Object.entries(visualizations)) {
        const containerId = `viz-${name.replace('_', '-')}`;
        const container = document.getElementById(containerId);
        
        if (container) {
            try {
                const figure = JSON.parse(vizData);
                Plotly.newPlot(container, figure.data, figure.layout, {
                    responsive: true,
                    displayModeBar: false
                });
            } catch (error) {
                console.error(`Error rendering ${name}:`, error);
            }
        }
    }
}

function displayArticles(articles) {
    const articlesContainer = document.getElementById('articles-list');
    articlesContainer.innerHTML = '';
    
    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'article-card';
        
        const imageUrl = article.image || 'https://via.placeholder.com/300x180?text=No+Image';
        
        card.innerHTML = `
            ${article.image ? `<img src="${imageUrl}" alt="${article.title}" class="article-image" onerror="this.src='https://via.placeholder.com/300x180?text=No+Image'">` : ''}
            <div class="article-source">${article.source}</div>
            <div class="article-date">${article.date}</div>
            <div class="article-title">${article.title}</div>
            <div class="article-description">${article.description || 'No description available.'}</div>
            <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="article-link">
                Read Full Article →
            </a>
        `;
        
        articlesContainer.appendChild(card);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadNewsData);
