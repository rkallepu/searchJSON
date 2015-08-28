/**
 * Created by Rashmika on 28-08-2015.
 */
//wait for the DOM to be ready for interaction
document.addEventListener('DOMContentLoaded', function(){
    var searchKey = document.querySelector('input[type=text]');
        //Listener to detect the text entered by the user in the input text box
        searchKey.addEventListener('keyup', function(event){
            clearResultsDiv();
            //console.log(searchKey.value);
            if(searchKey.value.length === 0){
                //clearResultsDiv();
            }
            else{
                /** Make an ajax call to get the data when the length of the searchkey is greater than 1
                 * Considering the fact that in real time the products.json will be dynamic and
                 * so are the search results - hence an ajax call is made for every search
                 */

                $.ajax({url: "data/products.json"}).done(function(data){
                    //console.log(data);
                    searchMyJSON(data.products, searchKey.value);
                }).fail(function(textStatus){
                    alert("Request failed: " + textStatus);
                });
            }
        });
    //Listener to Add animation when new li elements are inserted into DOM
    var insertListener = function(event){
        if (event.animationName == "nodeInserted") {
             /** This is the debug for knowing our listener worked!
              * event.target gives the new node!
              * console.warn("Another node has been inserted! ", event, event.target);
              */
        }
    };
    document.addEventListener("animationstart", insertListener, false); // standard + firefox
    document.addEventListener("MSAnimationStart", insertListener, false); // IE
    document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari
});
/**
 * function to filter the products by the searchkey and
 * store data by financial institution by type in searchResults object
 */
function searchMyJSON(products, searchKey){
    var searchResults = {},
        searchRegExp,
        searchKey = '\\b' + searchKey;

    searchRegExp = new RegExp(searchKey, 'i');
    products.map(function (item) {
        if(searchRegExp.test(item.name)){
            if(searchResults[item.type]){
                searchResults[item.type].push(item);
            }
            else{
                searchResults[item.type] = [item];
            }
        }
    });
    createSearchResults(searchResults);
}
/**
 * function to process the searchResults, create the appropriate DOM elements
 * to show the final results to the user in a organised way
 */
function createSearchResults(searchResults){
    var searchResultsDiv = document.getElementById('searchResults');
    if(Object.keys(searchResults).length === 0){
        searchResultsDiv.innerHTML = "<h4>No results found</h4>";
    }else{
        Object.keys(searchResults).forEach(function(item){
            var h4  =createElement('h4',searchResultsDiv,null,item),
                ul =  createElement('ul',searchResultsDiv);
            searchResults[item].forEach(function(subitem){
                var liName = createElement('li',ul,'name_li', subitem.name,null);
                var liUrl = createElement('li',ul,'url_li', null,null);
                var url  = createElement('a',liUrl,null,subitem.url,{'href': subitem.url});
            });
        });
    }
}
/**
 * A generalized function to create DOM elements
 */
function createElement(element, parent, className, textcontent, attributes){
    var element = document.createElement(element);
    if (parent) parent.appendChild(element);
    if (className) element.className = className;
    if (textcontent) element.innerHTML = textcontent;
    if (typeof attributes !== 'undefined') {
        for (var attr in attributes) {
            element.setAttribute(attr, attributes[attr]);
        }
    }
    return element;
}
/**
 * function to reset the ResultsDiv
 */
function clearResultsDiv(){
    document.getElementById('searchResults').innerHTML = "";
}