
import $ from 'jquery';
import 'what-input';


// Foundation JS relies on a global variable. In ES6, all imports are hoisted
// to the top of the file so if we used `import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
require('foundation-sites');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';


$(document).foundation();




const listCountContainer = document.querySelector(".listcounter span");

const skabelon = document.querySelector(".item-temp");
const liste = document.querySelector("#product-grid");
const myButtons = document.querySelectorAll(".button.filter");
const mySortButtons = document.querySelectorAll(".button.sort");
const catalogueContainer = document.querySelector("#catalogue");

const url = "https://mostvalue.dk/Buddhabikes/wordpress/wp-json/wp/v2/posts?per_page=40";
if (liste) {
    $.get(url).done((data) => (console.log(data)))
        .fail((error) => console.log(error)).always((data) => onlyAcf(data))

}

let allItems = [];
let acfList = [];
let currentItems = []
let listCounter;


const Product = {
    name: "",
    gear: "",
    madeBy: "",
    price: "",
    date: "",
    description: "",
    image: "",
    serienummer: "",
    category: "",
    dateFormatted: "",
};

let textvariable;


function eventListeners() {



    myButtons.forEach((button) => {
        button.addEventListener("click", filterList)
    })


    mySortButtons.forEach((button) => {
        button.addEventListener("click", sortList)

    })

}



function onlyAcf(data) {
    data.forEach(object => {
        acfList.push(object.acf)
    })

    makeProducts(acfList);
}

function createInfo(textvariable, text, clone) {
/*     const div = document.createElement("div");
    const p = document.createElement("p");
    const pInfo = document.createElement("p");
    let li_data = document.createElement("li");
    if (text.length < 70) {

        text = text.trim();
    }

    div.classList.add("i-info");

    clone.querySelector(".cell.specs").appendChild(li_data);

 
    pInfo.textContent = text
    div.appendChild(pInfo)
    li_data.appendChild(div); */
}

function createSeries(text, clone) {
 
    const p = document.createElement("p");
    const span = document.createElement("span");
    const div = document.createElement("div");

    p.textContent="Serienummer: ";
    p.classList.add("span");

  span.textContent = text;

    clone.querySelector(".cell.description").appendChild(p);
    clone.querySelector("p.span").appendChild(span);


}


function makeProducts(acfList) {
    eventListeners();
   
    acfList.forEach(item => {

        const productObject = Object.create(Product);
        productObject.name = item.title;
        productObject.gear = item.number_of_gears;
        productObject.madeBy = item.made_by;
        productObject.price = item.price;
        productObject.date = item.date;
        productObject.description = item.bike_description;

        productObject.image = item.image.url;
        productObject.serienummer = item.serienummer;
        productObject.category = item.category_;
        productObject.dateFormatted = "";
        allItems.push(productObject);

    })

    currentItems = allItems;
    displayList(currentItems)

}

function displayList(products) {
    liste.innerHTML = "";
    products.forEach(displaySingleProduct);
    listCounter = currentItems.length
    listCountContainer.textContent =  listCounter + " cykler";
    document.querySelector("p.desktop.listcount span").textContent = listCounter + " cykler";
    reloadAccordionFunctionality();

    popUpListeners();

}
function popUpListeners() {
    let button = document.querySelectorAll("a.button.reserve");
    console.log(button)

    button.forEach(button => {

        button.href = "#popUp";

     /*    button.addEventListener("click", () => {
            console.log("den her", button)

        }) */
    })
}
/* 

function createDate(textvariable, product, clone) {
    let date = product.date;
    product.dateFormatted
    const div = document.createElement("div");
    const p = document.createElement("p");
    const pInfo = document.createElement("p");
    let li_data = document.createElement("li");
    clone.querySelector(".menu.vertical.specs").appendChild(li_data);
    const dateArray = date.split('/')
    const formattedDate = new Date(dateArray[2], (dateArray[1] - 1), dateArray[0]);
    p.textContent = textvariable;
    pInfo.textContent = product.date;
    div.classList.add("i-info");
    li_data.appendChild(div);
    div.appendChild(p);
    div.appendChild(pInfo);
    product.dateFormatted = formattedDate;


} */

function createCategory(categories, clone) {

    const div = document.createElement("div");
    const p = document.createElement("p");
    const pInfo = document.createElement("p");
    let li_data = document.createElement("li");
    let first = categories[0]
    let second = categories[1]
    let third = categories[2]
    let fourth = categories[3]
    
    if (categories.length === 4) {
        li_data.dataset.first = `${first} ${second} ${third} ${fourth}   $`;
        pInfo.textContent = `${first}, ${second}, ${third}, ${fourth}  `;
    }

    else if (categories.length === 3) {
        let first = categories[0]
        let second = categories[1]
        li_data.dataset.first = `${first} ${second} ${third}  $`;
        pInfo.textContent = `${first}, ${second}, ${third}  `;
    }

    else if (categories.length === 2) {
        let first = categories[0]
        let second = categories[1]
        li_data.dataset.first = `${first} ${second} $`;
        pInfo.textContent = `${first}, ${second} `;
    } else if (categories.length === 1) {
        li_data.dataset.field = categories;
        pInfo.textContent = categories;
       
    }
    clone.querySelector(".type").appendChild(li_data);

    div.classList.add("i-info");
    li_data.appendChild(div);

    div.appendChild(pInfo);

}

function displaySingleProduct(product) {

    const clone = skabelon.cloneNode(true).content;
    const test = document.createElement("div")
    clone.querySelector("img").src = product.image;
    clone.querySelector("h4").textContent = product.name;
    clone.querySelector("p.price").innerHTML = + product.price + ",-";
  
    clone.querySelector(".description p ").textContent = product.description;

    if (product.category) {
        textvariable = "Cykel type"
        createCategory(product.category, clone, textvariable)
    }


    
    clone.querySelector("p.gear").textContent= "Antal gear: " + product.gear;
    clone.querySelector("p.date").textContent= "Lagt op: " + product.date;


  /*   if (product.date) {
        textvariable = "Dato:";
        createDate(textvariable, product, clone)
    }  */
  /*   clone.querySelector("span").textContent =    product.serienummer; */

    if (product.serienummer) {
        createSeries(product.serienummer, clone)
    }
/*     let abutton = document.createElement("a")
    abutton.textContent = "Reserver via mail";
    abutton.classList.add("button");
    abutton.classList.add("reserve");
    abutton.classList.add("expanded");
    abutton.href = "contact.html#mail-section"
    clone.querySelector(".menu.vertical.specs").appendChild(abutton); */

    liste.appendChild(clone);

}


function filterList() {
    const filter = this.dataset.filter;

    myButtons.forEach(button => {
        button.classList.remove("selected")
    })
this.classList.add("selected")
    myFilter(filter);
}

function clearAllSort() {

    mySortButtons.forEach((botton) => {
        botton.dataset.action = "sort";
        botton.classList.remove("selected")
    });

}

function sortList() {
    console.log("er her")
    if (this.dataset.action === "sort") {
        clearAllSort();
        this.dataset.action = "sorted";
        this.classList.add("selected")
    }
    mySort(this.dataset.sort, this.dataset.direction);
}
function mySort(sortBy, direction) {
    console.log(`mySort-, ${sortBy} sortDirection-  ${direction}  `); let desc = 1;

    console.log(currentItems, "se her")
  
    if (direction === "desc") {
        desc = -1;
    } currentItems.sort(function (a, b) {
        console.log(a, b)
        var x = a[sortBy];
        var y = b[sortBy];
        console.log(x, y);
        if (x < y) {

            return -1 * desc;
        }
        if (x > y) {
            return 1 * desc;
        }
        return 0;
    });
    displayList(currentItems);
}



function reloadAccordionFunctionality() {
    $('.catalogue-item .accordion-menu').foundation();
    $('.dropdown-pane').foundation();
    document.querySelector("#xc9tld-dd-anchor")
    
}
function myFilter(filter) {
    if (filter === "*") {
        currentItems = allItems;

        mySortButtons.forEach(button => {
            button.classList.remove("selected")
        })

    }
    else {
        mySortButtons.forEach(button => {
            button.classList.remove("selected")
        })
        currentItems = [];
        allItems.filter((item) => {
            const testArray = item.category;

            const exists = testArray.find((x) => x === filter);
            if (exists) {


                currentItems.push(item);

            } else {

            }
        })
    }


    displayList(currentItems)

    liste.classList.remove("pointerNone");

}
