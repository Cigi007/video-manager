from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class PageView(Base):
    __tablename__ = "page_views"

    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String)
    user_agent = Column(String)
    referrer = Column(String, nullable=True)

    page = relationship("Page", back_populates="views")
    user = relationship("User", back_populates="page_views")

class VideoView(Base):
    __tablename__ = "video_views"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String)
    user_agent = Column(String)
    referrer = Column(String, nullable=True)
    watch_duration = Column(Float, nullable=True)  # Duration in seconds

    video = relationship("Video", back_populates="views")
    user = relationship("User", back_populates="video_views")

class Click(Base):
    __tablename__ = "clicks"

    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String)
    user_agent = Column(String)
    element_id = Column(String)  # ID of the clicked element
    element_type = Column(String)  # Type of element (button, link, etc.)

    page = relationship("Page", back_populates="clicks")
    user = relationship("User", back_populates="clicks")

class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    page_id = Column(Integer, ForeignKey("pages.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float)
    currency = Column(String)
    product_id = Column(String)
    transaction_id = Column(String, unique=True)

    page = relationship("Page", back_populates="purchases")
    user = relationship("User", back_populates="purchases") 