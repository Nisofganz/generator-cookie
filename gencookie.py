import random
import string
from datetime import datetime, timedelta
import json

def generate_random_string(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def generate_random_cookie_name():
    return generate_random_string(20)

def generate_random_cookie_value():
    return generate_random_string(43)

def generate_random_expiry_date():
    days_to_add = random.randint(1, 365)
    expiry_date = datetime.now() + timedelta(days=days_to_add)
    return expiry_date.strftime("%a, %d-%b-%Y %H:%M:%S GMT")

def generate_cookie(num_cookies=5):
    cookies = []
    for _ in range(num_cookies):
        name = generate_random_cookie_name()
        value = generate_random_cookie_value()
        expiry = generate_random_expiry_date()
        cookies.append({
            "name": name,
            "value": value,
            "expiry": expiry,
            "domain": "ikky.com",
            "path": "/",
            "secure": True,
            "sameSite": "Strict"
        })
    return cookies

def is_valid_cookie(cookie):
    if not cookie['name'] or not cookie['value']:
        return False
    return True

def save_cookies_to_file(cookies, filename="cookie.json"):
    with open(filename, "w") as file:
        json.dump(cookies, file, indent=4)

if __name__ == "__main__":
    num_cookies = 1000 
    cookie_data = generate_cookie(num_cookies)
    valid_cookies = [cookie for cookie in cookie_data if is_valid_cookie(cookie)]
    save_cookies_to_file(valid_cookies)
    print(f"{len(valid_cookies)} valid cookies have been saved to cookie.json")