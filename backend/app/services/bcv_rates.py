from bs4 import BeautifulSoup
import requests
import certifi
from app.core.config import settings
from app.schemas.rate_schema import RateSchemaBase


def _get_verify():
    """Usar bundle de certifi si verificamos SSL; si no, desactivar (BCV suele dar cadena incompleta)."""
    return certifi.where() if settings.BCV_VERIFY_SSL else False


class BcvRates:

    @classmethod
    def get_bcv_rates(cls) -> list[RateSchemaBase] | None:
        try:
            response = requests.get(settings.BCV_URL, verify=_get_verify(), timeout=30)
            if response.status_code == 200:
                html = response.text
                soup = BeautifulSoup(html, "html.parser")

                rates: list[RateSchemaBase] = [
                    RateSchemaBase(**cls.get_euro(soup)),
                    RateSchemaBase(**cls.get_dolar(soup)),
                ]
                return rates
            return None

        except Exception as e:
            print(f"Error on get_rate_currencies: {e}")
            return None

    @classmethod
    def get_dolar(cls, soup) -> dict[str, str | float]:
        dolar_rate = soup.find(id="dolar").find(class_="centrado").find("strong").text
        dolar_rate = dolar_rate.replace(",", ".")
        dolar_float = round(float(dolar_rate.strip()), 2)
        return {"name": "dolar", "rate": dolar_float}

    @classmethod
    def get_euro(cls, soup) -> dict[str, str | float]:
        euro_rate = soup.find(id="euro").find(class_="centrado").find("strong").text
        euro_rate = euro_rate.replace(",", ".")
        euro_float = round(float(euro_rate.strip()), 2)
        return {"name": "euro", "rate": euro_float}
