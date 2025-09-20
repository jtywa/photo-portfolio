const repoOwner = "jtywa";
const repoName = "photo-portfolio";
const branch = "main";

const jsonUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/data/photos.json`;

fetch(jsonUrl)
	.then((res) => res.json())
	.then((photos) => {
		const gallery = document.getElementById("gallery");
		photos.forEach((photo) => {
			const div = document.createElement("div");
			div.className = "photo";
			div.innerHTML = `
        <img src="https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${photo.url}" alt="${photo.title}">
        <p>${photo.title}</p>
      `;
			gallery.appendChild(div);
		});
	});
