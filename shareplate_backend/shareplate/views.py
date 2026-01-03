from rest_framework import generics
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.db import transaction
from .models import Item, UserProfile, Request
from .serializers import ItemSerializer, UserProfileSerializer, RequestSerializer
from .filters import CustomInBBoxFilter
from .notifications import send_donation_notification_to_volunteers
import logging

logger = logging.getLogger(__name__)

class ItemListCreateView(generics.ListCreateAPIView):
    """
    API view to retrieve a list of items or create a new item.
    - GET: Returns a list of available items. Can be filtered by a bounding box
      using the `in_bbox` query parameter (e.g., ?in_bbox=xmin,ymin,xmax,ymax).
    - POST: Creates a new item, automatically assigning the logged-in user as the donor.
    """
    queryset = Item.objects.filter(is_available=True)
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Enable geographic filtering
    # filter_backends = [CustomInBBoxFilter]
    # bbox_filter_field = 'location' # The field to filter on

    def perform_create(self, serializer):
        # Automatically set the donor to the current user when an item is created
        item = serializer.save(donor=self.request.user)
        
        # Send notification to volunteers after donation is created
        try:
            send_donation_notification_to_volunteers(item)
        except Exception as e:
            # Log the error but don't fail the request if notification fails
            logger.error(f"Failed to send notification to volunteers: {str(e)}", exc_info=True)
    
    def create(self, request, *args, **kwargs):
        """Override create to handle the response and ensure notification is sent"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class RequestListCreateView(generics.ListCreateAPIView):
    """
    API view to manage requests (claims).
    - GET: List requests (Recipients see their own claims).
    - POST: Create a request to claim an item.
    """
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Recipients see only their own requests
        return Request.objects.filter(requester=user)

    def create(self, request, *args, **kwargs):
        item_id = request.data.get('item_id')
        if not item_id:
            return Response({'error': 'Item ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        if not item.is_available:
            return Response({'error': 'Item is not available'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the request
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
             # Mark item as unavailable (since it's claimed)
            with transaction.atomic():
                instance = serializer.save(requester=self.request.user, item=item, status='Accepted') # Auto-accept for MVP claim flow
                item.is_available = False
                item.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserRegistrationView(APIView):
    """
    API view for user registration.
    Allows creating new users with role selection.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save()
                password = request.data.get('password')
                if password:
                    user.set_password(password)
                    user.save()
                
                # Create auth token for the user
                token, created = Token.objects.get_or_create(user=user)
                
                # Remove password from response
                user_data = UserProfileSerializer(user).data
                user_data.pop('password', None)
                
                return Response({
                    'user': user_data,
                    'token': token.key,
                    'message': 'User registered successfully'
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    """
    API view to list users, filtered by role.
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = UserProfile.objects.all()
        role = self.request.query_params.get('role', None)
        email = self.request.query_params.get('email', None)
        if role:
            queryset = queryset.filter(role=role)
        if email:
            queryset = queryset.filter(email=email)
        return queryset


class ObtainAuthToken(APIView):
    """
    Custom view to obtain an auth token using email and password.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'error': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = authenticate(request=request, email=email, password=password)
        
        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
            
        token, created = Token.objects.get_or_create(user=user)
        # Return user role along with token
        return Response({
            'token': token.key,
            'role': user.role,
            'name': user.get_full_name() or user.email
        })