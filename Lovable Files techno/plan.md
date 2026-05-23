Add more surveying firms to the map directory in `src/pages/MapSearch.tsx`, categorized by location and specialty:

**Rural firms (Property Boundary & Survey focus)** — placed in outskirts of Davao (Calinan, Toril, Tugbok, Marilog):
1. Calinan Land Surveyors — Property Boundary, Relocation (~7.1850, 125.4680)
2. Toril Geodetic Services — Boundary, Subdivision (~7.0250, 125.4900)
3. Tugbok Cadastral Survey Co. — Cadastral, Relocation (~7.1100, 125.5100)
4. Marilog Highland Surveying — Boundary, Topographic (~7.3500, 125.4200)

**City firms (GIS & Specialized focus)** — placed in Davao city center / Lanang / Matina:
5. Davao GIS Mapping Solutions — GIS, Topographic (~7.0850, 125.6130)
6. Mindanao Geomatics & GIS — GIS, As-Built (~7.0900, 125.6250)
7. UrbanGeo Analytics Davao — GIS, Hydrographic (~7.0650, 125.6080)

**Changes to FIRMS array**:
- Add `category` field ("Property Boundary" | "GIS / Specialized") to all firms (existing + new) so the filter chips can actually filter
- Add `services: string[]` for display
- Keep existing 4 firms

**Filter behavior**:
- Update `FILTERS` to include "GIS" 
- Wire up the active filter to filter both the map markers and bottom-sheet list (currently the chip is decorative)

**Visual**:
- Add a small category badge under each firm name in the bottom sheet list
- Marker color stays orange (no scope change to GoogleMap component)

Scope: only `src/pages/MapSearch.tsx`. No backend, no new components.