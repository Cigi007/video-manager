from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    # Relationships
    pages = relationship("Page", back_populates="owner")
    videos = relationship("Video", back_populates="owner")
    page_views = relationship("PageView", back_populates="user")
    video_views = relationship("VideoView", back_populates="user")
    clicks = relationship("Click", back_populates="user")
    purchases = relationship("Purchase", back_populates="user") 