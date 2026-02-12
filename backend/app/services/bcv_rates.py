from bs4 import BeautifulSoup
import requests
import certifi
from app.core.config import settings
from app.schemas.rate_schema import RateSchemaBase


def _get_verify():
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
                    RateSchemaBase(**cls.get_rate_currency(soup, "dolar")),
                    RateSchemaBase(**cls.get_rate_currency(soup, "euro")),
                    RateSchemaBase(**cls.get_rate_currency(soup, "lira")),
                    RateSchemaBase(**cls.get_rate_currency(soup, "rublo")),
                ]
                return rates
            return None

        except Exception as e:
            print(f"Error on get_rate_currencies: {e}")
            return None

    @classmethod
    def get_rate_currency(cls, soup, currency_name: str):
        currency_div = soup.find(id=currency_name)
        currency_rate = currency_div.find(class_="centrado").find("strong").text
        currency_rate = currency_rate.replace(",", ".")
        currency_code = (
            currency_div.find(class_="col-sm-6 col-xs-6").find("span").text.strip()
        )
        currency_rate_float = round(float(currency_rate.strip()), 2)
        return {
            "name": currency_name,
            "rate": currency_rate_float,
            "currency_code": currency_code,
        }
