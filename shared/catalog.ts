export type CatalogLanguage = 'en' | 'ar';
export type CatalogKind = 'packages' | 'offers';
export type CatalogStatus = 'draft' | 'published';
export type PackageTranslation = {
  name: string; label: string; price: string; pricePrefix: string; priceLabel: string;
  description: string; features: string[]; cta: string;
  details: { label: string; value: string }[];
};
export type OfferTranslation = { title: string; text: string };
export type CatalogBase = {
  id: string; image_url: string; status: CatalogStatus; sort_order: number;
  created_at?: string; updated_at?: string;
};
export type CatalogPackage = CatalogBase & { featured: boolean; translations: Record<CatalogLanguage, PackageTranslation> };
export type CatalogOffer = CatalogBase & {
  image_layout: 'atlas' | 'cover'; image_x: number; image_y: number;
  translations: Record<CatalogLanguage, OfferTranslation>;
};
export type PackageInput = Omit<CatalogPackage, 'id' | 'created_at' | 'updated_at'>;
export type OfferInput = Omit<CatalogOffer, 'id' | 'created_at' | 'updated_at'>;
export type PublicCatalog = { packages: CatalogPackage[]; offers: CatalogOffer[] };
