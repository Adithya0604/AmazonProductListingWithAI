import { chromium } from "playwright";
import db from "../../mysqlConnections.js";
import { AiServiceForAmazonProduct } from "../ai/aiService.js";

export async function AmazonProductList(req, res) {
  const { ASIN } = req.body;

  if (!ASIN) {
    return res
      .status(400)
      .json({ success: false, message: "ASIN is required." });
  }

  const asinRegex = /^[A-Z0-9]{10}$/;
  if (!asinRegex.test(ASIN)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ASIN format." });
  }

  try {
    const url = `https://www.amazon.in/dp/${ASIN}`;
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Scrape original data
    const title = await page
      .$eval("#productTitle", (el) => el.textContent.trim())
      .catch(() => "");

    const price = await page
      .$eval(".a-price-whole", (el) => el.textContent.trim())
      .catch(() => "");

    const features = await page
      .$eval("#feature-bullets", (el) => el.innerText.trim())
      .catch(() => "");

    await browser.close();

    // Prepare original data structure
    const bulletPoints = features
      ? features.split("\n").filter((line) => line.trim() !== "")
      : [];

    const originalData = {
      asin: ASIN,
      title: title || "",
      Description: "", // Original doesn't have description, only features
      features: features || "",
      bullet_points: bulletPoints,
      price: price || "",
    };

    // Check if we have enough data to optimize
    const hasMinimalData = title || features || bulletPoints.length > 0;

    let optimizedData;
    if (!hasMinimalData) {
      // If no data found, return empty optimized structure
      optimizedData = {
        title: "",
        Description: "",
        features: "",
        bullet_points: [],
        price: "",
        keywords: [],
      };
    } else {
      // Call AI service to generate optimized data
      optimizedData = await AiServiceForAmazonProduct(originalData);

      // Ensure price is preserved from original
      optimizedData.price = originalData.price;
    }

    // Store in database
    const insertQuery = `
      INSERT INTO products (asin, original_data, optimized_data)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        original_data = VALUES(original_data),
        optimized_data = VALUES(optimized_data)
    `;

    await db.execute(insertQuery, [
      ASIN,
      JSON.stringify(originalData),
      JSON.stringify(optimizedData),
    ]);

    return res.status(200).json({
      success: true,
      asin: ASIN,
      original: originalData,
      optimized: optimizedData,
    });
  } catch (error) {
    console.error("Error fetching product details:", error.message);
    return res.status(500).json({
      success: false,
      message: `Unable to fetch or process product for ASIN ${ASIN}`,
      error: error.message,
    });
  }
}
