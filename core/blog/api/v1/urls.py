from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = "api-v1"
router = DefaultRouter()
router.register(r"posts", views.PostViewSet, basename="posts")
router.register(r"categories", views.CategoryViewSet, basename="categories")

urlpatterns = [
    path("", include(router.urls)),
]
