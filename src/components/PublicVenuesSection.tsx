import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { fetchPublicVenues, type PublicVenuePreview } from '@/lib/publicVenues';

function VenuePreviewCard({ venue }: { venue: PublicVenuePreview }) {
  const { t } = useI18n();
  const [failedImage, setFailedImage] = useState(false);
  return (
    <li className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03]">
      <div className="aspect-[16/10] bg-white/[0.04] flex items-center justify-center">
        {venue.imageUrl && !failedImage ? (
          <img src={venue.imageUrl} alt="" loading="lazy" decoding="async" width={640} height={400}
            className="h-full w-full object-cover" onError={() => setFailedImage(true)} />
        ) : <MapPin className="h-10 w-10 text-white/30" aria-hidden="true" />}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-white break-words">{venue.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/65 break-words">{venue.address ?? t('places.no_address')}</p>
      </div>
    </li>
  );
}

export function PublicVenuesSection() {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['public-venue-previews'],
    queryFn: ({ signal }) => fetchPublicVenues(signal),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: false,
  });
  const venues = data ?? [];
  const visibleVenues = expanded ? venues : venues.slice(0, 6);

  return (
    <section id="helyek" aria-labelledby="places-heading" className="scroll-mt-24 bg-black px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl mb-8">
          <p className="text-sm font-semibold uppercase text-primary mb-3">{t('places.eyebrow')}</p>
          <h2 id="places-heading" className="font-anton uppercase text-3xl md:text-5xl text-white">{t('places.title')}</h2>
          <p className="mt-4 leading-relaxed text-white/70">{t('places.description')}</p>
        </div>
        {isPending && (
          <div role="status" className="rounded-2xl border border-white/15 p-8 text-white/70">{t('places.loading')}</div>
        )}
        {isError && (
          <div role="status" className="mb-6 rounded-2xl border border-white/15 p-6">
            <p className="text-white/80">{t(data ? 'places.refresh_error' : 'places.error')}</p>
            <Button variant="outline" className="mt-4" disabled={isFetching} onClick={() => void refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              {t(isFetching ? 'places.loading' : 'places.retry')}
            </Button>
          </div>
        )}
        {!isPending && !isError && venues.length === 0 && (
          <p role="status" className="rounded-2xl border border-white/15 p-8 text-white/70">{t('places.empty')}</p>
        )}
        {visibleVenues.length > 0 && (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleVenues.map(venue => <VenuePreviewCard key={`${venue.id}:${venue.imageUrl}`} venue={venue} />)}
          </ul>
        )}
        {venues.length > 6 && (
          <Button variant="outline" className="mt-6" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>
            {t(expanded ? 'places.show_less' : 'places.show_all')}
          </Button>
        )}
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/55">{t('places.note')}</p>
      </div>
    </section>
  );
}
