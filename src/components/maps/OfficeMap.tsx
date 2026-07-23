"use client";

import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface OfficeMapProps {
  latitude: number;
  longitude: number;
  officeName: string;
  address: string;
}

export default function OfficeMap({ latitude, longitude, officeName, address }: OfficeMapProps) {
  useEffect(() => {
    // Prevent re-initialization error on fast hot reloads
    const container = L.DomUtil.get(`map-${latitude}-${longitude}`);
    if (container != null) {
      (container as any)._leaflet_id = null;
    }

    const map = L.map(`map-${latitude}-${longitude}`, {
      center: [latitude, longitude],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom Amber Icon
    const customIcon = L.divIcon({
      className: "custom-map-pin",
      html: `<div style="background-color: #f59e0b; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #000; box-shadow: 0 0 10px rgba(245,158,11,0.5);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>${officeName}</b><br/>${address}`)
      .openPopup();

    return () => {
      map.remove();
    };
  }, [latitude, longitude, officeName, address]);

  return (
    <div
      id={`map-${latitude}-${longitude}`}
      className="w-full h-full min-h-[220px] rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-neutral-800"
    />
  );
}
