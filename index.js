const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const USER_ID = "hardikpatidar_01042004";           
const EMAIL_ID = "hp3619@srmist.edu.in";   
const COLLEGE_ROLL_NUMBER = "RA2311027010088"; 



function isValidEdge(entry) {
  const trimmed = entry.trim();

  if (!/^[A-Z]->[A-Z]$/.test(trimmed)) return false;
  const [from, to] = trimmed.split("->");
  if (from === to) return false; // self-loop
  return true;
}

function processData(data) {
  const invalid_entries = [];
  const duplicate_edges = [];
  const seenEdges = new Set();
  const validEdges = [];

  for (const entry of data) {
    const trimmed = (entry || "").trim();

    if (!isValidEdge(trimmed)) {
      invalid_entries.push(entry); 
      continue;
    }

    if (seenEdges.has(trimmed)) {
      if (!duplicate_edges.includes(trimmed)) {
        duplicate_edges.push(trimmed);
      }
    } else {
      seenEdges.add(trimmed);
      validEdges.push(trimmed);
    }
  }

  const childParent = {}; 
  const parentChildren = {}; 
  const allNodes = new Set();

  for (const edge of validEdges) {
    const [parent, child] = edge.split("->");
    allNodes.add(parent);
    allNodes.add(child);

    if (!parentChildren[parent]) parentChildren[parent] = [];

    if (childParent[child] !== undefined) {
      continue;
    }
    childParent[child] = parent;
    parentChildren[parent].push(child);
  }

  const parent = {};
  function find(x) {
    if (!parent[x]) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a, b) {
    parent[find(a)] = find(b);
  }

  for (const edge of validEdges) {
    const [p, c] = edge.split("->");
    union(p, c);
  }

  const components = {};
  for (const node of allNodes) {
    const root = find(node);
    if (!components[root]) components[root] = new Set();
    components[root].add(node);
  }

  const hierarchies = [];

  for (const compNodes of Object.values(components)) {
    const nodeSet = Array.from(compNodes);

    function hasCycle(nodes) {
      const visited = new Set();
      const stack = new Set();

      function dfs(node) {
        visited.add(node);
        stack.add(node);
        for (const child of (parentChildren[node] || [])) {
          if (!visited.has(child)) {
            if (dfs(child)) return true;
          } else if (stack.has(child)) {
            return true;
          }
        }
        stack.delete(node);
        return false;
      }

      for (const node of nodes) {
        if (!visited.has(node)) {
          if (dfs(node)) return true;
        }
      }
      return false;
    }

    const cyclic = hasCycle(nodeSet);

    let roots = nodeSet.filter((n) => childParent[n] === undefined);

    let rootNode;
    if (roots.length === 0) {
      rootNode = nodeSet.sort()[0];
    } else {
      rootNode = roots.sort()[0]; 
    }

    if (cyclic) {
      hierarchies.push({
        root: rootNode,
        tree: {},
        has_cycle: true,
      });
    } else {
      function buildTree(node) {
        const children = parentChildren[node] || [];
        const obj = {};
        for (const child of children) {
          obj[child] = buildTree(child);
        }
        return obj;
      }

      function calcDepth(node) {
        const children = parentChildren[node] || [];
        if (children.length === 0) return 1;
        return 1 + Math.max(...children.map(calcDepth));
      }

      const tree = { [rootNode]: buildTree(rootNode) };
      const depth = calcDepth(rootNode);

      hierarchies.push({ root: rootNode, tree, depth });
    }
  }

  hierarchies.sort((a, b) => a.root.localeCompare(b.root));

  const nonCyclicTrees = hierarchies.filter((h) => !h.has_cycle);
  const total_trees = nonCyclicTrees.length;
  const total_cycles = hierarchies.filter((h) => h.has_cycle).length;

  let largest_tree_root = "";
  let maxDepth = -1;
  for (const h of nonCyclicTrees) {
    if (
      h.depth > maxDepth ||
      (h.depth === maxDepth && h.root < largest_tree_root)
    ) {
      maxDepth = h.depth;
      largest_tree_root = h.root;
    }
  }

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root,
    },
  };
}

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "data must be an array" });
    }
    const result = processData(data);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => res.send("BFHL API is running. POST to /bfhl"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
