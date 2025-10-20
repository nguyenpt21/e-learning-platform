export const estimateReadingTime = (content) => {
    const text = content.replace(/<[^>]+>/g, "");

    const words = text.trim().split(/\s+/).length;

    const wordsPerSecond = 3;
    const seconds = words / wordsPerSecond;

    const readTime = Math.ceil(seconds);

    return readTime;
};

export const generateThumbnailFromVideo = (videoFile, seekTo = 1.0) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;

        video.onloadeddata = () => {
            video.currentTime = seekTo;
        };

        video.onseeked = () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(video.src);
                    resolve(blob);
                },
                "image/jpeg",
                0.85
            );
        };

        video.onerror = (e) => {
            reject(new Error("Error loading video"));
        };

        video.src = URL.createObjectURL(videoFile);
    });
};

export const formatTimeShort = (seconds) => {
    seconds = Math.max(0, Math.floor(seconds));

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const mm = String(minutes).padStart(2, "0");
    const ss = String(secs).padStart(2, "0");

    return hours > 0 ? `${String(hours).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
};
