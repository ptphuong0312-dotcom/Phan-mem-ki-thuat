import urllib.request
import re

url = "https://www.gewinde-normen.de/en/KS-KT-thread.html"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
res = urllib.request.urlopen(req)
html_content = res.read().decode('utf-8', errors='ignore')

def clean_html(raw_html):
    import html
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return html.unescape(cleantext).strip().replace('\xa0', ' ').replace('\r\n', ' ').replace('\n', ' ')

table_match = re.search(r'<table class="content"[^>]*>(.*?)</table>', html_content, re.DOTALL | re.IGNORECASE)
table_content = table_match.group(1)

tr_matches = re.finditer(r'<tr[^>]*>(.*?)</tr>', table_content, re.DOTALL | re.IGNORECASE)
for i, tr in enumerate(tr_matches):
    tr_content = tr.group(1)
    td_matches = re.finditer(r'<(td|th)[^>]*>(.*?)</\1>', tr_content, re.DOTALL | re.IGNORECASE)
    cols = [clean_html(td.group(2)) for td in td_matches]
    if i < 3:
        print(cols)
