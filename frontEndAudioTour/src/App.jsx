import React from "react";
import "./App.css";
import AudioTourList from "./assets/AudioTourList";

function App() {
  return (
    <div className="page-container">
      {/* Navigation/Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            {/* Replace with your logo or site name */}
            <span>Afstudeerportfolio</span>
          </div>
          <nav className="nav-links">
            {/* Example navigation links */}
            <a href="#audio-tour">Audio Tour</a>
            <a href="#over">Over</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content: Audio Tour */}
      <main>
        <AudioTourList />
      </main>
    </div>
  );
}

export default App;
