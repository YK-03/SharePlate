from django.urls import path
from .views import ItemListCreateView, UserRegistrationView, UserListView, ObtainAuthToken

urlpatterns = [
    path('items/', ItemListCreateView.as_view(), name='item-list-create'),
    path('users/register/', UserRegistrationView.as_view(), name='user-register'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('api-token-auth/', ObtainAuthToken.as_view(), name='api-token-auth'),
]