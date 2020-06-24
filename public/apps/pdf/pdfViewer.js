var pdfjsLib = require('../pdf/pdf');
var runner = require('./pdfHelper');

exports.app = function (path, num, zoom, start=null, end=null) {
    //show progress retrieving
    $(".pdf-scraper-spinner").attr("hidden",false);
    $(".pdf-scraper-spinner").siblings().text("retrieving");

    pdfjsLib.GlobalWorkerOptions.workerSrc = '../apps/pdf/pdf.worker.js';
    // Asynchronous download of PDF
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(proxyurl + path)
        .then((response) => {
            var loadingTask = pdfjsLib.getDocument(response);
            loadingTask.promise.then(function(pdf) {
                //show progress spinner
                $(".pdf-scraper-spinner").siblings().text("loading");

                // Fetch the first page
                var pageNumber = num;
                pdf.getPage(pageNumber)
                    .then(function(page) {
                    //show progress spinner
                    $(".pdf-scraper-spinner").siblings().text("rendering");
                    page.getTextContent({normalizeWhitespace: true, disableCombineTextItems: true})
                    .then(function(text){
                        let store;
                        text.items.map((v, i)=>{
                            $(`<pre wrap><li>${v.str}</pre><hr/>`).appendTo(".pdf-text");
                            store += ` ${v.str}`;
                        })
                        return store
                    })
                    .then((store)=>{
                        runner.serializer(store, start, end);
                    });
                    var scale = zoom;
                    var viewport = page.getViewport({scale: scale});

                    // Prepare canvas using PDF page dimensions
                    var canvas = document.getElementById('the-canvas');
                    var context = canvas.getContext("2d");;
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Render PDF page into canvas context
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    var renderTask = page.render(renderContext);
                    renderTask.promise.then(function () {
                        // show progress spinner
                        $(".pdf-scraper-spinner").attr("hidden",true);
                        $(".pdf-scraper-spinner").siblings().text("load new");
                        $(".pdf-scraper-results").attr("hidden",false);
                    });
                });
            }, function (reason) {
                // PDF loading error
                $(".pdf-scraper-spinner").attr("hidden",true);
                $(".pdf-scraper-spinner").siblings().text("try again");
            });
        })
        .catch(() => {
        $(".pdf-scraper-spinner").attr("hidden",true);
        $(".pdf-scraper-spinner").siblings().text("try again");
        });
}