from django.urls import path
from blog import views

app_name = 'blog'
urlpatterns = [
    path('posts/', views.PostListView.as_view(), name = 'Post-List'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name = 'Post-Detail'),
    path('posts/create/', views.PostFormView.as_view(), name= "Create-Post"),
    path('posts/<int:pk>/edit/', views.EditPostView.as_view(), name= "Edit-Post"),
    path('posts/<int:pk>/delete/', views.DeletePostView.as_view(), name= "Delete-Post")
] 