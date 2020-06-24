// Parse selection into a formatted string
exports.serializer = function (string, start=null, end=null) {
    newstring = string.replace(/  /g,"");
    try {
        let results = newstring.match( new RegExp(`${start}(.*?(?=${end}.*))`, "im") )[0];
        $(".pdf-display-selection").text(`${results}`);
        $(".pdf-input-selection").val(`${results}`);
    } catch (error) {
        console.log("error")
    }
}