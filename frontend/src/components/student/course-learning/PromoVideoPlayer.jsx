import React, { useEffect, useRef, useMemo, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import Hls from "hls.js";

const PromoVideoPlayer = ({ videoUrl, captions = [], poster }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const hlsRef = useRef(null);

    const isYouTube = useMemo(
        () => videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be"),
        [videoUrl]
    );

    useEffect(() => {
        if (!videoRef.current || !videoUrl || isYouTube) return;
        const video = videoRef.current;

        Array.from(video.querySelectorAll('track')).forEach(track => track.remove());
        if (captions && captions.length > 0) {
            captions.forEach(track => {
                const el = document.createElement('track');
                el.kind = track.kind || 'subtitles';
                el.label = track.label;
                el.srclang = track.srclang;
                el.src = track.src;
                if (track.default) el.default = true;
                video.appendChild(el);
            });
        }

        const initPlayer = () => {
            if (playerRef.current) return;
            const player = new Plyr(video, {
                controls: [
                    "play-large", "play", "progress", "current-time", "mute",
                    "volume", "captions", "settings", "fullscreen",
                ],
                // settings: ["captions", "speed"],
            });
            playerRef.current = player;

            player.on('seeked', () => {
                if (!player.playing) {
                    player.play();
                }
            });
        };

        if (videoUrl.endsWith(".m3u8") && Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.addEventListener("loadedmetadata", initPlayer, { once: true });
            });
        } else {
            video.src = videoUrl;
            video.addEventListener("loadedmetadata", initPlayer, { once: true });
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [videoUrl, isYouTube]);


    if (isYouTube) {
        const videoId =
            videoUrl.split("v=")[1]?.split("&")[0] || videoUrl.split("/").pop();
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0`;

        return (
            <div className="w-full h-[45vh] md:h-[50vh] lg:h-[58vh] flex justify-center">
                <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="Promo video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center bg-black">
            <video
                ref={videoRef}
                playsInline
                poster={poster}
            // crossOrigin="anonymous" 
            />
        </div>
    );
};

export default PromoVideoPlayer;