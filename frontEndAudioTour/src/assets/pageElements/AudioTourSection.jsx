import React, { useRef, useState } from "react";
import "../../prototype1.css";

const AudioTourSection = ({ title, items }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
  const [pausedAudioIndex, setPausedAudioIndex] = useState(null);
  const audioRefs = useRef([]);

  // Play/pause/continue logic for individual audio buttons
  const playAudio = (index) => {
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
    if (!items[index]?.audio) {
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
    <section className="section">
      <h2>{title}</h2>
      <div className="section-content">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`card${activeCard === index ? " active-card" : ""}`}
            tabIndex={-1}
          >
            <img src={item.image} alt={`Afbeelding van ${item.name}`} />
            <p>{item.name}</p>
            <button
              onClick={() => playAudio(index)}
              disabled={!item.audio}
              className={!item.audio ? "unavailable-btn" : ""}
            >
              {getButtonContent(index)}
            </button>
            <audio
              ref={(el) => (audioRefs.current[index] = el)}
              src={item.audio || ""}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AudioTourSection;
