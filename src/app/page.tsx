import { InspireMeForm } from '@/components/inspire-me-form';
import Image from 'next/image';
import placeholderData from '@/lib/placeholder-images.json';

export default function Home() {
  const bgImage = placeholderData.placeholderImages.find(
    (img) => img.id === 'hero-background'
  );

  return (
    <div className="relative min-h-screen w-full font-body text-foreground">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          fill
          className="object-cover opacity-20"
          data-ai-hint={bgImage.imageHint}
          priority
        />
      )}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <InspireMeForm />
      </main>
    </div>
  );
}
