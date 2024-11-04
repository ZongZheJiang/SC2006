from flask import Flask, Blueprint, jsonify,request
sort_option_bp= Blueprint("sort_option", __name__)

sort_type="default"

@sort_option_bp.route("/sort")
def sort():
    global sort_type
    sort_type=request.args.get("sort_type", default=sort_type)
    print("Setting sort option to : ", sort_type)
    return jsonify(sort_type)
