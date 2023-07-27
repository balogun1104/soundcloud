from django.db import models
from datetime import date, timedelta
from django.db import IntegrityError


today = date.today() - timedelta(7)


class Chart(models.Model):
    tags = models.CharField(max_length=300, null=True)
    title = models.CharField(
        max_length=300,
    )
    previous_position = models.IntegerField(null=True, blank=True)
    current_position = models.IntegerField(null=True)
    link = models.URLField()
    spot_name = models.CharField(max_length=300, null=True)
    spot_url = models.URLField(null=True)
    comp_name = models.CharField(max_length=300, null=True)
    comp_artist = models.CharField(max_length=300, null=True)
    comp_url = models.URLField(null=True)
    sound_likes = models.IntegerField(null=True)
    sound_play = models.IntegerField(null=True)
    sound_repost = models.IntegerField(null=True)
    sound_release = models.DateTimeField()
    today = models.DateField(default=today)
    position_7_days_ago = models.IntegerField(
        null=True, blank=True
    )  # New field for 7 days ago position

    # Add unique constraints on title, tags, and today
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["title", "tags", "today"], name="unique_chart_entry"
            )
        ]


class Chart_disc(models.Model):
    tags = models.CharField(max_length=300, null=True)
    title = models.CharField(
        max_length=300,
    )
    country = models.CharField(max_length=300, null=True)
    previous_position = models.IntegerField(null=True)
    current_position = models.IntegerField(null=True)
    link = models.URLField()
    spot_name = models.CharField(max_length=300, null=True)
    spot_url = models.URLField(null=True)
    comp_name = models.CharField(max_length=300, null=True)
    comp_artist = models.CharField(max_length=300, null=True)
    comp_url = models.URLField(null=True)
    sound_likes = models.IntegerField(null=True)
    sound_play = models.IntegerField(null=True)
    sound_repost = models.IntegerField(null=True)
    sound_release = models.DateTimeField()
    today = models.DateField(default=today)
    position_7_days_ago = models.IntegerField(
        null=True, blank=True
    )  # New field for 7 days ago position

    # Add unique constraints on title, tags, and today
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["title", "tags", "today", "country"], name="unique_chart_entry2"
            )
        ]
