const API_BASE_URL = import.meta.env.VITE_WORDPRESS_API_URL;
// const API_BASE_URL = "http://backend.test/wp-json/wp/v2";
export async function fetchAudioTours() {
  // Try localStorage first
  const cached = localStorage.getItem("audioTourData");
  const cachedTime = localStorage.getItem("audioTourDataTime");
  let useCache = false;

  // Use cache if less than 10 minutes old
  if (
    cached &&
    cachedTime &&
    Date.now() - cachedTime < 7 * 24 * 60 * 60 * 1000
  ) {
    useCache = true;
  }

  // Always check for updates in the background
  try {
    // Get total count
    const res = await fetch(`${API_BASE_URL}/audio_tour?per_page=1`);
    console.log(
      `Fetching audio tours from ${API_BASE_URL} at ${new Date().toISOString()}`
    );
    if (!res.ok) throw new Error("Network response was not ok");
    const total = res.headers.get("X-WP-Total");

    // Get all items
    const allRes = await fetch(`${API_BASE_URL}/audio_tour?per_page=${total}`);
    if (!allRes.ok) throw new Error("Network response was not ok");
    const data = await allRes.json();

    // Compare with cache
    const cachedData = cached ? JSON.parse(cached) : [];
    const isDifferent =
      cachedData.length !== data.length ||
      data.some(
        (item, i) => !cachedData[i] || cachedData[i].modified !== item.modified
      );

    if (isDifferent) {
      localStorage.setItem("audioTourData", JSON.stringify(data));
      localStorage.setItem("audioTourDataTime", Date.now());
      return data;
    } else if (useCache) {
      return cachedData;
    } else {
      return data;
    }
  } catch (err) {
    // On error, fallback to cache if available
    if (cached) return JSON.parse(cached);
    throw err;
  }
}
