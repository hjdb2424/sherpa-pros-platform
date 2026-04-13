'use client';

import { useCallback, useState } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
}

interface UseUserLocationReturn {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        const messages: Record<number, string> = {
          [GeolocationPositionError.PERMISSION_DENIED]:
            'Location permission denied. Please enable location access.',
          [GeolocationPositionError.POSITION_UNAVAILABLE]:
            'Location information is unavailable.',
          [GeolocationPositionError.TIMEOUT]:
            'Location request timed out.',
        };
        setError(messages[err.code] ?? 'Failed to get location.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 300_000, // 5 minutes
      },
    );
  }, []);

  return { location, loading, error, requestLocation };
}
