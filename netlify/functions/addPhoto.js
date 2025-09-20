// netlify/functions/addPhoto.js
export async function handler(event, context) {
	// Require a logged-in user
	if (!context.clientContext || !context.clientContext.user) {
		return {
			statusCode: 401,
			body: JSON.stringify({ error: "Not authorized" }),
		};
	}

	// ✅ Pull values from request body
	const { fileName, fileContent, category } = JSON.parse(event.body);

	const repoOwner = "jtywa";
	const repoName = "photo-portfolio";
	const branch = "main";
	const token = process.env.GITHUB_TOKEN;

	const imagePath = `uploads/${fileName}`;
	const photosJsonPath = `data/photos.json`;

	// 1. Upload image to GitHub
	await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${imagePath}`, {
		method: "PUT",
		headers: {
			Authorization: `token ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			message: `Upload ${fileName}`,
			content: fileContent, // base64 string
			branch,
		}),
	});

	// 2. Get current photos.json
	const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${photosJsonPath}`, {
		headers: { Authorization: `token ${token}` },
	});
	const fileData = await res.json();
	const oldContent = JSON.parse(Buffer.from(fileData.content, "base64").toString());

	// 3. ✅ Add the new photo entry
	oldContent.push({ category, url: imagePath });

	// 4. Save updated photos.json
	await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${photosJsonPath}`, {
		method: "PUT",
		headers: {
			Authorization: `token ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			message: `Update photos.json with ${fileName}`,
			content: Buffer.from(JSON.stringify(oldContent, null, 2)).toString("base64"),
			sha: fileData.sha,
			branch,
		}),
	});

	return { statusCode: 200, body: JSON.stringify({ success: true }) };
}
