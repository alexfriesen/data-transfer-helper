import { dotFileFilter, parseFilesFromEvent } from "../src/index";

const droppedFiles: File[] = [];

// @ts-ignore
const fileSizeFormat = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "byte",
});

document.addEventListener("dragover", function (event) {
  event.preventDefault();
  event.stopPropagation();
});
document.addEventListener("dragleave", function (event) {
  event.preventDefault();
  event.stopPropagation();
});

document.addEventListener("drop", async function (event) {
  event.preventDefault();
  event.stopPropagation();

  console.time("parseFilesFromEvent");
  const files = await parseFilesFromEvent(event, {
    addDirectoryName: true,
    filters: [
      dotFileFilter,
    ]
  });
  console.timeEnd("parseFilesFromEvent");
  droppedFiles.push(...files);

  renderFiles();
});

const filesSection = document.getElementById("files");
function renderFiles() {
  if (filesSection) {
    filesSection.innerHTML = "";
  }

  for (const file of droppedFiles) {
    filesSection?.appendChild(createFileDiv(file));
  }
}

function createFileDiv(file: File) {
  const div = document.createElement("div");

  const nameElement = document.createElement("div");
  nameElement.textContent = `Name: ${file.name}`;

  div.appendChild(nameElement);

  const sizeElement = document.createElement("div");
  sizeElement.textContent = `Size: ${fileSizeFormat.format(file.size)}`;

  div.appendChild(sizeElement);

  const typeElement = document.createElement("div");
  typeElement.textContent = `Type: ${file.type}`;

  div.appendChild(typeElement);

  return div;
}
