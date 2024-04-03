document.addEventListener("DOMContentLoaded", () => {
	// Get image list container
    const imageList = document.querySelector('.image-list');

    // Fetch image files from the "images" folder
    /*fetch('images/')
        .then(response => response.text())
        .then(data => {
            // Extract image file names from the response HTML
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(data, 'text/html');
            const imageLinks = Array.from(htmlDocument.querySelectorAll('a')).map(a => a.getAttribute('href'));
            const imageFiles = imageLinks.filter(link => link.endsWith('.jpg') || link.endsWith('.jpeg') || link.endsWith('.png') || link.endsWith('.gif'));

            // Add images to the image list
            imageFiles.forEach(imageFile => {
                const img = document.createElement('img');
                img.src = imageFile;
                img.style.maxWidth = '100px'; // Set maximum width for images
                img.style.maxHeight = '100px'; // Set maximum height for images
                imageList.appendChild(img);

                img.addEventListener('dragstart', (event) => {
                    event.dataTransfer.setData('text/plain', event.target.src); // Set image URL as data to transfer
                });
            });
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });*/

    // Variable to store the reference to the last dropped tier
    let lastDroppedTier = {};

    // Get all tier containers
    const tiers = document.querySelectorAll('.tier');

    // Add event listeners to each tier container
    tiers.forEach(tier => {
        tier.addEventListener('dragover', (event) => {
            event.preventDefault(); // Prevent default behavior to allow drop
        });

        tier.addEventListener('drop', (event) => {
            event.preventDefault(); // Prevent default behavior
            const imageUrl = event.dataTransfer.getData('text/plain'); // Get image URL from data transfer

            // Remove the image from the last dropped tier if exists
			if (lastDroppedTier[imageUrl] == tier)
				return;

            if (lastDroppedTier[imageUrl]) {
                removeImageFromTier(lastDroppedTier[imageUrl], imageUrl);
            }

            // Add dropped image to the tier
            addImageToTier(tier.getAttribute('data-tier'), imageUrl);

			const imageList = document.querySelector('.image-list');
            const imagesInList = imageList.querySelectorAll('img');
            const imageToRemove = [...imagesInList].find(img => img.src === imageUrl);
            if (imageToRemove) {
                imageToRemove.parentNode.removeChild(imageToRemove);
            }

            // Update the last dropped tiers
            lastDroppedTier[imageUrl] = tier;
        });
    });
    
    imageList.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.src); // Set image URL as data to transfer
        });
    });

    /*const imagesdata = []
    fetch('images/')
        .then(response => response.text())
        .then(data => {
            // Extract image file names from the response HTML
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(data, 'text/html');
            const imageLinks = Array.from(htmlDocument.querySelectorAll('a')).map(a => a.getAttribute('href'));
            const imageFiles = imageLinks.filter(link => link.endsWith('.jpg') || link.endsWith('.jpeg') || link.endsWith('.png') || link.endsWith('.gif'));

            // Add images to the image list
            imageFiles.forEach(imageFile => {
                console.log(`added ${imageFile}`)
                imagesdata.push(`<img src=./${imageFile}>`)
            });
        })
        .then(() => {
            console.log(`finished`)
            console.log(imagesdata.join("\n"))
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });*/
});

function adjustContainerHeight(tier) {
	const imageContainer = document.getElementById(`${tier}Images`);
	const images = imageContainer.querySelectorAll('img');

	// Wait for all images to load
	Promise.all(Array.from(images).map(img => new Promise(resolve => {
		if (img.complete) {
		resolve();
		} else {
		img.onload = resolve;
		}
	}))).then(() => {
		// All images have loaded, now calculate the maximum height
		let maxHeight = 0;
		images.forEach(img => {
		const imgHeight = img.offsetHeight;
		if (imgHeight > maxHeight) {
			maxHeight = imgHeight;
		}
		});

		// Calculate the number of rows and adjust the height accordingly
		const numRows = Math.ceil(images.length / 4); // Assuming 3 images per row
		const newHeight = (numRows * maxHeight) + 15; // Calculate the new height
		const tierBackground = document.querySelector(`.${tier} .letter-background`);
		const letterBackground = document.querySelector(`.${tier} .background-square`);
		letterBackground.style.height = `${newHeight + 10}px`; // Set the new height for the black rectangle
		tierBackground.style.height = `${newHeight}px`; // Set the new height for the black rectangle
	});
}
  
function removeImageFromTier(tier, imageUrl) {
    const imageContainer = document.getElementById(`${tier.getAttribute('data-tier')}Images`);
    if (!imageContainer) return; // Check if the container exists

    const imageToRemove = imageContainer.querySelector(`img[src="${imageUrl}"]`);
    if (imageToRemove) {
        imageToRemove.parentNode.removeChild(imageToRemove);
        adjustContainerHeight(tier.getAttribute('data-tier'));
    }
}

function addImageToTier(tier, imageUrl) {
	const imageContainer = document.getElementById(`${tier}Images`);
	const img = document.createElement('img');
	img.src = imageUrl;
	img.style.maxWidth = '100px'; // Set maximum width for images
	img.style.maxHeight = '100px'; // Set maximum height for images
	imageContainer.appendChild(img);
	adjustContainerHeight(tier);
}

adjustContainerHeight("s")
adjustContainerHeight("a")
adjustContainerHeight("b")
adjustContainerHeight("c")
adjustContainerHeight("d")
adjustContainerHeight("f")