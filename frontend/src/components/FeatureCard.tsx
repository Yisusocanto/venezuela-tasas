import { Card, linkVariants, Link as HeroLink } from "@heroui/react";
import { Rocket } from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  content: string;
  linkName: string;
  linkHref: string;
}

function FeatureCard({ content, linkHref, linkName, title }: FeatureCardProps) {
  const slots = linkVariants();
  return (
    <Card className="w-full border">
      <Card.Title className="flex flex-row gap-2 items-center text-2xl font-bold">
        <span className="rounded-full bg-accent-soft p-2 flex items-center justify-center">
          <Rocket size={20} className="text-accent" />
        </span>
        {title}
      </Card.Title>
      <Card.Content>
        <p className="text-muted">{content}</p>
      </Card.Content>
      <Card.Footer>
        <Link className={`${slots.base()} text-lg text-accent`} href={linkHref}>
          {linkName}
          <HeroLink.Icon className={slots.icon()} />
        </Link>
      </Card.Footer>
    </Card>
  );
}

export default FeatureCard;
