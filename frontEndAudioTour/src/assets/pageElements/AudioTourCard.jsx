import React, { useRef, useEffect, useState } from "react";
import styles from "../../styles/AudioTourCard.module.css";

const AudioTourCard = ({
  item,
  isActive,
  isTourPlaying,
  onPlay,
  onAudioRef,
}) => {
  const audioRef = useRef(null);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    if (audioRef.current && item.audio) onAudioRef(item.id, audioRef.current);
  }, [audioRef, item.id, onAudioRef, item.audio]);

  useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        audioRef.current?.closest(`.${styles.card}`)?.focus();
      }, 100);
    }
  }, [isActive]);

  const handleButtonClick = () => {
    if (!item.audio) return;
    onPlay(item.id);
  };

  const isButtonDisabled = !item.audio || isTourPlaying;

  return (
    <div
      className={`${styles.card} ${isActive ? styles.activeCard : ""}`}
      tabIndex={isActive ? 0 : -1}
      aria-live={isActive ? "polite" : undefined}
    >
      <img
        className={styles.cardImg}
        src={item.image}
        alt={`Afbeelding van ${item.name}`}
      />
      {/* Functie field (optional, above name) */}
      {item.functie && <p className={styles.cardFunctie}>{item.functie}</p>}
      <p className={styles.cardName}>{item.name}</p>
      {/* Toggle beschrijving */}
      {item.beschrijving && (
        <>
          <button
            className={styles.toggleBeschrijvingBtn}
            onClick={() => setShowDescription((v) => !v)}
            type="button"
          >
            {showDescription ? "Verberg beschrijving" : "Toon beschrijving"}
          </button>
          {showDescription && (
            <p className={styles.cardBeschrijving}>{item.beschrijving}</p>
          )}
        </>
      )}
      <button
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        className={`${styles.cardButton} ${
          isActive ? styles.cardButtonActive : ""
        } ${!item.audio ? styles.unavailableBtn : ""}`}
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
