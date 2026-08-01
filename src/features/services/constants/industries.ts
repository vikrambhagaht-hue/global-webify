import { 
  Home, HeartPulse, Utensils, GraduationCap, 
  Plane, ShoppingBag, Building2, ShoppingCart, 
  Sparkles, HeartHandshake, Hotel, Newspaper, LucideIcon
} from 'lucide-react';

export interface IndustryConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  bgClass: string;
  borderClass: string;
  shadowClass: string;
}

export const INDUSTRIES_LIST: IndustryConfig[] = [
  { icon: Home, label: "Real Estate", color: "text-rose-500", bgClass: "group-hover:bg-rose-50", borderClass: "border-rose-200 group-hover:border-rose-400", shadowClass: "group-hover:shadow-rose-500/20" },
  { icon: HeartPulse, label: "Medical & Doctors", color: "text-red-500", bgClass: "group-hover:bg-red-50", borderClass: "border-red-200 group-hover:border-red-400", shadowClass: "group-hover:shadow-red-500/20" },
  { icon: Utensils, label: "Food & Beverage", color: "text-amber-500", bgClass: "group-hover:bg-amber-50", borderClass: "border-amber-200 group-hover:border-amber-400", shadowClass: "group-hover:shadow-amber-500/20" },
  { icon: GraduationCap, label: "School & Education", color: "text-indigo-500", bgClass: "group-hover:bg-indigo-50", borderClass: "border-indigo-200 group-hover:border-indigo-400", shadowClass: "group-hover:shadow-indigo-500/20" },
  { icon: Plane, label: "Tours & Travel", color: "text-cyan-500", bgClass: "group-hover:bg-cyan-50", borderClass: "border-cyan-200 group-hover:border-cyan-400", shadowClass: "group-hover:shadow-cyan-500/20" },
  { icon: ShoppingBag, label: "B2C", color: "text-emerald-500", bgClass: "group-hover:bg-emerald-50", borderClass: "border-emerald-200 group-hover:border-emerald-400", shadowClass: "group-hover:shadow-emerald-500/20" },
  { icon: Building2, label: "B2B", color: "text-blue-500", bgClass: "group-hover:bg-blue-50", borderClass: "border-blue-200 group-hover:border-blue-400", shadowClass: "group-hover:shadow-blue-500/20" },
  { icon: ShoppingCart, label: "E-Commerce", color: "text-purple-500", bgClass: "group-hover:bg-purple-50", borderClass: "border-purple-200 group-hover:border-purple-400", shadowClass: "group-hover:shadow-purple-500/20" },
  { icon: Sparkles, label: "Health & Beauty", color: "text-pink-500", bgClass: "group-hover:bg-pink-50", borderClass: "border-pink-200 group-hover:border-pink-400", shadowClass: "group-hover:shadow-pink-500/20" },
  { icon: HeartHandshake, label: "Community", color: "text-green-500", bgClass: "group-hover:bg-green-50", borderClass: "border-green-200 group-hover:border-green-400", shadowClass: "group-hover:shadow-green-500/20" },
  { icon: Hotel, label: "Hotels", color: "text-teal-500", bgClass: "group-hover:bg-teal-50", borderClass: "border-teal-200 group-hover:border-teal-400", shadowClass: "group-hover:shadow-teal-500/20" },
  { icon: Newspaper, label: "Publication", color: "text-orange-500", bgClass: "group-hover:bg-orange-50", borderClass: "border-orange-200 group-hover:border-orange-400", shadowClass: "group-hover:shadow-orange-500/20" }
];
