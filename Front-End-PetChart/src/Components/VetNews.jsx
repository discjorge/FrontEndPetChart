import React, { useState, useEffect } from 'react';
import '../Styles/VetNews.css';

const VetNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://newsapi.org/v2/everything?q=veterinary+medicine&apiKey=d376711f05dd428e896bb82c73046b50');
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        setNews(data.articles || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="vet-news-card">
        <div className="vet-news-header">
          <h3>🐾 Veterinary News</h3>
        </div>
        <div className="vet-news-content">
          <div className="loading">Loading latest veterinary news...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vet-news-card">
        <div className="vet-news-header">
          <h3>🐾 Veterinary News</h3>
        </div>
        <div className="vet-news-content">
          <div className="error">Unable to load news: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="vet-news-card">
      <div className="vet-news-header">
        <h3>🐾 Veterinary News</h3>
      </div>
      <div className="vet-news-content">
        {news.length === 0 ? (
          <div className="no-news">No veterinary news available at the moment.</div>
        ) : (
          <div className="news-list">
            {news.slice(0, 3).map((article, index) => (
              <div key={index} className="news-item">
                <div className="news-title">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    {article.title}
                  </a>
                </div>
                <div className="news-description">
                  {article.description && article.description.length > 120 
                    ? `${article.description.substring(0, 120)}...` 
                    : article.description}
                </div>
                <div className="news-date">
                  {formatDate(article.publishedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
        {news.length > 3 
        }
      </div>
    </div>
  );
};

export default VetNews; 