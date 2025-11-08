// api/search-image.js

export default async function handler(req, res) {
  const brand = (req.query?.brand || "").trim();
  const name = (req.query?.name || "").trim();

  if (!brand && !name) {
    return res.status(400).json({ error: "brand or name required" });
  }

  const query = `${brand} ${name} perfume bottle`;

  try {
    const apiKey = process.env.GOOGLE_API_KEY; // set this in Vercel
    if (!apiKey) {
      return res.status(500).json({ error: "missing_api_key" });
    }

    const apiUrl = "https://google-api-unlimited.p.rapidapi.com/google/image";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "google-api-unlimited.p.rapidapi.com"
      },
      body: new URLSearchParams({ q: query })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "search_failed", status: response.status });
    }

    const data = await response.json();

    // Adjust parsing based on API response structure
    if (!data || !data.results || data.results.length === 0) {
      return res.json({ found: false });
    }

    const best = data.results[0];
    return res.json({
      found: true,
      image: best.image,
      title: best.title || `${brand} ${name}`,
      source: best.link || null
    });
  } catch (err) {
    console.error("Unhandled error:", err);
    return res.status(500).json({ error: "internal_error", details: err.message });
  }
}
