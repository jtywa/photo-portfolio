const repoOwner = "jtywa";
const repoName = "photo-portfolio";
const branch = "main";

const jsonUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/data/photos.json`;

fetch(jsonUrl)
	.then((res) => res.json())
	.then((photos) => {
		const gallery = document.getElementById("gallery");

		// Group photos by category
		const grouped = photos.reduce((acc, photo) => {
			(acc[photo.category] = acc[photo.category] || []).push(photo);
			return acc;
		}, {});

		// Render each category section
		for (const category in grouped) {
			const section = document.createElement("section");
			section.className = "gallery-section";

			// Category title
			const heading = document.createElement("h2");
			heading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
			section.appendChild(heading);

			// Images
			const container = document.createElement("div");
			container.className = "gallery-grid";

			grouped[category].forEach((photo) => {
				const img = document.createElement("img");
				img.src = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${photo.url}`;
				img.alt = category;
				img.className = "photo";
				container.appendChild(img);
			});

			section.appendChild(container);
			gallery.appendChild(section);
		}
	});
