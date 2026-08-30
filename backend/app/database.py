from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Handles both sqlite and postgresql connection URLs transparently
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    """Create all tables and safely migrate columns without dropping existing data."""
    Base.metadata.create_all(bind=engine)
    try:
        with engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(users)"))
            columns = [row[1] for row in result.fetchall()]
            if "username" not in columns and len(columns) > 0:
                conn.execute(text("ALTER TABLE users ADD COLUMN username VARCHAR"))
                conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_username ON users (username)"))
                conn.commit()
    except Exception as e:
        print(f"Schema migration notice: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
