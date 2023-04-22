//get the html elements with selectors
const container = document.querySelector(".container");
const search = document.querySelector(`#search_bar`);
const searchDiv = document.querySelector(`.search`);
const images = document.querySelectorAll(`.image1`);
const downloadLinks = document.getElementsByTagName(`a`);
const select = document.querySelector(`select`);

// this function shows the image after the pic finishes loading
function hideImage() {
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
function displayImage() {
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
  hideImage();
};
window.addEventListener("DOMContentLoaded", () => {
  select.addEventListener("change", () => {
    console.log("Select element was changed");
    let selectedOption = select.value;
    if (selectedOption === "images") {
      container.innerHTML = "";
      createImages(6);
    } else if (selectedOption === "videos") {
      createVideos(6);
      container.innerHTML = "";
    }
  });

  search.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      if (search.value !== "") {
        container.innerHTML = "";
        let selectedOption = select.value;
        if (selectedOption === "videos") {
          createVideos(6);
        } else if (selectedOption === "images") {
          createImages(6);
        }
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
      let selectedOption = select.value;
      if (selectedOption === "videos") {
        createVideos(6);
      } else if (selectedOption === "images") {
        createImages(6);
      }
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
      // return the data to the other function
      return data.photos;
    } catch (error) {
      // Log any errors that occur and re-throw them
      console.error(error);
      throw error;
    }
  }

  // This function creates a specified number of image elements within a container element
  async function createImages(numImagesToAdd) {
    displayImage();
    // Get the container element
    const container = document.querySelector(".container");
    // Determine which page of images to fetch based on how many images are currently displayed in the container
    const page = Math.ceil(container.children.length / numImagesToAdd) + 1;
    // Fetch the specified number of images for the current page
    const imgSrcArr = await fetchImages(numImagesToAdd, page);

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

  /*******************  Video Part ****************/

  // This function fetches videos from the Pexels API based on a given page size and page number
  async function fetchVideos(pageSize, page) {
    try {
      // API key for authorization purposes
      const apiKey = "h2GJPiMjw5uymsoNtcmBCDvVGksedNJ8aTvuyLkRtjMotcT8BWfqk7pb";
      // Call the Pexels API using the provided URL and headers, with the given page size and page number
      const response = await fetch(
        `https://api.pexels.com/videos/search?query=${search.value}&per_page=${pageSize}&page=${page}`,
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
      // return the data to the other function
      console.log(data.videos);
      return data.videos;
    } catch (error) {
      // Log any errors that occur and re-throw them
      console.error(error);
      throw error;
    }
  }

  // This function creates a specified number of image elements within a container element
  async function createVideos(numVideosToAdd) {
    displayImage();
    console.log("createVideos function executing...");
    // hideImage();
    // Get the container element
    const container = document.querySelector(".container");
    // Determine which page of images to fetch based on how many images are currently displayed in the container
    const page = Math.ceil(container.children.length / numVideosToAdd) + 1;
    // Fetch the specified number of images for the current page
    const vidSrcArr = await fetchVideos(numVideosToAdd, page);
    console.log("vidSrcArr:", vidSrcArr);
    // If there is no valid data returned or it is not an array, log an error and exit the function
    if (!vidSrcArr || !Array.isArray(vidSrcArr)) {
      console.error("Invalid Video data");
      return;
    }
    // Add each image to the container element
    vidSrcArr.forEach((vidSrc) => {
      console.log("adding video to container:", vidSrc);
      // Create a container div for the image
      const vidContainer = document.createElement("div");
      vidContainer.classList.add("vid-container");
      // Create a new Image element with the retrieved URL and set its alt text
      const vid = document.createElement("video");
      vid.controls = true;
      const vidData = vidSrc.video_files;
      vidData.forEach((video) => {
        const source = document.createElement("source");
        source.src = video.link;
        vid.appendChild(source);
      });

      //Create loader container
      const card = document.createElement("div");
      card.className = "card";
      const cardDescription = document.createElement("div");
      cardDescription.className = "card_description";
      //Create an overlay container
      const overlay = document.createElement("div");
      overlay.className = "vid_overlay";
      const p = document.createElement("p");
      p.textContent = "Video by:";
      const h1 = document.createElement("h1");
      h1.textContent = vidSrc.user.name;
      h1.className = "photographer";
      // Once the image is loaded, append it to the container element
      vid.addEventListener("loadeddata", () => {
        console.log("before added");
        container.appendChild(vidContainer);
        console.log("added vidContainer to container");
      });

      // Append the image element to the container element
      vidContainer.appendChild(card);
      vidContainer.appendChild(vid);
      vidContainer.appendChild(overlay);
      card.appendChild(cardDescription);
      overlay.appendChild(p);
      overlay.appendChild(h1);
    });
  }
});
