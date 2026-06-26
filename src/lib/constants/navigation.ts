import {
  LayoutDashboard,
  Users,
  DollarSign,
  Activity,
  GitBranch,
  PlayCircle,
  Calculator,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navigationItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Recursos Humanos", href: "/recursos-humanos", icon: Users },
  { title: "Gastos Generales", href: "/gastos-generales", icon: DollarSign },
  { title: "Actividades", href: "/actividades", icon: Activity },
  { title: "Inductores", href: "/inductores", icon: GitBranch },
  { title: "Ejecuciones", href: "/ejecuciones", icon: PlayCircle },
  { title: "Costeo", href: "/costeo", icon: Calculator },
];
