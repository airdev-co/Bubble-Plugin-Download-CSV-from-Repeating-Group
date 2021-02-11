function(properties, context) {

  //find correct repeatinggroup
    var separator = properties.file_type === "CSV" ? "," : "";
    var csvContent = "data:text/csv;charset=utf-8,";
    if (separator === "") {
        separator = properties.file_type === "TSV" ? "\t" : "";   
        csvContent = "data:text/tab-separated-values;charset=utf-8,";
    }
    else if (separator === ""){
        separator = properties.file_type === "; separated CSV" ? ";" : ""; 
        csvContent = "data:text/csv;charset=utf-8,";
    }
    else if (separator === ""){
        separator = properties.file_type === "| separated CSV" ? "|" : ""; 
        csvContent = "data:text/csv;charset=utf-8,";
    }
    else if (separator === ""){
        console.log("ERROR: Separator not assigned");
        separator = ",";
        csvContent = "data:text/csv;charset=utf-8,";
    }
  let rg1 = document.getElementById(properties.repeating_group_HTML_id);

  // console.log("test1" + rg1);
  
  //determine if we should use element IDs for column headers if provided
  let useIds = properties.useElementIds;
  
  //get text elements from repeatinggroup
  let allTextElements = rg1.getElementsByClassName("content");
  let allNums2 = [];
  for(i=0;i<allTextElements.length;i++){
    allNums2.push(allTextElements[i].innerText.replace(/(\r\n|\n|\r|\s+|\t|&nbsp;)/gm," ").replace(/(\#)/gm, ""));
  }
  // console.log("test2");

  
  function cleanText(text, separator) {
    var wrap = false
    if (text.includes(properties.quote_char)) {
        wrap = true;
        text = text.replace(new RegExp(properties.quote_char, 'g'), properties.quote_char + properties.quote_char);
    }
    if (text.match(/\r\n|\n|\r|\#/gm) !== null) {
        wrap = true;
    }
    // check if separator is within this cell
    if (text.match(new RegExp(separator, "gm")) !== null) {
        wrap = true;
    }
    
    if (wrap)
        return properties.quote_char + text + properties.quote_char;
    else
        return text;
}

  var numRows = document.getElementById(properties.repeating_group_HTML_id).childNodes[0].childElementCount;
  //count how many inputs in each row   
  let numColumns = allNums2.length/numRows;
  
  /* Get element IDs */
    
  let elementIds = [];

  for (i=0; i<numColumns; i++) {
    let parentElement = allTextElements[i].parentElement;
    let thisId = parentElement.id;
    if (!thisId) {
      elementIds.push(null);
    } else {
      elementIds.push(thisId)
    }
  };

  // set column names (first row)
  let row = [];
  for (let i = 0; i<numColumns; i++){
    // Check if an element ID is available for this column
    if (elementIds[i] !== null && useIds) {
      row.push(cleanText(elementIds[i], separator));
    } else { 
      let idx = i + 1;
      row.push(cleanText('Column ' + idx, separator));
    }
  }
  csvContent += row.join(separator) + "\r\n"; 

  // set row content (second row and beyond)
  row = [];

  // only download X rows if user specifies
  if (properties.number_of_rows) {
    numRows = properties.number_of_rows;
  }

  for (let rowNum=0; rowNum<numRows; rowNum++){
    for (let columnNum = 0; columnNum<numColumns; columnNum++){
      row.push(cleanText(allNums2[rowNum*numColumns+columnNum], separator));
    }
    //console.log(row);
    csvContent += row.join(separator) + "\r\n";
    row = [];
  };


  //download CSV
  
  /*  Old solution:
  
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
  
  */
  
  var myData = encodeURI(csvContent);
  var filename = properties.filename;
  
  var link = document.createElement('a');
  link.setAttribute('href', myData);
  link.setAttribute('target', "_blank");
  link.setAttribute('download', filename);
  
  link.click();
  
  /* Notes 
  
  - commas and # hashes are stripped from the content before starting
  - Date times seems to break into separate columns
  
  */

}