export type ContentStatus = 'draft' | 'published';
export type PackageData = {
  image_url:string; name_ar:string; name_en:string; label_ar:string; label_en:string; price:string;
  price_prefix_ar:string; price_prefix_en:string; price_label_ar:string; price_label_en:string;
  description_ar:string; description_en:string; features_ar:string[]; features_en:string[];
  cta_ar:string; cta_en:string; featured:boolean;
};
export type OfferData = { image_url:string; title_ar:string; title_en:string; text_ar:string; text_en:string };
export type SiteContentItem<T = PackageData | OfferData> = {
  id:number; section:'packages'|'offers'; key:string; sort_order:number; status?:ContentStatus;
  data:T; published_data?:T|null; created_at?:string; updated_at?:string;
};
export type TravelContent = { packages:SiteContentItem<PackageData>[]; offers:SiteContentItem<OfferData>[] };
