import type { ImageMetadata } from 'astro';

export type Service = {
  slug: string;        // must match the folder name under src/assets/services/<slug>/
  title: string;
  blurb: string;
  bullets: string[];
};

export type ServiceGroup = {
  id: string;
  label: string;
  eyebrow: string;
  intro: string;
  services: Service[];
};

// ── DROP-IN IMAGES ────────────────────────────────────────────────────────────
// Drop a photo into src/assets/services/<slug>/ and it shows up next to that
// service automatically on the next build/dev reload. Filenames sort A→Z, so
// prefix with 01-, 02- if you want a specific order.
const serviceImageModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/services/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

export function getServiceImages(slug: string): ImageMetadata[] {
  return Object.entries(serviceImageModules)
    .filter(([path]) => path.includes(`/services/${slug}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);
}

// ── SERVICE CONTENT ───────────────────────────────────────────────────────────
export const serviceGroups: ServiceGroup[] = [
  {
    id: 'welding',
    label: 'Welding & Fabrication',
    eyebrow: 'Steel work',
    intro:
      'From a single broken bracket to full custom fabrication, every weld is laid to hold up under load, weather, and time.',
    services: [
      {
        slug: 'mig-tig-stick',
        title: 'MIG, TIG & Stick Welding',
        blurb:
          'Three processes, one standard. The right method for the metal and the job — clean TIG on thin or stainless work, fast MIG on production runs, and stick where conditions are rough.',
        bullets: [
          'MIG for speed and strong production welds',
          'TIG for precision on stainless and aluminum',
          'Stick for outdoor, dirty, or heavy material',
          'Proper equipment setup and safety protocols',
        ],
      },
      {
        slug: 'fabrication',
        title: 'Custom Metal Fabrication',
        blurb:
          'Built to spec from your idea, sketch, or blueprint. Trailers, gates, racks, brackets, repairs, and one-off parts cut, shaped, and welded to fit.',
        bullets: [
          'Blueprint reading and build-to-spec work',
          'Repairs and reinforcement of existing steel',
          'Gates, frames, racks, and custom parts',
          'Grinding and finishing for a clean result',
        ],
      },
      {
        slug: 'plasma-cutting',
        title: 'Plasma Cutting',
        blurb:
          'Fast, accurate cuts through plate and structural steel. Clean edges that save grinding time and keep fabrication tight.',
        bullets: [
          'Precise cuts on thick and thin material',
          'Clean edges ready for weld prep',
          'Shapes, holes, and straight runs',
        ],
      },
      {
        slug: 'structural',
        title: 'Structural & Pipe Welding',
        blurb:
          'Certified for structural and pipe work — the welds that carry load and hold pressure. Done to code, every joint.',
        bullets: [
          'Structural certified',
          'Pipe certified',
          'Load-bearing and code-conscious joints',
        ],
      },
      {
        slug: 'mobile-welding',
        title: 'Mobile Welding',
        blurb:
          "Some jobs can't move. The rig comes to your site — farm, shop, jobsite, or breakdown on the side of a field — and the work gets done where the steel is.",
        bullets: [
          'On-site repairs and fabrication',
          'Farm, jobsite, and equipment work',
          'No need to haul heavy steel to a shop',
        ],
      },
    ],
  },
  {
    id: 'dirt-work',
    label: 'Dirt Work & Site Services',
    eyebrow: 'Ground work',
    intro:
      'Site prep and groundwork to get the ground ready before, during, or after the steel goes up.',
    services: [
      {
        slug: 'excavation',
        title: 'Excavation',
        blurb:
          'Digging, grading, and moving earth for footings, pads, drainage, and site prep. The ground squared away before anything gets built on it.',
        bullets: [
          'Footings, pads, and site prep',
          'Grading and earth moving',
          'Cleanup and haul-off as needed',
        ],
      },
      {
        slug: 'core-drilling',
        title: 'Core Drilling',
        blurb:
          'Clean, accurate holes bored through concrete and hard material for plumbing, electrical, drainage, and anchor work.',
        bullets: [
          'Concrete and slab penetrations',
          'Holes sized for pipe, conduit, or anchors',
          'Accurate placement, minimal mess',
        ],
      },
      {
        slug: 'trenching',
        title: 'Trenching',
        blurb:
          'Trenches dug to depth and line for water, drainage, electrical, and utility runs — straight, consistent, and ready to lay in.',
        bullets: [
          'Utility, water, and drainage lines',
          'Consistent depth and grade',
          'Backfill and cleanup',
        ],
      },
      {
        slug: 'maintenance',
        title: 'General Maintenance',
        blurb:
          'The catch-all for the jobs that keep a property and its equipment running — repairs, fixes, and upkeep that fall between trades.',
        bullets: [
          'Equipment and property repairs',
          'Upkeep and fixes across trades',
          'Honest assessment of what the job needs',
        ],
      },
    ],
  },
];

// Flat list for places that just need every service.
export const allServices: Service[] = serviceGroups.flatMap((g) => g.services);
