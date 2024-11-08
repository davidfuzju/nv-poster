jQuery(document).ready(function ($) {
  // Append the overlay and close button to the body
  $("body").append(`
        <div id="poster-overlay">
            <img id="poster-preview" src="" alt="Poster Preview">
            <span id="close-overlay">&times;</span> <!-- Close button -->
        </div>
    `);

  // Set the click event for the close button to remove the overlay and preview image
  $("#nv-poster-generate-button").on("click", function () {
    nv_generatePosterAndPopup(); // Call your function when the button is clicked
  });

  // Function to generate the poster and display it in the overlay
  function nv_generatePosterAndPopup() {
    // Create an iframe to isolate the poster content
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.border = "none";
    iframe.style.width = "375px"; // Set a fixed width for the poster
    iframe.style.height = "auto"; // Allow height to adjust based on content
    iframe.style.visibility = "hidden"; // Hide the iframe to avoid visual impact
    document.body.appendChild(iframe); // Append iframe to body

    iframe.onload = function () {
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;

      // Add the poster content inside the iframe
      iframeDocument.body.innerHTML = `
      <div id="poster" style="width: 375px; background-color: black; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; padding: 20px 37.5px; margin: 0; color: white; font-family: 'Roboto', '微软雅黑', sans-serif; position: relative; box-sizing: border-box;">
        <!-- poster-content with dynamic height based on its internal image -->
        <div id="poster-content" style="width: 300px; position: relative;">
          <!-- Adding the glow effect behind the product image, centered and with a fixed width of 300px -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 60%, rgba(0,0,0,0) 100%); border-radius: 50%; z-index: 0;"></div>
          <!-- Product image with a fixed width of 300px -->
          <img id="product-image" src="${productData.image}" style="width: 300px; height: auto; min-width: 300px; min-height: 300px; z-index: 1; position: relative;">
        </div>
        <!-- product-name with fixed height and width, centered and aligned at the bottom -->
        <div id="product-name" style="height: 100px; font-size: 16px; margin-top: 0px; width: calc(375px - 145px); display: flex; align-items: center; justify-content: flex-start; text-align: left; line-height: 1.5em; overflow: hidden; text-overflow: ellipsis;">
          ${productData.name}
        </div>
        <!-- QR code with padding and 70x70 size, aligned at the bottom-right -->
        <div id="qrcode" style="position: absolute; bottom: 10px; right: 10px; border: 2px solid white; width: 104px; height: 104px; box-sizing: border-box;"></div>
      </div>
        `;

      // Generate the QR code inside the iframe
      $(iframeDocument).find("#qrcode").qrcode({
        width: 100,
        height: 100,
        text: productData.referral_url,
      });

      const posterElement = iframeDocument.getElementById("poster");
      // Use html2canvas to capture the poster with scale=3 and a fixed width of 375px
      html2canvas(posterElement, {
        backgroundColor: "#000000", // Set background color to black to avoid transparency
      })
        .then((canvas) => {
          var imgData = canvas.toDataURL("image/png");
          $("#poster-preview").attr("src", imgData); // Set the generated image in the overlay
          $("#poster-overlay").css("display", "flex"); // Show the overlay
          $("body").css("overflow", "hidden"); // Disable scrolling on the body

          // Remove the poster content after generating the image
          iframe.remove();
        })
        .catch((e) => {
          console.error("Failed to generate poster:", e);

          // Remove the poster content after generating the image
          iframe.remove();
        });
    };

    // Set the iframe source to an empty document
    iframe.src = "about:blank";
  }

  // Close the overlay when the close button is clicked
  $("#close-overlay").on("click", function () {
    $("#poster-overlay").css("display", "none"); // Hide the overlay
    $("body").css("overflow", "auto"); // Enable scrolling again
  });
});
