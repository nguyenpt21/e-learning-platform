export const estimateReadingTime = (content) => {
    const text = content.replace(/<[^>]+>/g, "");

    const words = text.trim().split(/\s+/).length;

    const wordsPerSecond = 3;
    const seconds = words / wordsPerSecond;

    const readTime = Math.ceil(seconds);

    return readTime;
};
