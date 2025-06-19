from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from ..database import get_db
from ..models import metrics
from ..schemas import metrics as metrics_schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/metrics",
    tags=["metrics"]
)

@router.post("/page-view", response_model=metrics_schemas.PageView)
def create_page_view(
    page_view: metrics_schemas.PageViewCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_page_view = metrics.PageView(
        page_id=page_view.page_id,
        user_id=current_user.id,
        ip_address=page_view.ip_address,
        user_agent=page_view.user_agent,
        referrer=page_view.referrer
    )
    db.add(db_page_view)
    db.commit()
    db.refresh(db_page_view)
    return db_page_view

@router.post("/video-view", response_model=metrics_schemas.VideoView)
def create_video_view(
    video_view: metrics_schemas.VideoViewCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_video_view = metrics.VideoView(
        video_id=video_view.video_id,
        user_id=current_user.id,
        ip_address=video_view.ip_address,
        user_agent=video_view.user_agent,
        referrer=video_view.referrer,
        watch_duration=video_view.watch_duration
    )
    db.add(db_video_view)
    db.commit()
    db.refresh(db_video_view)
    return db_video_view

@router.post("/click", response_model=metrics_schemas.Click)
def create_click(
    click: metrics_schemas.ClickCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_click = metrics.Click(
        page_id=click.page_id,
        user_id=current_user.id,
        ip_address=click.ip_address,
        user_agent=click.user_agent,
        element_id=click.element_id,
        element_type=click.element_type
    )
    db.add(db_click)
    db.commit()
    db.refresh(db_click)
    return db_click

@router.post("/purchase", response_model=metrics_schemas.Purchase)
def create_purchase(
    purchase: metrics_schemas.PurchaseCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_purchase = metrics.Purchase(
        user_id=current_user.id,
        page_id=purchase.page_id,
        amount=purchase.amount,
        currency=purchase.currency,
        product_id=purchase.product_id,
        transaction_id=purchase.transaction_id
    )
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase

@router.get("/dashboard", response_model=metrics_schemas.DashboardMetrics)
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Get metrics for the last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    # Get page views
    page_views = db.query(metrics.PageView).filter(
        metrics.PageView.user_id == current_user.id,
        metrics.PageView.timestamp >= thirty_days_ago
    ).count()
    
    # Get video views
    video_views = db.query(metrics.VideoView).filter(
        metrics.VideoView.user_id == current_user.id,
        metrics.VideoView.timestamp >= thirty_days_ago
    ).count()
    
    # Get clicks
    clicks = db.query(metrics.Click).filter(
        metrics.Click.user_id == current_user.id,
        metrics.Click.timestamp >= thirty_days_ago
    ).count()
    
    # Get purchases
    purchases = db.query(metrics.Purchase).filter(
        metrics.Purchase.user_id == current_user.id,
        metrics.Purchase.timestamp >= thirty_days_ago
    ).all()
    
    total_revenue = sum(purchase.amount for purchase in purchases)
    
    return metrics_schemas.DashboardMetrics(
        page_views=page_views,
        video_views=video_views,
        clicks=clicks,
        purchases=len(purchases),
        total_revenue=total_revenue
    ) 