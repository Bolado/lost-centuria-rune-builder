from flask import request, jsonify, redirect
from bson import ObjectId
from .auth import token_required
from . import bp
from ..extensions import mongo

# This route handles saving a new build when the user clicks the save button.
@bp.route('/build/save', methods=['POST'])
@token_required
def save_build(current_user):
    user_id = current_user['user_id']

    json_body = request.get_json()
    build_object = json_body['build']

    # Check if body has a build id
    if 'id' in json_body:
        build_id = json_body['id']
        build_document = mongo.cx.db.builds.find_one({'_id': ObjectId(build_id)})

        # if build exists, check if user is the owner
        if build_document:
            if build_document['user_id'] == user_id:
                # if user is the owner, update the build
                mongo.cx.db.builds.update_one({'_id': ObjectId(build_id)}, {'$set': {'build': build_object}})
                return jsonify({'status':'updated','id': build_id})

    # if build does not exist or user is not the owner, create a new build
    result = mongo.cx.db.builds.insert_one({'build': build_object, 'user_id': user_id})
    return jsonify({'status':'created','id': str(result.inserted_id)})

# This route will handle the creation of a new build whenever the user navigates to /build/new. It will return a new build JSON with the id.
@bp.route('/build/new', methods=['GET'])
@token_required
def new_build(current_user):
    user_id = current_user['user_id']
    result = mongo.cx.db.builds.insert_one({'build': {}, 'user_id': user_id})
    if result:
        return jsonify({'id': str(result.inserted_id)})

# This route will handle the retrieval of a build whenever the user navigates to /build/:id. It will return the build JSON if it exists in the database, otherwise, it will redirect to /build/new.
@bp.route('/build/<id>', methods=['GET'])
def get_url(id):
    build = mongo.cx.db.builds.find_one({'_id': ObjectId(id)})
    if build:
        return jsonify(build['build'])
    else:
        return redirect('/build/new')
