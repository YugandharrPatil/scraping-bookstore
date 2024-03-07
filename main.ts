import fs from "fs";
import puppeteer, { Browser } from "puppeteer";

const URL = "https://books.toscrape.com/";

const main = async () => {
	const browser: Browser = await puppeteer.launch({ headless: false });
	console.log("123");
	const page = await browser.newPage(); // open a new tab
	await page.goto(URL); // natigate to this URL

	const bookData = await page.evaluate((URL: string) => {
		const bookPods = Array.from(document.querySelectorAll(".product_pod")); // generating an array containing the product_pod objects

		const data = bookPods.map((pod: any) => ({
			title: pod.querySelector("h3 a").getAttribute("title"),
			price: parseFloat(pod.querySelector(".price_color").innerText.replace("£", "")),
			imgSrc: `${URL}${pod.querySelector("img").getAttribute("src")}`,
			// switch statement written inline because gives error otherwise
			rating:
				pod.querySelector(".star-rating").classList[1] === "One"
					? 1
					: pod.querySelector(".star-rating").classList[1] === "Two"
					? 2
					: pod.querySelector(".star-rating").classList[1] === "Three"
					? 3
					: pod.querySelector(".star-rating").classList[1] === "Four"
					? 4
					: pod.querySelector(".star-rating").classList[1] === "Five"
					? 5
					: 0,
		}));

		return data;
	}, URL);
	console.log(bookData);

	await browser.close();

	fs.writeFile("data.json", JSON.stringify(bookData), (err: any) => {
		if (err) throw err;
		console.log("Successfully saved JSON!");
	});
};

main();
