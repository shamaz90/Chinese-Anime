const { addonBuilder } = require("stremio-addon-sdk");

const RD_TOKEN = process.env.RD_TOKEN || ""; 
const PRIVATE_ACCESS_KEY = process.env.PRIVATE_ACCESS_KEY || "my-super-secret-key-123";

const manifest = {
    "id": "org.donghua.render.streamonly",
    "version": "1.0.0",
    "name": "Donghua Streaming (Lucifer+Torrentio+Comet+RD)",
    "description": "Donghua stream source only; shows up as a streaming option in any Stremio catalogue.",
    "types": ["movie", "series"],
    "resources": ["stream"],
    "catalogs": [],
    "idPrefixes": ["tt"]
};

const builder = new addonBuilder(manifest);

// Stream handler ONLY with private key check
builder.defineStreamHandler(async ({ id, type, req }) => {
    // Enforce private access key via query param
    const url = req && req.url;
    const urlParams = url ? new URLSearchParams(url.split("?")[1]) : null;
    const key = urlParams ? urlParams.get('key') : null;
    if (!key || key !== PRIVATE_ACCESS_KEY) {
        return { streams: [] };
    }

    let streams = [];
    streams.push({
        title: "Lucifer Donghua (search manually)",
        externalUrl: "https://luciferdonghua.in/"
    });

    streams.push({
        title: "Torrentio",
        externalUrl: `stremio://addon/torrentio/stream/${id}`
    });
    streams.push({
        title: "Comet",
        externalUrl: `stremio://addon/comet/stream/${id}`
    });

    if (RD_TOKEN) {
        streams.push({
            title: "Real Debrid (Premium, manual magnet)",
            externalUrl: "https://real-debrid.com/torrents"
        });
    } else {
        streams.push({
            title: "Enable Real Debrid by setting RD_TOKEN in Render!",
            externalUrl: "https://real-debrid.com/apitoken"
        });
    }

    return { streams };
});

const port = process.env.PORT || 3000;
builder.getInterface().listen(port, () => {
    console.log(`Donghua Stream-only Addon running with private access key on port ${port}`);
});
