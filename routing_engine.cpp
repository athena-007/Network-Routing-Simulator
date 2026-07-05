#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <climits>

using namespace std;

//==================================================
// Result Structure
//==================================================

struct Result
{
    vector<int> path;
    int distance;
    bool found;
};

//==================================================
// Graph Class
//==================================================

class Graph
{
private:
    int numNodes;
    vector<vector<pair<int, int>>> adjacencyList;

public:
    Graph(int nodes);

    bool addEdge(int u, int v, int cost);

    Result dijkstra(int source, int destination);
};

//==================================================
// Constructor
//==================================================

Graph::Graph(int nodes)
{
    numNodes = nodes;
    adjacencyList.resize(nodes);
}

//==================================================
// Add Edge
//==================================================

bool Graph::addEdge(int u, int v, int cost)
{
    if (u < 0 || u >= numNodes)
        return false;

    if (v < 0 || v >= numNodes)
        return false;

    if (cost < 0)
        return false;

    adjacencyList[u].push_back({v, cost});
    adjacencyList[v].push_back({u, cost});

    return true;
}

//==================================================
// Dijkstra Algorithm
//==================================================

Result Graph::dijkstra(int source, int destination)
{
    Result result;

    result.distance = INT_MAX;
    result.found = false;

    if (source < 0 || source >= numNodes)
        return result;

    if (destination < 0 || destination >= numNodes)
        return result;

    vector<int> distance(numNodes, INT_MAX);
    vector<int> parent(numNodes, -1);

    priority_queue<
        pair<int, int>,
        vector<pair<int, int>>,
        greater<pair<int, int>>
    > pq;

    distance[source] = 0;
    pq.push({0, source});

    while (!pq.empty())
    {
        int currentDistance = pq.top().first;
        int currentNode = pq.top().second;
        pq.pop();

        if (currentDistance > distance[currentNode])
            continue;

        // Early exit optimization
        if (currentNode == destination)
            break;

        for (auto neighbour : adjacencyList[currentNode])
        {
            int nextNode = neighbour.first;
            int edgeWeight = neighbour.second;

            if (distance[currentNode] + edgeWeight < distance[nextNode])
            {
                distance[nextNode] = distance[currentNode] + edgeWeight;
                parent[nextNode] = currentNode;

                pq.push({distance[nextNode], nextNode});
            }
        }
    }

    if (distance[destination] == INT_MAX)
        return result;

    result.distance = distance[destination];
    result.found = true;

    int current = destination;

    while (current != -1)
    {
        result.path.push_back(current);
        current = parent[current];
    }

    reverse(result.path.begin(), result.path.end());

    return result;
}

//==================================================
// Main
//==================================================

int main()
{
    int nodes;
    int edges;

    if (!(cin >> nodes))
    {
        cout << "INVALID_INPUT";
        return 0;
    }

    if (!(cin >> edges))
    {
        cout << "INVALID_INPUT";
        return 0;
    }

    Graph network(nodes);

    for (int i = 0; i < edges; i++)
    {
        int u, v, cost;

        if (!(cin >> u >> v >> cost))
        {
            cout << "INVALID_INPUT";
            return 0;
        }

        if (!network.addEdge(u, v, cost))
        {
            cout << "INVALID_INPUT";
            return 0;
        }
    }

    int source;
    int destination;

    if (!(cin >> source >> destination))
    {
        cout << "INVALID_INPUT";
        return 0;
    }

    Result result = network.dijkstra(source, destination);

    if (!result.found)
    {
        cout << "NO_PATH";
        return 0;
    }

    cout << result.distance << endl;

    for (int i = 0; i < result.path.size(); i++)
    {
        cout << result.path[i];

        if (i != result.path.size() - 1)
            cout << " ";
    }

    return 0;
}