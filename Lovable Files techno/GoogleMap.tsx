import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
    initFalconMap?: () => void;
    __falconMapReady?: Promise<void>;
  }
}

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface Props {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (id: string) => void;
}

const DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0b1a2b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1a2b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8aa0b8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1b2f47" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9fb3c8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#06121f" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#22364f" }] },
];

function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (window.__falconMapReady) return window.__falconMapReady;

  window.__falconMapReady = new Promise<void>((resolve) => {
    window.initFalconMap = () => resolve();
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=initFalconMap&channel=${channel}`;
    s.async = true;
    document.head.appendChild(s);
  });
  return window.__falconMapReady;
}

export const GoogleMap = ({ markers, center, zoom = 14, onMarkerClick }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    loadMaps().then(() => {
      if (cancelled || !ref.current) return;
      const c = center ?? { lat: markers[0]?.lat ?? 7.0731, lng: markers[0]?.lng ?? 125.6128 };
      mapRef.current = new window.google.maps.Map(ref.current, {
        center: c,
        zoom,
        disableDefaultUI: true,
        zoomControl: true,
        styles: DARK_STYLE,
        backgroundColor: "#0b1a2b",
      });

      markers.forEach((m) => {
        const marker = new window.google.maps.Marker({
          position: { lat: m.lat, lng: m.lng },
          map: mapRef.current,
          title: m.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#ff6a1a",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });
        marker.addListener("click", () => onMarkerClick?.(m.id));
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref} className="absolute inset-0 w-full h-full" />;
};
