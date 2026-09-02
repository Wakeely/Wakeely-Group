export const destinations = {
  legalwakeely: "https://legalwakeely.com",
  prowakeely: "https://prowakeely.com",
  almizanpro: "https://almizanpro.com",
  accident_wakeely: "https://accident.legalwakeely.com",
  tenant_wakeely: "https://tenant.legalwakeely.com",
  labor_wakeely: "https://labor.legalwakeely.com",
} as const;

export type Platform = keyof typeof destinations;

export const platformDisplayName: Record<Platform, string> = {
  legalwakeely: "LegalWakeely",
  prowakeely: "ProWakeely",
  almizanpro: "AlmizanPro",
  accident_wakeely: "Accident Wakeely",
  tenant_wakeely: "Tenant Wakeely",
  labor_wakeely: "Labor Wakeely",
};
