import CompanyInfo from "@/components/about/company-info";
import OurProcess from "@/components/about/our-process";
import Team from "@/components/about/team";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <CompanyInfo />
      <Separator className="my-12 bg-border/20" />
      <OurProcess />
      <Separator className="my-12 bg-border/20" />
      <Team />
    </div>
  );
}
