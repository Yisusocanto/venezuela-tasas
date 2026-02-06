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
};
