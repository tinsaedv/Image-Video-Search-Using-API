//get the html elements with selectors
const container = document.querySelector(".container");
const search = document.querySelector(`#search_bar`);
const searchDiv = document.querySelector(`.search`);
const images = document.querySelectorAll(`.image1`);
const downloadLinks = document.getElementsByTagName(`a`);

// this function shows the image after the pic finishes loading
function displayImage() {
  const images = document.querySelectorAll(`img`);
  images.forEach((image) => {
    image.style.display = "none";
  });

  const cards = document.querySelectorAll(".cards_descripion");
  cards.forEach((card) => {
    card.style.display = "block";
  });
}
// this function hides the image until the pic finishes loading
function hideImage() {
  const images = document.querySelectorAll(`img`);
  images.forEach((image) => {
    image.style.display = "block";
  });
  const cards = document.querySelectorAll(".card_load_extreme_descripion");
  cards.forEach((card) => {
    card.style.display = "none";
  });
}

window.onload = function () {
  displayImage();
};

window.addEventListener("DOMContentLoaded", () => {
  // this is the function that will be called when the user presses enter in the search bar
  search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (search.value !== "") {
        createImages(20);
        container.innerHTML = "";
        searchDiv.classList.add("slider");
        container.classList.add("show");
      } else {
        container.classList.remove("show");
        searchDiv.classList.remove("slider");
      }
    }
  });

  window.addEventListener("scroll", function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      createImages(20);
    }
  });

  // This function fetches images from the Pexels API based on a given page size and page number
  async function fetchImages(pageSize, page) {
    try {
      // API key for authorization purposes
      const apiKey = "h2GJPiMjw5uymsoNtcmBCDvVGksedNJ8aTvuyLkRtjMotcT8BWfqk7pb";
      // Call the Pexels API using the provided URL and headers, with the given page size and page number
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${search.value}&per_page=${pageSize}&page=${page}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      // If the response from the API is not okay, throw an error
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Convert the response data to JSON
      const data = await response.json();
      // Map over the photos in the response data and return an array of medium-sized image URLs
      console.log(data.photos);
      // Return the array of medium-sized image URLs
      return data.photos;
    } catch (error) {
      // Log any errors that occur and re-throw them
      console.error(error);
      throw error;
    }
  }

  // This function creates a specified number of image elements within a container element
  async function createImages(numImagesToAdd) {
    hideImage();
    // Get the container element
    const container = document.querySelector(".container");
    // Determine which page of images to fetch based on how many images are currently displayed in the container
    const page = Math.ceil(container.children.length / numImagesToAdd) + 1;
    // Fetch the specified number of images for the current page
    const imgSrcArr = await fetchImages(numImagesToAdd, page);

    // Log the retrieved image URLs
    console.log(imgSrcArr);
    // If there is no valid data returned or it is not an array, log an error and exit the function
    if (!imgSrcArr || !Array.isArray(imgSrcArr)) {
      console.error("Invalid image data");
      return;
    }
    // Add each image to the container element
    imgSrcArr.forEach((imgSrc) => {
      // Create a container div for the image
      const imgContainer = document.createElement("div");
      imgContainer.classList.add("img-container");
      // Create a new Image element with the retrieved URL and set its alt text
      const img = new Image();
      img.src = imgSrc.src.medium;
      img.alt = "Image";
      //Create loader container
      const card = document.createElement("div");
      card.className = "card";
      const cardDescription = document.createElement("div");
      cardDescription.className = "card_description";
      //Create an overlay container
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      const p = document.createElement("p");
      p.textContent = "Photo by:";
      const h1 = document.createElement("h1");
      h1.textContent = imgSrc.photographer || "Unknown";
      h1.className = "photographer";
      const aLink = document.createElement("a");
      aLink.href = imgSrc.src.original;
      aLink.download = "";
      aLink.target = "_blank";
      const linkBtn = document.createElement("button");
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-download";
      aLink.appendChild(linkBtn);
      linkBtn.appendChild(icon);

      // Once the image is loaded, append it to the container element
      img.addEventListener("load", () => {
        container.appendChild(imgContainer);
      });

      // Append the image element to the container element
      imgContainer.appendChild(card);
      imgContainer.appendChild(img);
      imgContainer.appendChild(overlay);
      card.appendChild(cardDescription);
      overlay.appendChild(p);
      overlay.appendChild(h1);
      overlay.appendChild(aLink);
    });
  }
});
