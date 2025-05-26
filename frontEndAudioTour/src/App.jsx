import React from "react";
import "./App.css";
import AudioTourList from "./assets/AudioTourList";
import logo from "../public/DT-LogoSide-Primary-Dark.svg";

function App() {
  return (
    <div className="page-container">
      {/* Navigation/Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-block">
            <img
              src={logo}
              alt="Digitaal Toegankelijk logo"
              className="header-logo"
            />
          </div>
          <nav className="nav-links">
            <a href="#trainingen">Trainingen</a>
            <a href="https://digitaaltoegankelijk.nl/diensten/toegankelijkheidsonderzoeken-audits/">
              Audits
            </a>
            <a href="https://digitaaltoegankelijk.nl/diensten/advies/">
              Advies
            </a>
            <a href="https://digitaaltoegankelijk.nl/nieuws/">Nieuws</a>
            <a href="#" className="active-link">
              Over ons
            </a>
            <a href="https://digitaaltoegankelijk.nl/contact/">Contact</a>
            <a
              href="https://digitaaltoegankelijk.nl/whitepapers/"
              className="cta-btn"
            >
              Gratis Whitepapers
            </a>
            <a
              href="https://digitaaltoegankelijk.nl/zoeken/"
              className="search-link"
            >
              Zoeken
            </a>
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
