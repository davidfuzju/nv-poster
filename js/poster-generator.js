jQuery(document).ready(function ($) {
  // Append the overlay and close button to the body
  $("body").append(`
        <div id="poster-overlay">
            <img id="poster-preview" src="" alt="Poster Preview">
            <span id="close-overlay">&times;</span> <!-- Close button -->
        </div>
    `);

  // Find the element <p class="stock in-stock"> and insert the button after it
  var stockElement = $("form.cart");

  // Check if the element exists, then insert the button after it
  if (stockElement.length) {
    stockElement.after(
      '<button id="generate-poster" class="generate_poster_button button alt">Generate Poster</button>'
    );
  }

  $("#generate-poster").on("click", function () {
    // Set the width of the poster to 375px and reserve space for the QR code
    var posterContent = `
            <div id="poster" style="width: 375px; background-color: black; text-align: center; padding-top: 20px; padding-bottom: 20px; position: relative; color: white; font-family: 'Roboto', '微软雅黑', sans-serif;">
                <div id="poster-content" style="margin-bottom: 10px; position: relative;">
                    <!-- Adding the glow effect behind the product image, centered and with a fixed width of 300px -->
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 60%, rgba(0,0,0,0) 100%); border-radius: 50%; z-index: 0;"></div>
                    <!-- Product image with a fixed width of 300px -->
                    <img id="product-image" src="${productData.image}" style="width: calc(375px - 95px); height: auto; margin: 0 auto; position: relative; z-index: 1;">
                </div>
                <!-- Ensure the product name container is centered, does not overlap with the QR code, and can display up to two lines -->
                <div id="product-name" style="font-size: 20px; margin: 0 auto; width: calc(375px - 135px); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.5em;">
                    ${productData.name}
                </div>
                <!-- Adjusted the QR code padding to 10px from bottom and right, and set its size to 50x50 -->
                <div id="qrcode" style="position: absolute; bottom: 10px; right: 10px;"></div>
            </div>
        `;

    // Append the poster content to body and generate the QR code with adjusted size (50x50)
    $("body").append(posterContent);
    $("#qrcode").qrcode({
      width: 50,
      height: 50,
      text: productData.referral_url,
    });

    // Generate the current timestamp in 'YYYYMMDD-HHmmss' format
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Ensure two digits for month
    var day = ("0" + currentDate.getDate()).slice(-2); // Ensure two digits for day
    var hours = ("0" + currentDate.getHours()).slice(-2);
    var minutes = ("0" + currentDate.getMinutes()).slice(-2);
    var seconds = ("0" + currentDate.getSeconds()).slice(-2);

    // Construct the file name with user name, product name, and timestamp
    var fileName = `${productData.user_name}-${productData.name}-${year}${month}${day}${hours}${minutes}${seconds}.png`;

    // Use html2canvas to capture the poster with scale=3 and a fixed width of 375px
    html2canvas(document.querySelector("#poster"), {}).then((canvas) => {
      var imgData = canvas.toDataURL("image/png");
      $("#poster-preview").attr("src", imgData); // Set the generated image in the overlay
      $("#poster-overlay").css("display", "flex"); // Show the overlay
      $("body").css("overflow", "hidden"); // Disable scrolling on the body

      // Remove the poster content after generating the image
      $("#poster").remove();
    });
  });

  // Close the overlay when the close button is clicked
  $("#close-overlay").on("click", function () {
    $("#poster-overlay").css("display", "none"); // Hide the overlay
    $("body").css("overflow", "auto"); // Enable scrolling again
  });
});
