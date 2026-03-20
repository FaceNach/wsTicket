import { useEffect, useRef } from 'react';

type YouTubePlayerVars = {
  autoplay?: 0 | 1;
  mute?: 0 | 1;
  controls?: 0 | 1 | 2;
  modestbranding?: 0 | 1;
  rel?: 0 | 1;
  playsinline?: 0 | 1;
  loop?: 0 | 1;
  playlist?: string;
};

type YouTubePlayerInstance = {
  destroy: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  playVideo: () => void;
};

type YouTubePlayerEvent = {
  target: YouTubePlayerInstance;
};

type YouTubePlayerOptions = {
  videoId: string;
  playerVars?: YouTubePlayerVars;
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void;
  };
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement | string,
    options: YouTubePlayerOptions
  ) => YouTubePlayerInstance;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YouTubePlayerProps = {
  videoId: string;
  title: string;
  isMuted: boolean;
  fill?: boolean;
  className?: string;
};

type YouTubeApiLoadState = 'idle' | 'loading' | 'ready' | 'error';

let youtubeApiLoadState: YouTubeApiLoadState = 'idle';
let youtubeApiReadyPromise: Promise<void> | null = null;

function ensureYouTubeIframeApiReady(): Promise<void> {
  if (youtubeApiLoadState === 'ready') return Promise.resolve();
  if (youtubeApiReadyPromise) return youtubeApiReadyPromise;

  youtubeApiLoadState = 'loading';

  youtubeApiReadyPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      youtubeApiLoadState = 'error';
      reject(new Error('YouTube IFrame API requires a browser environment.'));
      return;
    }

    if (window.YT?.Player) {
      youtubeApiLoadState = 'ready';
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-youtube-iframe-api="true"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.dataset.youtubeIframeApi = 'true';
      script.onerror = () => {
        youtubeApiLoadState = 'error';
        reject(new Error('Failed to load YouTube IFrame API.'));
      };
      document.head.appendChild(script);
    }

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      youtubeApiLoadState = 'ready';
      resolve();
    };
  });

  return youtubeApiReadyPromise;
}

export function YouTubePlayer({
  videoId,
  title,
  isMuted,
  fill = false,
  className,
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayerInstance | null>(null);

  useEffect(() => {
    let isCancelled = false;

    void ensureYouTubeIframeApiReady()
      .then(() => {
        if (isCancelled) return;
        if (!window.YT?.Player) return;
        if (!containerRef.current) return;

        playerRef.current?.destroy();
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            loop: 1,
            playlist: videoId,
          },
          events: {
            onReady: (event: YouTubePlayerEvent) => {
              event.target.mute();
              event.target.playVideo();
            },
          },
        });
      })
      .catch(() => {
        // If the API fails to load, we simply keep the black container.
      });

    return () => {
      isCancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (isMuted) {
      player.mute();
      return;
    }

    player.unMute();
    player.setVolume(70);
    player.playVideo();
  }, [isMuted]);

  return (
    <div
      className={[
        'relative w-full overflow-hidden rounded-3xl bg-black/40 ring-1 ring-white/10',
        fill ? 'h-full' : 'aspect-video',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        aria-label={title}
      />
    </div>
  );
}
