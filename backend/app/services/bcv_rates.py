from bs4 import BeautifulSoup
import requests
import certifi
from app.core.config import settings
from app.schemas.schemas import BCVRate


def _get_verify():
    return certifi.where() if settings.BCV_VERIFY_SSL else False


class BcvRates:

    @classmethod
    def get_bcv_rates(cls) -> list[BCVRate] | None:
        try:
            response = requests.get(settings.BCV_URL, verify=_get_verify(), timeout=30)
            if response.status_code == 200:
                html = response.text
                soup = BeautifulSoup(html, "html.parser")

                rates: list[BCVRate] = [
                    BCVRate(**cls.get_rate_currency(soup, "dolar")),
                    BCVRate(**cls.get_rate_currency(soup, "euro")),
                    BCVRate(**cls.get_rate_currency(soup, "lira")),
                    BCVRate(**cls.get_rate_currency(soup, "rublo")),
                ]
                return rates
            return None

        except Exception as e:
            print(f"Error on get_rate_currencies: {e}")
            return None

    @classmethod
    def get_rate_currency(cls, soup, currency_name: str):
        currency_div = soup.find(id=currency_name)
        if not currency_div:
            raise ValueError(f"Could not find div for currency: {currency_name}")
            
        centrado_div = currency_div.find(class_="centrado")
        if not centrado_div or not centrado_div.find("strong"):
            raise ValueError(f"Could not find rate text for currency: {currency_name}")

        currency_rate = centrado_div.find("strong").text
        currency_rate = currency_rate.replace(",", ".")
        
        # We don't strictly need currency_code for BCVRate schema but we can log it if needed
        # currency_code_span = currency_div.find(class_="col-sm-6 col-xs-6")
        
        try:
            currency_rate_float = round(float(currency_rate.strip()), 2)
        except ValueError:
            raise ValueError(f"Could not parse rate '{currency_rate}' as float for {currency_name}")

        return {
            "currency_name": currency_name,
            "rate": str(currency_rate_float),
        }
