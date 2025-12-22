from django.db import models
from django.urls import reverse


class Post(models.Model):
    author = models.ForeignKey("accounts.Profile", on_delete=models.CASCADE)
    image = models.ImageField(null=True, blank=True)
    title = models.CharField(max_length=50)
    content = models.TextField()
    status = models.BooleanField()
    category = models.ForeignKey("Category", on_delete=models.SET_NULL, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    published_date = models.DateTimeField()

    def __str__(self):
        return self.title

    def get_snippet(self):
        return self.content[:10] + "..."

    def get_absolute_api_url(self):
        return reverse("blog:api-v1:posts-detail", kwargs={"pk": self.pk})


class Category(models.Model):
    name = models.CharField(max_length=350)

    def __str__(self):
        return self.name
