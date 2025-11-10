import React, { useEffect, useRef, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Hls from 'hls.js';

// const captions = [
//     { label: 'English', srclang: 'en', src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt', default: true },
//     { label: 'Vietnamese', srclang: 'vi', src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt' }
// ];

const VideoPlayer = forwardRef(({ videoUrl, onPlayStateChange, startTime = 0, captions = [] }, ref) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const hlsRef = useRef(null);
    const hasSetStartTime = useRef(false);
    const hasSeekedOnce = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const isYouTube = useMemo(() =>
        videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be"),
        [videoUrl]
    );
    useImperativeHandle(ref, () => ({
        getCurrentTime: () => playerRef.current?.currentTime || 0,
        getDuration: () => playerRef.current?.duration || 0,
        play: () => playerRef.current?.play(),
        pause: () => playerRef.current?.pause(),
        setCurrentTime: (time) => { if (playerRef.current) playerRef.current.currentTime = time; }
    }));

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

        const initPlayer = (qualityOptions) => {
            if (playerRef.current) return;
            const player = new Plyr(video, {
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'fullscreen'],
                settings: ['quality', 'speed', 'captions'],
                // quality: qualityOptions || undefined
            });
            playerRef.current = player;

            if (!hasSetStartTime.current && startTime) {
                const setTime = () => video.currentTime = startTime;
                if (video.duration) setTime();
                else video.addEventListener('loadedmetadata', setTime, { once: true });
                hasSetStartTime.current = true;
            }

            player.on('play', () => { setIsPlaying(true); onPlayStateChange?.(true); });
            player.on('pause', () => { setIsPlaying(false); onPlayStateChange?.(false); });
            player.on('ended', () => { setIsPlaying(false); onPlayStateChange?.(false); });
            player.on('seeked', () => {
                if (!hasSeekedOnce.current) {
                    hasSeekedOnce.current = true;
                    return;
                }
                if (!player.playing) {
                    player.play();
                }
            });
        };

        if (videoUrl.endsWith('.m3u8') && Hls.isSupported()) {
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
    }, [videoUrl, isYouTube, startTime, onPlayStateChange]);

    // useEffect(() => {
    //     if (!playerRef.current) return;
    //     const interval = setInterval(() => {
    //         const currentTime = playerRef.current.currentTime || 0;
    //         const lastTime = lastTimeRef.current;
    //         const isSeek = Math.abs(currentTime - lastTime) > 0.5;
    //         if (!isPlaying && isSeek) {
    //             playerRef.current.play();
    //         }
    //         lastTimeRef.current = currentTime;
    //     }, 200);
    //     return () => clearInterval(interval);
    // }, [isPlaying]);

    if (isYouTube) {
        const videoId = videoUrl.split("v=")[1]?.split("&")[0] || videoUrl.split("/").pop();
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0`;
        return (
            <div className="w-full h-[45vh] md:h-[50vh] lg:h-[58vh] flex justify-center">
                <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <div className="w-full bg-black h-[45vh] md:h-[50vh] lg:h-[60vh] flex justify-center items-center">
            <div className="aspect-video w-auto max-h-full">
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    playsInline
                />
            </div>
        </div>
    );
});

export default VideoPlayer;