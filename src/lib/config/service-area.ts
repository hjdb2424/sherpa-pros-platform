export const SERVICE_AREA = {
  center: { lat: 43.0718, lng: -70.7626 },
  radiusMiles: 45,
  radiusKm: 72.4,
  zipCode: '03801',
  name: 'Greater Portsmouth',
  description: '1-hour drive radius from Portsmouth, NH',
  bounds: {
    north: 43.65,
    south: 42.55,
    east: -70.15,
    west: -71.50,
  },
  states: ['NH', 'ME', 'MA'] as const,
  majorCities: [
    // NH
    { name: 'Portsmouth', state: 'NH', lat: 43.0718, lng: -70.7626 },
    { name: 'Dover', state: 'NH', lat: 43.1979, lng: -70.8737 },
    { name: 'Rochester', state: 'NH', lat: 43.3045, lng: -70.9756 },
    { name: 'Exeter', state: 'NH', lat: 42.9815, lng: -70.9478 },
    { name: 'Hampton', state: 'NH', lat: 42.9376, lng: -70.8389 },
    { name: 'Manchester', state: 'NH', lat: 42.9956, lng: -71.4548 },
    { name: 'Nashua', state: 'NH', lat: 42.7654, lng: -71.4676 },
    { name: 'Concord', state: 'NH', lat: 43.2081, lng: -71.5376 },
    { name: 'Derry', state: 'NH', lat: 42.8806, lng: -71.3273 },
    { name: 'Salem', state: 'NH', lat: 42.7886, lng: -71.2009 },
    // ME
    { name: 'Kittery', state: 'ME', lat: 43.0884, lng: -70.7356 },
    { name: 'York', state: 'ME', lat: 43.1615, lng: -70.6487 },
    { name: 'Kennebunk', state: 'ME', lat: 43.3848, lng: -70.5445 },
    { name: 'Biddeford', state: 'ME', lat: 43.4926, lng: -70.4512 },
    { name: 'Portland', state: 'ME', lat: 43.6591, lng: -70.2568 },
    { name: 'Sanford', state: 'ME', lat: 43.4393, lng: -70.7742 },
    // MA
    { name: 'Newburyport', state: 'MA', lat: 42.8126, lng: -70.8773 },
    { name: 'Haverhill', state: 'MA', lat: 42.7762, lng: -71.0773 },
    { name: 'Lawrence', state: 'MA', lat: 42.7070, lng: -71.1631 },
    { name: 'Lowell', state: 'MA', lat: 42.6334, lng: -71.3162 },
    { name: 'Amesbury', state: 'MA', lat: 42.8584, lng: -70.9300 },
  ],
};

export function isWithinServiceArea(lat: number, lng: number): boolean {
  const { bounds } = SERVICE_AREA;
  return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
}

export function distanceFromCenter(lat: number, lng: number): number {
  // Haversine formula -- returns miles
  const R = 3959; // Earth radius in miles
  const dLat = (lat - SERVICE_AREA.center.lat) * Math.PI / 180;
  const dLng = (lng - SERVICE_AREA.center.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(SERVICE_AREA.center.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
