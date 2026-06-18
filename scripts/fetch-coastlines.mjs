// Fetches Natural Earth 110m coastline and writes as JSON rings
import { writeFileSync } from "fs";

const url = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson";

async function main() {
  console.log("Fetching...");
  const res = await fetch(url);
  const data = await res.json();

  const rings = [];
  for (const f of data.features) {
    if (f.geometry.type === "Polygon") {
      for (const r of f.geometry.coordinates) rings.push(r);
    } else if (f.geometry.type === "MultiPolygon") {
      for (const p of f.geometry.coordinates) for (const r of p) rings.push(r);
    }
  }

  writeFileSync("public/coastlines.json", JSON.stringify(rings));
  console.log(`Done: ${rings.length} rings, ${rings.reduce((s,r) => s + r.length, 0)} points`);
}

main();
