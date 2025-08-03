// import OpenAI from "openai";
// import 'dotenv/config'

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY, dangerouslyAllowBrowser: true
// });

// document.getElementById('imageInput').addEventListener('change', function () {
//     const input = document.getElementById('imageInput');
//     const file = input.files[0];
//     const reader = new FileReader();

//     reader.onload = function (e) {
//         const imagePreview = document.getElementById('imagePreview');
//         imagePreview.src = e.target.result;
//         imagePreview.style.display = 'block';
//     };

//     reader.readAsDataURL(file);
// });

// document.getElementById('uploadButton').addEventListener('click', async () => {
//     const input = document.getElementById('imageInput');
//     const loadingSpinner = document.getElementById('loadingSpinner');
//     const colorResultDiv = document.getElementById('colorResult');

//     if (input.files && input.files[0]) {
//         const file = input.files[0];
//         const reader = new FileReader();
//         reader.onload = async function (e) {
//             const imageData = e.target.result;

//             // Show loading spinner
//             loadingSpinner.style.display = 'block';
//             colorResultDiv.innerHTML = '';

//             // Send image data to OpenAI API
//             const response = await openai.chat.completions.create({
//                 model: "gpt-4o",
//                 messages: [
//                     {
//                         role: "user",
//                         content: [
//                             {
//                                 type: "text",
//                                 text: "Please extract the colors from this image, and give me the names, RGB, and hex codes of them. Please return in JSON format."
//                             },
//                             {
//                                 type: "image_url",
//                                 image_url: {
//                                     url: imageData,
//                                 },
//                             }
//                         ],
//                     },
//                 ],
//                 response_format: {
//                     type: "json_object"
//                 },
//                 temperature: 1,
//                 max_completion_tokens: 2048,
//                 top_p: 1,
//                 frequency_penalty: 0,
//                 presence_penalty: 0
//             });

//             const result = JSON.parse(response.choices[0].message.content);
//             loadingSpinner.style.display = 'none';

//             result.colors.forEach(color => {
//                 const colorItem = document.createElement('div');
//                 colorItem.className = 'color-item';

//                 const colorSquare = document.createElement('div');
//                 colorSquare.className = 'color-square';
//                 colorSquare.style.backgroundColor = color.hex;

//                 const colorText = document.createElement('span');
//                 colorText.innerText = `${color.name} (RGB: ${color.rgb}, HEX: ${color.hex})`;

//                 colorItem.appendChild(colorSquare);
//                 colorItem.appendChild(colorText);
//                 colorResultDiv.appendChild(colorItem);
//             });
//         };
//         reader.readAsDataURL(file);
//     }
// });
// Image preview handler
// Upload and process handler
document.getElementById("uploadButton").addEventListener("click", async () => {
  const input = document.getElementById("imageInput");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const colorResultDiv = document.getElementById("colorResult");
  const uploadButton = document.getElementById("uploadButton");

  if (!input.files || !input.files[0]) {
    alert("Please select an image first");
    return;
  }

  const file = input.files[0];
  const formData = new FormData();
  formData.append("file", file);

  // Disable button and show loading state
  uploadButton.disabled = true;
  loadingSpinner.style.display = "block";
  colorResultDiv.innerHTML =
    '<div class="processing-message">Analyzing image colors...</div>';

  try {
    const response = await fetch(
      "https://sorapalette-back.haithamamireh.com/process-image/",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Raw API response:", result); // Let's see what we're getting

    colorResultDiv.innerHTML = "";

    // Parse the result - it might be a string that needs to be parsed
    let colorData;
    try {
      colorData = typeof result === "string" ? JSON.parse(result) : result;
    } catch (e) {
      colorData = result;
    }

    if (
      !colorData.colors ||
      !Array.isArray(colorData.colors) ||
      colorData.colors.length === 0
    ) {
      throw new Error("No colors detected in the image");
    }

    colorData.colors.forEach((color) => {
      const colorItem = document.createElement("div");
      colorItem.className = "color-item";

      const colorSquare = document.createElement("div");
      colorSquare.className = "color-square";
      colorSquare.style.backgroundColor = color.hex;

      const colorInfo = document.createElement("div");
      colorInfo.className = "color-info";
      colorInfo.innerHTML = `
                <div class="color-name">${color.name}</div>
                <div class="color-values">
                    <span class="rgb">RGB: ${color.rgb}</span>
                    <span class="hex">HEX: ${color.hex}</span>
                </div>
            `;

      colorItem.appendChild(colorSquare);
      colorItem.appendChild(colorInfo);
      colorResultDiv.appendChild(colorItem);
    });
  } catch (error) {
    colorResultDiv.innerHTML = `
            <div class="error-message">
                <p>Error: ${error.message}</p>
                <button onclick="location.reload()">Try Again</button>
            </div>
        `;
    console.error("Error:", error);
  } finally {
    loadingSpinner.style.display = "none";
    uploadButton.disabled = false;
  }
});
document.getElementById("imageInput").addEventListener("change", function () {
  const input = document.getElementById("imageInput");
  const imagePreview = document.getElementById("imagePreview");
  const file = input.files[0];

  // Clear preview if no file selected
  if (!file) {
    imagePreview.style.display = "none";
    imagePreview.src = "";
    return;
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file");
    input.value = ""; // Clear the input
    imagePreview.style.display = "none";
    imagePreview.src = "";
    return;
  }

  // Size validation (optional, adjust max size as needed)
  const maxSize = 100 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    alert("Please select an image smaller than 5MB");
    input.value = "";
    imagePreview.style.display = "none";
    imagePreview.src = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    imagePreview.src = e.target.result;
    imagePreview.style.display = "block";

    // Optional: Ensure image loads correctly
    imagePreview.onload = function () {
      // Image loaded successfully
      imagePreview.style.display = "block";
    };

    imagePreview.onerror = function () {
      alert("Error loading image preview");
      imagePreview.style.display = "none";
      imagePreview.src = "";
      input.value = "";
    };
  };

  reader.onerror = function () {
    alert("Error reading file");
    imagePreview.style.display = "none";
    imagePreview.src = "";
    input.value = "";
  };

  reader.readAsDataURL(file);
});
