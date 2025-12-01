from rest_framework.filters import BaseFilterBackend

class CustomInBBoxFilter(BaseFilterBackend):
    """
    Dummy filter to replace GIS filter for auth debugging.
    """
    def filter_queryset(self, request, queryset, view):
        return queryset