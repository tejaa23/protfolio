import { useState, useRef, useEffect, MouseEvent } from "react";
import { Play, Volume2, VolumeX, RefreshCw } from "lucide-react";

interface VideoPlayerProps {
  url: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  poster?: string;
}

export function parseVideoUrl(url: string): {
  type: "mp4" | "youtube" | "vimeo" | "drive";
  srcUrl: string;
} {
  if (!url) return { type: "mp4", srcUrl: "" };

  // Google Drive detection & conversion to embed preview
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([^/?#&\s]+)/;
  const driveMatch = url.match(driveRegex);
  if (driveMatch && driveMatch[1]) {
    return {
      type: "drive",
      srcUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
    };
  }

  // YouTube detection & conversion to embed
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      srcUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&playlist=${ytMatch[1]}&loop=1&controls=1`
    };
  }

  // Vimeo detection & conversion to embed
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      srcUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&badge=0&byline=0&portrait=0`
    };
  }

  // Fallback to direct MP4 or other files
  return { type: "mp4", srcUrl: url };
}

export default function VideoPlayer({
  url,
  autoplay = false,
  muted = true,
  loop = true,
  controls = true,
  className = "",
  poster = ""
}: VideoPlayerProps) {
  const { type, srcUrl } = parseVideoUrl(url);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error when URL changes
    setHasError(false);
  }, [url]);

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Handle play error, e.g. browser autoplay blocks
        videoRef.current?.pause();
        setIsPlaying(false);
      });
    }
  };

  const handleMuteToggle = (e: MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = (e: MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    if (!isPlaying) {
      videoRef.current.play().then(() => setIsPlaying(true));
    }
  };

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-6 rounded-xl text-center ${className}`}>
        <p className="text-sm font-medium mb-2">Could not play video source</p>
        <span className="text-xs text-slate-500 break-all max-w-xs">{url}</span>
      </div>
    );
  }

  if (type === "youtube" || type === "vimeo" || type === "drive") {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-black aspect-video ${className}`}>
        <iframe
          src={srcUrl}
          title="Invitation Video Player"
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`relative group/player overflow-hidden bg-black rounded-xl ${className}`}>
      <video
        ref={videoRef}
        src={srcUrl}
        poster={poster}
        autoPlay={autoplay}
        muted={isMuted}
        loop={loop}
        playsInline
        onClick={handlePlayToggle}
        onError={() => setHasError(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Custom Control Overlay */}
      {controls && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between opacity-0 group-hover/player:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayToggle}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <div className="w-4 h-4 flex gap-1 justify-center items-center">
                  <div className="w-1 h-3 bg-white" />
                  <div className="w-1 h-3 bg-white" />
                </div>
              ) : (
                <Play size={16} fill="white" className="ml-0.5" />
              )}
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all cursor-pointer"
              title="Restart"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <button
            onClick={handleMuteToggle}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      )}

      {/* Click-to-Play Indicator when paused and hovered */}
      {!isPlaying && (
        <div 
          onClick={handlePlayToggle}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-white/90 shadow-xl flex items-center justify-center text-slate-900 transform scale-100 group-hover/player:scale-110 transition-transform duration-300">
            <Play size={24} fill="currentColor" className="ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
