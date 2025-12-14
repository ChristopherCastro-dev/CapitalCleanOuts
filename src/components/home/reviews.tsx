import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { customerReviews } from "@/lib/constants";
import { Star, StarHalf } from "lucide-react";

const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex gap-0.5 text-primary">
        {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="h-5 w-5 fill-current" />)}
        {halfStar && <StarHalf key="half" className="h-5 w-5 fill-current" />}
        {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="h-5 w-5" />)}
      </div>
    );
  };

export default function Reviews() {
  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              Trusted by Your Neighbors
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              See what our satisfied customers in Tallahassee have to say about our service.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-4xl">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {customerReviews.map((review, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="h-full">
                      <CardContent className="flex flex-col items-start justify-between gap-4 p-6">
                        {renderStars(review.rating)}
                        <p className="text-sm italic text-foreground/90">"{review.text}"</p>
                        <p className="w-full text-right font-semibold text-foreground">- {review.author}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
