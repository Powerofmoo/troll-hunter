import wixLocation from 'wix-location';
import wixData from 'wix-data';

import wixWindow from 'wix-window';

$w.onReady(async function () {
    let referenceKey = wixLocation.query.key;
    if (!referenceKey) referenceKey = "H105-H120-L768";

    let url = "";
    let comments = [];

    const result = await wixData.query('TrollHuntData')
        .eq('referenceKey', referenceKey)
        .find();

    if (result.items.length > 0) {
        const item = result.items[0];
        url = item.url;
        comments = JSON.parse(item.comments); // Assuming comments are stored as JSON string
    }

	$w("#urlInput").value = url;

    let uniqueParam = Date.now(); // or you can use Math.random()
    $w("#htmlBox").src = url + "?refresh=" + uniqueParam;

    populateRepeater(comments);
});



function populateRepeater(comments) {

    $w("#repeater").collapse();

    $w("#repeater").data = comments;
    $w("#repeater").onItemReady(($item, itemData, index) => {

        $item("#boxBack").style.backgroundColor = "orange";

        $item("#commentText").text = itemData.text.replace(' ', '\u00A0\u00A0');  // TRICK - mask so find will skip it
        $item("#responseBox").value = itemData.response;

        $item("#textButton").onClick(() => {
            clipText(itemData.text);
        });
        $item("#responseButton").onClick(() => {
            clipResponse( $item("#responseBox").value );
            $item("#boxBack").style.backgroundColor = "lightgreen";
        });

    });

    // show
    $w("#repeater").expand();

}

function clipText(text) {
    wixWindow.copyToClipboard(text.substring(0,50));
}

function clipResponse(response) {
    wixWindow.copyToClipboard(response);
}