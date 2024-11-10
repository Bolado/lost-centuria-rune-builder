from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    MONGO_URI = os.getenv('MONGO_URI')
    DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
    DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
    JWT_SECRET = os.getenv('JWT_SECRET')
    SECRET_KEY = os.getenv('SECRET_KEY')
