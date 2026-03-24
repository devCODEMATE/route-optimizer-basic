const pointsInput = document.getElementById("pointsInput");
const optimizeBtn = document.getElementById("optimizeBtn");
const clearBtn = document.getElementById("clearBtn");
const resultDiv = document.getElementById("result");

function parsePoints(input) {
  const lines = input
    .trim()
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

  const points = lines.map((line, index) => {
    const parts = line.split(",");

    if (parts.length !== 2) {
      throw new Error(`Invalid format on line ${index + 1}. Use x,y`);
    }

    const x = Number(parts[0].trim());
    const y = Number(parts[1].trim());

    if (Number.isNaN(x) || Number.isNaN(y)) {
      throw new Error(`Invalid number on line ${index + 1}.`);
    }

    return { x, y };
  });

  if (points.length < 2) {
    throw new Error("Please enter at least 2 points.");
  }

  return points;
}

function getDistance(pointA, pointB) {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function optimizeRoute(points) {
  const remaining = [...points];
  const route = [];

  let current = remaining.shift();
  route.push(current);

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = getDistance(current, remaining[0]);

    for (let i = 1; i < remaining.length; i++) {
      const distance = getDistance(current, remaining[i]);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    current = remaining.splice(nearestIndex, 1)[0];
    route.push(current);
  }

  return route;
}

function formatRoute(route) {
  return route
    .map((point, index) => {
      if (index === 0) {
        return `Start: (${point.x}, ${point.y})`;
      }
      return `Step ${index}: (${point.x}, ${point.y})`;
    })
    .join("\n");
}

optimizeBtn.addEventListener("click", () => {
  try {
    const points = parsePoints(pointsInput.value);
    const route = optimizeRoute(points);
    resultDiv.textContent = formatRoute(route);
  } catch (error) {
    resultDiv.textContent = error.message;
  }
});

clearBtn.addEventListener("click", () => {
  pointsInput.value = "";
  resultDiv.textContent = "Your optimized route will appear here.";
});