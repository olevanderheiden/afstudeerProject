import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/AudioTourList.module.css";
import AudioTourSection from "./pageElements/AudioTourSection";

const SECTION_LABELS = {
  ons_team: "Ons team",
  over_het_kantoor: "Over het Kantoor",
  onze_filosofie: "Onze filosofie",
};
const SECTION_ORDER = ["ons_team", "over_het_kantoor", "onze_filosofie"];

function AudioTourList() {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [tourPlaying, setTourPlaying] = useState(false);
  const [tourPaused, setTourPaused] = useState(false);
  const [tourQueue, setTourQueue] = useState([]);
  const [tourStep, setTourStep] = useState(0);
  const audioRefs = useRef({});

  useEffect(() => {
    fetch("http://backend.test/wp-json/wp/v2/audio_tour?per_page=1")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        const total = res.headers.get("X-WP-Total");
        return { total, promise: res.json() };
      })
      .then(async ({ total }) => {
        const allRes = await fetch(
          `http://backend.test/wp-json/wp/v2/audio_tour?per_page=${total}`
        );
        if (!allRes.ok) throw new Error("Network response was not ok");
        return allRes.json();
      })
      .then((data) => setTours(data))
      .catch((err) => setError(err.message));
  }, []);

  // Group and sort items
  const grouped = {
    ons_team: [],
    over_het_kantoor: [],
    onze_filosofie: [],
  };
  tours.forEach((tour) => {
    const sectie = tour.acf?.sectie;
    if (grouped[sectie]) {
      grouped[sectie].push({
        id: tour.id,
        name: tour.acf.naam || tour.title.rendered,
        image: tour.acf.afbeelding?.url,
        audio: tour.acf.audio?.url,
        section: SECTION_LABELS[sectie],
      });
    }
  });
  grouped.ons_team.sort((a, b) =>
    a.name.localeCompare(b.name, "nl", { sensitivity: "base" })
  );

  // Play/pause logic for individual play
  const handlePlay = (id) => {
    Object.entries(audioRefs.current).forEach(([otherId, audio]) => {
      if (audio) {
        if (parseInt(otherId) !== id) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    });
    const audio = audioRefs.current[id];
    if (!audio) return;
    if (playingIndex === id && !audio.paused) {
      audio.pause();
      setPlayingIndex(null);
    } else {
      audio.play();
      setPlayingIndex(id);
    }
  };

  // Handle "Tour starten" with pause/resume
  const handleTourStart = () => {
    // If tour is playing, pause it
    if (tourPlaying && !tourPaused) {
      const currentItem = tourQueue[tourStep];
      if (currentItem) {
        const audio = audioRefs.current[currentItem.id];
        if (audio && !audio.paused) {
          audio.pause();
        }
      }
      setTourPaused(true);
      setTourPlaying(false);
      return;
    }
    // If tour is paused, resume it
    if (tourPaused) {
      setTourPaused(false);
      setTourPlaying(true);
      const currentItem = tourQueue[tourStep];
      if (currentItem) {
        const audio = audioRefs.current[currentItem.id];
        if (audio && audio.paused) {
          audio.play();
        }
      }
      return;
    }
    // Otherwise, start a new tour
    const queue = SECTION_ORDER.flatMap((key) => grouped[key]).filter(
      (item) => item.audio
    );
    if (!queue.length) return;
    setTourQueue(queue);
    setTourStep(0);
    setTourPlaying(true);
    setTourPaused(false);
    setPlayingIndex(queue[0].id);
    const audio = audioRefs.current[queue[0].id];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  // Listen for audio end to play next in queue
  useEffect(() => {
    if ((!tourPlaying && !tourPaused) || !tourQueue.length) return;
    const currentItem = tourQueue[tourStep];
    if (!currentItem) {
      setTourPlaying(false);
      setPlayingIndex(null);
      return;
    }
    const audio = audioRefs.current[currentItem.id];
    if (!audio) return;

    const handleEnded = () => {
      if (tourPaused) return; // Don't advance if paused
      if (tourStep < tourQueue.length - 1) {
        setTourStep((step) => step + 1);
      } else {
        setTourPlaying(false);
        setPlayingIndex(null);
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleEnded);
    };
  }, [tourPlaying, tourPaused, tourQueue, tourStep]);

  // When tourStep changes, play the next audio
  useEffect(() => {
    if (!tourPlaying || !tourQueue.length) return;
    const currentItem = tourQueue[tourStep];
    if (!currentItem) return;
    setPlayingIndex(currentItem.id);
    const audio = audioRefs.current[currentItem.id];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }, [tourStep, tourPlaying, tourQueue]);

  // Pass refs down so cards register their audio elements
  const handleAudioRef = (id, ref) => {
    audioRefs.current[id] = ref;
  };

  if (error) return <div>Error: {error}</div>;
  if (!tours.length) return <div>Loading or no items found.</div>;

  return (
    <main className={styles.main}>
      <div className={styles.layout}>
        {/* Left column: Tour starten button */}
        <div className={styles.leftCol}>
          <button
            className={styles.tourStartenBtn}
            onClick={handleTourStart}
            disabled={false}
          >
            {tourPlaying && !tourPaused
              ? "Tour pauzeren"
              : tourPaused
              ? "Tour hervatten"
              : "Tour starten"}
          </button>
        </div>
        {/* Center column: Sections */}
        <div className={styles.centerCol}>
          {SECTION_ORDER.map((sectieKey) =>
            grouped[sectieKey].length ? (
              <AudioTourSection
                key={sectieKey}
                title={SECTION_LABELS[sectieKey]}
                items={grouped[sectieKey]}
                playingIndex={playingIndex}
                isTourPlaying={tourPlaying && !tourPaused}
                onPlay={handlePlay}
                onAudioRef={handleAudioRef}
              />
            ) : null
          )}
        </div>
      </div>
    </main>
  );
}

export default AudioTourList;
