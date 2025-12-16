export const streamToString = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
};

export const parseVTT = (vttContent) => {
    const lines = vttContent.split("\n");
    const captions = [];
    let currentCaption = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === "WEBVTT" || line === "") {
            if (currentCaption) {
                captions.push(currentCaption);
                currentCaption = null;
            }
            continue;
        }

        if (line.includes("-->")) {
            const [start, end] = line.split("-->").map((t) => t.trim());
            currentCaption = {
                start: timeToSeconds(start),
                end: timeToSeconds(end),
                text: "",
            };
        } else if (currentCaption) {
            currentCaption.text += (currentCaption.text ? "\n" : "") + line;
        }
    }

    if (currentCaption) {
        captions.push(currentCaption);
    }

    return captions;
};

const timeToSeconds = (timeString) => {
    const parts = timeString.split(":");
    const secondsPart = parts[parts.length - 1].split(".");
    const seconds = secondsPart[0];
    const milliseconds = secondsPart[1] || "0";
    const minutes = parts.length > 1 ? parts[parts.length - 2] : "0";
    const hours = parts.length > 2 ? parts[0] : "0";

    return (
        parseInt(hours) * 3600 +
        parseInt(minutes) * 60 +
        parseInt(seconds) +
        parseInt(milliseconds) / 1000
    );
};

const secondsToVTTTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
        secs
    ).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
};

export const generateVTT = (captions) => {
    let vtt = "WEBVTT\n\n";

    captions.map((caption) => {
        const startTime = secondsToVTTTime(caption.start);
        const endTime = secondsToVTTTime(caption.end);
        vtt += `${startTime} --> ${endTime}\n`;
        vtt += `${caption.text}\n\n`;
    });

    return vtt;
};
