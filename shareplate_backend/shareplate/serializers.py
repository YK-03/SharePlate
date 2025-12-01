from rest_framework import serializers
from .models import Item, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = UserProfile.objects.create_user(**validated_data)
        return user

class ItemSerializer(serializers.ModelSerializer):
    donor_name = serializers.ReadOnlyField(source='donor.email')
    
    class Meta:
        model = Item
        fields = ('id', 'name', 'description', 'address', 'quantity', 'expiry_date', 'is_available', 'created_at', 'donor', 'donor_name', 'latitude', 'longitude')
        read_only_fields = ('donor', 'created_at', 'latitude', 'longitude')
