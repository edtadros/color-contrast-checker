# Color Contrast Monitoring for Dark Mode

🚨 **Work in Progress** 🚨

## Overview

The provided scripts are designed to monitor color contrast issues, specifically for dark mode. The process involves creating test cases based on the top Wikipedia articles and running accessibility tests using [axe-core](https://github.com/dequelabs/axe-core). The results are logged to the console and a CSV file, capturing color contrast violations.

## Prerequisites

- Node.js (version 12 or higher recommended)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd [repository-name]
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the project root with the following variables:
   ```
   MW_SERVER=https://en.wikipedia.org
   MEDIAWIKI_USER=your_username
   MEDIAWIKI_PASSWORD=your_password
   ```
   Replace `your_username` and `your_password` with your Wikipedia credentials.

## Project Structure

```
Color Contrast Tester
│
├── index.js
│
├── report/
│   ├── index.html
│   └── simplifiedList.csv
│
├── modules/
│   ├── csvWriter.js
│   ├── htmlGenerator.js
│   ├── topArticles.js
│   └── accessibility.test.js
│
└── README.md
```

## Usage

### Basic Command

Run the tests using the following command:

```
node index.js --project en.wikipedia
```

### Advanced Usage

1. Run against mobile:
   ```
   node index.js --project fr.wikipedia --mobile --query "minervanightmode=1"
   ```

2. Run against mobile for 10 random articles with sleep duration of 0s:
   ```
   node index.js --project fr.wikipedia --mobile --query "minervanightmode=1" --source random -z 0 --limit 10
   ```

3. Run against desktop night theme for 100 random articles:
   ```
   node index.js --project fr.wikipedia --query "useskin=vector-2022&vectornightmode=1" --source random --limit 100
   ```

### Command Line Options

- `--project <project>`: Specify the Wikipedia project (e.g., en.wikipedia, fr.wikipedia)
- `--query <query>`: Add custom query parameters to the URL
- `--mobile`: Run tests on mobile version
- `--source <source>`: Use a specific source for articles (default: top articles API)
- `--limit <number>`: Limit the number of articles to test
- `-z, --zleep <duration>`: Set sleep duration between requests (default: 5000ms)
- `-a, --alpha`: Force addition of alpha styles from beta cluster
- `-s, --include-screenshots`: Capture screenshots of errors and add them to the report

## Output

The script generates several types of reports in the `report/` folder:

1. CSV Reports:
   - `light.csv`: Contains color contrast violations for light mode.
   - `night.csv`: Contains color contrast violations for dark mode.

2. HTML Reports:
   - `light.html`: An interactive report showing detailed information about the tests and violations in light mode.
   - `dark.html`: An interactive report showing detailed information about the tests and violations in dark mode.

3. Summary Report (new):
   - CSV: `summary.csv`
   - HTML: `summary.html`
   These reports provide a summary of errors for each tested URL in both light and dark modes.

## Troubleshooting

- If you encounter issues with Puppeteer, ensure you have all necessary system dependencies installed.
- For authentication issues, double-check your `.env` file and ensure your Wikipedia credentials are correct.
- If tests are failing consistently, try increasing the sleep duration using the `-z` option.

## Contributing

This project is a work in progress. Contributions, bug reports, and feature requests are welcome. Please open an issue or submit a pull request on the project repository.

## Important Note

This tool is currently in development and should be used cautiously. Stay tuned for updates and improvements!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
