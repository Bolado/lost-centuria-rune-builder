from flask import redirect, url_for, request, jsonify, make_response
from functools import wraps
from datetime import datetime, timedelta, timezone
import jwt
import os
from ..extensions import oauth
from ..config import Config
from . import bp

# OAuth config

oauth.register(
    name='discord',
    client_id= Config.DISCORD_CLIENT_ID,
    client_secret= Config.DISCORD_CLIENT_SECRET,
    api_base_url='https://discord.com/api/',
    access_token_url='https://discord.com/api/oauth2/token',
    authorize_url='https://discord.com/api/oauth2/authorize',
    client_kwargs={
        'scope': 'identify',
    }
)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check Authorization header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        # Check cookies
        elif request.cookies.get('token'):
            token = request.cookies.get('token')

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            current_user = data
        except:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)
    return decorated
@bp.route('/login')
def login():
    redirect_uri = url_for('api.authorize', _external=True)
    return oauth.discord.authorize_redirect(redirect_uri)

@bp.route('/authorize')
def authorize():
    try:
        # Explicitly include state in token verification
        token = oauth.discord.authorize_access_token()
        if token is None:
            raise Exception('Access token not found')

        # Get user data
        resp = oauth.discord.get('users/@me')
        user_data = resp.json()

        # Create JWT with Config.JWT_SECRET
        jwt_token = jwt.encode({
            'user_id': user_data['id'],
            'username': user_data['username'],
            'email': user_data.get('email'),
            'exp': datetime.now(timezone.utc) + timedelta(days=1)
        }, Config.JWT_SECRET, algorithm='HS256')

        # Return success response
        response = make_response(redirect('callback'))
        response.set_cookie('token', jwt_token)
        return response

    except Exception as e:
        return jsonify({'error': str(e)}), 400
