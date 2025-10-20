import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Hls from 'hls.js';

const VideoPlayer = forwardRef(({ videoUrl }, ref) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getCurrentTime: () => playerRef.current?.currentTime || 0,
        play: () => playerRef.current?.play(),
        pause: () => playerRef.current?.pause(),
    }));

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (videoUrl.endsWith('.m3u8')) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(videoUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    playerRef.current = new Plyr(video, {
                        controls: [
                            'play-large', 'play', 'progress', 'current-time',
                            'mute', 'volume', 'captions', 'settings', 'fullscreen'
                        ]
                    });
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoUrl;
                playerRef.current = new Plyr(video, {
                    controls: [
                        'play-large', 'play', 'progress', 'current-time',
                        'mute', 'volume', 'captions', 'settings', 'fullscreen'
                    ]
                });
            }
        } else {
            playerRef.current = new Plyr(video, {
                controls: [
                    'play-large', 'play', 'progress', 'current-time',
                    'mute', 'volume', 'captions', 'settings', 'fullscreen'
                ]
            });
            video.src = videoUrl;
        }

        return () => {
            if (playerRef.current) playerRef.current.destroy();
        };
    }, [videoUrl]);
    

    return (
        <div className="w-full h-[50vh] bg-black flex items-center justify-center">
            <video
                ref={videoRef}
                className="object-contain w-full h-full"
                playsInline
            />
        </div>
    );
});

export default VideoPlayer;