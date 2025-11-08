// api/search-image.js  (debug version)
// Replaces the normal handler temporarily to return diagnostic info
export default async function handler(req, res) {
  const brand = (req.query.brand || "").trim();
  const name = (req.query.name || "").trim();

  if (!brand && !name)
    return res.status(400).json({ error: "brand or name required" });

  const query = `${brand} ${name} perfume bottle`;
  const apiKey = process.env.BING_API_KEY || null;

  if (!apiKey) {
    return res.status(500).json({
      error: "missing_env",
      message: "Environment variable BING_API_KEY not set in Vercel",
      hint: "Add BING_API_KEY in Vercel settings and redeploy"
    });
  }

  try {
    const apiUrl = `https://bing-search-api.p.rapidapi.com/images/search?q=${encodeURIComponent(query)}&count=3`;
    const response = await fetch(apiUrl, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "bing-search-api.p.rapidapi.com",
        "User-Agent": "SillageMuseDebug/1.0"
      },
      // timeout not available in fetch by default; rely on platform
    });

    const status = response.status;
    let data = null;
    try { data = await response.json(); } catch (jsonErr) { data = { parseError: String(jsonErr) }; }

    // Prepare a small diagnostic summary
    const summary = {
      query,
      request: { url: apiUrl, status },
      dataKeys: data && typeof data === "object" ? Object.keys(data) : null,
      length: (data && data.value && Array.isArray(data.value)) ? data.value.length : 0,
      sample: (data && data.value && Array.isArray(data.value) && data.value.length > 0)
        ? {
            name: data.value[0].name,
            contentUrl: data.value[0].contentUrl,
            hostPageDisplayUrl: data.value[0].hostPageDisplayUrl
          }
        : null
    };

    return res.json({ debug: true, summary, rawDataSnippet: (data && data.value && Array.isArray(data.value)) ? data.value.slice(0,2) : data });
  } catch (err) {
    console.error("search-image debug error:", err);
    return res.status(500).json({ error: "exception", details: String(err) });
  }
}
