function PlaceTypes(){
    this.placeTypesArr = ["accounting","fly|airport","plane|airport","airport","amusement_park","aquarium","artist|art_gallery","art_gallery","atm","bakery","bank",
"beer|bar","bars|bar","joint|bar","lounge|bar","taverns|bar","tavern|bar","dive|bar","pubs|bar","pub|bar","bar","beauty_salon","bike|bicycle_store","bicycle_store","book_store","bowling_alley","bus_station","cafe","campground","automobile|car_dealer","car_dealer",
"car_rental","car_repair","carwash","car wash","car_wash","gambl|casino","casino","cemetery","church","city_hall","clothing_store","kwik|convenience_store","mart|convenience_store","highs|convenience_store","7 11|convenience_store","royal farm|convenience_store","convenience_store",
"courthouse","dentist","department_store","doctor","electrician","electronics_store","embassy","establishment (deprecated)",
"finance (deprecated)","fire_station","flower|florist","florist","funeral_home","furniture_store","deisel|gas_station","fuel|gas_station","gas_station","grocery_or_supermarket","gym","perm|hair_care","style|hair_care","hair_care","hardware_store","clinic|hospital","hospital","insurance_agency","jewelry_store","laundry","lawyer","library",
"liquor_store","local_government_office","locksmith","motel|lodging","hotel|lodging","lodging","meal_delivery","meal_takeaway","mosque","movie_rental",
"movie_theater","moving_company","museum","club|night_club","nightclub|night_club","night_club","painter","park","parking","pet_store","pharmacy","physiotherapist",
"plumber","police","post_office","real_estate_agency","restaurant","roofing_contractor",
"rv_park","school","shoe_store","shopping_mall","spa","stadium","storage","store","subway_station","synagogue",
"taxi_stand","train_station","bus|transit_station","transit_station","travel_agency","college|university","university","veterinary_care","zoo"];
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
