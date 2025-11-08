export default async function handler(req, res) {
  const brand = (req.query.brand || "").trim();
  const name = (req.query.name || "").trim();

  if (!brand && !name)
    return res.status(400).json({ error: "brand or name required" });

  const query = `${brand} ${name} perfume bottle`;

  try {
    const apiKey = process.env.BING_API_KEY;
    const apiUrl = `https://bing-search-api.p.rapidapi.com/images/search?q=${encodeURIComponent(query)}&count=1`;

    const response = await fetch(apiUrl, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "bing-search-api.p.rapidapi.com"
      }
    });

    const data = await response.json();

    if (!data.value || data.value.length === 0)
      return res.json({ found: false });

    const best = data.value[0];
    return res.json({
      found: true,
      image: best.contentUrl,
      title: best.name,
      source: best.hostPageDisplayUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "search_failed", details: err.message });
  }
}
