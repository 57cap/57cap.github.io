import type { Dealer, Department } from '../types.js';

/**
 * Seed dealer network. In production this is a managed table with live
 * relationships; the inventory-verification agent contacts these dealers.
 */
export const DEALERS: Dealer[] = [
  {
    id: 'moto-centro-ss',
    name: 'Moto Centro San Salvador',
    department: 'San Salvador',
    address: 'Alameda Juan Pablo II, San Salvador',
    phone: '+503 2222 1100',
    whatsapp: '+503 7000 1100',
    email: 'ventas@motocentro.sv',
    brandsCarried: ['Bajaj', 'Honda', 'TVS', 'Italika'],
  },
  {
    id: 'motos-libertad',
    name: 'Motos La Libertad',
    department: 'La Libertad',
    address: 'Carretera a Santa Tecla, La Libertad',
    phone: '+503 2228 4500',
    whatsapp: '+503 7000 4500',
    email: 'info@motoslibertad.sv',
    brandsCarried: ['Yamaha', 'Suzuki', 'Honda'],
  },
  {
    id: 'moto-occidente-sa',
    name: 'Moto Occidente Santa Ana',
    department: 'Santa Ana',
    address: 'Av. Independencia, Santa Ana',
    phone: '+503 2440 7800',
    whatsapp: '+503 7000 7800',
    email: 'santaana@motoccidente.sv',
    brandsCarried: ['Bajaj', 'TVS', 'Italika', 'Yamaha'],
  },
  {
    id: 'moto-oriente-sm',
    name: 'Moto Oriente San Miguel',
    department: 'San Miguel',
    address: 'Av. Roosevelt Sur, San Miguel',
    phone: '+503 2660 3300',
    whatsapp: '+503 7000 3300',
    email: 'sanmiguel@motooriente.sv',
    brandsCarried: ['Honda', 'Suzuki', 'Bajaj', 'Italika'],
  },
];

/** Find dealers in a department that carry a given brand. */
export function findDealers(brand: string, department?: Department): Dealer[] {
  const b = brand.toLowerCase().trim();
  return DEALERS.filter((d) => {
    const carries = d.brandsCarried.some((x) => x.toLowerCase() === b);
    if (!carries) return false;
    if (department && department !== 'Otro' && d.department !== department) return false;
    return true;
  });
}

export function getDealer(id: string): Dealer | undefined {
  return DEALERS.find((d) => d.id === id);
}
