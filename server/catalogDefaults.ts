import { content } from '../src/siteContent.js';
import type { CatalogLanguage, CatalogOffer, CatalogPackage, PackageTranslation } from '../shared/catalog.js';

// Bootstrap only: future edits live in PostgreSQL, never in this source data.
function packageTranslation(language: CatalogLanguage, index: number): PackageTranslation {
  const planner = content[language].planner;
  const item = planner.packages[index];
  const values = planner.packageModal.detailValues[item.id];
  return {
    name: item.name, label: item.label, price: item.price, pricePrefix: item.pricePrefix,
    priceLabel: item.priceLabel, description: item.description, features: [...item.features], cta: item.cta,
    details: planner.packageModal.detailLabels.map((label, i) => ({ label, value: values[i] ?? '' })),
  };
}

export const defaultPackages: CatalogPackage[] = content.en.planner.packages.map((item, index) => ({
  id: item.id, image_url: item.image, status: 'published', sort_order: index,
  featured: 'featured' in item && item.featured === true,
  translations: { en: packageTranslation('en', index), ar: packageTranslation('ar', index) },
}));

export const defaultOffers: CatalogOffer[] = content.en.offers.offers.map((item, index) => ({
  id: `offer-${index + 1}`, image_url: '/images/saudi-atlas.jpg', image_layout: 'atlas',
  image_x: [0, 66.666, 33.333][index], image_y: [0, 100, 50][index],
  status: 'published', sort_order: index,
  translations: { en: { ...item }, ar: { ...content.ar.offers.offers[index] } },
}));
