async function attachPerfumeImage(brand, name) {
  try {
    const response = await fetch(`/api/search-image?brand=${encodeURIComponent(brand)}&name=${encodeURIComponent(name)}`);
    const data = await response.json();

    if (data.found && data.image) {
      // Resize to 500px width for consistency
      const resizedUrl = `${data.image}&w=500`;
      return {
        image: resizedUrl,
        title: data.title || `${brand} ${name}`,
        source: data.source || null
      };
    } else {
      // Fallback image if search fails
      return {
        image: "/images/fallback-perfume.png",
        title: `${brand} ${name}`,
        source: null
      };
    }
  } catch (err) {
    console.error("Image fetch failed:", err);
    return {
      image: "/images/fallback-perfume.png",
      title: `${brand} ${name}`,
      source: null
    };
  }
}
