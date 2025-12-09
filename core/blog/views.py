from django.shortcuts import render
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.views.generic.base import TemplateView
from blog.models import Post
from accounts.models import User
from blog.forms import PostForm
from django.contrib.auth.mixins import LoginRequiredMixin


class indexView(TemplateView):
    template_name = 'index.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["users"] = User.objects.all()
        context["posts"] = Post.objects.all()
        return context
    
class PostListView(LoginRequiredMixin, ListView):
    model = Post
    context_object_name = 'posts'
    paginate_by = 2
    ordering = 'id'

class PostDetailView(LoginRequiredMixin, DetailView):
    model = Post


class PostFormView(LoginRequiredMixin, CreateView):
    model = Post
    form_class = PostForm
    success_url = '/blog/posts/'
    
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class EditPostView(LoginRequiredMixin, UpdateView):
    model = Post
    form_class = PostForm
    success_url = '/blog/posts/'

class DeletePostView(LoginRequiredMixin, DeleteView):
    model = Post
    success_url = '/blog/posts/'