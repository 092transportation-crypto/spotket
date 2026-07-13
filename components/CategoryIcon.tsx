import {
  ChefHat,
  Dumbbell,
  HeartPulse,
  Home,
  Package,
  Smartphone,
  Sparkles,
  Tent,
  ToyBrick,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Electronics: Smartphone,
  "Home & Garden": Home,
  "Health & Wellness": HeartPulse,
  Beauty: Sparkles,
  Sports: Dumbbell,
  Kitchen: ChefHat,
  Toys: ToyBrick,
  Outdoor: Tent,
};

export default function CategoryIcon({
  category,
  className = "h-4 w-4",
}: {
  category: string;
  className?: string;
}) {
  const Icon = icons[category] ?? Package;
  return <Icon className={className} aria-hidden="true" />;
}
