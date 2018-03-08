# edx_nodejs

Module 1 Assignment Lab: CSV to JSON Converter

Command line example usage:
node moduel1.js /tmp/customer-data.csv 


## Design Choices:

I decided to check the CSV input file type (DOS or Unix) and output the JSON in the same format.
This required a few extra libraries of utilities.
I also needed to detect the operating system that the process was running on so as to convert FROM the correct OS file type as needed.

The general flow is:
- Check input file is valid
- Determine OS and file end of line character(s) for the file type conversion
- Perform the CSV to JSON conversion and output to a file
- Perform any EOL conversion if needed


## Testing:

Using Linux diff, wc, file and grep commands I was able to:
- Compare (diff) my output with the sample output
- Count (wc) that the number of lines in each file matched
- Check the file type (file) that both ended up in DOS format
- Count the number of JSON records matched (1000) the sample output with 'grep \{ FILENAME | wc'

I also catered for:
- No file name provided as a parameter
- Filename provided was a CSV file
- Filename provided actually exists
- Filename provided could be relativer or absolute path

## Issues Encountered:

Detecting the EOL of the input file took a lot of mucking around and I tried various npm packages. 
Initially I found some success with file-line-reader to read only the first line of the CSV file, which is quite efficient. 
The trouble is the CRLF were being converted to LF on Linux, so detecting the EOL in the next step was always wrong.
I ended up using the read-text-file package instead, which is slower as it reads the whole file, but it is accurate.

Mac file type was not catered for or tested.

