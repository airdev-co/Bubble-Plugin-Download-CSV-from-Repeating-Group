function(instance, properties, context) {

    if (instance.data.myData === undefined ||
       instance.data.myData === null) {
        console.log("No data to download")
        return;
    }
  var link = document.createElement('a');
  link.setAttribute('href', instance.data.myData);
  link.setAttribute('target', "_blank");
  link.setAttribute('download', instance.data.filename);
  
  link.click();



}