// api/search-image.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  try {
    const brand = (req.query.brand || "").trim();
    const name = (req.query.name || "").trim();
    if (!brand && !name) return res.status(400).json({ error: "brand or name required" });

    const query = encodeURIComponent(`${brand} ${name} perfume bottle`.trim());
    const ddgUrl = `https://duckduckgo.com/i.js?q=${query}`;

    const ddgResp = await fetch(ddgUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!ddgResp.ok) return res.status(502).json({ error: "image search failed" });

    const ddgJson = await ddgResp.json();
    if (!ddgJson.results || ddgJson.results.length === 0) {
      return res.json({ found: false });
    }

    const best = ddgJson.results[0];
    return res.json({
      found: true,
      image: best.image,
      thumbnail: best.thumbnail,
      title: best.title,
      source: best.url
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal_error", details: err.message });
  }
};
