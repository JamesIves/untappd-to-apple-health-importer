<img align="right" width="180" height="auto"  src="./src/images/hand.png" alt="Icon">

# Untappd to Apple Health Importer

Transforms your [Untappd](https://untappd.com) beer check-in history into CSV files that can be imported into [Apple Health's Alcohol Consumption](https://www.apple.com/health/) tracking via the [Shortcuts app](https://apps.apple.com/us/app/shortcuts/id915249334).
The script uses best guess estimates to calculate vessel size and alcohol by volume (ABV%) in its conversion to [standard US drinks](https://www.cdc.gov/alcohol/standard-drink-sizes/index.html).

# Getting Started

Use the following steps to get your data imported.

1. [Download your Untappd history as JSON by going to the website](https://untappd.com) and going to the `View all beers` page. Requires an [Untappd Insider account](https://insiders.untappd.com/) (their premium subscription).
2. [Visit the importer page](#) and import the JSON file, hit the convert button.
3. Make sure you have [Shortcuts installed on your iOS device](#) and then import the [Untappd to Apple Health Shortcut](https://www.icloud.com/shortcuts/12395f925b24469f9170f800f5c9e548).
4. Initialize the shortcut and upload the CSV files that were generated, once done you should see the data on the Alcohol Consumption graph in the Health app.

[If you'd like to run the project locally and make a change please check out the contribution guide](./CONTRIBUTING.md). [Any problems can be reported via the issue board](https://github.com/JamesIves/untappd-to-apple-health-importer/issues).

# Common Questions

<details>
<summary>How do I get my Untappd data?</summary>
<p>
To download your Untappd data, you need to be an <strong>Untappd Insider</strong> (their premium subscription). Once you're an Insider:
</p>
<ul>
<li>Log in to your Untappd account on the web</li>
<li>Go to your profile and click on the <strong>"View all beers"</strong> tab</li>
<li>Look for the export or download option to get your <code>checkins.json</code> file</li>
</ul>
</details>

<details>
<summary>How are standard drinks calculated?</summary>
<p>
Standard drinks are calculated using the formula: <strong>(Volume in mL × ABV% ÷ 100 × 0.789g/mL) ÷ 14g</strong>
</p>
<p>
We use 0.789 g/mL as the density of ethanol and 14 grams of pure alcohol as one US standard drink.
</p>
</details>

<details>
<summary>What defines a standard drink?</summary>
<p>
In the United States, one standard drink contains approximately <strong>14 grams (0.6 fl oz) of pure alcohol</strong>. This is typically found in:
</p>
<ul>
<li>12 fl oz of regular beer (~5% ABV)</li>
<li>5 fl oz of wine (~12% ABV)</li>
<li>1.5 fl oz of distilled spirits (~40% ABV)</li>
</ul>
</details>

<details>
<summary>How are serving sizes determined?</summary>
<p>
Since Untappd doesn't provide exact serving volumes, we infer them based on the serving type:
</p>
<ul>
<li><strong>Pint/Cask/Nitro:</strong> 16 oz</li>
<li><strong>Draft:</strong> 16 oz (or 12 oz if ABV > 7%)</li>
<li><strong>Can/Bottle/Glass:</strong> 12 oz (or 16 oz if ABV > 7%)</li>
<li><strong>Flight/Sample:</strong> 5 oz</li>
</ul>
<p>
Higher ABV beers (>7%) are assumed to be served in larger cans (tallboys) or smaller draft pours.
</p>
<p>
<strong>Important:</strong> If vessel sizes aren't properly marked in Untappd, this can lead to inconsistent tracking. For example, if you check in multiple tasting samples but they're not marked as "Flight" or "Sample," they may be calculated as full 12-16oz servings, making it appear you've consumed an unrealistically high number of drinks.
</p>
</details>

<details>
<summary>Why are some checkins skipped?</summary>
<p>
Checkins are skipped when the ABV (alcohol by volume) is missing or invalid. Without ABV data, we cannot accurately calculate the standard drinks for that checkin.
</p>
</details>

<details>
<summary>Why does it export multiple CSV files?</summary>
<p>
If you have more than 500 checkins, the tool automatically splits your data into multiple CSV files (500 entries per file). This is necessary to prevent memory issues in the Shortcuts app.
</p>
<p>
Processing large CSV files can cause the Shortcuts app to crash or freeze on iPhone. By splitting the data into smaller chunks, each file can be imported successfully without overwhelming your device's memory.
</p>
<p>
Simply import each file one at a time using the shortcut - the data will all be combined in Apple Health automatically.
</p>
</details>

<details>
<summary>How do I give Shortcuts access to Apple Health?</summary>
<p>
For the shortcut to import data into Apple Health, you need to grant it permission:
</p>
<ul>
<li>Open the <strong>Settings</strong> app on your iPhone</li>
<li>Scroll down and tap <strong>Health</strong></li>
<li>Tap <strong>Data Access & Devices</strong></li>
<li>Find and tap <strong>Shortcuts</strong></li>
<li>Enable <strong>Number of Alcoholic Drinks</strong> (or "All Categories")</li>
</ul>
<p>
You may also be prompted to grant permission when you first run the shortcut.
</p>
</details>
