import React, { useState } from "react";

const ImageFilters = () => {
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log("yr", file);

    if (file && file.size > 200 * 1024) {
      alert("Image size should not be more than 100 KB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const dataURL = e.target.result;
      setImage(dataURL);
      setOriginalImage(dataURL);
    };

    reader.readAsDataURL(file);
  };

  const applyGrayscale = () => {
    if (originalImage) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = originalImage;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }

        ctx.putImageData(imageData, 0, 0);
        setImage(canvas.toDataURL());
      };
    }
  };

  const applySepia = () => {
    if (originalImage) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = originalImage;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const originalRed = data[i];
          const originalGreen = data[i + 1];
          const originalBlue = data[i + 2];

          const sepiaRed = Math.min(
            255,
            0.393 * originalRed + 0.769 * originalGreen + 0.189 * originalBlue
          );
          const sepiaGreen = Math.min(
            255,
            0.349 * originalRed + 0.686 * originalGreen + 0.168 * originalBlue
          );
          const sepiaBlue = Math.min(
            255,
            0.272 * originalRed + 0.534 * originalGreen + 0.131 * originalBlue
          );

          data[i] = sepiaRed;
          data[i + 1] = sepiaGreen;
          data[i + 2] = sepiaBlue;
        }

        ctx.putImageData(imageData, 0, 0);
        setImage(canvas.toDataURL());
      };
    }
  };

  const applyBlur = () => {
    if (originalImage) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = originalImage;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const blurRadius = 2; // Adjust the blur radius as needed

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            let red = 0;
            let green = 0;
            let blue = 0;
            let count = 0;

            for (let dy = -blurRadius; dy <= blurRadius; dy++) {
              for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                const pixelX = Math.min(canvas.width - 1, Math.max(0, x + dx));
                const pixelY = Math.min(canvas.height - 1, Math.max(0, y + dy));
                const pixelIndex = (pixelY * canvas.width + pixelX) * 4;

                red += data[pixelIndex];
                green += data[pixelIndex + 1];
                blue += data[pixelIndex + 2];
                count++;
              }
            }

            const currentIndex = (y * canvas.width + x) * 4;
            data[currentIndex] = red / count;
            data[currentIndex + 1] = green / count;
            data[currentIndex + 2] = blue / count;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setImage(canvas.toDataURL());
      };
    }
  };

  const resetImage = () => {
    setImage(originalImage);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "filtered_image.jpg";
    link.click();
  };

  return (
    <div>
      <h2> Go ahead and upload Image </h2>
      <input type="file" accept="image/jpeg" onChange={handleImageChange} />
      <br />
      {image && (
        <div>
          <button onClick={applyGrayscale}>Grayscale</button>
          <button onClick={applySepia}>Sepia</button>
          <button onClick={applyBlur}>Blur</button>
          <button onClick={resetImage}>Reset</button>
          <button onClick={downloadImage}>Download</button>
          <br />
          <img src={image} alt="Filtered" />
        </div>
      )}
    </div>
  );
};

export default ImageFilters;
