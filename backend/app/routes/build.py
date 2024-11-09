from flask import request, jsonify, redirect
from bson import ObjectId
from . import bp
from .. import db

# This route handles saving a new build when the user clicks the save button. It receives the build JSON from the frontend, checks if the build already exists in the database, and if not, saves the build and returns the build's ID.
@bp.route('/build/save', methods=['POST'])
def save_build():
    build = request.json
    exists = db.builds.find_one({'build': build})
    if exists:
        return jsonify({'id': str(exists['_id'])})
    else:
        result = db.builds.insert_one({'build': build})
        return jsonify({'id': str(result.inserted_id)})

# This route will handle the retrieval of a build whenever the user navigates to /build/:id. It will return the build JSON if it exists in the database, otherwise, it will redirect to /build/new.
@bp.route('/build/<id>', methods=['GET'])
def get_url(id):
    build = db.builds.find_one({'_id': ObjectId(id)})
    if build:
        return jsonify(build['build'])
    else:
        return redirect('/build/new')
