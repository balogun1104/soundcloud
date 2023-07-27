
def extract_tiktok_username(url):
    # Split the URL using the '/' character
    parts = url.split("/")

    # Find the part of the URL containing '@' followed by the username
    for part in parts:
        if part.startswith("@"):
            return part

    # If no '@' symbol followed by username is found, return None
    return None


def loader(url):

    url = f"{url}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

    response = requests.get(url, headers=headers)

    tiktok_username = extract_tiktok_username(response.url)
    if tiktok_username is None:
        user_info = None
        return user_info
    url = f"https://www.tiktok.com/{tiktok_username}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        # Extracting the profile/bio information from the HTML
        user_info = {}
        user_info["username"] = tiktok_username
        nm = soup.find("div", class_=re.compile(r"DivShareTitleContainer"))
        try:
            user_info["title"] = nm.find("h1").text
        except:
            user_info["title"] = ""
            user_info = None
            return user_info
        try:
            user_info["subtitle"] = nm.find("h2").text
        except:
            user_info["subtitle"] = ""
        inf = soup.find("div", class_=re.compile(r"DivShareLayoutHeader"))
        try:
            user_info["followers"] = inf.find_all("strong")[1].text
        except:
            user_info["followers"] = ""
        try:
            user_info["following"] = inf.find_all("strong")[0].text
        except:
            user_info["following"] = ""
        try:
            user_info["likes"] = inf.find_all("strong")[2].text
        except:
            user_info["likes"] = ""
        try:
            user_info["image"] = inf.find("img")["src"]
        except:
            user_info["image"] = ""
        try:
            user_info["bio"] = soup.find("h2", class_=re.compile(r"H2ShareDesc")).text
        except:
            user_info["bio"] = "No Bio Yet"
        try:
            user_info["external_link"] = soup.find(
                "div", class_=re.compile(r"DivShareLinks")
            ).text
        except:
            user_info["external_link"] = ""

    return user_info

