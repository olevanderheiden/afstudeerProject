import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./prototype1.css";
import useUpdateTitle from "../../../hooks/useUpdateTitle";

const title = "Clickable Prototype 1";

const people = [
  "Aimee",
  "Annelies",
  "Emma",
  "Laure",
  "Peter",
  "Pim",
  "Sanne",
  "Petra",
  "Roel",
  "David",
];

const office = ["Benedenverdieping", "Bovenverdieping"];
const philosophy = ["Belang Toegankelijkheid", "B Corp"];
const items = [...people, ...office, ...philosophy];

// Helper: get possible audio sources for an item
const getPossibleAudioSrcs = (name) => [
  `audio/prototype/${name.toLowerCase().replace(/ /g, "_")}.wav`,
  `audio/${name.toLowerCase().replace(/ /g, "_")}.mp3`,
];

const ClickablePrototype1 = () => {
  useUpdateTitle(title);
  const [isInIframe, setIsInIframe] = useState(false);
  const [isTourLoading, setIsTourLoading] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [tourAbortController, setTourAbortController] = useState(null);
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
  const [pausedAudioIndex, setPausedAudioIndex] = useState(null);
  // Store for each item: { exists: true/false, src: string or null }
  const [audioExists, setAudioExists] = useState([]);
  const navigate = useNavigate();
  const audioRefs = useRef([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);
  }, []);

  // Check if an audio file exists
  const checkAudioExists = (src) => {
    return new Promise((resolve) => {
      const audio = new window.Audio();
      audio.src = src;
      audio.addEventListener("canplaythrough", () => resolve(true), {
        once: true,
      });
      audio.addEventListener("error", () => resolve(false), { once: true });
    });
  };

  // On mount, check all possible audio files for each item and pick the first that exists
  useEffect(() => {
    const checkAllAudio = async () => {
      const checks = await Promise.all(
        items.map(async (name) => {
          const srcs = getPossibleAudioSrcs(name);
          for (let src of srcs) {
            if (await checkAudioExists(src)) {
              return { exists: true, src };
            }
          }
          return { exists: false, src: null };
        })
      );
      setAudioExists(checks);
    };
    checkAllAudio();
    // eslint-disable-next-line
  }, []);

  // Helper: get the audio src for an index (returns null if not found)
  const getAudioSrc = (idx) =>
    audioExists[idx] && audioExists[idx].exists ? audioExists[idx].src : null;

  // Play all available audio files in order, scroll and focus to each card
  const handleTourStart = async () => {
    if (isTourLoading) {
      if (tourAbortController) {
        tourAbortController.abort();
      }
      setIsTourLoading(false);
      setActiveCard(null);
      setTourAbortController(null);
      return;
    }

    setIsTourLoading(true);
    setPlayingAudioIndex(null);
    setPausedAudioIndex(null);
    const abortController = new AbortController();
    setTourAbortController(abortController);

    const playableIndexes = audioExists
      .map((info, idx) => (info && info.exists ? idx : null))
      .filter((idx) => idx !== null);

    for (const idx of playableIndexes) {
      if (abortController.signal.aborted) break;

      const card = cardRefs.current[idx];
      if (card) {
        setActiveCard(idx);
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.focus({ preventScroll: true });
      }
      setPlayingAudioIndex(idx);
      setPausedAudioIndex(null);

      const src = getAudioSrc(idx);
      if (!src) continue;
      const audio = new window.Audio(src);
      await new Promise((resolve) => {
        audio.play();
        audio.onended = () => {
          setPlayingAudioIndex(null);
          resolve();
        };
        audio.onerror = () => {
          setPlayingAudioIndex(null);
          resolve();
        };
        abortController.signal.addEventListener(
          "abort",
          () => {
            audio.pause();
            audio.currentTime = 0;
            setPlayingAudioIndex(null);
            resolve();
          },
          { once: true }
        );
      });
    }
    setActiveCard(null);
    setPlayingAudioIndex(null);
    setPausedAudioIndex(null);
    setIsTourLoading(false);
    setTourAbortController(null);
  };

  // Play/pause/continue logic for individual audio buttons
  const playAudio = (index) => {
    if (isTourLoading) return;
    const audio = audioRefs.current[index];
    if (!audio) return;
    if (playingAudioIndex !== null && playingAudioIndex !== index) {
      return;
    }
    if (playingAudioIndex === index && !audio.paused) {
      audio.pause();
      setPausedAudioIndex(index);
      setPlayingAudioIndex(null);
      return;
    }
    if (pausedAudioIndex === index) {
      audio.play();
      setPlayingAudioIndex(index);
      setPausedAudioIndex(null);
      audio.onended = () => {
        setPlayingAudioIndex(null);
        setPausedAudioIndex(null);
      };
      audio.onerror = () => {
        setPlayingAudioIndex(null);
        setPausedAudioIndex(null);
      };
      return;
    }
    audio.currentTime = 0;
    audio.play();
    setActiveCard(index);
    setPlayingAudioIndex(index);
    setPausedAudioIndex(null);
    audio.onended = () => {
      setPlayingAudioIndex(null);
      setPausedAudioIndex(null);
    };
    audio.onerror = () => {
      setPlayingAudioIndex(null);
      setPausedAudioIndex(null);
    };
  };

  // Helper for button content
  const getButtonContent = (index) => {
    if (!audioExists[index]?.exists) {
      return "Niet beschikbaar";
    }
    if (
      playingAudioIndex === index &&
      audioRefs.current[index] &&
      !audioRefs.current[index].paused
    ) {
      return "Pauzeer";
    }
    if (pausedAudioIndex === index) {
      return "Doorgaan";
    }
    return "Afspelen";
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">Logo</div>
          <nav className="nav-links">
            <a>Trainingen</a>
            <a href="#">Audit</a>
            <a href="#">Advies</a>
            <a href="#">Nieuws</a>
            <a href="#">Over ons</a>
            <a href="#">Contact</a>
            <a href="#">Gratis White papers</a>
            <a href="#">Zoeken</a>
          </nav>
        </div>
      </header>

      {/* Tour Starten Button */}
      <div className="tour-starten-bar">
        <button
          className="tour-starten-btn"
          onClick={handleTourStart}
          aria-pressed={isTourLoading}
          disabled={isTourLoading || playingAudioIndex !== null}
        >
          {isTourLoading ? "Tour stoppen" : "Tour starten"}
        </button>
      </div>

      {/* Back Button */}
      {!isInIframe && (
        <button className="back-button" onClick={() => navigate("/")}>
          Terug naar Portfolio
        </button>
      )}

      {/* Main Content */}
      <main>
        <section className="section">
          <h2>Ons team</h2>
          <div className="section-content">
            {people.map((name, index) => (
              <div
                key={index}
                className={`card${activeCard === index ? " active-card" : ""}`}
                tabIndex={-1}
                ref={(el) => (cardRefs.current[index] = el)}
              >
                <img
                  src={`images/prototype/${name
                    .toLowerCase()
                    .replace(/ /g, "_")}.png`}
                  alt={`Afbeelding van ${name}`}
                />
                <p>{name}</p>
                <button
                  onClick={() => playAudio(index)}
                  disabled={
                    isTourLoading ||
                    (playingAudioIndex !== null &&
                      playingAudioIndex !== index) ||
                    !audioExists[index]?.exists
                  }
                  className={
                    !audioExists[index]?.exists ? "unavailable-btn" : ""
                  }
                >
                  {getButtonContent(index)}
                </button>
                <audio
                  ref={(el) => (audioRefs.current[index] = el)}
                  src={getAudioSrc(index) || ""}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Over het Kantoor</h2>
          <div className="section-content">
            {office.map((name, i) => {
              const index = people.length + i;
              return (
                <div
                  key={index}
                  className={`card${
                    activeCard === index ? " active-card" : ""
                  }`}
                  tabIndex={-1}
                  ref={(el) => (cardRefs.current[index] = el)}
                >
                  <img
                    src={`images/prototype/${name
                      .toLowerCase()
                      .replace(/ /g, "_")}.png`}
                    alt={`Afbeelding van ${name}`}
                  />
                  <p>{name}</p>
                  <button
                    onClick={() => playAudio(index)}
                    disabled={
                      isTourLoading ||
                      (playingAudioIndex !== null &&
                        playingAudioIndex !== index) ||
                      !audioExists[index]?.exists
                    }
                    className={
                      !audioExists[index]?.exists ? "unavailable-btn" : ""
                    }
                  >
                    {getButtonContent(index)}
                  </button>
                  <audio
                    ref={(el) => (audioRefs.current[index] = el)}
                    src={getAudioSrc(index) || ""}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="section">
          <h2>Onze filosofie</h2>
          <div className="section-content">
            {philosophy.map((name, i) => {
              const index = people.length + office.length + i;
              return (
                <div
                  key={index}
                  className={`card${
                    activeCard === index ? " active-card" : ""
                  }`}
                  tabIndex={-1}
                  ref={(el) => (cardRefs.current[index] = el)}
                >
                  <img
                    src={`images/prototype/${name
                      .toLowerCase()
                      .replace(/ /g, "_")}.png`}
                    alt={`Afbeelding van ${name}`}
                  />
                  <p>{name}</p>
                  <button
                    onClick={() => playAudio(index)}
                    disabled={
                      isTourLoading ||
                      (playingAudioIndex !== null &&
                        playingAudioIndex !== index) ||
                      !audioExists[index]?.exists
                    }
                    className={
                      !audioExists[index]?.exists ? "unavailable-btn" : ""
                    }
                  >
                    {getButtonContent(index)}
                  </button>
                  <audio
                    ref={(el) => (audioRefs.current[index] = el)}
                    src={getAudioSrc(index) || ""}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Social media links will be put here</p>
      </footer>
    </div>
  );
};

export default ClickablePrototype1;
