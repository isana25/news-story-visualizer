let allData = {};
let currentTopic = null;
let currentSourceFilter = 'all';
let currentCountryFilter = 'all';

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    setupEventListeners();
});

async function loadData() {
    try {
        const response = await fetch('./data/news_data_interactive.json');
        const data = await response.json();
        allData = data.topics;
        
        console.log('Data loaded:', allData);
        
        // Initialize UI
        createTopicButtons();
        
        // Load first topic by default
        const firstTopic = Object.keys(allData)[0];
        if (firstTopic) {
            loadTopic(firstTopic);
        }
        
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('ai-summary').textContent = 
            'Error loading data. Please check console for details.';
    }
}

function createTopicButtons() {
    const container = document.getElementById('topic-selector');
    container.innerHTML = '';
    
    for (const [key, data] of Object.entries(allData)) {
        const btn = document.createElement('button');
        btn.className = 'topic-btn';
        btn.textContent = data.topic_name;
        btn.dataset.topic = key;
        btn.onclick = () => loadTopic(key);
        container.appendChild(btn);
    }
}

function loadTopic(topicKey) {
    currentTopic = topicKey;
    const data = allData[topicKey];
    
    // Update active button
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.topic === topicKey);
    });
    
    // Update header
    document.getElementById('current-topic-display').textContent = data.topic_name;
    
    // Update summary
    document.getElementById('ai-summary').textContent = data.summary;
    
    // Update stats
    document.getElementById('stat-articles').textContent = data.stats.total_articles;
    document.getElementById('stat-sources').textContent = data.stats.sources.length;
    document.getElementById('stat-countries').textContent = data.stats.countries.length;
    document.getElementById('date-range').textContent = data.stats.date_range;
    
    // Populate filters
    populateSourceFilter(data.stats.sources);
    populateCountryFilter(data.stats.countries);
    
    // Reset filters
    currentSourceFilter = 'all';
    currentCountryFilter = 'all';
    document.getElementById('source-filter').value = 'all';
    document.getElementById('country-filter').value = 'all';
    
    // Render visualizations and articles
    renderVisualizations(data);
    renderArticles(data.articles);
}

function populateSourceFilter(sources) {
    const select = document.getElementById('source-filter');
    select.innerHTML = '<option value="all">All Sources</option>';
    
    sources.forEach(source => {
        const option = document.createElement('option');
        option.value = source;
        option.textContent = source;
        select.appendChild(option);
    });
}

function populateCountryFilter(countries) {
    const select = document.getElementById('country-filter');
    select.innerHTML = '<option value="all">All Countries</option>';
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        select.appendChild(option);
    });
}

function renderVisualizations(data) {
    // Source distribution
    const sourcesData = Object.entries(data.source_counts);
    const sourcesFig = {
        data: [{
            type: 'bar',
            x: sourcesData.map(d => d[1]),
            y: sourcesData.map(d => d[0]),
            orientation: 'h',
            marker: {
                color: sourcesData.map((_, i) => `hsl(${240 + i * 15}, 70%, 60%)`)
            }
        }],
        layout: {
            margin: { l: 150, r: 20, t: 20, b: 40 },
            xaxis: { title: 'Number of Articles' },
            yaxis: { title: '' },
            height: 350
        }
    };
    Plotly.newPlot('viz-sources', sourcesFig.data, sourcesFig.layout, {responsive: true});
    
    // Timeline
    const timelineData = Object.entries(data.date_counts).sort();
    const timelineFig = {
        data: [{
            type: 'scatter',
            mode: 'lines+markers',
            x: timelineData.map(d => d[0]),
            y: timelineData.map(d => d[1]),
            line: { color: '#667eea', width: 3 },
            marker: { size: 8, color: '#764ba2' }
        }],
        layout: {
            margin: { l: 50, r: 20, t: 20, b: 60 },
            xaxis: { title: 'Date' },
            yaxis: { title: 'Articles Published' },
            height: 350
        }
    };
    Plotly.newPlot('viz-timeline', timelineFig.data, timelineFig.layout, {responsive: true});
    
    // Geographic map
    const countryData = Object.entries(data.country_counts);
    const geoFig = {
        data: [{
            type: 'choropleth',
            locations: countryData.map(d => d[0]),
            z: countryData.map(d => d[1]),
            locationmode: 'country names',
            colorscale: 'Reds',
            colorbar: { title: 'Mentions' }
        }],
        layout: {
            geo: {
                showframe: false,
                projection: { type: 'natural earth' }
            },
            margin: { l: 0, r: 0, t: 0, b: 0 },
            height: 400
        }
    };
    Plotly.newPlot('viz-geography', geoFig.data, geoFig.layout, {responsive: true});
}

function renderArticles(articles) {
    let filteredArticles = articles;
    
    // Apply source filter
    if (currentSourceFilter !== 'all') {
        filteredArticles = filteredArticles.filter(a => a.source === currentSourceFilter);
    }
    
    // Apply country filter (would need to add country to each article in data generation)
    if (currentCountryFilter !== 'all') {
        filteredArticles = filteredArticles.filter(a => 
            (a.title + a.description).includes(currentCountryFilter)
        );
    }
    
    const container = document.getElementById('articles-grid');
    document.getElementById('article-count').textContent = filteredArticles.length;
    
    container.innerHTML = filteredArticles.map(article => `
        <div class="article-card" onclick="window.open('${article.url}', '_blank')">
            ${article.image ? `<img src="${article.image}" alt="${article.title}" class="article-image" onerror="this.style.display='none'">` : ''}
            <div class="article-source">${article.source}</div>
            <div class="article-date">${article.date}</div>
            <div class="article-title">${article.title}</div>
            <div class="article-description">${article.description || 'No description available.'}</div>
        </div>
    `).join('');
}

function setupEventListeners() {
    // Source filter
    document.getElementById('source-filter').addEventListener('change', (e) => {
        currentSourceFilter = e.target.value;
        if (currentTopic) {
            renderArticles(allData[currentTopic].articles);
        }
    });
    
    // Country filter
    document.getElementById('country-filter').addEventListener('change', (e) => {
        currentCountryFilter = e.target.value;
        if (currentTopic) {
            renderArticles(allData[currentTopic].articles);
        }
    });
    
    // Reset button
    document.getElementById('reset-filters').addEventListener('click', () => {
        if (currentTopic) {
            loadTopic(currentTopic);
        }
    });
}
