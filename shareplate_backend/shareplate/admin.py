from django.contrib import admin
# from django.contrib.gis import admin
# from leaflet.admin import LeafletGeoAdmin
from .models import Item, Request, UserProfile

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin): # Changed from LeafletGeoAdmin
    """
    Admin interface for the Item model, using Leaflet for map widgets.
    """
    # Customize the admin list display, search fields, etc. here
    list_display = ('name', 'donor', 'address', 'is_available', 'expiry_date')
    list_filter = ('is_available', 'expiry_date')
    search_fields = ('name', 'description', 'address', 'donor__username')

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    """Admin interface for the Request model."""
    list_display = ('item', 'requester', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('item__name', 'requester__username')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin interface for the UserProfile model."""
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'email_notifications_enabled', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active', 'email_notifications_enabled')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Notifications', {'fields': ('email_notifications_enabled',)}),
    )
