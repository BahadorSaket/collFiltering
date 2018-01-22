(function() {

    /*************************************VARIABLES*************************************/

    raw = {};
    
    raw.call_backend = function () {

        var url = "http://localhost:5000/call_backend";

        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                async: false,
                url: url,
                data: {
                    key: JSON.stringify([0,1])
                },  
                // dataType: "json",
                dataType: 'json',
                success: function (dataBoth) {
                    
                    console.log('call backend returned')
                    resolve();
                },
                error: function (error) {
                    //console.log(' svm amss errr , ', error);
                }
            });
        });
    }
})();