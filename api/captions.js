
export default async function handler(req, res) {

  const url = "https://script.google.com/macros/s/AKfycbwLXSog_nkbwnrRHBjZ4i35SSYiRmgNNPZL3YeGitAJlDceXYkJw0gLQ9zvc8Ra7ivc6w/exec";

  try {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // ⏱ timeout 8 วิ

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    const text = await response.text();

    // 🔥 check status ก่อน
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Google Script error",
        status: response.status,
        raw: text
      });
    }

    // 🔥 parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "Invalid JSON from Google Script",
        raw: text.substring(0, 500) // กันยาวเกิน
      });
    }

    // 🔥 validate structure
    if (!data || (!data.captions && !data.hashtags)) {
      return res.status(500).json({
        error: "Invalid data structure",
        data: data
      });
    }

    // 🔥 success
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      captions: data.captions || [],
      hashtags: data.hashtags || []
    });

  } catch (err) {

    const isTimeout = err.name === "AbortError";

    res.status(500).json({
      error: isTimeout ? "Request timeout" : "fetch failed",
      detail: err.message
    });

  }
}