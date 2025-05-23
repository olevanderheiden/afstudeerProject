import React from "react";
import AudioTourList from "../../AudioToorList";

const HomePage = () => (
  <div>
    <h2>Welkom op de afstudeerportfolio van Ole van der Heiden</h2>
    <p>
      Dit portfolio is grotendeels in audiovorm opgesteld. Ik heb deze keuze
      bewust gemaakt, omdat audio goed past bij mijn onderzoek. Graag geef ik
      enkele tips voorafgaand aan het gebruiken van de audiospeler, zodat de
      ervaring zo prettig mogelijk is. Gebruik de audiospelers in de
      verschillende (deel)hoofdstukken om naar bewijslevering en onderbouwing te
      luisteren. Is het geluid te zacht, praat ik te langzaam naar je zin of wil
      je naar een bepaalde sectie luisteren? Wees dan niet bang om de diverse
      besturingsfuncties van de audiospeler te gebruiken. Deze uitlegtekst is
      hieronder ook te beluisteren. Op die manier heeft u direct een idee van de
      werking van de audiospeler.
    </p>
    {/* Add your audio player here later */}
    <AudioTourList />
  </div>
);

export default HomePage;
