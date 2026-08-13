import urllib.request
from bs4 import BeautifulSoup
import sys

def check_url(url):
    print(f"Checking {url}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read()
        soup = BeautifulSoup(html, 'html.parser')
        tables = soup.find_all('table')
        for t in tables:
            headers = [th.text.strip() for th in t.find_all('th')]
            if headers:
                print("Headers:", headers)
                break
    except Exception as e:
        print("Error:", e)

check_url("https://www.gewinde-normen.de/en/whitworth-pipe-thread.html")
check_url("https://www.gewinde-normen.de/en/trapezoidal-coarse-thread.html")
check_url("https://www.gewinde-normen.de/en/tapered-whitworth-pipe-thread.html")
