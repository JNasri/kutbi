import { useEffect, useState } from 'react';
import TripPlanner, { type PlannerMode } from '../components/TripPlanner';
import SeasonalOffers from '../components/SeasonalOffers';
import DiscoverSaudi from '../components/DiscoverSaudi';
import LoadingScreen from '../components/LoadingScreen';
import { apiRequest } from '../lib/api';
import { content, type Language } from '../siteContent';
import type { PublicCatalog } from '../../shared/catalog';

export default function TripsPage({ language, mode, onModeChange }: { language: Language; mode: PlannerMode; onModeChange: (mode: PlannerMode) => void }) {
  const [catalog, setCatalog] = useState<PublicCatalog | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const copy = content[language];
  useEffect(() => {
    let active = true;
    setFailed(false);
    apiRequest<PublicCatalog>('/api/catalog').then((value) => { if (active) setCatalog(value); }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [attempt]);
  if (failed) return <div className="catalog-public-error routed-page" role="alert"><p>{language === 'ar' ? 'تعذّر تحميل الباقات والعروض.' : 'Packages and offers could not be loaded.'}</p><button className="button button-gold" onClick={() => setAttempt((value) => value + 1)}>{language === 'ar' ? 'إعادة المحاولة' : 'Try again'}</button></div>;
  if (!catalog) return <LoadingScreen label={language === 'ar' ? 'جارٍ تحميل الباقات والعروض…' : 'Loading packages and offers…'} />;
  const packages = catalog.packages.map((item) => ({ ...item.translations[language], id: item.id, image: item.image_url, featured: item.featured }));
  const offers = catalog.offers.map((item) => ({ ...item.translations[language], id: item.id, image_url: item.image_url, image_layout: item.image_layout, image_x: item.image_x, image_y: item.image_y }));
  return <div className="routed-page"><TripPlanner key={`planner-${language}`} copy={copy.planner} transport={copy.transport} mode={mode} onModeChange={onModeChange} packages={packages} />{packages.length === 0 && mode === 'packages' ? <p className="catalog-public-empty">{language === 'ar' ? 'لا توجد باقات متاحة حاليًا. يمكنك طلب رحلة مخصصة.' : 'No packages are available right now. You can request a custom trip.'}</p> : null}{offers.length > 0 ? <SeasonalOffers copy={copy.offers} offers={offers} /> : null}<DiscoverSaudi key={`discover-${language}`} copy={copy.discover} /></div>;
}
