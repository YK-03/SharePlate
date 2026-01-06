from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Item, Request


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def claim_donation(request, item_id):
    try:
        item = Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        return Response(
            {"error": "Donation not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # ❌ already claimed
    if item.status == "CLAIMED":
        return Response(
            {"error": "Donation already claimed"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ create request
    Request.objects.create(
        item=item,
        requester=request.user
    )

    # ✅ mark item as claimed
    item.status = "CLAIMED"
    item.save()

    return Response(
        {"message": "Donation claimed successfully"},
        status=status.HTTP_200_OK
    )
