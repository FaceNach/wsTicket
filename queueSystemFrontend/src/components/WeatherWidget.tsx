import { useEffect, useMemo, useState } from 'react';

type WeatherWidgetProps = {
  latitude: number;
  longitude: number;
  label?: string;
  refreshIntervalMs?: number;
};

type WeatherStatus = 'idle' | 'loading' | 'success' | 'error';

type WeatherData = {
  temperatureC: number;
  weatherCode: number;
  observedAtIso?: string;
};

type OpenMeteoResponse = {
  current_weather?: {
    temperature?: number;
    weathercode?: number;
    weather_code?: number;
    time?: string;
  };
  current?: {
    temperature_2m?: number;
    weather_code?: number;
    time?: string;
  };
};

function getWeatherLabelEs(weatherCode: number): string {
  if (weatherCode === 0) return 'Despejado';
  if (weatherCode === 1) return 'Mayormente despejado';
  if (weatherCode === 2) return 'Parcialmente nublado';
  if (weatherCode === 3) return 'Nublado';
  if (weatherCode === 45 || weatherCode === 48) return 'Niebla';
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return 'Llovizna';
  if ([61, 63, 65, 66, 67].includes(weatherCode)) return 'Lluvia';
  if ([71, 73, 75, 77].includes(weatherCode)) return 'Nieve';
  if ([80, 81, 82].includes(weatherCode)) return 'Chubascos';
  if ([85, 86].includes(weatherCode)) return 'Chubascos de nieve';
  if (weatherCode === 95) return 'Tormenta';
  if (weatherCode === 96 || weatherCode === 99) return 'Tormenta con granizo';
  return 'Clima';
}

function formatTemperatureC(temperatureC: number): string {
  const rounded = Math.round(temperatureC);
  return `${rounded}°C`;
}

async function fetchOpenMeteoCurrentWeather(
  latitude: number,
  longitude: number,
  signal: AbortSignal
): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set('timezone', 'auto');

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoResponse;
  const temperatureC =
    data.current_weather?.temperature ?? data.current?.temperature_2m;

  const weatherCode =
    data.current_weather?.weathercode ??
    data.current_weather?.weather_code ??
    data.current?.weather_code;

  const observedAtIso = data.current_weather?.time ?? data.current?.time;

  if (typeof temperatureC !== 'number' || typeof weatherCode !== 'number') {
    throw new Error('Weather response missing required fields.');
  }

  return { temperatureC, weatherCode, observedAtIso };
}

export function WeatherWidget({
  latitude,
  longitude,
  label,
  refreshIntervalMs = 10 * 60 * 1000,
}: WeatherWidgetProps) {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const locationText = useMemo(() => {
    if (!label) return null;
    const trimmed = label.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, [label]);

  useEffect(() => {
    let isCancelled = false;
    let activeController: AbortController | null = null;

    const run = async () => {
      activeController?.abort();
      const controller = new AbortController();
      activeController = controller;
      try {
        setStatus((prev) => (prev === 'success' ? prev : 'loading'));
        const nextWeather = await fetchOpenMeteoCurrentWeather(
          latitude,
          longitude,
          controller.signal
        );

        if (isCancelled) return;
        setWeather(nextWeather);
        setStatus('success');
      } catch {
        if (isCancelled) return;
        setStatus('error');
      }
    };

    void run();
    const intervalId = window.setInterval(() => void run(), refreshIntervalMs);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
      activeController?.abort();
      activeController = null;
    };
  }, [latitude, longitude, refreshIntervalMs]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="text-right">
        {locationText ? (
          <div className="text-xs font-semibold tracking-wide text-white/60">
            {locationText}
          </div>
        ) : null}
        <div className="mt-1 text-lg font-semibold text-white/80">Clima…</div>
      </div>
    );
  }

  if (!weather || status === 'error') {
    return (
      <div className="text-right">
        {locationText ? (
          <div className="text-xs font-semibold tracking-wide text-white/60">
            {locationText}
          </div>
        ) : null}
        <div className="mt-1 text-sm font-semibold text-white/70">
          Clima no disponible
        </div>
      </div>
    );
  }

  return (
    <div className="text-right">
      {locationText ? (
        <div className="text-xs font-semibold tracking-wide text-white/60">
          {locationText}
        </div>
      ) : null}
      <div className="mt-1 text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl">
        {formatTemperatureC(weather.temperatureC)}
      </div>
      <div className="mt-1 text-sm font-semibold text-white/70">
        {getWeatherLabelEs(weather.weatherCode)}
      </div>
    </div>
  );
}


