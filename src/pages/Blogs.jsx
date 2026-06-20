import { useState } from 'react';
import { blogs } from '../data/blogs';

export default function Blogs() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="blogs" className="page-view active">
      <div className="blogs-hero">
        <span className="sub-title">Ayurvedic Wisdom & Insights</span>
        <h1 className="page-title">Vedic Food & Lifestyle Resources</h1>
        <p className="page-subtitle">Learn about ancient healing nutrition, dynamic health benefits of A2 ghee, and Rajasthan's heritage crop methods.</p>
      </div>

      <div className="blogs-grid">
        {blogs.map(article => (
          <div key={article.id} className="blog-card" onClick={() => setSelected(article)}>
            <div className="blog-img-box">
              <img src={article.image} alt={article.title} className="blog-img" />
            </div>
            <div className="blog-info">
              <span className="blog-tag">{article.tag}</span>
              <h3 className="blog-card-title">{article.title}</h3>
              <p className="blog-snippet">{article.snippet}</p>
              <div className="blog-card-footer">
                <span>By {article.author.split(' (')[0]}</span>
                <span>{article.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <>
          <div className="blog-modal open">
            <div className="blog-modal-content glass-panel">
              <button className="blog-modal-close" onClick={() => setSelected(null)}><i className="fa-solid fa-xmark"></i></button>
              <span className="modal-blog-tag">{selected.tag}</span>
              <h2 className="modal-blog-title">{selected.title}</h2>
              <div className="modal-blog-meta">
                <span>Published on <strong>{selected.date}</strong> | Authored by <strong>{selected.author}</strong></span>
              </div>
              <img src={selected.image} alt={selected.title} className="modal-blog-img" />
              <div className="modal-blog-text" dangerouslySetInnerHTML={{ __html: selected.content }} />
            </div>
          </div>
          <div className="blog-modal-overlay open" onClick={() => setSelected(null)}></div>
        </>
      )}
    </section>
  );
}
