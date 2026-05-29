import { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LiveMap.css';

// Fix default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const goldIcon = L.divIcon({
  className: 'livemap-marker',
  html: '<div class="livemap-marker__dot"></div><div class="livemap-marker__pulse"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export default function LiveMap() {
  const { state } = useApp();
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loc = state.userLocation;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [loc?.lat ?? -1.2921, loc?.lng ?? 36.8219],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker position
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loc) return;

    if (!markerRef.current) {
      markerRef.current = L.marker([loc.lat, loc.lng], { icon: goldIcon }).addTo(map);
    } else {
      markerRef.current.setLatLng([loc.lat, loc.lng]);
    }

    map.setView([loc.lat, loc.lng], map.getZoom());
  }, [loc?.lat, loc?.lng]);

  const coords = loc
    ? `${loc.lat.toFixed(4)}° S, ${loc.lng.toFixed(4)}° E`
    : 'Acquiring GPS...';

  return (
    <div className="livemap-card">
      <div className="livemap-card__header">
        <div className="livemap-card__label-group">
          <div className="livemap-card__label">Live Tracking</div>
          <div className="livemap-card__sublabel">Nairobi CBD</div>
        </div>
        <div className="livemap-badge">
          <span className="livemap-badge__dot" />
          LIVE
        </div>
      </div>

      <div className="livemap-stage" ref={containerRef} />

      <div className="livemap-coords">
        <span>{coords}</span>
        <span>{loc ? '± 4m accuracy' : '—'}</span>
      </div>
    </div>
  );
}
