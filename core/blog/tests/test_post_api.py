import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from accounts.models import User
from blog.models import Category, Post


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def verified_user():
    """Creates a verified user for testing"""
    return User.objects.create_user(
        email="test@test.com", password="testpass123", is_verified=True
    )


@pytest.fixture
def authenticated_client(api_client, verified_user):
    """Returns an authenticated API client"""
    api_client.force_authenticate(user=verified_user)
    return api_client


@pytest.fixture
def sample_category():
    """Creates a sample category"""
    return Category.objects.create(name="Technology")


@pytest.fixture
def sample_post_data(sample_category):
    """Returns valid post data for testing"""
    return {
        "title": "Test Post",
        "content": "This is test content for the post.",
        "status": True,
        "category": sample_category.id,
    }


"""
Tests for Blog Post API endpoints
"""
import pytest
from django.urls import reverse
from blog.models import Post


@pytest.mark.django_db
class TestPostListAPI:
    """Tests for GET /api/v1/posts/"""

    def test_get_posts_anonymous_user_succeeds(self, api_client):
        """Anonymous users can view posts list"""
        url = reverse("blog:api-v1:posts-list")
        response = api_client.get(url)

        assert response.status_code == 200
        assert "results" in response.data  # Your pagination response

    def test_get_posts_returns_paginated_results(
        self, api_client, verified_user, sample_category
    ):
        """Posts are returned with pagination"""
        # Create some posts
        profile = verified_user.profile_set.first()
        for i in range(5):
            Post.objects.create(
                author=profile,
                title=f"Post {i}",
                content=f"Content {i}",
                status=True,
                category=sample_category,
                published_date="2025-01-01T00:00:00Z",
            )

        url = reverse("blog:api-v1:posts-list")
        response = api_client.get(url)

        assert response.status_code == 200
        assert response.data["count"] == 5
        assert len(response.data["results"]) == 5


@pytest.mark.django_db
class TestPostCreateAPI:
    """Tests for POST /api/v1/posts/"""

    def test_create_post_unauthenticated_fails(self, api_client, sample_post_data):
        """Anonymous users cannot create posts"""
        url = reverse("blog:api-v1:posts-list")
        response = api_client.post(url, sample_post_data, format="json")

        assert response.status_code == 401  # Or 403 depending on your permissions

    def test_create_post_authenticated_succeeds(
        self, authenticated_client, sample_post_data
    ):
        """Authenticated users can create posts"""
        url = reverse("blog:api-v1:posts-list")
        response = authenticated_client.post(url, sample_post_data, format="json")

        assert response.status_code == 201
        assert response.data["title"] == sample_post_data["title"]
        post = Post.objects.get(id=response.data["id"])
        assert post.content == sample_post_data["content"]

        # Verify in database
        post = Post.objects.get(id=response.data["id"])
        assert post.title == sample_post_data["title"]
        assert post.status is True

    def test_create_post_sets_author_automatically(
        self, authenticated_client, verified_user, sample_post_data
    ):
        """Post author is automatically set to authenticated user"""
        url = reverse("blog:api-v1:posts-list")
        response = authenticated_client.post(url, sample_post_data, format="json")

        assert response.status_code == 201

        post = Post.objects.get(id=response.data["id"])
        assert post.author.user == verified_user

    def test_create_post_missing_required_fields_fails(self, authenticated_client):
        """Creating post without required fields returns 400"""
        url = reverse("blog:api-v1:posts-list")
        response = authenticated_client.post(url, {}, format="json")

        assert response.status_code == 200
        assert "title" in response.data
        assert "content" in response.data


@pytest.mark.django_db
class TestJWTLoginAPI:
    """Tests for JWT authentication"""

    def test_login_valid_credentials_succeeds(self, api_client, verified_user):
        """Login with valid credentials returns tokens"""
        url = reverse("accounts:accounts-v1:jwt-create")
        response = api_client.post(
            url, {"email": verified_user.email, "password": "testpass123"}
        )

        assert response.status_code == 200
        assert "access" in response.data
        assert "refresh" in response.data
        assert response.data["email"] == verified_user.email

    def test_login_invalid_password_fails(self, api_client, verified_user):
        """Login with wrong password returns 401"""
        url = reverse("accounts:accounts-v1:jwt-create")
        response = api_client.post(
            url, {"email": verified_user.email, "password": "wrongpassword"}
        )

        assert response.status_code == 401

    def test_login_unverified_user_fails(self, api_client):
        """Unverified users cannot login"""
        unverified = User.objects.create_user(
            email="unverified@test.com", password="testpass123", is_verified=False
        )

        url = reverse("accounts:accounts-v1:jwt-create")
        response = api_client.post(
            url, {"email": unverified.email, "password": "testpass123"}
        )

        assert response.status_code == 400
        assert "not verified" in str(response.data).lower()
