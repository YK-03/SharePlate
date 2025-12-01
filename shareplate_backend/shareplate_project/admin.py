from django.contrib import admin
from shareplate.models import UserProfile, Item, Request # Corrected import path

class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'donor', 'location', 'is_available', 'created_at')
    readonly_fields = ('latitude', 'longitude')
    list_filter = ('is_available', 'created_at')
    search_fields = ('name', 'description', 'location')

admin.site.register(UserProfile)
admin.site.register(Item, ItemAdmin)
admin.site.register(Request)