from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import UserRegistrationSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    """
    View for user registration.
    Returns user data and user type for frontend redirection.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        headers = self.get_success_headers(serializer.data)
        
        # Include user role in the response
        response_data = serializer.data
        # The 'role' from the request is the source of truth.
        # The serializer should handle saving it. We just need to return it.
        response_data['role'] = request.data.get('role', 'donor')

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)