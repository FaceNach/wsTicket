import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { WeatherWidget } from '../components/WeatherWidget';
import { YouTubePlayer } from '../components/YouTubePlayer';
import type { Ticket } from '../types/ticket';
import { useNow } from '../hooks/useNow';
import { formatBoardDate, formatBoardTime } from '../utils/date-formatter';
import { formatTicketLabel } from '../utils/tickets';

const YOUTUBE_VIDEO_ID = 'dQw4w9WgXcQ';

const servedTickets: Ticket[] = [
  {
    id: 'preview-1',
    prefix: 'A',
    number: 22,
    deskNumber: 1,
    createdAt: new Date(),
    servedAt: new Date(),
  },
  {
    id: 'preview-2',
    prefix: 'A',
    number: 21,
    deskNumber: 4,
    createdAt: new Date(),
    servedAt: new Date(),
  },
  {
    id: 'preview-3',
    prefix: 'A',
    number: 20,
    deskNumber: 3,
    createdAt: new Date(),
    servedAt: new Date(),
  },
  {
    id: 'preview-4',
    prefix: 'A',
    number: 19,
    deskNumber: 2,
    createdAt: new Date(),
    servedAt: new Date(),
  },
  {
    id: 'preview-5',
    prefix: 'A',
    number: 18,
    deskNumber: 5,
    createdAt: new Date(),
    servedAt: new Date(),
  },
  {
    id: 'preview-6',
    prefix: 'A',
    number: 17,
    deskNumber: 2,
    createdAt: new Date(),
    servedAt: new Date(),
  },
  {
    id: 'preview-7',
    prefix: 'A',
    number: 16,
    deskNumber: 1,
    createdAt: new Date(),
    servedAt: new Date(),
  },
  {
    id: 'preview-8',
    prefix: 'A',
    number: 15,
    deskNumber: 3,
    createdAt: new Date(),
    servedAt: new Date(),
  },
];

function getWeatherConfigFromEnv(): {
  latitude: number;
  longitude: number;
  cityLabel?: string;
} | null {
  const latitude = `${import.meta.env.VITE_WEATHER_LAT}`.trim();
  const longitude = `${import.meta.env.VITE_WEATHER_LON}`.trim();
  if (latitude.length === 0 || longitude.length === 0) return null;

  const latitudeNumber = Number(latitude);
  const longitudeNumber = Number(longitude);
  if (isNaN(latitudeNumber) || isNaN(longitudeNumber)) return null;

  const cityLabel = `${import.meta.env.VITE_WEATHER_LABEL}`.trim();
  return {
    latitude: latitudeNumber,
    longitude: longitudeNumber,
    cityLabel: cityLabel,
  };
}

export function BoardPage() {
  const now = useNow(1000);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const weatherConfig = useMemo(() => getWeatherConfigFromEnv(), []);

  const servingTickets: Ticket[] = servedTickets;

  return (
    <div className="grid min-h-[calc(100vh-2rem)] items-stretch gap-6 lg:grid-cols-[1fr_420px] lg:gap-8 sm:min-h-[calc(100vh-3rem)]">
      <div className="flex min-h-0 flex-col gap-6">
        <header className="flex items-start justify-between gap-6 rounded-3xl bg-white/3 px-6 py-5 ring-1 ring-white/10 sm:px-7 sm:py-6">
          <div>
            <div className="text-6xl font-extrabold tracking-tight tabular-nums sm:text-7xl">
              {formatBoardTime(now)}
            </div>
            <div className="mt-1 text-base font-semibold capitalize tracking-wide text-white/75 sm:text-lg">
              {formatBoardDate(now)}
            </div>
          </div>

          {weatherConfig ? (
            <WeatherWidget
              latitude={weatherConfig.latitude}
              longitude={weatherConfig.longitude}
              label={weatherConfig.cityLabel}
            />
          ) : null}
        </header>

        <section className="relative flex min-h-[520px] flex-1 overflow-hidden rounded-3xl bg-linear-to-br from-sky-500/10 via-white/3 to-emerald-500/10 ring-1 ring-white/10">
          <div className="absolute -right-24 -top-20 size-[420px] rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-24 size-[460px] rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative flex min-h-0 flex-1 p-6 sm:p-8">
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold tracking-wide text-white/60">
                    Contenido / anuncios
                  </div>
                  <div className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
                    Video informativo
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-white/60">YouTube</div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsAudioMuted((prev) => !prev)}
                    aria-pressed={!isAudioMuted}
                  >
                    {isAudioMuted ? 'Audio: Apagado' : 'Audio: Encendido'}
                  </Button>
                </div>
              </div>

              <div className="min-h-0 flex-1">
                <YouTubePlayer
                  videoId={YOUTUBE_VIDEO_ID}
                  title="Contenido informativo para sala de espera"
                  isMuted={isAudioMuted}
                  fill
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside className="rounded-3xl bg-white/3 p-5 ring-1 ring-white/10 sm:p-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wide text-white/60">
              Panel de llamados
            </div>
            <div className="mt-1 text-lg font-semibold tracking-tight">
              Turno / Puesto
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3" aria-live="polite">
          <div className="grid grid-cols-[1fr_92px] gap-3 rounded-2xl bg-black/35 px-4 py-3 ring-1 ring-white/10">
            <div className="text-xs font-bold tracking-widest text-white/70">
              Ticket
            </div>
            <div className="text-xs font-bold tracking-widest text-white/70">
              Escritorio
            </div>
          </div>

          {servingTickets.map((ticket, index) => (
            <div
              key={ticket.id}
              className={[
                'grid grid-cols-[1fr_92px] items-center gap-3 rounded-2xl bg-black/45 px-4 py-4 ring-1 ring-white/10',
                index === 0 ? 'bg-sky-500/40 ring-white/20' : '',
              ].join(' ')}
            >
              <div
                className={[
                  'font-extrabold tracking-tight text-white tabular-nums',
                  index === 0 ? 'text-6xl sm:text-7xl' : 'text-5xl sm:text-5xl',
                ].join(' ')}
              >
                {formatTicketLabel(ticket)}
              </div>
              <div
                className={[
                  'text-center font-extrabold tabular-nums',
                  index === 0 ? 'text-6xl sm:text-7xl' : 'text-5xl sm:text-6xl',
                ].join(' ')}
              >
                {ticket.deskNumber}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
