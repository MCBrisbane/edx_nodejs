/*
*  Script to convert a CSV datafile to JSON format
*
*  Input parameter: path_to_csv_file
*
*  Output file is the same file name with a .json extension
*  Output file end of line (EOL) will be the same as the input file
*
*  Checks that filename is provided
*  Checks that filename is .CSV file
*  Checks that input file exists
*  Checks that input file can be in a different directory to this script
*
*  Note - Only tested for Linux/Unix and DOS. Not tested for Mac or other OSs
*/

const fs			= require('fs')
const osName 		= require('os-name');
const c2j			= require('csvtojson')
const readTextFile 	= require('read-text-file');
const replaceStr 	= require('replace-in-file')
const detectNewline = require('detect-newline');

// Constants for end of line checking/replacing and Debug output
const replaceStrLFGlobally   	= /\n/g
const replaceStrCRLFGlobally 	= /\r\n/g
const DOSEOL  					= '\r\n'
const UnixEOL 					= '\n'
const Debug 					= true

// Set default values as per Linux OS
var localOSFormat 	= replaceStrLFGlobally 	
var inputFileFormat = DOSEOL   				


const detectEOLs = (csvFilePath, callback) => {

	// Determine OS type and set appropriate replace strings for use by replace-in-file
	var currentOS = osName().substring(0,5)
	if(currentOS == 'Linux') 
		localOSFormat = replaceStrLFGlobally   // Set search/replace string for Linux/Unix
	else 
		localOSFormat = replaceStrCRLFGlobally  // Set search/replace string for DOS


	// Determine input file EOL eg DOS/Unix format
	var contents = readTextFile.readSync(csvFilePath);
	if (Debug) 
		console.log("eol=" + detectNewline.graceful(contents))	    

   	if (detectNewline.graceful(contents) == UnixEOL) { 
		inputFileFormat = UnixEOL
		if (Debug) 
			console.log("LF format")
	}
	else { 
		inputFileFormat = DOSEOL
		if (Debug) 
			console.log("CRLF format ")
	}
}


const doConvserion = (csvFilePath, callback) => {
	var jsonString = ''
	var osEOL      = ''

	c2j({toArrayString:true})   
	.fromFile(csvFilePath)

	.on('end_parsed',(jsonObj)=>{	
		const csvOutFilePath = csvFilePath.replace(".csv", ".json")
		const replaceOptions = {
  			files: csvOutFilePath,
  			from:  localOSFormat,      // Local format
  			to:    inputFileFormat,    // Original source file format 
		};

		// Output string of data to the file
		jsonString = JSON.stringify(jsonObj, null, 2)
	 	fs.writeFileSync(csvOutFilePath, jsonString)

	 	// Replace Unix 'LF' EOL char for DOS 'CRLF' EOL
		replaceStr(replaceOptions, (error, changes) => {
		  if (error) {
		    return console.error('Error occurred:', error);
		  }
		});

		// All done, inform the user
	    console.log('Conversion complete : JSON file =', csvOutFilePath)
	})

    .on('error', (error) => {
		console.error(`Error: ${error.message}`)
		process.exit()	
		})
}

//////////////////////////////////////////////////////////////////////////////////////

// Check CSV filename was provided by the user
if(process.argv[2] == undefined) {
	console.log("Error: Please provide a CSV file name as a parameter.")
	process.exit()
}
else if(process.argv[2].search(".csv") == -1){
	console.log("Error: Not a CSV file")
	process.exit()
}
else { 
    detectEOLs(process.argv[2])
	doConvserion(process.argv[2])	
}

