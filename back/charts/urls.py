from django.urls import path
from . import views
from charts.views import Update, Render, tik, tiktok_view,Discover,RenderDiscovery


urlpatterns = [
    path("api/tiktok", tiktok_view, name="tiktok"),
    path("api/update", Update.as_view()),
    path("api/discover", Discover.as_view()),
    path("api/render", Render.as_view()),
     path("api/render2", RenderDiscovery.as_view()),
    path("api/tik", tik.as_view()),
]
