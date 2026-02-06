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
                    RateSchemaBase(**cls.get_lira(soup)),
                    RateSchemaBase(**cls.get_rublo(soup)),
                ]
                return rates
            return None

        except Exception as e:
            print(f"Error on get_rate_currencies: {e}")
            return None

    @classmethod
    def get_dolar(cls, soup) -> dict[str, str | float]:
        dolar_div = soup.find(id="dolar")
        dolar_rate = dolar_div.find(class_="centrado").find("strong").text
        currency_code = (
            dolar_div.find(class_="col-sm-6 col-xs-6").find("span").text.strip()
        )
        dolar_rate = dolar_rate.replace(",", ".")
        dolar_float = round(float(dolar_rate.strip()), 2)
        return {"name": "dolar", "rate": dolar_float, "currency_code": currency_code}

    @classmethod
    def get_euro(cls, soup) -> dict[str, str | float]:
        euro_div = soup.find(id="euro")
        euro_rate = euro_div.find(class_="centrado").find("strong").text
        currency_code = (
            euro_div.find(class_="col-sm-6 col-xs-6").find("span").text.strip()
        )
        euro_rate = euro_rate.replace(",", ".")
        euro_float = round(float(euro_rate.strip()), 2)
        return {"name": "euro", "rate": euro_float, "currency_code": currency_code}

    @classmethod
    def get_lira(cls, soup) -> dict[str, str | float]:
        lira_div = soup.find(id="lira")
        print("lira div")
        lira_rate = lira_div.find(class_="centrado").find("strong").text
        print("lira rate", lira_rate)
        currency_code = (
            lira_div.find(class_="col-sm-6 col-xs-6").find("span").text.strip()
        )
        print("lira code")
        lira_rate = lira_rate.replace(",", ".")
        lira_float = round(float(lira_rate.strip()), 2)
        print("lira final")
        return {"name": "lira", "rate": lira_float, "currency_code": currency_code}

    @classmethod
    def get_rublo(cls, soup) -> dict[str, str | float]:
        rublo_div = soup.find(id="rublo")
        rublo_rate = rublo_div.find(class_="centrado").find("strong").text
        print("rublo rate")
        currency_code = (
            rublo_div.find(class_="col-sm-6 col-xs-6").find("span").text.strip()
        )
        print("rublo code")
        rublo_rate = rublo_rate.replace(",", ".")
        rublo_float = round(float(rublo_rate.strip()), 2)
        print("rublo final")
        return {"name": "rublo", "rate": rublo_float, "currency_code": currency_code}
