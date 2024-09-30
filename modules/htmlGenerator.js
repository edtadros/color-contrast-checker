const fs = require( 'fs' );
const path = require( 'path' );
const mustache = require( 'mustache' );

// Define a custom function to escape HTML.
function escapeHTML( text ) {
	return text.replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
}

function generateHTMLPage( file, simplifiedLists, noColorContrastViolationCount, colorContrastViolationCount, pagesScanned, includeScreenshots ) {
	try {
		// Read the template file.
		const templatePath = path.join( __dirname, '../views/template.mustache' );
		const template = fs.readFileSync( templatePath, 'utf8' );

		// Organize items by pageURL.
		const groupedItems = simplifiedLists.reduce( ( acc, item ) => {
			if ( !acc[item.pageUrl] ) {
				acc[item.pageUrl] = [];
			}
			acc[item.pageUrl].push( item );
			return acc;
		}, {} );

		// Generate separate tables for each pageURL.
		const tableSections = Object.keys( groupedItems ).map( pageUrl => {
			const items = groupedItems[pageUrl].map( item => `
				<tr>
					<td><pre>${item.selector}</pre></td>
					<td><pre>${escapeHTML( item.context )}</pre></td>
					<td>${item.message}</td>
					${ includeScreenshots ? `<td><img src="${item.screenshot}"/></td>` : '' }
				</tr>
			`).join( '' );
			const totalItemsForPageUrl = groupedItems[pageUrl].length;
			const pageTitle = groupedItems[pageUrl][0].title; // Assuming title is present in all items

			return `
				<h2 class="collapsible"><a href="${pageUrl}">${pageTitle}</a> - Total Errors: ${totalItemsForPageUrl}</h2>
				<table>
					<thead>
						<tr>
							<th>Selector</th>
							<th>Context</th>
							<th>Message</th>
							${ includeScreenshots ? `<th>Screenshot</th>` : '' }
						</tr>
					</thead>
					<tbody>
						${items}
					</tbody>
				</table>
			`;
		} ).join( '' );

		// Calculate total number of items.
		const totalItems = simplifiedLists.length;

		const passingPages = noColorContrastViolationCount;

		const failingPages = colorContrastViolationCount;

		// Modify the pageTitle based on the file parameter
		let pageTitle;
		if (file === 'light') {
			pageTitle = 'Light Mode Color Contrast Report';
		} else if (file === 'night') {
			pageTitle = 'Dark Mode Color Contrast Report';
		} else {
			pageTitle = 'Color Contrast Report';
		}

		// Render the template with dynamic content
		const htmlContent = mustache.render( template, {
			pageTitle: pageTitle,
			pagesScanned: pagesScanned,
			totalItems: totalItems,
			tableSections: tableSections,
			passingPages: passingPages,
			failingPages: failingPages
		} );

		// Determine the output directory based on the location of the script.
		const outputDir = path.join( __dirname, '../report' );

		// Check if the directory exists, if not create it recursively.
		if ( !fs.existsSync( outputDir ) ) {
			fs.mkdirSync( outputDir, { recursive: true } );
		}

		// Write the generated HTML to the specified path.
		const outputPath = path.join( outputDir, `${file}.html` );
		fs.writeFileSync( outputPath, htmlContent );

		console.log( `HTML page generated successfully at ${outputPath}` );

		return htmlContent;
	} catch ( error ) {
		console.error( 'Error generating HTML page:', error );
		throw error; // Rethrow the error to propagate it upwards.
	}
}

function generateSummaryHTMLPage(summaryData, pagesScanned) {
	const fs = require('fs');
	const path = require('path');
	const mustache = require('mustache');

	// Read the template file
	const template = fs.readFileSync(path.join(__dirname, '../views/template.mustache'), 'utf8');

	// Generate table rows from summaryData
	const tableRows = summaryData.data.map(item => `
		<tr>
			<td>${item.id}</td>
			<td>${item.project}</td>
			<td><a href="${item.pageUrl}">${item.pageTitle}</a></td>
			<td>${item.light}</td>
			<td>${item.dark}</td>
		</tr>
	`).join('');

	// Create the table HTML
	const tableHTML = `
		<table class="summary-table">
			<thead>
				<tr>
					${summaryData.headers.map(header => `<th>${header}</th>`).join('')}
				</tr>
			</thead>
			<tbody>
				${tableRows}
			</tbody>
		</table>
	`;

	// Calculate totals
	const totalLight = summaryData.data.reduce((sum, item) => sum + item.light, 0);
	const totalDark = summaryData.data.reduce((sum, item) => sum + item.dark, 0);

	// Render the template with dynamic content
	const htmlContent = mustache.render(template, {
		pageTitle: 'Summary Report',
		pagesScanned: pagesScanned,
		totalItems: summaryData.data.length,
		tableSections: tableHTML,
		passingPages: summaryData.data.filter(item => item.light === 0 && item.dark === 0).length,
		failingPages: summaryData.data.filter(item => item.light > 0 || item.dark > 0).length,
		isSummary: true,
		totalLight: totalLight,
		totalDark: totalDark,
		hideExpandButton: true 
	});

	// Determine the output directory
	const outputDir = path.join(__dirname, '../report');

	// Check if the directory exists, if not create it
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	// Write the generated HTML to the specified path
	const outputPath = path.join(outputDir, 'summary.html');
	fs.writeFileSync(outputPath, htmlContent);

	console.log(`Summary HTML page generated successfully at ${outputPath}`);
}

// Don't forget to export the new function
module.exports = {
	generateHTMLPage,
	generateSummaryHTMLPage
};
