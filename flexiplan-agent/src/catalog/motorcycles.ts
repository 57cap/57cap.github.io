import type { Motorcycle } from '../types.js';

/**
 * Seed catalog of motorcycles commonly financed in El Salvador.
 * Prices are representative dealer-counter prices in USD.
 *
 * In production this would be backed by a database / dealer feed; the agent
 * only ever sees it through `searchCatalog`, so swapping the source is trivial.
 */
export const MOTORCYCLES: Motorcycle[] = [
  {
    id: 'bajaj-boxer-ct125',
    brand: 'Bajaj',
    model: 'Boxer CT 125',
    priceUsd: 1450,
    engineCc: 125,
    useCase: ['trabajo', 'economico', 'ciudad'],
    highlights: ['Muy bajo consumo', 'Repuestos baratos', 'Ideal para trabajo diario'],
  },
  {
    id: 'bajaj-pulsar-ns160',
    brand: 'Bajaj',
    model: 'Pulsar NS 160',
    priceUsd: 2350,
    engineCc: 160,
    useCase: ['ciudad', 'carretera'],
    highlights: ['Deportiva', 'Frenos de disco', 'Buena para carretera'],
  },
  {
    id: 'honda-cargo-cg125',
    brand: 'Honda',
    model: 'CG 125 Cargo',
    priceUsd: 1950,
    engineCc: 125,
    useCase: ['trabajo', 'delivery', 'economico'],
    highlights: ['Marca confiable', 'Excelente reventa', 'Robusta para carga'],
  },
  {
    id: 'honda-xr150',
    brand: 'Honda',
    model: 'XR 150L',
    priceUsd: 3100,
    engineCc: 150,
    useCase: ['carretera', 'trabajo'],
    highlights: ['Doble propósito', 'Aguanta caminos difíciles', 'Alta durabilidad'],
  },
  {
    id: 'yamaha-ybr125',
    brand: 'Yamaha',
    model: 'YBR 125',
    priceUsd: 2100,
    engineCc: 125,
    useCase: ['ciudad', 'trabajo', 'economico'],
    highlights: ['Cómoda', 'Bajo mantenimiento', 'Buena para ciudad'],
  },
  {
    id: 'yamaha-fz150',
    brand: 'Yamaha',
    model: 'FZ 150',
    priceUsd: 2750,
    engineCc: 150,
    useCase: ['ciudad', 'carretera'],
    highlights: ['Diseño moderno', 'Buen rendimiento', 'Popular entre jóvenes'],
  },
  {
    id: 'suzuki-gn125',
    brand: 'Suzuki',
    model: 'GN 125',
    priceUsd: 1900,
    engineCc: 125,
    useCase: ['ciudad', 'economico'],
    highlights: ['Clásica', 'Fácil de manejar', 'Repuestos disponibles'],
  },
  {
    id: 'tvs-stryker125',
    brand: 'TVS',
    model: 'Stryker 125',
    priceUsd: 1550,
    engineCc: 125,
    useCase: ['trabajo', 'economico', 'delivery'],
    highlights: ['Precio accesible', 'Económica en gasolina', 'Para empezar a trabajar'],
  },
  {
    id: 'italika-dm150',
    brand: 'Italika',
    model: 'DM 150',
    priceUsd: 1350,
    engineCc: 150,
    useCase: ['economico', 'ciudad', 'delivery'],
    highlights: ['La más accesible', 'Red de servicio amplia', 'Buena de entrada'],
  },
];

export interface CatalogQuery {
  brand?: string;
  maxPriceUsd?: number;
  useCase?: string;
}

/** Filter the catalog. All filters are optional and combine with AND. */
export function searchCatalog(query: CatalogQuery): Motorcycle[] {
  const brand = query.brand?.toLowerCase().trim();
  const useCase = query.useCase?.toLowerCase().trim();

  return MOTORCYCLES.filter((m) => {
    if (brand && !m.brand.toLowerCase().includes(brand)) return false;
    if (query.maxPriceUsd && m.priceUsd > query.maxPriceUsd) return false;
    if (useCase && !m.useCase.some((u) => u.includes(useCase) || useCase.includes(u)))
      return false;
    return true;
  }).sort((a, b) => a.priceUsd - b.priceUsd);
}

export function getMotorcycle(id: string): Motorcycle | undefined {
  return MOTORCYCLES.find((m) => m.id === id);
}

/** Distinct brand list — handy for the agent to mention options. */
export const BRANDS = [...new Set(MOTORCYCLES.map((m) => m.brand))];
