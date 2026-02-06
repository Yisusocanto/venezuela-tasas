import {
  DollarSign,
  EuroIcon,
  LucideIcon,
  TurkishLira,
  RussianRuble,
} from "lucide-react";

export interface CurrencyConfig {
  icon: LucideIcon;
}

// Mapeo de códigos de divisa a iconos
// Soporta múltiples variaciones del código para mayor flexibilidad
export const currencyIcons: Record<string, CurrencyConfig> = {
  USD: {
    icon: DollarSign,
  },
  EUR: {
    icon: EuroIcon,
  },
  TRY: {
    icon: TurkishLira,
  },
  RUB: {
    icon: RussianRuble,
  },
  // Agrega más divisas aquí en el futuro
  // GBP: {
  //   icon: PoundSterling,
  // },
  // JPY: {
  //   icon: YenIcon,
  // },
};
