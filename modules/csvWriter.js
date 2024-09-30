const fs = require( 'fs' );
const path = require( 'path' );

function writeSimplifiedListToCSV( simplifiedLists, file ) {
	const allData = simplifiedLists.reduce( ( acc, list ) => {
		if ( list && list.length > 0 ) {
			acc.push( ...list );
		}
		return acc;
	}, [] );

	if ( allData.length > 0 ) {
		// Use "..." as a delimiter so it doesn't interfere with "," which may appear in certain selectors.
		const csvContent = allData.map( entry => `${entry.pageUrl}...${entry.selector}...${entry.context}` ).join( '\n' );
		const directoryPath = path.join( __dirname, '../report' ); // Go up two levels
		const filePath = path.join( directoryPath, file );

		fs.writeFileSync( filePath, csvContent );
		console.log( `CSV file generated with all simplified lists` );
	} else {
		console.log( simplifiedLists, file);
		console.log( `No simplifiedList data to write` );
	}
}

function writeSummaryToCSV(summaryData) {
    const headers = summaryData.headers.join(',');
    const rows = summaryData.data.map(item => 
        `${item.id},${item.project},"${item.pageUrl}",${item.light},${item.dark}`
    ).join('\n');

    const csvContent = `${headers}\n${rows}`;
    const directoryPath = path.join(__dirname, '../report');
    const filePath = path.join(directoryPath, 'summary.csv');

    fs.writeFileSync(filePath, csvContent);
    console.log(`Summary CSV file generated at ${filePath}`);
}

module.exports = {
	writeSimplifiedListToCSV,
	writeSummaryToCSV  // Add this line
};
