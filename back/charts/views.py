from django.shortcuts import render
from .models import Chart, Chart_disc
import requests
import json
from django.forms.models import model_to_dict
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from bs4 import BeautifulSoup
from pyairtable import Api, Base, Table
import re
import pyairtable
from .utils2 import *
from .utils import *

api_key = "keyPTU7Oyav6HW5aK"
base_id = "appAcwKKL0mqVM14s"
table_name = "Tiktok"



from datetime import date, timedelta

today = date.today() - timedelta(1)

airtable = pyairtable.Table(api_key, base_id, table_name)


music_types = [
    "electronic",
    "all-music",
    "house",
    "world",
    "electronic",
    "pop",
    "rock",
    "danceedm",
    "techno",
    "rbsoul",
    "deephouse",
    "ambient",
    "soundtrack",
    "drumbass",
    "trance",
    "country",
    "alternativerock",
    "indie",
    "piano",
]
import requests

headers = {
    "Accept": "application/json, text/javascript, */*; q=0.1",
    "Accept-Language": "en-US,en;q=0.9",
    "Authorization": "OAuth 2-294078-444389085-iIl21X0gbFjMWd",
    "Connection": "keep-alive",
    "Content-Type": "application/json",
    "Origin": "https://soundcloud.com",
    "Referer": "https://soundcloud.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.188 Safari/537.36 CrKey/1.54.250320 Edg/115.0.0.0",
}

params = {
    "ids": "1056989302,1051523650,111127967,115236819,1194533935,1204457869,1242757588,1247116825,1263196699,1267447333,1269345835,1273484212,1275853348,1301428681,1339623658,1389272428,1393753888,1418341354,1428974836,1436403271,1436403670,1441741387,1443741343,1449523786,1454585971,1459277209,1459277581,1459277827,1459278433,1459278556,1459278877,1459279579,1460303899,1485545800,1491677641,1520926177,180905489,247837953,253006715,383244017,646736838,665261066,673254992,709649923,887243206,887244826,894055741,930408532,959334589,959336380",
    "client_id": "MK6Otkm10RJQcH3Cju78UhH6NXw40V47",
    "[object Object]": "",
    "app_version": "1690193099",
    "app_locale": "en",
}
countries_tuple = [
    ("Germany", "DE"),
    ("United Kingdom", "GB"),
    ("United States", "US"),
    ("Netherlands", "NL"),
    ("France", "FR"),
    ("Australia", "AU"),
    ("Brazil", "BR"),
    ("Poland", "PL"),
    ("Sweden", "SE"),
    ("Austria", "AT"),
    ("India", "IN"),
    ("Canada", "CA"),
    ("Turkey", "TR"),
    ("Switzerland", "CH"),
    ("Norway", "NO"),
    ("Indonesia", "ID"),
    ("Mexico", "MX"),
    ("New Zealand", "NZ"),
    ("Belgium", "BE"),
    ("Ireland", "IE"),
    ("Italy", "IT"),
    ("Portugal", "PT"),
    ("Spain", "ES"),
    ("Denmark", "DK"),
    ("Finland", "FI"),
]



@csrf_exempt
def tiktok_view(request):
    if request.method == "POST":
        # Get the TikTok URL from the POST request
        tiktok_url = request.POST.get("url", "")

        # Validate the TikTok URL (you may add more robust validation here)
        if not tiktok_url.startswith("https://www.tiktok.com/"):
            return JsonResponse({"error": "Invalid TikTok URL"})

        # Prepare the JSON data for the API request
        data = {"url": tiktok_url}

        # Make a POST request to the specified endpoint (you may adjust the URL as needed)
        api_endpoint = "http://167.99.195.35/api/tik"
        try:
            response = requests.post(api_endpoint, json=data)
            response.raise_for_status()  # Raise an exception for HTTP errors (4xx, 5xx)
            api_response = response.json()
        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": "Error making the API request"})

        return JsonResponse(api_response)

    return render(request, "tiktok_form.html")





class Render(APIView):
    @staticmethod
    def get(request):
        tags = request.data["tags"]
        today = request.data["today"]
        # tags = request.data["tags"]
        previous_chart = Chart.objects.filter(tags= tags, today=today).order_by("current_position")

        # Convert QuerySet to list of dictionaries
        previous_chart_list = [model_to_dict(instance) for instance in previous_chart]

        return Response(
            {
                "status": "success",
                "data": previous_chart_list,
            },
            status=201,
        )


class RenderDiscovery(APIView):
    @staticmethod
    def get(request):

        # tags = request.data["tags"]
        
        tag = request.data["tags"]
        today = request.data["today"]
        country = request.data["country"]
        previous_chart = Chart_disc.objects.filter(tag= tag, today=today,country=country).order_by("current_position")
        # Convert QuerySet to list of dictionaries
        previous_chart_list = [model_to_dict(instance) for instance in previous_chart]

        return Response(
            {
                "status": "success",
                "data": previous_chart_list,
            },
            status=201,
        )


class tik(APIView):
    @staticmethod
    def post(request):

        result = loader(request.data["url"])
        if result:
            airtable.create(result)
            print(result)
            return Response(
                {
                    "status": "success",
                    "data": result,
                },
                status=201,
            )
        else:
            print(result)
            return Response(
                {
                    "status": "Failed",
                    "data": "No profile found",
                },
                status=201,
            )


class Update(APIView):
    @staticmethod
    def get(req):

        tag = req.data["tag"]
        headers = {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
            "Origin": "https://soundcloud.com",
            "Referer": "https://soundcloud.com/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.188 Safari/537.36 CrKey/1.54.250320 Edg/114.0.0.0",
        }
        current_charts = []


        response = requests.get(
            f"https://api-v2.soundcloud.com/search/tracks?q=*&filter.genre_or_tag={tag}&sort=popular&client_id=w2Cs8NzMrJqhjiCIinZ1xxNBqPNgTVIe&limit=50&offset=0&linked_partitioning=1&app_version=1689322736&app_locale=en",
            headers=headers,
        )
        dt = response.json()
        current_charts = [
            {
                "tags": tag,
                "lastweek": None,
                "current_position": index + 1,
                "title": i["title"],
                "link": i["permalink_url"],
                "sound_likes": i["likes_count"],
                "sound_play": i["playback_count"],
                "sound_repost": i["reposts_count"],
                "sound_release": i["display_date"],
                "date":today
            }
            for index, i in enumerate(dt["collection"])
        ][:51]


        bn = generate(current_charts,)

        return Response(
            {
                "status": "success",
            },
            status=201,
        )


class Discover(APIView):
    @staticmethod
    def get(req):
        for country, co in countries_tuple:
            for typex in music_types:
                url = f"https://soundcloud.com/discover/sets/charts-top:{typex}:{co}"
                data = extract_dictionary_from_html(url)
                dummy = [str(i["id"]) for i in data[6]["data"]["tracks"]]

                # Sort the new_ids_list alphabetically
                dummy.sort()

                # Convert the sorted list back to a string with comma separation
                new_ids_str = ",".join(dummy)

                # Format the params dictionary with the new sorted ids
                params_formatted = params.copy()
                params_formatted["ids"] = new_ids_str

                response = requests.get(
                    "https://api-v2.soundcloud.com/tracks",
                    params=params_formatted,
                    headers=headers,
                )
                response.json()
                dt = response.json()
                current_chart = [
                    {
                        "tags": f"{typex}",
                        "country": f"{country}",
                        "current_position": index + 1,
                        "title": i["title"],
                        "link": i["permalink_url"],
                        "sound_likes": i["likes_count"],
                        "sound_play": i["playback_count"],
                        "sound_repost": i["reposts_count"],
                        "sound_release": i["display_date"],
                    }
                    for index, i in enumerate(response.json())
                ]

                generate_discover(current_chart, today=today)

        return Response(
            {
                "status": "success",
            },
            status=201,
        )
