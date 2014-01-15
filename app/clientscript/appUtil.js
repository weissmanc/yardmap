var appUtil = (function () {

    //Determines if two DOM elements overlap in terms off min/max x-y coords
    function isOverlap(a, b) {
        var rect1 = a.getBoundingClientRect();
        var rect2 = b.getBoundingClientRect();

        return !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom)
        
    }

    return {

        isOverlap: isOverlap

    }

})();   