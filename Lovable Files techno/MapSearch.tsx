import { useMemo, useState } from "react";
import { Search, MapPin, Star, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/falcon/AppShell";
import { GoogleMap } from "@/components/falcon/GoogleMap";
import { useNavigate } from "react-router-dom";

type Category = "Property Boundary" | "Land Division" | "Land Titling" | "GIS" | "Specialized";

const FILTERS: Category[] = ["Property Boundary", "GIS", "Land Division", "Land Titling", "Specialized"];

const DAVAO_CENTER = { lat: 7.0731, lng: 125.6128 };

interface Firm {
  id: string;
  name: string;
  distance: string;
  rating: number;
  lat: number;
  lng: number;
  area: "City" | "Rural";
  categories: Category[];
  services: string[];
}

const FIRMS: Firm[] = [
  // Existing city firms
  { id: "vedua", name: "J.A. VEDUA SURVEYING OFFICE", distance: "400 m away", rating: 5, lat: 7.0755, lng: 125.6105, area: "City", categories: ["Property Boundary", "Land Division"], services: ["Boundary", "Subdivision"] },
  { id: "ge", name: "GE Land Surveying Services", distance: "400 m away", rating: 5, lat: 7.0710, lng: 125.6160, area: "City", categories: ["Property Boundary", "Land Titling"], services: ["Relocation", "Cadastral"] },
  { id: "laps", name: "LAPS Land Analytics & Planning", distance: "500 m away", rating: 5, lat: 7.0690, lng: 125.6090, area: "City", categories: ["Land Division", "Specialized"], services: ["Consolidation", "Topographic"] },
  { id: "scube", name: "Scube Silao Surveying Services", distance: "1.7 km away", rating: 4.8, lat: 7.0820, lng: 125.6200, area: "City", categories: ["Property Boundary", "Specialized"], services: ["Verification", "As-Built"] },

  // City — GIS specialists
  { id: "davao-gis", name: "Davao GIS Mapping Solutions", distance: "2.1 km away", rating: 4.9, lat: 7.0850, lng: 125.6130, area: "City", categories: ["GIS", "Specialized"], services: ["GIS Mapping", "Topographic"] },
  { id: "mindanao-geo", name: "Mindanao Geomatics & GIS", distance: "3.4 km away", rating: 4.8, lat: 7.0900, lng: 125.6250, area: "City", categories: ["GIS", "Specialized"], services: ["GIS Analysis", "As-Built"] },
  { id: "urbangeo", name: "UrbanGeo Analytics Davao", distance: "1.9 km away", rating: 4.7, lat: 7.0650, lng: 125.6080, area: "City", categories: ["GIS", "Specialized"], services: ["GIS Mapping", "Hydrographic"] },

  // Rural — Property Boundary & Survey
  { id: "calinan", name: "Calinan Land Surveyors", distance: "18 km away", rating: 4.8, lat: 7.1850, lng: 125.4680, area: "Rural", categories: ["Property Boundary", "Land Titling"], services: ["Boundary", "Relocation"] },
  { id: "toril", name: "Toril Geodetic Services", distance: "14 km away", rating: 4.7, lat: 7.0250, lng: 125.4900, area: "Rural", categories: ["Property Boundary", "Land Division"], services: ["Boundary", "Subdivision"] },
  { id: "tugbok", name: "Tugbok Cadastral Survey Co.", distance: "12 km away", rating: 4.9, lat: 7.1100, lng: 125.5100, area: "Rural", categories: ["Property Boundary", "Land Titling"], services: ["Cadastral", "Relocation"] },
  { id: "marilog", name: "Marilog Highland Surveying", distance: "42 km away", rating: 4.6, lat: 7.3500, lng: 125.4200, area: "Rural", categories: ["Property Boundary", "Specialized"], services: ["Boundary", "Topographic"] },
];

const MapSearch = () => {
  const [active, setActive] = useState<Category | null>("Property Boundary");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return FIRMS.filter((f) => {
      const matchCat = !active || f.categories.includes(active);
      const matchQ = !query || f.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [active, query]);

  return (
    <AppShell>
      {/* Map */}
      <div className="relative h-[55vh]">
        <GoogleMap
          key={`${active ?? "all"}-${filtered.length}`}
          markers={filtered.map((f) => ({ id: f.id, name: f.name, lat: f.lat, lng: f.lng }))}
          center={DAVAO_CENTER}
          zoom={11}
          onMarkerClick={() => navigate("/firm")}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />


        {/* Search bar overlay */}
        <div className="absolute top-4 inset-x-4 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for Surveying Firms"
              className="pl-11 h-12 rounded-2xl bg-card/95 backdrop-blur-xl border-border shadow-card-elegant font-poppins"
            />
          </div>

          {/* Filter chips */}
          <div
            className="mt-3 -mx-4 flex gap-2 overflow-x-auto overscroll-x-contain no-scrollbar px-4 pb-2 [touch-action:pan-x]"
            onPointerDown={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {FILTERS.map((f) => (
              <Button
                key={f}
                variant={active === f ? "chipActive" : "chip"}
                size="chip"
                onClick={() => setActive(active === f ? null : f)}
                className="font-poppins shrink-0"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* Locate button */}
        <button className="absolute bottom-6 right-5 h-12 w-12 rounded-full bg-card border border-border shadow-card-elegant flex items-center justify-center text-primary">
          <Navigation className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom sheet */}
      <section className="-mt-6 relative z-10 rounded-t-3xl bg-card border-t border-border px-5 pt-5 pb-6 shadow-card-elegant">
        <div className="mx-auto h-1 w-12 rounded-full bg-muted mb-4" />
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-display text-base">Nearby Firms</h2>
          <span className="text-xs text-muted-foreground font-poppins">{filtered.length} results</span>
        </div>

        <div className="space-y-3">
          {filtered.map((f, i) => (
            <button
              key={f.id}
              onClick={() => navigate("/firm")}
              className="w-full text-left flex items-center gap-3 p-3 rounded-2xl bg-background-elevated border border-border hover:border-primary/50 transition-all animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-poppins font-semibold text-sm truncate">{f.name}</p>
                  <span
                    className={`shrink-0 text-[9px] uppercase tracking-wider font-poppins font-semibold px-1.5 py-0.5 rounded-md border ${
                      f.area === "Rural"
                        ? "text-accent border-accent/40 bg-accent/10"
                        : "text-primary border-primary/40 bg-primary/10"
                    }`}
                  >
                    {f.area}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">{f.services.join(" · ")}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{f.distance}</span>
                  <span className="flex items-center gap-0.5 text-xs text-primary">
                    <Star className="h-3 w-3 fill-current" /> {f.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground font-poppins py-6">
              No firms match this filter.
            </p>
          )}
        </div>
      </section>
    </AppShell>
  );
};

export default MapSearch;
