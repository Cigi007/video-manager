from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PageViewBase(BaseModel):
    page_id: int
    ip_address: str
    user_agent: str
    referrer: Optional[str] = None

class PageViewCreate(PageViewBase):
    pass

class PageView(PageViewBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class VideoViewBase(BaseModel):
    video_id: int
    ip_address: str
    user_agent: str
    referrer: Optional[str] = None
    watch_duration: Optional[float] = None

class VideoViewCreate(VideoViewBase):
    pass

class VideoView(VideoViewBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class ClickBase(BaseModel):
    page_id: int
    ip_address: str
    user_agent: str
    element_id: str
    element_type: str

class ClickCreate(ClickBase):
    pass

class Click(ClickBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class PurchaseBase(BaseModel):
    page_id: int
    amount: float
    currency: str
    product_id: str
    transaction_id: str

class PurchaseCreate(PurchaseBase):
    pass

class Purchase(PurchaseBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class DashboardMetrics(BaseModel):
    page_views: int
    video_views: int
    clicks: int
    purchases: int
    total_revenue: float 