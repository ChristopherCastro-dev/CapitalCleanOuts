import Hero from '@/components/home/hero';
import ServiceHighlights from '@/components/home/service-highlights';
import BeforeAfterSlider from '@/components/home/before-after-slider';
import ServiceArea from '@/components/home/service-area';
import Reviews from '@/components/home/reviews';

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceHighlights />
      <BeforeAfterSlider />
      <ServiceArea />
      <Reviews />
    </>
  );
}
