import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';


interface Item {
  id: string;
  name: string;
  image_url: string;
  rarity: string;
}

export default function HomePage() {

  // Пример коллекций
  const collections = [
    { id: 1, title: 'Legendary Set', image_url: '/collections/legendary.png' },
    { id: 2, title: 'Epic Set', image_url: '/collections/epic.png' },
    { id: 3, title: 'Rare Set', image_url: '/collections/rare.png' },
  ];

  return (
    <div className="home-page">
      <Navbar />
      <main className="container">
        <h2 className="page-title" style={{ marginTop: '3rem' }}>Collections</h2>
        <div className="collections-grid">
          {collections.map(c => (
            <div key={c.id} className="collection-card">
              <img src={c.image_url} alt={c.title} />
              <h3>{c.title}</h3>
            </div>
          ))}
        </div>
      </main>
      <footer className="footer">
        <div className="footer-section">
          <h4>Follow</h4>
          <a href="https://x.com" target="_blank">X</a>
          <a href="https://discord.com" target="_blank">Discord</a>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <a href="/support">Support</a>
        </div>

        <div className="footer-section">
          <h4>Markets</h4>
          <a href="/popular">Popular Collections</a>
          <a href="/ethereum">Ethereum</a>
          <a href="/arbitrum">Arbitrum</a>
          <a href="/polygon">Polygon</a>
        </div>
      </footer>
    </div>
  );
}
