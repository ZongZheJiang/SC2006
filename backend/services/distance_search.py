from math import radians, sin, cos, sqrt, atan2

from utils.performance import measure_time

def calculate_distance(origin, destination):
    EARTH_RADIUS = 6371000

    lat1, lon1 = origin
    lat2, lon2 = destination

    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))

    distance = EARTH_RADIUS * c
    return distance

@measure_time
def linear_search(target, carpark_data, k=5):
    res=set()
    for id in carpark_data.keys():
        dist=calculate_distance(target, (float(carpark_data[id][1]), float(carpark_data[id][2])))
        res.add((dist, id))
        if len(res)>k:
            res.remove(max(res, key=lambda x: x[0]))

    res= sorted(
        [{"id": id,
            "dist": dist,
            "location": carpark_data[id][0],
            "lat":carpark_data[id][1],
            "long":carpark_data[id][2]}

        for (dist,id) in res],
        key=lambda x: x["dist"])
    return res
