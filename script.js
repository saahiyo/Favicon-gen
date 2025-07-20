// --- State ---
let currentMode = "text";
let uploadedImage = null;

// --- DOM Elements ---
const dynamicFavicon = document.getElementById("dynamic-favicon");
const charInput = document.getElementById("charInput");
const bgColorInput = document.getElementById("bgColor");
const textColorInput = document.getElementById("textColor");
const borderRadiusInput = document.getElementById("borderRadius");
const borderRadiusValue = document.getElementById("borderRadiusValue");
const bgColorPreview = document.getElementById("bgColorPreview");
const textColorPreview = document.getElementById("textColorPreview");
const downloadBtn = document.getElementById("downloadBtn");
const downloadLinksContainer = document.getElementById("downloadLinks");
const textModeBtn = document.getElementById("textModeBtn");
const imageModeBtn = document.getElementById("imageModeBtn");
const textInputSection = document.getElementById("textInputSection");
const imageInputSection = document.getElementById("imageInputSection");
const textColorSection = document.getElementById("textColorSection");
const imageUpload = document.getElementById("imageUpload");
const imageUploadText = document.getElementById("imageUploadText");
const imagePreview = document.getElementById("imagePreview");
const preview16 = document.getElementById("preview16");
const preview32 = document.getElementById("preview32");
const preview48 = document.getElementById("preview48");
const preview256 = document.getElementById("preview256");
const mainCanvas = document.getElementById("canvas");
const themeToggle = document.getElementById("theme-toggle");
const lightIcon = document.getElementById("theme-icon-light");
const darkIcon = document.getElementById("theme-icon-dark");

// --- Theme Toggle ---
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    lightIcon.classList.add("hidden");
    darkIcon.classList.remove("hidden");
  } else {
    document.documentElement.classList.remove("dark");
    lightIcon.classList.remove("hidden");
    darkIcon.classList.add("hidden");
  }
}

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  const newTheme = isDark ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
});

// --- Live Favicon Update ---
function updateLiveFavicon() {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 32;
  tempCanvas.height = 32;
  drawOnCanvas(
    tempCanvas,
    bgColorInput.value,
    currentMode === "text"
      ? { mode: "text", char: charInput.value, textColor: textColorInput.value }
      : uploadedImage
      ? { mode: "image", image: uploadedImage }
      : { mode: "text", char: "", textColor: "#000000" }
  );
  dynamicFavicon.href = tempCanvas.toDataURL("image/png");
}

// --- Core Drawing Function ---
function drawFavicon() {
  const bgColor = bgColorInput.value;
  bgColorPreview.style.backgroundColor = bgColor;
  if (currentMode === "text") {
    const char = charInput.value;
    const textColor = textColorInput.value;
    textColorPreview.style.backgroundColor = textColor;
    drawOnCanvas(mainCanvas, bgColor, { mode: "text", char, textColor });
  } else if (currentMode === "image" && uploadedImage) {
    drawOnCanvas(mainCanvas, bgColor, { mode: "image", image: uploadedImage });
  } else {
    drawOnCanvas(mainCanvas, bgColor, {
      mode: "text",
      char: "",
      textColor: "#000000",
    });
  }
  copyToPreview(mainCanvas, preview256);
  copyToPreview(mainCanvas, preview48);
  copyToPreview(mainCanvas, preview32);
  copyToPreview(mainCanvas, preview16);
  updateLiveFavicon(); // Update live favicon in real-time
}

function drawOnCanvas(canvas, bgColor, content) {
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const radiusPercent = parseInt(borderRadiusInput.value, 10);
  const radius = size * (radiusPercent / 100);
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.arcTo(size, 0, size, size, radius);
  ctx.arcTo(size, size, 0, size, radius);
  ctx.arcTo(0, size, 0, 0, radius);
  ctx.arcTo(0, 0, size, 0, radius);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);
  if (content.mode === "text") {
    ctx.fillStyle = content.textColor;
    const fontSize = size * (content.char.length > 1 ? 0.8 : 0.7);
    ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(content.char, size / 2, size / 2);
  } else if (content.mode === "image" && content.image) {
    const hRatio = size / content.image.width;
    const vRatio = size / content.image.height;
    const ratio = Math.max(hRatio, vRatio);
    const newWidth = content.image.width * ratio;
    const newHeight = content.image.height * ratio;
    const centerShift_x = (size - newWidth) / 2;
    const centerShift_y = (size - newHeight) / 2;
    ctx.drawImage(
      content.image,
      0,
      0,
      content.image.width,
      content.image.height,
      centerShift_x,
      centerShift_y,
      newWidth,
      newHeight
    );
  }
  ctx.restore();
}

function copyToPreview(sourceCanvas, destCanvas) {
  const destCtx = destCanvas.getContext("2d");
  destCtx.imageSmoothingEnabled = false;
  destCtx.clearRect(0, 0, destCanvas.width, destCanvas.height);
  destCtx.drawImage(sourceCanvas, 0, 0, destCanvas.width, destCanvas.height);
}

function setMode(mode) {
  currentMode = mode;
  textModeBtn.classList.toggle("active", mode === "text");
  imageModeBtn.classList.toggle("active", mode === "image");
  textInputSection.classList.toggle("hidden", mode !== "text");
  imageInputSection.classList.toggle("hidden", mode !== "image");
  textColorSection.classList.toggle("hidden", mode !== "text");
  drawFavicon();
}

// --- Event Listeners ---
textModeBtn.addEventListener("click", () => setMode("text"));
imageModeBtn.addEventListener("click", () => setMode("image"));
[charInput, bgColorInput, textColorInput].forEach((el) =>
  el.addEventListener("input", drawFavicon)
);
borderRadiusInput.addEventListener("input", () => {
  borderRadiusValue.textContent = borderRadiusInput.value;
  drawFavicon();
});
imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        uploadedImage = img;
        imagePreview.src = event.target.result;
        imagePreview.classList.remove("hidden");
        imageUploadText.classList.add("hidden");
        drawFavicon();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});
downloadBtn.addEventListener("click", () => {
  downloadLinksContainer.innerHTML = "";
  const sizes = [16, 32, 48, 128, 180, 192, 512];
  const tempCanvas = document.createElement("canvas");
  const fragment = document.createDocumentFragment();
  sizes.forEach((size) => {
    tempCanvas.width = size;
    tempCanvas.height = size;
    if (currentMode === "text") {
      drawOnCanvas(tempCanvas, bgColorInput.value, {
        mode: "text",
        char: charInput.value,
        textColor: textColorInput.value,
      });
    } else if (currentMode === "image" && uploadedImage) {
      drawOnCanvas(tempCanvas, bgColorInput.value, {
        mode: "image",
        image: uploadedImage,
      });
    }
    const dataUrl = tempCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `favicon-${size}x${size}.png`;
    link.textContent = `Download ${size}x${size}`;
    link.className =
      "secondary-button inline-block text-sm py-1 px-3 rounded-full mr-2 mb-2 transition";
    fragment.appendChild(link);
  });
  downloadLinksContainer.appendChild(fragment);
  const instructions = document.createElement("p");
  instructions.className = "text-xs mt-4 text-left max-w-xs mx-auto text-muted";
  instructions.innerHTML = `<strong>How to use:</strong><br>1. Download your desired sizes.<br>2. Rename the 32x32 (or 16x16) version to <strong>favicon.ico</strong> and upload it to your website's root directory.<br>3. Add this code to the <code>&lt;head&gt;</code> section of your HTML: <br><code>&lt;link rel="icon" href="/favicon.ico" sizes="any"&gt;</code><br><code>&lt;link rel="apple-touch-icon" href="/favicon-180x180.png"&gt;</code>`;
  downloadLinksContainer.appendChild(instructions);
});

// --- Initial Load ---
window.onload = () => {
  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  applyTheme(savedTheme);
  borderRadiusValue.textContent = borderRadiusInput.value;
  setMode("text");
};
