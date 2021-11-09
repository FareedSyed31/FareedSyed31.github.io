let test = "0"
setInterval(ajax_query, 2000);

function ajax_query() {
    if (test <= "5") {
        test++;
    } else {
        test = "1";
    }

    $("#div2").load("description_" + test + ".txt", function (responseTxt, statusTxt, xhr) {
    });
    let $img = $("<img>", {'src': "image_" + test + ".jpg"});
    $('#div1').html($img);
}