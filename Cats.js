const apiKey = "live_p6Y6FrhmqRakOAYvdVnJa4KJA6YEbUdihAKptnfirmWw6KCOsa2HMvlOuNH0X24X";
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const selectBreed = document.getElementById('selectBreed');
let breedsStore = [];
let currentIndex = -1;

const fetchRandomButton = document.getElementById('fetchRandomButton');
fetchRandomButton.addEventListener('click', (event) => {
    fetchRandomImage(); 
    document.getElementById('information').hidden = true;
});

const fetchBreedsButton = document.getElementById('fetchBreedsButton');
fetchBreedsButton.addEventListener('click', (event) => {
    fetchBreeds();
});

prevButton.addEventListener('click', (event) => {
    if(currentIndex <= 0)
      currentIndex = breedsStore.length - 1;
    else
      --currentIndex;

    loadImageAndInfo(currentIndex);
    selectBreed.options[currentIndex].selected = true;
});

nextButton.addEventListener('click', (event) => {
    if(currentIndex < breedsStore.length){
        loadImageAndInfo(++currentIndex);
        selectBreed.options[currentIndex].selected = true;
    }
});

selectBreed.addEventListener('change', (event) => {
    currentIndex = event.target.value;
    loadImageAndInfo(currentIndex);
});

function fetchBreeds(){
    const url = `https://api.thecatapi.com/v1/breeds`;
    fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey
        }
      })
      .then((response) => response.json())
      .then((json) => {
        breedsStore = json;
        loadDropDown();
        loadImageAndInfo(0);
        currentIndex = 0;
        prevButton.hidden = false;
        nextButton.hidden = false;
      });
}

function loadDropDown(){    
    selectBreed.innerHTML = ""; //remove all childeren 
    for(let i=0; i<breedsStore.length; i++){
        let o = document.createElement('option');
        o.innerText = breedsStore[i].name;
        o.value = i;
        selectBreed.appendChild(o);
    }

    if(selectBreed.options.length > 0){
        selectBreed.firstChild.selected = true;
        loadImageAndInfo(0);
    }

    currentIndex = 0;
}

function fetchRandomImage(imgID) {    
    let url = "https://api.thecatapi.com/v1/images/search";

    fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey
      }
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        if(json.length > 0)
        {
            loadImage(json[0].url);
        }
    });
}

function fetchImageByID(imgID) {    
    url = "https://api.thecatapi.com/v1/images/" + imgID;

    fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey
      }
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        loadImage(json.url);
    });
  }

  function loadImageAndInfo(index){
    if(index > -1 && index < breedsStore.length ){
        fetchImageByID(breedsStore[index].reference_image_id);
        loadInfo(breedsStore[index]);
    }
  }

  function loadImage(url){
    const imageElement = document.createElement("img");
    imageElement.src = url;
    //imageElement.style.maxWidth = "500px";
    imageElement.style.height = "500px";
    const imgContainer = document.getElementById("image-container");
    imgContainer.innerHTML = "";
    imgContainer.appendChild(imageElement);
  }

  function loadInfo(info){
    const infoDiv = document.getElementById('information');
    infoDiv.hidden = false;

    document.getElementById('name').textContent = info.name;
    document.getElementById('weight').textContent = info.weight.metric + " kg";
    document.getElementById('temperament').textContent = info.temperament;
    document.getElementById('origin').textContent = info.origin;
    document.getElementById('lifeSpan').textContent = info.life_span + " years";
    document.getElementById('description').textContent = info.description;

    const links = document.getElementById("links");
    links.innerHTML = "";

    for(const prop in info)
    {
        if(prop.substring(prop.length-4) == '_url'){           
            let a = document.createElement('a');
            a.className = "text-capitalize badge badge-success";
            a.href = info[prop];
            a.target= "_blank";
            a.innerText = prop.substring(0, prop.length-5);

            let linkDiv = document.createElement('div')
            linkDiv.className = "col";
            linkDiv.appendChild(a);

            links.appendChild(linkDiv);
        }
    }    
  }