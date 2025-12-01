from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.auth import get_user_model
from shareplate.models import Item

UserProfile = get_user_model()

class ItemSerializer(GeoFeatureModelSerializer):
    """
    Serializes Item data into the GeoJSON Feature format.
    """
    # Make donor a read-only field that shows the username
    donor = serializers.StringRelatedField(read_only=True)
    # Add latitude and longitude for easier frontend access
    latitude = serializers.ReadOnlyField(source='latitude')
    longitude = serializers.ReadOnlyField(source='longitude')

    class Meta:
        model = Item
        geo_field = "location" # Specify the geometry field
        fields = [
            'id', 'name', 'description', 'quantity',
            'expiry_date', 'is_available', 'created_at',
            'donor', 'address', 'latitude', 'longitude', 'location'
        ]
        read_only_fields = ['id', 'created_at', 'latitude', 'longitude'] # 'donor' is handled above


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile
    """
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'email_notifications_enabled', 'password']
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'email': {'required': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = UserProfile.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user