import subprocess
from app.models import RouteRequest, RouteResponse


def calculate_route(request: RouteRequest):

    input_data = ""

    input_data += f"{request.nodes}\n"
    input_data += f"{len(request.edges)}\n"

    for edge in request.edges:

        if len(edge) != 3:
            raise ValueError("Each edge must contain exactly 3 values.")

        u, v, weight = edge

        input_data += f"{u} {v} {weight}\n"

    input_data += f"{request.source}\n"
    input_data += f"{request.destination}\n"

    try:

        result = subprocess.run(
            ["build/routing_engine.exe"],
            input=input_data,
            text=True,
            capture_output=True,
            cwd="."
        )

    except Exception as e:
        raise ValueError(str(e))

    if result.returncode != 0:
        raise ValueError("Failed to execute routing engine.")

    output = result.stdout.strip()

    if output == "INVALID_INPUT":
        raise ValueError("Invalid network input.")

    if output == "NO_PATH":
        raise ValueError("No path exists.")

    lines = output.splitlines()

    if len(lines) != 2:
        raise ValueError("Unexpected output from routing engine.")

    distance = int(lines[0])

    path = list(map(int, lines[1].split()))

    return RouteResponse(
        distance=distance,
        path=path
    )