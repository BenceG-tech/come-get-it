import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import LeadScoreBadge from "./LeadScoreBadge";

// Fix default icon URLs (Leaflet bundler quirk)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const STATUS_COLOR: Record<string, string> = {
  lead: "#00bcd4", contacted: "#fbbf24", negotiating: "#a78bfa", proposal_sent: "#fb7185",
  signed: "#22c55e", rejected: "#6b7280", paused: "#94a3b8",
};

function coloredIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 2px ${color}40,0 0 8px ${color}80"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function LeadsMap({ partners }: { partners: any[] }) {
  const withCoords = partners.filter(p => p.lat && p.lng);
  const center: [number, number] = withCoords.length
    ? [withCoords.reduce((s, p) => s + Number(p.lat), 0) / withCoords.length, withCoords.reduce((s, p) => s + Number(p.lng), 0) / withCoords.length]
    : [47.4979, 19.0402]; // Budapest

  return (
    <div className="h-[600px] rounded-lg overflow-hidden border border-nf-border relative">
      <MapContainer center={center} zoom={withCoords.length ? 12 : 7} style={{ height: "100%", width: "100%", background: "#0a0a0a" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {withCoords.map(p => (
          <Marker key={p.id} position={[Number(p.lat), Number(p.lng)]} icon={coloredIcon(STATUS_COLOR[p.status] ?? "#888")}>
            <Popup>
              <div className="space-y-1 min-w-[180px]">
                <div className="flex items-center justify-between gap-2">
                  <strong>{p.company_name}</strong>
                  <LeadScoreBadge score={p.lead_score} />
                </div>
                {p.city && <div className="text-xs">{p.city}{p.address ? ` · ${p.address}` : ""}</div>}
                {p.rating && <div className="text-xs">⭐ {p.rating} ({p.rating_count})</div>}
                <Link to={`/admin/partners/${p.id}`} className="text-electric-300 text-xs underline">Megnyit</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {withCoords.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-nf-surface/90 backdrop-blur px-4 py-2 rounded-lg text-sm text-nf-text-muted">
            Nincs koordinátával rendelkező partner. Importálj lat/lng oszlopokkal.
          </div>
        </div>
      )}
    </div>
  );
}
