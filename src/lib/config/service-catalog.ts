// =============================================================================
// Sherpa Pros — Service Catalog
// Comprehensive trade categories + sub-services for Greater Portsmouth NH area
// Used by: job posting wizard, pro trade selection, search filters, dispatch
// =============================================================================

export type UrgencyLevel = 'emergency' | 'standard' | 'flexible';

export interface SubService {
  id: string;
  name: string;
  scope: string;
  budgetRange: { min: number; max: number }; // in dollars (display), stored as cents in DB
  typicalDuration: string;
  urgency: UrgencyLevel;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string; // Ionicons name
  description: string;
  subServices: SubService[];
}

export const SERVICE_CATALOG: ServiceCategory[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. PLUMBING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: 'water-outline',
    description: 'Pipes, fixtures, water heaters, drains',
    subServices: [
      {
        id: 'faucet-replacement',
        name: 'Faucet Replacement',
        scope: 'Shut off water supply, disconnect and remove old faucet, clean mounting surface, install new faucet with supply lines, test for leaks under pressure, cleanup',
        budgetRange: { min: 150, max: 500 },
        typicalDuration: '1-2 hours',
        urgency: 'standard',
      },
      {
        id: 'water-heater-install',
        name: 'Water Heater Installation',
        scope: 'Drain and disconnect existing unit, remove old water heater, set new unit in place, connect water supply lines and gas/electric, install expansion tank if required, test T&P relief valve, verify temperature and flow, inspect for code compliance',
        budgetRange: { min: 1500, max: 4500 },
        typicalDuration: '4-8 hours',
        urgency: 'standard',
      },
      {
        id: 'drain-cleaning',
        name: 'Drain Cleaning',
        scope: 'Diagnose blockage location with camera inspection if needed, snake or hydro-jet drain line, clear debris, test flow rate, recommend preventive measures',
        budgetRange: { min: 150, max: 500 },
        typicalDuration: '1-3 hours',
        urgency: 'standard',
      },
      {
        id: 'pipe-repair',
        name: 'Pipe Repair / Leak Fix',
        scope: 'Locate leak source, shut off water, cut out damaged section, solder or fit new pipe (copper/PEX/PVC), pressure test, patch any drywall access holes, cleanup',
        budgetRange: { min: 200, max: 1200 },
        typicalDuration: '2-6 hours',
        urgency: 'standard',
      },
      {
        id: 'toilet-install',
        name: 'Toilet Installation',
        scope: 'Remove old toilet, inspect flange and replace wax ring, set new toilet and secure to floor, connect water supply, test flush and check for leaks, caulk base, cleanup',
        budgetRange: { min: 200, max: 600 },
        typicalDuration: '1-3 hours',
        urgency: 'standard',
      },
      {
        id: 'bathroom-rough-in',
        name: 'Bathroom Rough-In',
        scope: 'Layout drain and supply locations per plan, install DWV (drain-waste-vent) piping, run hot/cold supply lines (PEX or copper), install shut-off valves, pressure test all lines, coordinate with inspector for rough-in approval',
        budgetRange: { min: 2500, max: 6000 },
        typicalDuration: '2-4 days',
        urgency: 'flexible',
      },
      {
        id: 'sump-pump-install',
        name: 'Sump Pump Installation',
        scope: 'Excavate sump pit if needed, set pump basin and gravel bed, install submersible pump, run discharge line to exterior, install check valve, wire to dedicated circuit or battery backup, test cycle',
        budgetRange: { min: 800, max: 2500 },
        typicalDuration: '4-8 hours',
        urgency: 'standard',
      },
      {
        id: 'garbage-disposal-install',
        name: 'Garbage Disposal Install',
        scope: 'Disconnect and remove old disposal or drain assembly, install new mounting hardware, connect disposal unit, wire electrical connection, test operation and check for leaks',
        budgetRange: { min: 150, max: 450 },
        typicalDuration: '1-2 hours',
        urgency: 'standard',
      },
      {
        id: 'tankless-water-heater',
        name: 'Tankless Water Heater Conversion',
        scope: 'Remove existing tank unit, upgrade gas line or electrical panel as needed, mount tankless unit on wall, run condensate drain, connect water lines, program temperature settings, verify flow rate at all fixtures',
        budgetRange: { min: 3000, max: 7000 },
        typicalDuration: '1-2 days',
        urgency: 'flexible',
      },
      {
        id: 'outdoor-spigot',
        name: 'Outdoor Spigot / Hose Bib',
        scope: 'Core through rim joist or foundation, install frost-free sillcock, connect to interior supply line with shut-off valve, insulate penetration, test for leaks and proper drainage',
        budgetRange: { min: 200, max: 600 },
        typicalDuration: '2-4 hours',
        urgency: 'flexible',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. ELECTRICAL
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'flash-outline',
    description: 'Wiring, panels, outlets, lighting, EV chargers',
    subServices: [
      {
        id: 'outlet-replacement',
        name: 'Outlet / Switch Replacement',
        scope: 'Kill circuit at breaker, remove existing outlet or switch, inspect wiring condition, install new device (GFCI/AFCI if code requires), test polarity and ground, install cover plate',
        budgetRange: { min: 100, max: 300 },
        typicalDuration: '30 min - 1 hour per device',
        urgency: 'standard',
      },
      {
        id: 'panel-upgrade',
        name: 'Electrical Panel Upgrade',
        scope: 'Coordinate utility disconnect, remove old panel, install new 200A panel with main breaker, re-land all existing circuits, label all breakers, install whole-house surge protector, reconnect utility, pull permit and schedule inspection',
        budgetRange: { min: 2500, max: 5000 },
        typicalDuration: '1-2 days',
        urgency: 'standard',
      },
      {
        id: 'lighting-install',
        name: 'Light Fixture Installation',
        scope: 'Kill circuit, remove existing fixture, inspect junction box and reinforce if needed, connect new fixture wiring (match hot/neutral/ground), secure fixture, install bulbs, restore power and test dimmer compatibility',
        budgetRange: { min: 100, max: 500 },
        typicalDuration: '1-2 hours per fixture',
        urgency: 'standard',
      },
      {
        id: 'ev-charger-install',
        name: 'EV Charger Installation',
        scope: 'Assess panel capacity, install dedicated 50A circuit with appropriate wire gauge, mount Level 2 EVSE unit in garage or exterior, run conduit if needed, connect and test charging, pull permit',
        budgetRange: { min: 800, max: 2500 },
        typicalDuration: '4-8 hours',
        urgency: 'flexible',
      },
      {
        id: 'whole-house-rewire',
        name: 'Whole-House Rewire',
        scope: 'Map all existing circuits, pull permits, run new Romex (NM-B) through walls/attic/basement, install new outlets and switches throughout, replace panel if needed, patch access holes, final inspection and certificate of compliance',
        budgetRange: { min: 8000, max: 20000 },
        typicalDuration: '5-10 days',
        urgency: 'flexible',
      },
      {
        id: 'recessed-lighting',
        name: 'Recessed Lighting Package',
        scope: 'Plan layout and spacing per room dimensions, cut ceiling openings, run new circuits from panel or existing junction, install IC-rated housings, wire in series with dimmer switch, patch and paint around cans, install LED trim kits',
        budgetRange: { min: 800, max: 3000 },
        typicalDuration: '4-8 hours',
        urgency: 'flexible',
      },
      {
        id: 'ceiling-fan-install',
        name: 'Ceiling Fan Installation',
        scope: 'Kill circuit, remove existing fixture, install fan-rated junction box and brace, assemble fan, wire with wall switch or remote, balance blades, test all speeds and light',
        budgetRange: { min: 150, max: 500 },
        typicalDuration: '1-3 hours',
        urgency: 'standard',
      },
      {
        id: 'generator-hookup',
        name: 'Generator / Transfer Switch',
        scope: 'Install manual or automatic transfer switch at main panel, run dedicated inlet box on exterior, wire critical circuits to transfer switch sub-panel, test with generator under load, pull permit and inspect',
        budgetRange: { min: 1500, max: 5000 },
        typicalDuration: '1-2 days',
        urgency: 'standard',
      },
      {
        id: 'smoke-co-detectors',
        name: 'Smoke / CO Detector Install',
        scope: 'Install hardwired interconnected smoke and CO detectors per NH/ME/MA code requirements, run wiring to each location, connect to circuit, test alarm cascade, provide compliance documentation',
        budgetRange: { min: 300, max: 1000 },
        typicalDuration: '2-4 hours',
        urgency: 'standard',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. HVAC
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'hvac',
    name: 'HVAC',
    icon: 'thermometer-outline',
    description: 'Heating, cooling, ventilation, air quality',
    subServices: [
      {
        id: 'furnace-repair',
        name: 'Furnace Repair',
        scope: 'Diagnose issue (ignitor, flame sensor, blower motor, control board, gas valve), replace failed component, test combustion and safety controls, verify heat output and thermostat operation, clean as needed',
        budgetRange: { min: 200, max: 1200 },
        typicalDuration: '1-4 hours',
        urgency: 'standard',
      },
      {
        id: 'ac-install',
        name: 'Central AC Installation',
        scope: 'Size system per Manual J load calc, set condenser pad and unit, run refrigerant lines and electrical, install evaporator coil in air handler, connect thermostat, charge refrigerant, test cooling delta T, pull permit',
        budgetRange: { min: 4000, max: 10000 },
        typicalDuration: '1-3 days',
        urgency: 'flexible',
      },
      {
        id: 'mini-split-install',
        name: 'Mini-Split Heat Pump Install',
        scope: 'Mount indoor head unit on wall bracket, set outdoor condenser on pad or wall bracket, core through wall for line set, run refrigerant lines and drain, connect electrical, vacuum and charge system, test heating and cooling modes, program remote',
        budgetRange: { min: 3000, max: 7000 },
        typicalDuration: '1-2 days',
        urgency: 'flexible',
      },
      {
        id: 'duct-cleaning',
        name: 'Duct Cleaning',
        scope: 'Inspect ductwork with camera, seal and pressurize system, agitate debris with compressed air tools, vacuum with HEPA truck-mount, clean supply and return registers, sanitize if requested, provide before/after photos',
        budgetRange: { min: 300, max: 800 },
        typicalDuration: '3-5 hours',
        urgency: 'flexible',
      },
      {
        id: 'thermostat-install',
        name: 'Thermostat Installation',
        scope: 'Remove old thermostat, check wire count and compatibility, install mounting plate and level, connect wiring (C-wire adapter if needed), pair to WiFi, configure heating/cooling schedules, test all modes',
        budgetRange: { min: 100, max: 350 },
        typicalDuration: '30 min - 1 hour',
        urgency: 'standard',
      },
      {
        id: 'boiler-service',
        name: 'Boiler Service / Repair',
        scope: 'Inspect boiler operation, clean burner assembly, check expansion tank pressure, bleed air from radiators/baseboards, test aquastat and zone valves, replace circulator pump or zone valve if needed, verify even heat distribution',
        budgetRange: { min: 250, max: 1500 },
        typicalDuration: '2-4 hours',
        urgency: 'standard',
      },
      {
        id: 'annual-hvac-tune-up',
        name: 'Annual HVAC Tune-Up',
        scope: 'Inspect and clean burner/heat exchanger (heating) or evaporator/condenser coils (cooling), check refrigerant charge, test safety controls, lubricate motors, replace filter, check thermostat calibration, document findings',
        budgetRange: { min: 150, max: 350 },
        typicalDuration: '1-2 hours',
        urgency: 'flexible',
      },
      {
        id: 'heat-pump-install',
        name: 'Whole-House Heat Pump System',
        scope: 'Perform Manual J load calculation, install outdoor condenser, install multi-zone indoor units or ducted air handler, run line sets and electrical, install programmable thermostat, charge and commission system, pull permit, coordinate rebate paperwork (NH Energy, Efficiency Maine, Mass Save)',
        budgetRange: { min: 8000, max: 25000 },
        typicalDuration: '2-5 days',
        urgency: 'flexible',
      },
      {
        id: 'hrv-erv-install',
        name: 'HRV / ERV Ventilation Install',
        scope: 'Mount heat recovery ventilator or energy recovery ventilator, run ductwork to fresh air intake and exhaust, connect to existing duct system or install dedicated ducts, wire controls, balance airflow, test humidity exchange',
        budgetRange: { min: 2000, max: 5000 },
        typicalDuration: '1-2 days',
        urgency: 'flexible',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. PAINTING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'painting',
    name: 'Painting',
    icon: 'color-palette-outline',
    description: 'Interior, exterior, prep, stain, specialty finishes',
    subServices: [
      {
        id: 'interior-room-paint',
        name: 'Interior Room Painting',
        scope: 'Move and cover furniture, lay drop cloths, remove switch/outlet covers, fill nail holes and patch drywall imperfections with spackle, sand smooth, remove existing caulking from trim/ceiling joints, apply fresh caulk, prime repaired areas and stains, cut in ceiling line and trim edges, roll walls with 2 coats premium latex, reinstall covers, cleanup',
        budgetRange: { min: 400, max: 1200 },
        typicalDuration: '1-2 days per room',
        urgency: 'flexible',
      },
      {
        id: 'interior-trim-paint',
        name: 'Interior Trim & Door Painting',
        scope: 'Clean all trim surfaces, remove old caulking between trim and wall, sand existing paint to degloss, fill gaps and nail holes, apply new caulk at all joints, prime bare wood and repairs, apply 2 coats semi-gloss enamel by brush, paint door(s) both sides and edges, reinstall hardware',
        budgetRange: { min: 300, max: 1000 },
        typicalDuration: '1-2 days',
        urgency: 'flexible',
      },
      {
        id: 'exterior-house-paint',
        name: 'Exterior House Painting',
        scope: 'Pressure wash all surfaces, scrape loose and peeling paint, sand rough edges, remove deteriorated caulking around windows/doors/trim joints, apply new exterior caulk, prime bare wood and stained areas with oil-based primer, apply 2 coats acrylic latex to body, trim in contrasting color, paint shutters, touch up foundation line, cleanup and debris removal',
        budgetRange: { min: 4000, max: 12000 },
        typicalDuration: '4-8 days',
        urgency: 'flexible',
      },
      {
        id: 'exterior-trim-paint',
        name: 'Exterior Trim & Fascia',
        scope: 'Set up ladders/staging, scrape and sand existing trim paint, remove old caulking at all joints, apply new paintable exterior caulk, prime bare and repaired areas, apply 2 coats exterior semi-gloss to trim/fascia/rake boards/window casings, cleanup',
        budgetRange: { min: 1500, max: 5000 },
        typicalDuration: '2-4 days',
        urgency: 'flexible',
      },
      {
        id: 'cabinet-painting',
        name: 'Cabinet Painting / Refinishing',
        scope: 'Remove doors, drawers, and hardware, label all pieces, clean and degrease surfaces, sand/degloss all surfaces, fill imperfections, prime with bonding primer, apply 2 coats cabinet-grade enamel (spray or brush/roll), reinstall hardware and doors, adjust hinges',
        budgetRange: { min: 2500, max: 7000 },
        typicalDuration: '3-7 days',
        urgency: 'flexible',
      },
      {
        id: 'deck-stain',
        name: 'Deck Staining / Sealing',
        scope: 'Pressure wash deck and railing, apply wood brightener if needed, allow to dry 24-48 hrs, sand rough spots, mask adjacent surfaces, apply 1-2 coats semi-transparent or solid stain by brush/roller/sprayer, stain railings and stairs, cleanup',
        budgetRange: { min: 500, max: 2000 },
        typicalDuration: '1-3 days',
        urgency: 'flexible',
      },
      {
        id: 'ceiling-paint',
        name: 'Ceiling Painting',
        scope: 'Cover floors and furniture, scrape any flaking paint, patch cracks and nail pops, sand smooth, spot-prime repairs, cut in perimeter with brush, roll ceiling with flat ceiling paint (2 coats if color change), cleanup',
        budgetRange: { min: 250, max: 800 },
        typicalDuration: '4-8 hours per room',
        urgency: 'flexible',
      },
      {
        id: 'wallpaper-removal-paint',
        name: 'Wallpaper Removal + Paint',
        scope: 'Score wallpaper, apply removal solution, strip all wallpaper and adhesive residue, wash walls, skim coat any damaged areas, sand smooth, prime with shellac or PVA primer to seal, apply 2 coats latex, cleanup',
        budgetRange: { min: 600, max: 2000 },
        typicalDuration: '1-3 days per room',
        urgency: 'flexible',
      },
      {
        id: 'accent-wall',
        name: 'Accent Wall / Feature Wall',
        scope: 'Prep wall surface (fill, sand, prime), tape off edges and adjacent surfaces, apply 2-3 coats of accent color or specialty finish (limewash, venetian plaster, faux finish), remove tape, touch up edges, cleanup',
        budgetRange: { min: 200, max: 800 },
        typicalDuration: '4-8 hours',
        urgency: 'flexible',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. CARPENTRY
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'carpentry',
    name: 'Carpentry',
    icon: 'hammer-outline',
    description: 'Windows, doors, trim, framing, custom work',
    subServices: [
      {
        id: 'window-replacement',
        name: 'Window Replacement (2-10 units)',
        scope: 'Remove interior trim, extract old window sash/frame, inspect rough opening and repair rot if found, flash and seal opening, install new window with shims and low-expand foam, insulate gaps, reinstall or install new interior trim (casing, sill, apron), patch drywall around trim, caulk interior and exterior, prime and paint new trim to match existing',
        budgetRange: { min: 800, max: 8000 },
        typicalDuration: '1-4 days',
        urgency: 'standard',
      },
      {
        id: 'door-install-interior',
        name: 'Interior Door Installation',
        scope: 'Remove old door and hardware, check rough opening for plumb/level, install prehung unit with shims, secure with screws, install casing trim both sides, fill nail holes, caulk, prime and paint trim and door, install new hardware (knob/lever, hinges), adjust for proper swing and latch',
        budgetRange: { min: 300, max: 800 },
        typicalDuration: '2-4 hours per door',
        urgency: 'standard',
      },
      {
        id: 'door-install-exterior',
        name: 'Exterior Door Installation',
        scope: 'Remove existing door/frame, inspect and repair rough opening, flash and waterproof opening with peel-and-stick membrane, set new prehung entry door, shim plumb and level, insulate gaps, install exterior trim/brickmold, caulk all exterior joints, install lockset/deadbolt/kick plate, adjust threshold, paint or stain',
        budgetRange: { min: 800, max: 3000 },
        typicalDuration: '4-8 hours',
        urgency: 'standard',
      },
      {
        id: 'finish-trim-install',
        name: 'Finish Trim / Molding',
        scope: 'Measure and cut baseboard, casing, crown molding, or wainscoting to fit, cope inside corners, miter outside corners, nail in place, fill all nail holes, caulk gaps at wall/ceiling joints, sand, prime and paint 2 coats semi-gloss',
        budgetRange: { min: 500, max: 3000 },
        typicalDuration: '1-3 days',
        urgency: 'flexible',
      },
      {
        id: 'framing-wall',
        name: 'Wall Framing / Partition',
        scope: 'Layout wall location on floor/ceiling, cut and assemble top/bottom plates and studs at 16" OC, install blocking for fixtures, frame rough openings for doors, secure to existing structure, coordinate with electrical/plumbing rough-in, inspection ready',
        budgetRange: { min: 500, max: 3000 },
        typicalDuration: '1-2 days',
        urgency: 'flexible',
      },
      {
        id: 'drywall-repair',
        name: 'Drywall Repair & Patch',
        scope: 'Cut out damaged section, install backing if needed, cut and fit new drywall patch, tape seams with mesh or paper tape, apply 3 coats joint compound (mud, fill, skim), sand smooth between coats, prime and paint to match surrounding wall',
        budgetRange: { min: 150, max: 600 },
        typicalDuration: '2-6 hours (plus dry time)',
        urgency: 'standard',
      },
      {
        id: 'closet-build',
        name: 'Custom Closet Build-Out',
        scope: 'Design layout for shelves/rods/drawers, frame and install cleats, cut and install melamine or wood shelving, install closet rods at proper heights, add drawers or pull-out baskets, install LED lighting if requested, paint or finish visible surfaces',
        budgetRange: { min: 800, max: 3500 },
        typicalDuration: '1-3 days',
        urgency: 'flexible',
      },
      {
        id: 'deck-repair',
        name: 'Deck Repair / Board Replacement',
        scope: 'Inspect framing and ledger for rot and structural integrity, sister joists as needed, remove and replace damaged decking boards, tighten or replace fasteners, reinforce railing connections, sand rough spots, apply protective stain or sealer',
        budgetRange: { min: 500, max: 3000 },
        typicalDuration: '1-3 days',
        urgency: 'standard',
      },
      {
        id: 'shelving-install',
        name: 'Shelving / Built-In Install',
        scope: 'Locate studs, install brackets or cleats level, cut shelves to length, secure floating shelves or bracket shelving, fill and touch up fastener holes, verify level and weight capacity',
        budgetRange: { min: 150, max: 800 },
        typicalDuration: '1-4 hours',
        urgency: 'standard',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. LANDSCAPING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'landscaping',
    name: 'Landscaping',
    icon: 'leaf-outline',
    description: 'Lawn, hardscape, fencing, seasonal maintenance',
    subServices: [
      {
        id: 'last-min-mowing',
        name: 'Last-Minute Mowing',
        scope: 'Mow entire lawn at proper height, trim/edge along walkways, driveways, and beds, blow clippings off hardscape, spot-check for obvious hazards (branches, debris)',
        budgetRange: { min: 50, max: 200 },
        typicalDuration: '30 min - 2 hours',
        urgency: 'standard',
      },
      {
        id: 'paver-reset',
        name: 'Paver Reset / Releveling',
        scope: 'Remove sunken or shifted pavers, excavate and re-grade base material, compact with plate compactor, re-set pavers level, fill joints with polymeric sand, compact and mist to activate, clean surface',
        budgetRange: { min: 300, max: 2000 },
        typicalDuration: '4-8 hours',
        urgency: 'standard',
      },
      {
        id: 'fence-replacement',
        name: 'Fencing Replacement',
        scope: 'Remove existing fence and posts (pull or cut at grade), dig new post holes below frost line (42" in NH), set posts in concrete, allow to cure, install rails and pickets/panels, install gate with hardware, stain or paint if wood',
        budgetRange: { min: 1500, max: 8000 },
        typicalDuration: '2-5 days',
        urgency: 'standard',
      },
      {
        id: 'spring-cleanup',
        name: 'Spring Cleanup',
        scope: 'Rake and remove winter debris and matted leaves, cut back perennials, edge all beds, prune dead branches, apply pre-emergent if requested, spread fresh mulch (2-3"), clean up and haul all debris',
        budgetRange: { min: 200, max: 800 },
        typicalDuration: '3-6 hours',
        urgency: 'standard',
      },
      {
        id: 'fall-cleanup',
        name: 'Fall Cleanup',
        scope: 'Blow and rake all leaves from lawn, beds, and gutters, cut back perennials, remove annuals, final mow at lower height, aerate and overseed if requested, winterize irrigation system, apply winter fertilizer, haul debris',
        budgetRange: { min: 250, max: 1000 },
        typicalDuration: '4-8 hours',
        urgency: 'standard',
      },
      {
        id: 'mulching',
        name: 'Mulch Delivery & Spread',
        scope: 'Calculate cubic yards needed, deliver mulch, edge beds, remove old mulch if excessive, spread 2-3" layer of bark mulch around plantings, keep mulch away from trunks/stems, cleanup walkways',
        budgetRange: { min: 200, max: 1000 },
        typicalDuration: '2-6 hours',
        urgency: 'flexible',
      },
      {
        id: 'tree-trimming',
        name: 'Tree Trimming / Removal',
        scope: 'Assess tree health and risk, prune dead/crossing/hazardous branches, shape canopy, chip brush, remove small trees if requested (under 30" DBH), grind stump below grade, spread topsoil and seed over stump area',
        budgetRange: { min: 300, max: 3000 },
        typicalDuration: '2-8 hours',
        urgency: 'standard',
      },
      {
        id: 'drainage-solution',
        name: 'Drainage / French Drain',
        scope: 'Identify water flow pattern and problem areas, excavate trench to proper grade, lay filter fabric and perforated pipe, backfill with crushed stone, connect to daylight outlet or dry well, restore grade and reseed disturbed areas',
        budgetRange: { min: 1000, max: 5000 },
        typicalDuration: '1-3 days',
        urgency: 'standard',
      },
      {
        id: 'retaining-wall',
        name: 'Retaining Wall',
        scope: 'Excavate and compact base, lay leveling pad of crushed stone, stack block or stone per engineered design (stepped back), install geogrid reinforcement if over 3 feet, backfill with drainage stone, cap wall, grade and seed behind wall',
        budgetRange: { min: 2000, max: 10000 },
        typicalDuration: '2-5 days',
        urgency: 'flexible',
      },
      {
        id: 'snow-removal',
        name: 'Snow Removal / Plowing',
        scope: 'Plow driveway and parking areas, shovel walkways and steps, apply ice melt (sand/salt blend) to all walking surfaces, clear around mailbox, stack snow in designated areas away from structures',
        budgetRange: { min: 50, max: 300 },
        typicalDuration: '30 min - 2 hours',
        urgency: 'standard',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7. ROOFING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'roofing',
    name: 'Roofing',
    icon: 'home-outline',
    description: 'Roof repair, replacement, gutters, ice dams',
    subServices: [
      {
        id: 'roof-repair',
        name: 'Roof Leak Repair',
        scope: 'Inspect from interior and exterior to locate leak source, remove damaged shingles in affected area, inspect and replace underlayment if compromised, install new shingles matching existing (color/brand), seal flashings, test with water, cleanup debris',
        budgetRange: { min: 300, max: 1500 },
        typicalDuration: '2-6 hours',
        urgency: 'standard',
      },
      {
        id: 'roof-replacement',
        name: 'Full Roof Replacement',
        scope: 'Strip all existing shingles and underlayment to decking, inspect and replace damaged sheathing, install ice and water shield at eaves/valleys/penetrations, lay synthetic underlayment, install drip edge and valley flashing, nail new architectural shingles, install ridge vent, flash all penetrations (pipes, chimneys), magnetic nail sweep, haul debris in dumpster, pull permit',
        budgetRange: { min: 8000, max: 25000 },
        typicalDuration: '2-5 days',
        urgency: 'standard',
      },
      {
        id: 'gutter-install',
        name: 'Gutter Installation',
        scope: 'Remove old gutters and downspouts, inspect fascia and replace rotten sections, install seamless aluminum gutters with proper pitch, install downspouts with extensions or splash blocks, seal all joints, test water flow, install gutter guards if requested',
        budgetRange: { min: 1000, max: 4000 },
        typicalDuration: '1-2 days',
        urgency: 'standard',
      },
      {
        id: 'gutter-cleaning',
        name: 'Gutter Cleaning',
        scope: 'Set up ladders safely, remove all leaves and debris by hand, flush gutters and downspouts with water, check for proper flow and pitch, re-secure any loose hangers, note and report any damage found',
        budgetRange: { min: 150, max: 400 },
        typicalDuration: '1-3 hours',
        urgency: 'standard',
      },
      {
        id: 'ice-dam-removal',
        name: 'Ice Dam Removal',
        scope: 'Steam ice dams at eaves using low-pressure steamer (no hacking), clear ice from gutters and downspouts, create channels for meltwater drainage, assess and recommend long-term solutions (air sealing, insulation, heat cables)',
        budgetRange: { min: 400, max: 1500 },
        typicalDuration: '2-6 hours',
        urgency: 'emergency',
      },
      {
        id: 'flashing-repair',
        name: 'Flashing Repair',
        scope: 'Remove deteriorated flashing around chimney/skylight/vent pipe, clean and prep surface, install new step/counter flashing with proper overlap, seal with compatible roofing sealant, replace surrounding shingles as needed, test with water',
        budgetRange: { min: 200, max: 1000 },
        typicalDuration: '2-4 hours',
        urgency: 'standard',
      },
      {
        id: 'skylight-install',
        name: 'Skylight Installation',
        scope: 'Cut roof opening per skylight size, frame curb with 2x lumber, install ice and water shield around opening, set skylight on curb and secure, flash with step and counter flashing per manufacturer spec, shingle around, build interior light shaft through attic to ceiling, drywall, tape, and paint shaft, cleanup',
        budgetRange: { min: 1500, max: 4000 },
        typicalDuration: '1-2 days',
        urgency: 'flexible',
      },
      {
        id: 'chimney-repair',
        name: 'Chimney Cap / Repointing',
        scope: 'Inspect chimney condition, grind out deteriorated mortar joints to 3/4" depth, repoint with matching mortar, install or replace chimney cap and spark screen, seal crown with elastomeric sealant, install new flashing at roof line if needed',
        budgetRange: { min: 500, max: 2500 },
        typicalDuration: '4-8 hours',
        urgency: 'standard',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 8. GENERAL HANDYMAN
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'handyman',
    name: 'General Handyman',
    icon: 'construct-outline',
    description: 'Small repairs, assembly, mounting, odd jobs',
    subServices: [
      {
        id: 'furniture-assembly',
        name: 'Furniture Assembly',
        scope: 'Unbox and organize all parts, assemble per manufacturer instructions, secure all bolts and fasteners, anchor to wall if tipover risk (dressers, bookcases), cleanup packaging',
        budgetRange: { min: 75, max: 300 },
        typicalDuration: '1-3 hours',
        urgency: 'standard',
      },
      {
        id: 'tv-mount',
        name: 'TV Wall Mount',
        scope: 'Locate studs, install wall mount bracket, attach TV to mount, route and conceal cables (in-wall or cable cover), connect to power and AV, level and adjust tilt/swivel, test',
        budgetRange: { min: 100, max: 350 },
        typicalDuration: '1-2 hours',
        urgency: 'standard',
      },
      {
        id: 'door-adjustment',
        name: 'Door Adjustment / Fix',
        scope: 'Diagnose issue (sticking, sagging, not latching), tighten or replace hinge screws, plane or sand edge if swollen, adjust strike plate, replace weatherstripping if exterior, test operation',
        budgetRange: { min: 75, max: 250 },
        typicalDuration: '30 min - 1 hour',
        urgency: 'standard',
      },
      {
        id: 'caulking-sealing',
        name: 'Caulking / Sealing',
        scope: 'Remove all old caulking with oscillating tool or razor, clean and dry surfaces, apply painters tape for clean lines, apply new silicone or latex caulk (tub/shower, windows, baseboards), tool smooth, remove tape, cleanup',
        budgetRange: { min: 75, max: 300 },
        typicalDuration: '1-3 hours',
        urgency: 'standard',
      },
      {
        id: 'pressure-washing',
        name: 'Pressure Washing',
        scope: 'Set up pressure washer with appropriate PSI and nozzle for surface type, pre-treat with cleaning solution if needed, wash siding/deck/driveway/patio/walkways, rinse surrounding vegetation to protect, move outdoor furniture as needed',
        budgetRange: { min: 150, max: 600 },
        typicalDuration: '2-4 hours',
        urgency: 'flexible',
      },
      {
        id: 'weather-stripping',
        name: 'Weatherstripping / Draft Sealing',
        scope: 'Inspect all exterior doors and windows for air leaks, remove old weatherstripping, clean surfaces, install new foam/V-strip/door sweep weatherstripping, install door bottoms/thresholds if needed, test with incense stick for drafts',
        budgetRange: { min: 100, max: 400 },
        typicalDuration: '1-3 hours',
        urgency: 'standard',
      },
      {
        id: 'appliance-install',
        name: 'Appliance Installation',
        scope: 'Unbox and position new appliance, connect water/gas/electrical as applicable, level and secure, remove old unit if requested, test all functions, haul away packaging',
        budgetRange: { min: 100, max: 400 },
        typicalDuration: '1-2 hours',
        urgency: 'standard',
      },
      {
        id: 'small-repair-bundle',
        name: 'Honey-Do List (2-4 hour block)',
        scope: 'Tackle multiple small tasks in one visit: tighten fixtures, fix running toilet, replace light switches, patch nail holes, adjust doors, install curtain rods, re-caulk tub, etc. Pro brings standard tools and common supplies',
        budgetRange: { min: 200, max: 600 },
        typicalDuration: '2-4 hours',
        urgency: 'flexible',
      },
      {
        id: 'gutter-guard-install',
        name: 'Gutter Guard Installation',
        scope: 'Clean gutters thoroughly, measure and cut gutter guard sections to fit, secure guards under shingle edge or clip to gutter lip, ensure proper water flow at all sections, check downspout screens',
        budgetRange: { min: 300, max: 1200 },
        typicalDuration: '2-5 hours',
        urgency: 'flexible',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 9. FLOORING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'flooring',
    name: 'Flooring',
    icon: 'grid-outline',
    description: 'Hardwood, tile, LVP, carpet, refinishing',
    subServices: [
      {
        id: 'hardwood-install',
        name: 'Hardwood Floor Installation',
        scope: 'Acclimate flooring 3-5 days, prep subfloor (level, clean, moisture test), install vapor barrier, lay hardwood (nail-down or glue-down), stagger joints, cut around obstacles, install transitions at doorways, fill nail holes, sand and finish 3 coats polyurethane (or prefinished), install quarter-round base shoe',
        budgetRange: { min: 3000, max: 12000 },
        typicalDuration: '3-7 days',
        urgency: 'flexible',
      },
      {
        id: 'tile-install',
        name: 'Tile Floor Installation',
        scope: 'Prep subfloor (level with self-leveler if needed, install cement board), dry-lay pattern for best appearance, mix and spread thinset, set tiles with spacers, cut tiles at walls and around obstacles with wet saw, grout joints, seal grout, install base tile or transition strips, cleanup',
        budgetRange: { min: 1500, max: 6000 },
        typicalDuration: '2-5 days',
        urgency: 'flexible',
      },
      {
        id: 'lvp-install',
        name: 'LVP / Luxury Vinyl Plank Install',
        scope: 'Acclimate planks, prep subfloor (level, clean), install underlayment, click-lock planks together with staggered joints, cut at walls and around obstacles, leave expansion gap, install matching transitions and quarter-round, cleanup',
        budgetRange: { min: 1500, max: 5000 },
        typicalDuration: '1-3 days',
        urgency: 'flexible',
      },
      {
        id: 'carpet-install',
        name: 'Carpet Installation',
        scope: 'Remove old carpet and pad, inspect subfloor, install new tack strips if needed, lay carpet pad and staple, stretch carpet with power stretcher, seam if multiple pieces, trim at walls, tuck into tack strips, install transitions at doorways, haul old carpet',
        budgetRange: { min: 1000, max: 4000 },
        typicalDuration: '1-2 days',
        urgency: 'flexible',
      },
      {
        id: 'hardwood-refinish',
        name: 'Hardwood Floor Refinishing',
        scope: 'Move furniture out, sand floors with drum sander (3 passes: coarse/medium/fine), edge sand perimeter, hand scrape corners, vacuum and tack all dust, apply stain if requested, apply 3 coats water- or oil-based polyurethane with light sand between coats, allow 24-48hr cure before furniture',
        budgetRange: { min: 2000, max: 6000 },
        typicalDuration: '3-5 days',
        urgency: 'flexible',
      },
      {
        id: 'tile-shower',
        name: 'Tile Shower / Tub Surround',
        scope: 'Demo existing surround, inspect and repair framing/backer, install cement board with waterproof membrane (Kerdi or RedGard), set tile in thinset with proper spacing, install corner shelves/niches, grout and seal, install trim pieces, caulk all corners and fixtures, cleanup',
        budgetRange: { min: 2000, max: 6000 },
        typicalDuration: '3-5 days',
        urgency: 'flexible',
      },
      {
        id: 'floor-repair',
        name: 'Floor Repair / Patch',
        scope: 'Assess damage (water damage, scratches, broken tiles, squeaks), remove damaged sections, prep subfloor, install matching replacement material, blend finish to match existing, fill and sand transitions',
        budgetRange: { min: 200, max: 1000 },
        typicalDuration: '2-6 hours',
        urgency: 'standard',
      },
      {
        id: 'backsplash-tile',
        name: 'Kitchen Backsplash Tile',
        scope: 'Prep wall surface, mark layout lines, spread thinset, set tile in pattern (subway, herringbone, mosaic), cut around outlets and corners, grout, seal, caulk at counter and cabinet joints, reinstall outlet covers, cleanup',
        budgetRange: { min: 800, max: 3000 },
        typicalDuration: '1-2 days',
        urgency: 'flexible',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 10. EMERGENCY SERVICES
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'emergency',
    name: 'Emergency Services',
    icon: 'alert-circle-outline',
    description: '24/7 urgent repairs — burst pipes, no heat, storm damage',
    subServices: [
      {
        id: 'burst-pipe',
        name: 'Burst / Frozen Pipe',
        scope: 'Locate and shut off water main, assess burst location, cut out damaged section, install repair coupling or new pipe, thaw frozen sections with heat gun if applicable, pressure test, extract standing water, set up dehumidifiers if needed, temporary drywall patch',
        budgetRange: { min: 300, max: 2000 },
        typicalDuration: '1-4 hours',
        urgency: 'emergency',
      },
      {
        id: 'no-heat',
        name: 'No Heat Emergency',
        scope: 'Diagnose heating failure (furnace, boiler, heat pump), check thermostat, inspect ignitor/flame sensor/pilot, check fuel supply, replace failed component, restore heat, test safety controls, recommend follow-up service if needed',
        budgetRange: { min: 200, max: 1500 },
        typicalDuration: '1-4 hours',
        urgency: 'emergency',
      },
      {
        id: 'electrical-emergency',
        name: 'Electrical Emergency / Outage',
        scope: 'Safely assess electrical hazard, shut off affected circuits, identify fault (tripped main, burned connection, damaged wiring), make emergency repair to restore safe power, replace damaged breakers or outlets, advise on follow-up repairs',
        budgetRange: { min: 200, max: 1000 },
        typicalDuration: '1-3 hours',
        urgency: 'emergency',
      },
      {
        id: 'storm-damage',
        name: 'Storm Damage Response',
        scope: 'Emergency tarping of roof damage, board up broken windows/doors, remove fallen tree limbs from structure, secure loose siding or gutters, document damage with photos for insurance, provide written estimate for permanent repairs',
        budgetRange: { min: 300, max: 2500 },
        typicalDuration: '2-6 hours',
        urgency: 'emergency',
      },
      {
        id: 'flooding-water-extraction',
        name: 'Flooding / Water Extraction',
        scope: 'Extract standing water with pumps and wet vacs, remove saturated materials (carpet pad, drywall below flood line), set up industrial fans and dehumidifiers, apply antimicrobial treatment, monitor moisture levels, document for insurance',
        budgetRange: { min: 500, max: 3000 },
        typicalDuration: '2-8 hours (initial), 3-5 days drying',
        urgency: 'emergency',
      },
      {
        id: 'gas-leak-response',
        name: 'Gas Leak Response',
        scope: 'Confirm gas leak with detector, shut off gas supply at meter or appliance, ventilate area, locate and repair leak (fitting, valve, flex connector), pressure test gas line, relight pilots on all appliances, verify with gas detector',
        budgetRange: { min: 200, max: 1000 },
        typicalDuration: '1-3 hours',
        urgency: 'emergency',
      },
      {
        id: 'sewer-backup',
        name: 'Sewer Backup / Main Line Clog',
        scope: 'Camera inspect main sewer line, snake or hydro-jet blockage, clear roots or debris, extract sewage from basement floor drain area, sanitize affected areas, recommend repair (lining or excavation) if pipe is damaged',
        budgetRange: { min: 300, max: 1500 },
        typicalDuration: '2-4 hours',
        urgency: 'emergency',
      },
      {
        id: 'lockout-security',
        name: 'Emergency Lockout / Security',
        scope: 'Gain entry through non-destructive methods, replace or rekey locks if compromised, install temporary deadbolt, secure broken door/window with boarding, install security lighting if requested',
        budgetRange: { min: 100, max: 500 },
        typicalDuration: '30 min - 2 hours',
        urgency: 'emergency',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────────────────

/** Get all category IDs for use in dropdowns */
export const CATEGORY_IDS = SERVICE_CATALOG.map((c) => c.id);

/** Flat list of all sub-services with parent category */
export const ALL_SUB_SERVICES = SERVICE_CATALOG.flatMap((cat) =>
  cat.subServices.map((sub) => ({
    ...sub,
    categoryId: cat.id,
    categoryName: cat.name,
  })),
);

/** Lookup a category by ID */
export function getCategory(id: string): ServiceCategory | undefined {
  return SERVICE_CATALOG.find((c) => c.id === id);
}

/** Lookup a sub-service by ID (searches all categories) */
export function getSubService(id: string) {
  return ALL_SUB_SERVICES.find((s) => s.id === id);
}

/** Get sub-services filtered by urgency */
export function getEmergencyServices() {
  return ALL_SUB_SERVICES.filter((s) => s.urgency === 'emergency');
}

/** Get all categories as select options */
export function getCategoryOptions() {
  return SERVICE_CATALOG.map((c) => ({
    value: c.id,
    label: c.name,
    icon: c.icon,
  }));
}
