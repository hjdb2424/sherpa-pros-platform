/**
 * Skills Catalog
 *
 * Full list of skill categories and individual skills for pro onboarding.
 * Used by the OnboardingWizard (step 2) and admin verifications page.
 */

export interface SkillCategory {
  key: string;
  label: string;
  skills: { key: string; label: string }[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    key: "painting_walls",
    label: "Painting & Walls",
    skills: [
      { key: "interior_painting", label: "Interior painting" },
      { key: "exterior_painting", label: "Exterior painting" },
      { key: "drywall_install", label: "Drywall install" },
      { key: "drywall_repair", label: "Drywall repair" },
      { key: "wallpaper", label: "Wallpaper install/removal" },
      { key: "texture_skim", label: "Texture/skim coat" },
    ],
  },
  {
    key: "doors_windows",
    label: "Doors & Windows",
    skills: [
      { key: "door_install", label: "Door install" },
      { key: "door_repair", label: "Door repair" },
      { key: "window_install", label: "Window install" },
      { key: "window_repair", label: "Window repair" },
      { key: "screen_repair", label: "Screen repair" },
      { key: "weatherstripping", label: "Weatherstripping" },
    ],
  },
  {
    key: "exterior",
    label: "Exterior",
    skills: [
      { key: "siding_repair", label: "Siding repair" },
      { key: "gutter_cleaning", label: "Gutter cleaning" },
      { key: "power_washing", label: "Power washing" },
      { key: "deck_repair", label: "Deck repair" },
      { key: "fence_repair", label: "Fence repair" },
    ],
  },
  {
    key: "roofing",
    label: "Roofing",
    skills: [
      { key: "shingle_repair", label: "Shingle repair" },
      { key: "flashing_repair", label: "Flashing repair" },
      { key: "roof_leak", label: "Roof leak" },
      { key: "gutter_install", label: "Gutter install" },
    ],
  },
  {
    key: "plumbing_minor",
    label: "Plumbing (minor)",
    skills: [
      { key: "faucet_fixture", label: "Faucet/fixture" },
      { key: "toilet_repair", label: "Toilet repair" },
      { key: "garbage_disposal", label: "Garbage disposal" },
      { key: "caulking_grouting", label: "Caulking/grouting" },
    ],
  },
  {
    key: "electrical_minor",
    label: "Electrical (minor)",
    skills: [
      { key: "light_fixture", label: "Light fixture" },
      { key: "outlet_switch", label: "Outlet/switch" },
      { key: "ceiling_fan", label: "Ceiling fan" },
    ],
  },
  {
    key: "smart_home_av",
    label: "Smart Home & A/V",
    skills: [
      { key: "smart_devices", label: "Smart devices" },
      { key: "tv_projector_mount", label: "TV/projector mount" },
      { key: "surround_sound", label: "Surround sound" },
      { key: "network_setup", label: "Network setup" },
      { key: "doorbell_camera", label: "Doorbell/camera" },
    ],
  },
  {
    key: "flooring",
    label: "Flooring",
    skills: [
      { key: "tile_install_repair", label: "Tile install/repair" },
      { key: "laminate_vinyl", label: "Laminate/vinyl" },
      { key: "trim_baseboard", label: "Trim/baseboard" },
    ],
  },
  {
    key: "finish_carpentry",
    label: "Finish Carpentry",
    skills: [
      { key: "crown_molding", label: "Crown molding" },
      { key: "wainscoting", label: "Wainscoting" },
      { key: "built_in_shelving", label: "Built-in shelving" },
      { key: "cabinet_hardware", label: "Cabinet hardware" },
      { key: "window_door_casing", label: "Window/door casing" },
      { key: "stair_railing", label: "Stair railing" },
    ],
  },
  {
    key: "landscaping",
    label: "Landscaping",
    skills: [
      { key: "lawn_care", label: "Lawn care" },
      { key: "mulching_edging", label: "Mulching/edging" },
      { key: "shrub_tree_trimming", label: "Shrub/tree trimming" },
      { key: "garden_bed", label: "Garden bed" },
      { key: "leaf_cleanup", label: "Leaf cleanup" },
      { key: "irrigation_repair", label: "Irrigation repair" },
    ],
  },
  {
    key: "assembly_install",
    label: "Assembly & Install",
    skills: [
      { key: "furniture_assembly", label: "Furniture assembly" },
      { key: "shelf_closet", label: "Shelf/closet" },
      { key: "appliance_install", label: "Appliance install" },
    ],
  },
  {
    key: "general",
    label: "General",
    skills: [
      { key: "junk_removal", label: "Junk removal" },
      { key: "cleaning_turnover", label: "Cleaning/turnover" },
      { key: "lock_hardware", label: "Lock/hardware" },
      { key: "caulking_sealing", label: "Caulking/sealing" },
    ],
  },
  {
    key: "other",
    label: "Other",
    skills: [],
  },
];

/** Get a flat list of all skill keys from selected skills */
export function getSkillLabels(keys: string[]): string[] {
  const labels: string[] = [];
  for (const cat of SKILL_CATEGORIES) {
    for (const skill of cat.skills) {
      if (keys.includes(skill.key)) labels.push(skill.label);
    }
  }
  return labels;
}
