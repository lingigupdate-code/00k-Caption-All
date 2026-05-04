export default async function handler(req, res) {

  const url = "https://script.google.com/macros/s/AKfycbzvCqSpk5FqqU7O7fWIpe5AUJ1iiELOT2pPRi5ITawqZzV7SCNEmE0YuVnLwFOxZWAu5g/exec";

  try {

    const response = await fetch(url);
    const data = await response.json();

    // 🔥 normalize data
    const clean = data.map(d => ({
      platform: (d.platform || "").toUpperCase().trim(),
      caption: (d.caption || "").trim()
    }));

    // 🔥 allow CORS
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(200).json(clean);

  } catch (err) {

    res.status(500).json({ error: "fetch failed" });

  }

}