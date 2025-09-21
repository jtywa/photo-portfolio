export async function handler(event, context) {
	// Require a logged-in user
	if (!context.clientContext || !context.clientContext.user) {
		return {
			statusCode: 401,
			body: JSON.stringify({ error: "Not authorized" }),
		};
	}

	const { fileName } = JSON.parse(event.body);

	const repoOwner = "jtywa";
	const repoName = "photo-portfolio";
	const branch = "main";
	const token = process.env.GITHUB_TOKEN;

	const imagePath = `uploads/${fileName}`;
	const photosJsonPath = `data/photos.json`;

	// 1. Delete the image file
	const imgRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${imagePath}?ref=${branch}`, {
		headers: { Authorization: `token ${token}` },
	});
	if (imgRes.status === 200) {
		const imgData = await imgRes.json();
		await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${imagePath}`, {
			method: "DELETE",
			headers: { Authorization: `token ${token}` },
			body: JSON.stringify({ message: `Delete ${fileName}`, sha: imgData.sha, branch }),
		});
	}

	// 2. Update photos.json
	const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${photosJsonPath}`, {
		headers: { Authorization: `token ${token}` },
	});
	const fileData = await res.json();
	const oldContent = JSON.parse(Buffer.from(fileData.content, "base64").toString());
	const newContent = oldContent.filter((photo) => !photo.url.endsWith(fileName));

	await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${photosJsonPath}`, {
		method: "PUT",
		headers: { Authorization: `token ${token}` },
		body: JSON.stringify({
			message: `Remove ${fileName}`,
			content: Buffer.from(JSON.stringify(newContent, null, 2)).toString("base64"),
			sha: fileData.sha,
			branch,
		}),
	});

	return { statusCode: 200, body: JSON.stringify({ success: true }) };
}
