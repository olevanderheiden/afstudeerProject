import React, { useEffect, useState } from "react";
import AudioTourSection from "./assets/pageElements/AudioTourSection";

function AudioTourList() {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://backend.test/wp-json/wp/v2/audio_tour")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched tours:", data);
        setTours(data);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Fetch error:", err);
      });
  }, []);

  const items = tours
    .filter(
      (tour) =>
        tour.acf &&
        tour.acf.afbeelding &&
        tour.acf.afbeelding.url &&
        tour.acf.audio &&
        tour.acf.audio.url
    )
    .map((tour) => ({
      id: tour.id,
      title: tour.title.rendered,
      image: tour.acf.afbeelding.url,
      audio: tour.acf.audio.url,
      description: tour.acf.beschrijving || "",
      name: tour.acf.naam || tour.title.rendered,
    }));

  if (error) return <div>Error: {error}</div>;
  if (!tours.length) return <div>Loading or no items found.</div>;

  return (
    <main>
      <AudioTourSection title="Audio Tour" items={items} />
    </main>
  );
}

export default AudioTourList;
