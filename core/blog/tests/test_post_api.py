import pytest
from rest_framework.test import APIClient
from django.urls import reverse


@pytest.mark.django_db
class TestPostAPI:
    def test_get_post_response_200(self):
        client = APIClient()
        url = reverse("blog:api-v1:posts-list")
        response = client.get(url)
        assert response.status_code == 200


@pytest.mark.django_db
class TestLoginAPI:
    def test_login_response_200(self):
        # Creating User:
        from accounts.models import User

        User.objects.create_user(
            email="admin@admin.com",
            password="bguwedqdg322313",
            is_verified=True,
        )
        # Testing
        client = APIClient()
        url = reverse("accounts:accounts-v1:jwt-create")
        response = client.post(
            url, {"email": "admin@admin.com", "password": "bguwedqdg322313"}
        )
        assert response.status_code == 200
        
@pytest.mark.django_db
class TestCreatePostAPI:
    def test_create_post_201(self):
        from blog.models import Category, Post
        from accounts.models import User, Profile
        
        # Step 1: Create user and authenticate
        user = User.objects.create_user(
            email="author@test.com",
            password="testpass123",
            is_verified=True
        )
        # Profile is created automatically by your post_save signal
        
        # Step 2: Create category
        category = Category.objects.create(name="kazem")
        
        # Step 3: Prepare data to send to API
        data = {
            "title": "kazem",
            "content": "Kazem BVisadkaspdkop;sadasd",
            "status": True,
            "category": category.id,  # Send the ID
        }
        
        # Step 4: Authenticate and make request
        client = APIClient()
        client.force_authenticate(user=user)  # 👈 Important!
        
        url = reverse("blog:api-v1:posts-list")
        response = client.post(url, data, format='json')
        
        # Step 5: Assert
        assert response.status_code == 201
        assert response.data["title"] == "kazem"
        post = Post.objects.get(id=response.data["id"])
        assert post.content == "Kazem BVisadkaspdkop;sadasd"