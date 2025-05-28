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
  const [hoverPlay, setHoverPlay] = useState(false);

  // Helper to check if visuals is a video
  const isVideo =
    item.visuals &&
    item.visuals.mime_type &&
    item.visuals.mime_type.startsWith("video");

  useEffect(() => {
    if (audioRef.current && item.audio) onAudioRef(item.id, audioRef.current);
  }, [audioRef, item.id, onAudioRef, item.audio]);

  // Play video if: tour is playing this card, or play button is used, or hoverPlay is true
  useEffect(() => {
    if (isVideo && item.visuals) {
      const videoEl = document.getElementById(`video-${item.id}`);
      if (videoEl) {
        if (isActive && isTourPlaying) {
          videoEl.loop = true;
          videoEl.play().catch(() => {});
        } else if (hoverPlay) {
          videoEl.loop = false;
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
          videoEl.currentTime = 0;
          videoEl.loop = false;
        }
      }
    }
  }, [isActive, isTourPlaying, isVideo, item.visuals, item.id, hoverPlay]);

  // When video ends after hover, reset to beginning
  useEffect(() => {
    if (!isVideo || !item.visuals) return;
    const videoEl = document.getElementById(`video-${item.id}`);
    if (!videoEl) return;
    const handleEnded = () => {
      if (hoverPlay) {
        setHoverPlay(false);
        videoEl.currentTime = 0;
      }
    };
    videoEl.addEventListener("ended", handleEnded);
    return () => {
      videoEl.removeEventListener("ended", handleEnded);
    };
  }, [isVideo, item.visuals, item.id, hoverPlay]);

  // Play video on hover or when tour is going on
  const handleVideoMouseEnter = () => {
    if (!(isActive && isTourPlaying)) {
      setHoverPlay(true);
    }
  };

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
      {/* Visuals: image or video */}
      {item.visuals && isVideo ? (
        <video
          id={`video-${item.id}`}
          className={styles.cardImg}
          src={item.visuals.url}
          width="100%"
          height="140"
          muted
          playsInline
          preload="metadata"
          style={{
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "12px",
            background: "#f2f2f2",
          }}
          onMouseEnter={handleVideoMouseEnter}
        />
      ) : item.visuals && item.visuals.url ? (
        <img
          className={styles.cardImg}
          src={item.visuals.url}
          alt={`Afbeelding van ${item.name}`}
        />
      ) : null}
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
