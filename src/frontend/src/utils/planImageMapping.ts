interface PlanImageMap {
  primary: string;
  additional?: string[];
}

const planImages: Record<string, PlanImageMap> = {
  'jivan-labh': {
    primary: '/assets/generated/jivan-labh-736-4.jpg',
  },
  'jivan-umang': {
    primary: '/assets/generated/jivan-umang-6.jpg',
  },
  'jivan-shanti': {
    primary: '/assets/generated/jivan-shanti-1.jpg',
  },
  'jivan-utsav': {
    primary: '/assets/generated/lic-jivan-utsav-7.jpg',
    additional: [
      '/assets/generated/jivan-utsav-8.jpg',
      '/assets/generated/jivan-utsav-plan-6.jpg',
    ],
  },
  'jivan-lakshya': {
    primary: '/assets/generated/jivan-lakshya-1.jpg',
    additional: ['/assets/generated/jivan-lakshya-4.jpg'],
  },
  'bima-laxmi': {
    primary: '/assets/generated/bima-laxmi-2.jpg',
  },
};

export function getPlanImages(planId: string): PlanImageMap {
  return planImages[planId] || {
    primary: '/assets/generated/lic-plan-default.dim_800x600.png',
  };
}
