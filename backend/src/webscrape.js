const puppeteer = require("puppeteer");

async function scrapeUICEvents() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	let eventsData = [];
	let url = "https://today.uic.edu/events/";

	while (url) {
		await page.goto(url, { waitUntil: "load", timeout: 0 });

		// Scrape event data from the current page
		const eventsOnPage = await page.evaluate(() => {
			const events = [];
			const eventElements = document.querySelectorAll(
				".teaser-list .event-teaser"
			);

			eventElements.forEach((event) => {
				const title = event.querySelector("._name a")?.innerText || "";
				const link = event.querySelector("._name a")?.href || "";

				const month = event.querySelector("._month")?.innerText || "";
				const day = event.querySelector("._day")?.innerText || "";
				const year = event.querySelector("._year")?.innerText || "";
				const date = `${month} ${day}, ${year}`;

				const time = event.querySelector("._time")?.innerText || "All Day";
				const location =
					event.querySelector("._place")?.innerText || "Not specified";

				events.push({ title, date, time, location, link });
			});

			return events;
		});

		eventsData = eventsData.concat(eventsOnPage);

		// Check for the "next" pagination link
		const nextPageUrl = await page.evaluate(() => {
			const nextLink = document.querySelector(
				".em-pagination.em-ajax.overflowing .next.page-numbers"
			);
			return nextLink ? nextLink.href : null;
		});

		url = nextPageUrl;
	}

	await browser.close();
	return eventsData;
}

// Export the function for use in other files
module.exports = {scrapeUICEvents};

// Usage example

// const scrapeUICEvents = require("./webscrape");

// (async () => {
// 	const eventsData = await scrapeUICEvents();
// console.log(`Scraped ${eventsData.length} events.`);
// console.log(eventsData);

// })();
