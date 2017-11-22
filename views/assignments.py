from flask import Blueprint, request, jsonify, render_template
import json
from models.assignment import Assignment


asn = Blueprint('asn', __name__, url_prefix='/asn')
