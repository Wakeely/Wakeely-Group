export const destinations = {
  legalwakeely: "https://legalwakeely.com",
  prowakeely: "https://wakeelypro.com",
  almizanpro: "https://almizan.legalwakeely.com",
  accident_wakeely: "https://g.mokhamen.com/",
  tenant_wakeely: "https://rent.mokhamen.com/",
  labor_wakeely: "https://ommal.wakeelypro.com/ar",
} as const;

export type Platform = keyof typeof destinations;

export const previewImages: Record<Platform, string> = {
  legalwakeely: "/previews/legalwakeely.png",
  prowakeely: "/previews/wakeelypro.png",
  almizanpro: "/previews/almizan.png",
  accident_wakeely: "/previews/accident.png",
  tenant_wakeely: "/previews/tenant.png",
  labor_wakeely: "/previews/labor.png",
};

export const platformDisplayName: Record<Platform, string> = {
  legalwakeely: "LegalWakeely",
  prowakeely: "ProWakeely",
  almizanpro: "AlmizanPro",
  accident_wakeely: "Accident Wakeely",
  tenant_wakeely: "Tenant Wakeely",
  labor_wakeely: "Labor Wakeely",
};
