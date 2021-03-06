function PlaceTypes(){
    this.placeTypesArr = ["accounting",
    "fly|airport","plane|airport","airport",
    "amusement park",
    "aquarium",
    "art|art gallery","artist|art gallery","art gallery",
    "atm",
    "bakery",
    "bank",
    "beer|bar","bars|bar","joint|bar","lounge|bar","taverns|bar","tavern|bar","dive|bar","pubs|bar","pub|bar","bar",
    "beauty salon",
    "bowl|bowling alley","bowling alley",
    "bus|bus station","buses|bus station","bus station",
    "diner|cafe","tea|cafe","donut|cafe","coffee|cafe","java|cafe","cafe",
    "campground","campgrounds|campground","camping|campground","camps|campground",
    "automobile|car dealer",
    "car dealer",
    "car rental","car rentals|car rental","auto rentals|car rental","rent car|car rental",
    "car repair",
    "carwash","car wash","car wash",
    "gambl|casino","casino",
    "cemetery",
    "church",
    "city hall",
    "courthouse",
    "dentist",
    "dr|doctor","doctor",
    "electrician",
    "embassy",
    "establishment (deprecated)",
    "finance (deprecated)",
    "fire station",
    "flower|florist","florist",
    "funeral home",
    "deisel|gas station","fuel|gas station","gas|gas station","gas station",
    "grocery",
    "grocery or supermarket",
    "gym","basketball|gym","fitness|gym","workout|gym",
    "perm|hair care","style|hair care","hair care",
    "clinic|hospital","hospital",
    "insurance agency",
    "laundry",
    "lawyer","attorney|lawyer",
    "library",
    "local government office",
    "locksmith",
    "lodging","motel|lodging","hotel|lodging",
    "meal delivery","food delivery|meal delivery",
    "meal takeaway","takeout|meal takeaway",
    "mosque",
    "movie rental",
    "movie theater",
    "moving company",
    "museum",
    "club|night club","nightclub|night club","night club",
    "painter",
    "park",
    "parking",
    "physiotherapist",
    "plumber",
    "911|police","cop|police","police",
    "post office|post office","post office",
    "real estate agency",
    "restaurant",
    "roofing contractor",
    "rv park",
    "schools|school",
    "school",
    "mall|shopping mall","mall|shopping mall","shopping mall","mall",
    "spa",
    "stadium","sports|stadium",
    "storage",
    // stores
    "store",
    "clothing store",
    "kwik|convenience store","mart|convenience store","highs|convenience store","7 11|convenience store","royal farm|convenience store","convenience store",
    "dollar store",
    "department store|department store","department store",
    "bike|bicycle store","bicycle store", 
    "books|book store","book store",
    "shoestore","shoes|shoestore","shoes|shoe store","shoe store",
    "dog food|pet store","kittens|pet store","puppies|pet store","pets|pet store","pet store",
    "pharmacy","drugs|pharmacy","drug store|pharmacy","drugstore|pharmacy",
    "liquor store","booze|liquor store",
    "electronics store",
    "furniture store",
    "hardware store",
    "jewelry store",
    // end stores
    "subway station",
    "synagogue",
    "taxi stand","cab|taxi stand",
    "train station",
    "bus|bus station","transit station","bus|transit station","transit",
    "travel agency",
    "college|university","university",
    "veterinary care",
    "zoo"];
}
PlaceTypes.prototype.checkForTypeMatch = function(_str){
    var i, _type;
    for(i = 0; i < this.placeTypesArr.length; i++){
        _typeStr = this.placeTypesArr[i];
        console.log("compare: " + _str + ":" + _typeStr);
        if(_typeStr.indexOf(_str) != -1){
            if(_typeStr.indexOf('|') != -1){
                return(this.placeTypesArr[i].split('|')[1]);
            }
            else{
                return(this.placeTypesArr[i]);
            }
        }
    }
    return(null);
}
