export default async function handler(req, res) {
  const brand = (req.query?.brand || "").trim();
  const name = (req.query?.name || "").trim();

  if (!brand && !name) {
    return res.status(400).json({ error: "brand or name required" });
  }

  const query = `${brand} ${name} perfume bottle`;

  try {
    const apiKey = process.env.BING_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "missing_api_key" });
    }

    const apiUrl = `https://bing-image-search1.p.rapidapi.com/images/search?q=${encodeURIComponent(query)}&count=1`;

    const response = await fetch(apiUrl, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "bing-image-search1.p.rapidapi.com"
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: "search_failed", status: response.status });
    }

    const data = await response.json();

    if (!data.value || data.value.length === 0) {
      return res.json({ found: false });
    }

    const best = data.value[0];
    return res.json({
      found: true,
      image: best.contentUrl,
      title: best.name,
      source: best.hostPageDisplayUrl
    });
  } catch (err) {
    res.status(500).json({ error: "internal_error", details: err.message });
  }
}
