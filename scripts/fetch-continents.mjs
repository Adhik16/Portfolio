// Script to fetch Natural Earth coastline data and generate continent TypeScript
// Run: node scripts/fetch-continents.mjs

const R = 1.35;

async function main() {
  const url = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson";
  console.log("Fetching Natural Earth 110m land data...");
  const res = await fetch(url);
  const geojson = await res.json();

  // Group features by continent using rough bounding box heuristics
  const continents = {
    NorthAmerica: [],
    SouthAmerica: [],
    Europe: [],
    Africa: [],
    Asia: [],
    Oceania: [],
    Greenland: [],
  };

  for (const feat of geojson.features) {
    const coords = extractRings(feat);
    if (coords.length === 0) continue;

    // Determine continent by centroid
    let sumLon = 0, sumLat = 0, count = 0;
    for (const ring of coords) {
      for (const [lon, lat] of ring) {
        sumLon += lon; sumLat += lat; count++;
      }
    }
    const cLon = sumLon / count;
    const cLat = sumLat / count;

    if (cLat > 70 && cLon < -20) continents.Greenland.push(...coords);
    else if (cLat > 25 && cLon > -170 && cLon < -50) continents.NorthAmerica.push(...coords);
    else if (cLat < 20 && cLat > -60 && cLon > -85 && cLon < -30) continents.SouthAmerica.push(...coords);
    else if (cLat > 35 && cLon > -10 && cLon < 60) continents.Europe.push(...coords);
    else if (cLat < 35 && cLat > -40 && cLon > -20 && cLon < 55) continents.Africa.push(...coords);
    else if (cLat > 0 && cLon > 50) continents.Asia.push(...coords);
    else if (cLat < 0 && cLon > 95) continents.Oceania.push(...coords);
    else if (cLon > -170 && cLon < -50) continents.NorthAmerica.push(...coords);
    else if (cLon > 50) continents.Asia.push(...coords);
  }

  // Output TypeScript
  let ts = `// Auto-generated continent polygon data from Natural Earth 110m land
// Generated: ${new Date().toISOString()}

type Poly = [number, number][];

export const continentPolygons: { n: string; p: Poly }[] = [
`;

  for (const [name, rings] of Object.entries(continents)) {
    if (rings.length === 0) continue;
    // Take the largest ring
    rings.sort((a, b) => b.length - a.length);
    const mainRing = rings[0];

    // Simplify by taking every Nth point to keep under ~40 points
    const step = Math.max(1, Math.floor(mainRing.length / 40));
    const simplified = mainRing.filter((_, i) => i % step === 0);

    ts += `  { n: "${name}", p: [`;
    for (let i = 0; i < simplified.length; i++) {
      const [lon, lat] = simplified[i];
      ts += `[${lat.toFixed(2)},${lon.toFixed(2)}]`;
      if (i < simplified.length - 1) ts += ",";
    }
    ts += `] },\n`;
  }

  ts += `];
`;

  console.log(ts);
  console.log(`\nTotal continent entries: ${Object.entries(continents).filter(([,r]) => r.length > 0).length}`);
}

function extractRings(feat) {
  const result = [];
  if (feat.geometry.type === "Polygon") {
    for (const ring of feat.geometry.coordinates) {
      result.push(ring); // ring is [[lon, lat], ...]
    }
  } else if (feat.geometry.type === "MultiPolygon") {
    for (const poly of feat.geometry.coordinates) {
      for (const ring of poly) {
        result.push(ring);
      }
    }
  }
  return result;
}

main().catch(console.error);
