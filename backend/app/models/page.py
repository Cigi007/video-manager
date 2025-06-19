from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class Page(Base):
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(JSON)
    owner_id = Column(Integer, ForeignKey("users.id"))
    is_published = Column(Boolean, default=False)
    published_url = Column(String, nullable=True)

    # Relationships
    owner = relationship("User", back_populates="pages")
    videos = relationship("Video", secondary="page_videos", back_populates="pages")
    views = relationship("PageView", back_populates="page")
    clicks = relationship("Click", back_populates="page")
    purchases = relationship("Purchase", back_populates="page") 