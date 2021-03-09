// 1. initialize elements and declare Variables

const sizeInput = document.getElementById("size");
const setSizeButton = document.getElementById("set-size-button");

const originMatrixContainer = document.getElementById("created-matrix-container")
const originMatrixGrid = document.getElementById("origin-matrix");
const numberContentButton = document.getElementById("number-content-button");
const letterContentButton = document.getElementById("letter-content-button");
const smileyContentButton = document.getElementById("smiley-content-button");

const rotateMatrixContainer = document.getElementById("rotate-matrix-container")
const rotateCountInput = document.getElementById("rotate-count");
const rotateButton = document.getElementById("rotate-button");

const resultMatrixContainer = document.getElementById("result-matrix-container")
const resultMatrixGrid = document.getElementById("result-matrix");

let matrixSize;
let originMatrix = [];

let rotatedMatrix = [];

// Set eventlistener


setSizeButton.addEventListener("click", () => {
  generateGrid(originMatrixGrid, createOriginMatrixItem);
});

numberContentButton.addEventListener("click", () => {
  generateGridContent(originMatrixGrid, true, false);
});

smileyContentButton.addEventListener("click", () => {
  generateGridContent(originMatrixGrid, false, false);
});

letterContentButton.addEventListener("click", () => {
  generateGridContent(originMatrixGrid, false, true);
});

rotateButton.addEventListener("click", () => {
  initializeOriginMatrix();
  rotateMatrixNTimes(rotateCountInput.value);
  displayResultMatrix();
});

// 2. write function to generate grid to display originMatrix

function generateGrid(grid, item, size) {
  if (
    matrixSize != undefined &&
    size == undefined &&
    matrixSize == parseInt(sizeInput.value) &&
    grid.getAttribute("id") != "result-matrix"
  ) {
    return;
  }

  if(size != undefined) {
    matrixSize = size
  }

  else if (grid.getAttribute("id") != "result-matrix") {
    matrixSize = parseInt(sizeInput.value);
  }

  if (matrixSize != undefined || 0) {
    while (grid.firstChild) {
      grid.removeChild(grid.lastChild);
    }

    let gridTemplateString = "";

    for (i = 0; i < matrixSize; i++) {
      gridTemplateString += "auto ";
    }

    grid.style.gridTemplateRows = gridTemplateString;
    grid.style.gridTemplateColumns = gridTemplateString;
  }

  fillGridWithItems(grid, item);

  if (originMatrixContainer.classList.contains("hidden")) {
    originMatrixContainer.classList.replace("hidden","visible");
  }

  if (rotateMatrixContainer.classList.contains("hidden")) {
    rotateMatrixContainer.classList.replace("hidden","visible");
  }

  if (resultMatrixContainer.classList.contains("visible")) {
    resultMatrixContainer.classList.replace("visible","hidden");
  }
}

function fillGridWithItems(grid, createItem) {
  for (i = 0; i < matrixSize ** 2; i++) {
    const item = createItem();
    item.setAttribute(
      "id",
      "" + Math.floor(i / matrixSize) + " " + (i % matrixSize)
    );
    grid.appendChild(item);
  }
}

function createOriginMatrixItem() {
  const matrixItem = document.createElement("input");
  matrixItem.classList.add("matrix-input");
  matrixItem.setAttribute("size", "2");
  matrixItem.setAttribute("max-length", "2");
  return matrixItem;
}

function createResultMatrixItem() {
  const matrixItem = document.createElement("div");
  matrixItem.classList.add("result-matrix-item");
  return matrixItem;
}

// 3. write function to generate content for originmatrix

function generateGridContent(grid, numbers, letters) {
  const gridItems = grid.children;
  const gridItemsArray = Array.from(gridItems);

  for (i = 0; i < gridItemsArray.length; i++) {
    if (gridItemsArray[i].nodeName == "INPUT") {
      if (numbers) {
        gridItemsArray[i].value = i + 1;
      } else if (letters) {
        const index = i % 26;
        gridItemsArray[i].value = String.fromCharCode(65 + index);
      } else {
        gridItemsArray[i].value = String.fromCodePoint(128512 + i);
      }
    } else if (gridItemsArray[i].nodeName == "DIV") {
      gridItemsArray[i].textContent =
        rotatedMatrix[Math.floor(i / matrixSize)][i % matrixSize];
    }
  }

  if (resultMatrixContainer.classList.contains("visible")) {
    resultMatrixContainer.classList.replace("visible","hidden");
  }
}
// 4. write function to initialize originMatrix

function initializeOriginMatrix() {
  const gridItems = originMatrixGrid.children;
  const gridItemsArray = Array.from(gridItems);

  if (originMatrix.length > 0) {
    originMatrix = [];
  }

  for (i = 0; i < matrixSize; i++) {
    originMatrix[i] = [];
  }

  for (i = 0; i < gridItemsArray.length; i++) {
    const rowIndex = parseInt(gridItemsArray[i].getAttribute("id").charAt(0));
    const columnIndex = parseInt(
      gridItemsArray[i].getAttribute("id").charAt(2)
    );

    originMatrix[rowIndex][columnIndex] = gridItemsArray[i].value;
  }
}
// 5. write function to rotate Matrix

function rotateMatrix() {

  // Clear rotated matrix, when there is one
  if (rotatedMatrix.length > 0) {
    rotatedMatrix = [];
  }

  // Initialise 2d array
  for (i = 0; i < matrixSize; i++) {
    rotatedMatrix[i] = [];
  }

  // compute how many layers have to be rotated
  const layersToRotate = Math.floor(matrixSize / 2);


  // loop through layers and assign and move the elements in the rotated matrix
  for (let layer = 0; layer < layersToRotate; layer++) {
    for (let row = layer; row < matrixSize - layer; row++) {
      for (let column = layer; column < matrixSize - layer; column++) {
        // Rotate top
        if (row == layer && column < matrixSize - 1 - layer) {
          rotatedMatrix[row][column + 1] = originMatrix[row][column];
        }
        // Rotate bottom
        else if (row == matrixSize - 1 - layer && column > layer) {
          rotatedMatrix[row][column - 1] = originMatrix[row][column];
        }
        // Rotate left
        else if (column == layer && row > layer) {
          rotatedMatrix[row - 1][column] = originMatrix[row][column];
        }
        // Rotate right
        else if (column == matrixSize - 1 - layer && row < matrixSize - 1 - layer) {
          rotatedMatrix[row + 1][column] = originMatrix[row][column];
        }
      }
    }
  }
  // check if there is a middle element, and if so assign it to unmoved to the rotated matrix
  let middleElement;
  if (matrixSize % 2 != 0) {
    middleElement = layersToRotate;
  }

  if (middleElement != undefined) {
    rotatedMatrix[middleElement][middleElement] =
      originMatrix[middleElement][middleElement];
  }
}

function rotateMatrixNTimes(rotateCount) {
  if (rotateCount === "") {
    rotateCount = 1;
  }
  for (let i = 0; i < rotateCount; i++) {
    if (i > 0) {
      originMatrix = rotatedMatrix;
    }

    rotateMatrix();
  }
}
// 6. write function to display resultMatrix

function displayResultMatrix() {
  generateGrid(resultMatrixGrid, createResultMatrixItem);
  generateGridContent(resultMatrixGrid);

  if (resultMatrixContainer.classList.contains("hidden")) {
    resultMatrixContainer.classList.replace("hidden","visible");
  }
}

// 7.create and display presets

function createAndDisplayPresets(matrixDimension, matrixContent) {
  generateGrid(originMatrixGrid, createOriginMatrixItem, matrixDimension);
  generateGridContent(originMatrixGrid, (matrixContent === "number"), (matrixContent === "letter"));
  initializeOriginMatrix();
  rotateMatrixNTimes(1);
  displayResultMatrix();
}
