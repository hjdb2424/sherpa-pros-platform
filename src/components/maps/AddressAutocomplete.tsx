'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  setOptions as setGoogleMapsOptions,
  importLibrary,
} from '@googlemaps/js-api-loader';

export interface AddressResult {
  formatted: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  zip: string;
}

interface AddressAutocompleteProps {
  onSelect: (address: AddressResult) => void;
  placeholder?: string;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

let configured = false;

function ensureGoogleMapsConfigured(): void {
  if (!configured) {
    setGoogleMapsOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
      v: 'weekly',
      libraries: ['places'],
    });
    configured = true;
  }
}

function extractAddressComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
): string {
  return components.find((c) => c.types.includes(type))?.long_name ?? '';
}

function extractShortComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
): string {
  return components.find((c) => c.types.includes(type))?.short_name ?? '';
}

export function AddressAutocomplete({
  onSelect,
  placeholder = 'Enter address...',
  className = '',
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initAutocomplete() {
      try {
        ensureGoogleMapsConfigured();
        await importLibrary('places');

        if (!mounted || !inputRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: 'us' },
            fields: [
              'formatted_address',
              'geometry',
              'address_components',
            ],
            types: ['address'],
          },
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (
            !place.geometry?.location ||
            !place.address_components
          ) {
            return;
          }

          const components = place.address_components;
          const result: AddressResult = {
            formatted: place.formatted_address ?? '',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            city: extractAddressComponent(components, 'locality'),
            state: extractShortComponent(
              components,
              'administrative_area_level_1',
            ),
            zip: extractAddressComponent(components, 'postal_code'),
          };

          setValue(result.formatted);
          onSelect(result);
        });

        autocompleteRef.current = autocomplete;
      } catch {
        // Google Maps failed to load — degrade gracefully
      }
    }

    initAutocomplete();
    return () => {
      mounted = false;
    };
  }, [onSelect]);

  const handleClear = useCallback(() => {
    setValue('');
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value.length > 2) setLoading(true);
          else setLoading(false);
        }}
        onBlur={() => setLoading(false)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Address search"
        className="w-full rounded-lg border-2 border-zinc-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-[#00a9e0] focus:outline-none focus:ring-2 focus:ring-[#00a9e0]/30"
      />

      {/* Loading spinner */}
      {loading && !value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div
            className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#00a9e0]"
            aria-label="Loading address suggestions"
          />
        </div>
      )}

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
          aria-label="Clear address"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 4L4 12M4 4l8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
