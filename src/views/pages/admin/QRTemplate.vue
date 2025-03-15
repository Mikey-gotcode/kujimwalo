<template>
  <div class="relative flex flex-col items-center p-4">
    <!-- QR Code -->
    <div 
      id="qr-print" 
      class="p-2 rounded-lg shadow-lg"
      :class="themeClass"
    >
      <QRCodeVue 
          :value="link"
          :size="size"
          :foreground="computedForegroundColor"
          :background="computedBackgroundColor"
          level="H"
          class="rounded-lg"
          ref="qrCodeRef"
      />

      <!-- Logo Overlay Inside Canvas -->
      <canvas ref="canvasRef" class="hidden"></canvas>
      <div 
        v-if="logo" 
        class="absolute flex items-center justify-center bg-white rounded-full"
        :style="logoStyle"
      >
        <img :src="logo" alt="Logo" class="object-contain" />
      </div>
    </div>

    <!-- Print Button -->
    <button 
      @click="printQRCode"
      class="mt-4 px-4 py-2 rounded-lg hover:bg-opacity-80"
      :class="buttonClass"
    >
      Print QR Code
    </button>
  </div>
</template>

<script setup>
import { computed, ref, inject, nextTick } from "vue";
import QRCodeVue from "qrcode.vue";

// Inject the theme (assumes it's provided from a parent component)
const theme = inject("theme", "light"); // Default to 'light' if no provider

// Define props
const props = defineProps({
link: { type: String, required: true },
size: { type: Number, default: 200 },
foregroundColor: { type: String, default: "#000000" },
backgroundColor: { type: String, default: "#ffffff" },
logo: { type: String, default: null },
logoSize: { type: Number, default: 40 },
required: true
});

// Compute theme-based styles
const computedBackgroundColor = computed(() => 
theme.value === "dark" ? "#1a1a1a" : props.backgroundColor
);

const computedForegroundColor = computed(() => 
theme.value === "dark" ? "#ffffff" : props.foregroundColor
);

const themeClass = computed(() => ({
"bg-white text-black": theme.value === "light",
"bg-gray-900 text-white": theme.value === "dark"
}));

const buttonClass = computed(() => ({
"bg-blue-600 text-white hover:bg-blue-700": theme.value === "light",
"bg-gray-700 text-gray-300 hover:bg-gray-800": theme.value === "dark"
}));

// Compute logo size and position
const logoStyle = computed(() => ({
width: `${props.logoSize}px`,
height: `${props.logoSize}px`,
left: `50%`,
top: `42%`,
transform: `translate(-50%, -50%)`
}));

// Refs for canvas and logo
const canvasRef = ref(null);
const logoRef = ref(null);
const logoLoaded = ref(false);

// Ensure logo has loaded before proceeding
const onLogoLoad = () => {
logoLoaded.value = true;
};

// Function to print QR code with the logo
const printQRCode = async () => {
await nextTick(); // Wait for DOM updates

const qrCanvas = document.querySelector("#qr-print canvas");
const logoImg = logoRef.value;

if (!qrCanvas) {
  alert("QR Code canvas not found.");
  return;
}

const canvas = canvasRef.value;
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = props.size;
canvas.height = props.size;

// Draw QR code on canvas
ctx.drawImage(qrCanvas, 0, 0);

// Draw logo if available and loaded
if (logoLoaded.value && logoImg) {
  const logoSize = props.logoSize;
  ctx.drawImage(logoImg, (props.size - logoSize) / 2, (props.size - logoSize) / 2, logoSize, logoSize);
}

// Convert canvas to image
const imgData = canvas.toDataURL("image/png");

// Open print window
const newWindow = window.open("", "_blank");
newWindow.document.write(`
    <html>
        <head>
            <title>Print QR Code</title>
            <style>
                body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                img { max-width: 100%; height: auto; }
            </style>
        </head>
        <body>
            <img src="${imgData}" />
        </body>
    </html>
`);
newWindow.document.close();

// Print after short delay
setTimeout(() => {
    newWindow.focus();
    newWindow.print();
    newWindow.close();
}, 1000);
};
</script>

<style>
@media print {
body * {
  visibility: hidden;
}
#qr-print, #qr-print * {
  visibility: visible;
}
#qr-print {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
}
</style>
