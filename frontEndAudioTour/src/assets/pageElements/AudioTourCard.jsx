import React, { useRef, useEffect } from "react";
import styles from "../../styles/AudioTourCard.module.css";

const AudioTourCard = ({
  item,
  isActive,
  isTourPlaying,
  onPlay,
  onAudioRef,
}) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && item.audio) onAudioRef(item.id, audioRef.current);
  }, [audioRef, item.id, onAudioRef, item.audio]);

  const handleButtonClick = () => {
    if (!item.audio) return;
    onPlay(item.id);
  };

  return (
    <div
      className={`${styles.card} ${isActive ? styles.activeCard : ""}`}
      tabIndex={-1}
    >
      <img
        className={styles.cardImg}
        src={item.image}
        alt={`Afbeelding van ${item.name}`}
      />
      <p className={styles.cardName}>{item.name}</p>
      <p className={styles.sectionLabel}>{item.section}</p>
      <button
        onClick={handleButtonClick}
        disabled={!item.audio || isTourPlaying}
        className={`${styles.cardButton} ${
          !item.audio ? styles.unavailableBtn : ""
        }`}
      >
        {item.audio ? (isActive ? "Pauzeer" : "Afspelen") : "Niet beschikbaar"}
      </button>
      {item.audio && (
        <audio
          className={styles.cardAudio}
          ref={audioRef}
          src={item.audio}
          preload="auto"
        />
      )}
    </div>
  );
};

export default AudioTourCard;
