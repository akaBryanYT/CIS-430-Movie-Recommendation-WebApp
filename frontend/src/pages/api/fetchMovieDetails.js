const movieCache = new Map();

export default async function handler(req, res) {
    const { id } = req.query;

    // Check if response is cached
    if (movieCache.has(id)) {
        return res.status(200).send(movieCache.get(id));
    }

    try {
        const response = await fetch(`https://www.rottentomatoes.com/${id}`, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                Connection: "keep-alive",
            },
        });

        if (!response.ok) throw new Error("Failed to fetch movie details");

        const html = await response.text();

        // Cache the response
        movieCache.set(id, html);

        res.status(200).send(html);
    } catch (error) {
        console.error(`Failed to fetch from Rotten Tomatoes: ${error.message}`);
        res.status(500).json({ error: "Failed to fetch movie details" });
    }
}
