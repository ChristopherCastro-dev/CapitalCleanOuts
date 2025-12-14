
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teamMembers } from "@/lib/constants";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function Team() {
  return (
    <section>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
              Meet the Team
            </h2>
            <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              The friendly faces behind Capital CleanOuts, dedicated to making your space shine.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-4xl justify-center">
          {teamMembers.map((member) => {
             const memberImage = PlaceHolderImages.find(img => img.id === member.imageId);
             return (
                <Card key={member.name} className="overflow-hidden text-center transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                    <CardHeader className="p-0">
                    {memberImage && (
                        <Image
                            src={memberImage.imageUrl}
                            alt={member.name}
                            data-ai-hint={memberImage.imageHint}
                            width={400}
                            height={400}
                            className="aspect-square w-full object-cover"
                        />
                    )}
                    </CardHeader>
                    <CardContent className="space-y-2 p-6">
                        <CardTitle className="font-headline text-xl">{member.name}</CardTitle>
                        <p className="text-sm font-medium text-primary">{member.role}</p>
                    </CardContent>
                </Card>
             );
          })}
        </div>
      </div>
    </section>
  );
}
