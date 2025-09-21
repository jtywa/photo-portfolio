// netlify/functions/getPhotos.js
export async function handler(event, context) {
	const repoOwner = "jtywa";
	const repoName = "photo-portfolio";
	const branch = "main"; // change to master if that's your default
	const token = process.env.GITHUB_TOKEN;

	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/data/photos.json?ref=${branch}`;

	const res = await fetch(url, {
		headers: { Authorization: `token ${token}` },
	});

	if (!res.ok) {
		return { statusCode: res.status, body: await res.text() };
	}

	const fileData = await res.json();
	const jsonContent = Buffer.from(fileData.content, "base64").toString();

	return {
		statusCode: 200,
		body: jsonContent,
		headers: { "Content-Type": "application/json" },
	};
}
