from flask import Blueprint, url_for, session, make_response, redirect, jsonify, request
from authlib.integrations.flask_client import OAuth
from ..config import Config
from datetime import datetime, timedelta, timezone
import jwt
import uuid
from functools import wraps
from . import bp
from ..extensions import oauth

discord = oauth.register(
    name='discord',
    client_id=Config.DISCORD_CLIENT_ID,
    client_secret=Config.DISCORD_CLIENT_SECRET,
    access_token_url='https://discord.com/api/oauth2/token',
    access_token_params=None,
    authorize_url='https://discord.com/api/oauth2/authorize',
    authorize_params=None,
    api_base_url='https://discord.com/api/',
    client_kwargs={
        'scope': 'identify email',
        'token_endpoint_auth_method': 'client_secret_post'
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

def token_optional(f):
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
            return f(None, *args, **kwargs)

        try:
            data = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            current_user = data
        except:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

@bp.route('/login', methods=['GET'])
def login():
    # Generate and store state parameter
    state = session.get('state', str(uuid.uuid4()))
    session['state'] = state

    redirect_uri = url_for('api.authorize', _external=True)
    return oauth.discord.authorize_redirect(
        redirect_uri,
        state=state
    )

@bp.route('/authorize')
def authorize():
    try:
        # Verify state parameter
        if request.args.get('state') != session.get('state'):
            raise ValueError('State mismatch')

        token = oauth.discord.authorize_access_token()
        resp = oauth.discord.get('users/@me')
        user_data = resp.json()

        jwt_token = jwt.encode({
            'user_id': user_data['id'],
            'username': user_data['username'],
            'email': user_data.get('email'),
            'exp': datetime.now(timezone.utc) + timedelta(days=7)
        }, Config.JWT_SECRET, algorithm='HS256')

        # Clear state after successful authentication
        session.pop('state', None)

        response = make_response(redirect('/callback'))
        response.set_cookie('token', jwt_token, httponly=True, secure=True)
        return response

    except ValueError as e:
        return jsonify({'error': str(e), 'location': 'State verification'}), 400
    except Exception as e:
        return jsonify({
            'error': str(e),
            'location': e.__class__.__name__,
            'details': f'Error occurred in {request.path}'
        }), 400
