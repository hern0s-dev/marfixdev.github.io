const menu = document.querySelector("#responsive-menu");
const collapseBtn = document.querySelector("#collapse-btn");
const mainRight = document.querySelector(".main-right");
const search = document.querySelector("#search");
const typeFilter = document.querySelector("#type");
const weaknessFilter = document.querySelector("#weakness");
const abilityFilter = document.querySelector("#ability");
const resetBtn = document.querySelector(".reset-button");

let menuOpened = false;
//DROPDOWN WIDGET

const dropdowns = document.querySelectorAll(".dropdown");

document.addEventListener("click", function (event) {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(event.target)) {
      dropdown.querySelector(".menu").classList.remove("menu-open");
    }
  });
  if (collapseBtn.contains(event.target) && !menuOpened) {
    openMenu();
    return;
  } else if (collapseBtn.contains(event.target) && menuOpened) {
    closeMenu();
    return;
  }
  if (
    !menu.contains(event.target) &&
    menuOpened &&
    !collapseBtn.contains(event.target)
  ) {
    closeMenu();
  }
});
function openMenu() {
  menuOpened = true;
  menu.style.top = "100px";
}
function closeMenu() {
  menuOpened = false;
  menu.style.top = "-200px";
}

let Promises = [];
const pokemonDatabaseApiURL = "https://pokeapi.co/api/v2/pokemon/";

function fixImages() {
  let elements = document.querySelectorAll(".pokemon-gif");
  elements.forEach((gifContainer) => {
    let img = gifContainer.querySelector("img");
    // let width = parseInt(img.width);
    img.addEventListener("load", function () {
      let height = parseInt(img.naturalHeight);
      img.style.top = `${-1 * (height / 2)}px`;
      gifContainer.style.height = `${height / 2}px`;
    });
    // let auto = getComputedStyle(img);
    // console.dir(img);
    // console.log(`${img.height} ${img.clientHeight} ${img.naturalHeight}`);

    //let height = 60;

    //   console.log(`Width : ${width} Height ${height}`);
    //   console.log(gifContainer.style.height);
  });
}

let Pokemons = [];
const pokemonContainer = document.querySelector(".pokemons");

function getPokemonFromArray(index) {
  return Pokemons.filter((pokemon) => pokemon.id === index)[0];
}
async function FetchPokemons(from, to) {
  Promises = [];

  console.log(`FROM ${from} TO ${to}`);
  for (let i = from; i <= to; i++) {
    const url = pokemonDatabaseApiURL + i;
    Promises.push(fetch(url).then((res) => res.json()));
  }
  await Promise.all(Promises).then((results) => {
    Pokemons = [...results];
    console.dir(results);
  });
}

async function populatePokemons(config) {
  if (config.forceLoad) {
    await FetchPokemons(parseInt(config.from), parseInt(config.to));
  }
  const filters = {
    name: search.value,
    type: typeFilter.getAttribute("value"),
    weakness: weaknessFilter.getAttribute("value"),
    ability: abilityFilter.getAttribute("value"),
  };
  let newPokemons = [...Pokemons];
  if (filters !== undefined && filters.name !== "") {
    newPokemons = [
      ...Pokemons.filter((pokemon) => pokemon.name.includes(filters.name)),
    ];

    //console.log(newPokemons);
  }
  if (filters.type !== "") {
    newPokemons = newPokemons.filter((pokemon) => {
      let contains = false;
      for (type of pokemon.types) {
        //console.log(type.type.name);
        if (type.type.name === filters.type) {
          contains = true;
          break;
        }
      }
      return contains;
    });
  }

  // NOT USED.
  // if (config.filter.weakness !== "") {
  //   newPokemons = newPokemons.filter((pokemon) => {
  //     let contains = false;
  //     for (type of pokemon.types) {
  //       console.log(type.type.name);
  //       if (type.type.name === config.filter.type) {
  //         contains = true;
  //         break;
  //       }
  //     }
  //     return contains;
  //   });
  // }

  if (filters.ability !== "") {
    newPokemons = newPokemons.filter((pokemon) => {
      let contains = false;
      for (ability of pokemon.abilities) {
        if (ability.ability.name === filters.ability) {
          contains = true;
          break;
        }
      }
      return contains;
    });
  }
  let abilityList = [];
  pokemonContainer.innerHTML = ``;
  const abilityDropdown = abilityFilter;
  const abilityMenu = abilityDropdown.parentElement.nextElementSibling;
  newPokemons.forEach((pokemon) => {
    pokemon.abilities.forEach((ability) => {
      if (!abilityList.includes(ability.ability.name)) {
        abilityList.push(ability.ability.name);
        let liElement = document.createElement("li");
        liElement.innerText = `${ability.ability.name}`;
        liElement.classList.add("menu-item");
        abilityMenu.appendChild(liElement);

        liElement.addEventListener("click", function () {
          let menu = this.parentElement;
          const items = menu.querySelectorAll("li");
          let icon =
            menu.previousElementSibling.firstElementChild.nextElementSibling
              .nextElementSibling;
          const selected =
            this.parentElement.previousElementSibling.firstElementChild
              .nextElementSibling;
          selected.setAttribute("value", this.innerText.toLowerCase());
          selected.innerText = this.innerText;
          icon.classList.remove("dropdown-icon-rotate");
          menu.classList.remove("menu-open");
          populatePokemons({
            forceLoad: false,
            from: 1,
            to: 500,
          });
          items.forEach((item) => {
            item.classList.remove("menu-item-selected");
          });
          this.classList.add("menu-item-selected");
        });
      }
    });

    let badges = ``;
    pokemon.types.forEach((type) => {
      let badgeHTML = `<span class="custom-badge ${type.type.name} rounded">${type.type.name}</span>`;
      badges += badgeHTML;
    });
    const element = document.createElement("div");
    element.classList.add("p-2", "col", "rounded", "pokemon-card");
    element.innerHTML = `
                    <div class="pokemon-card-inner bg-light rounded-4">
                      <div class="pokemon-gif">
                        <img
                          src="https://raw.githubusercontent.com/geekygreek7/animated-pokemon-gifs/master/${pokemon.id}.gif"
                          alt=""
                        />
                      </div>
                      <p
                        class="mt-3 text-center fw-bold number-font"
                        style="color: #959ca7"
                      >
                        <i class="fa-solid fa-hashtag fa-xs"></i>${pokemon.id}
                      </p>
                      <p class="text-center pokemon-name mb-2">${pokemon.name}</p>
                      <div class="w-100 d-flex justify-content-center">
                        <p class="text-center d-flex justify-content-center gap-2">
                          ${badges}
                        </p>
                      </div>
                    </div>
          `;
    element.setAttribute("index", pokemon.id);
    pokemonContainer.appendChild(element);

    element.addEventListener("click", function () {
      let pokemonIndex = parseInt(this.getAttribute("index"));
      generateInformationCard(pokemonIndex);
    });
  });
  fixImages();
}

//Loop through all dropdown elements
dropdowns.forEach((dropdown) => {
  //Get inner elements from each dropdown
  const select = dropdown.querySelector(".select");
  const icon = dropdown.querySelector(".dropdown-icon");
  const menu = dropdown.querySelector(".menu");
  const items = dropdown.querySelectorAll(".menu li");
  const selected = dropdown.querySelector(".selected");

  select.addEventListener("click", () => {
    //select.classList.toggle('select-clicked');
    icon.classList.toggle("dropdown-icon-rotate");
    dropdowns.forEach((otherDropdown) => {
      if (dropdown !== otherDropdown) {
        const menu = otherDropdown.querySelector(".menu");
        menu.classList.remove("menu-open");
      }
    });
    menu.classList.toggle("menu-open");
  });

  //Loop through all item elements
  items.forEach((item) => {
    item.addEventListener("click", function () {
      //alert(this.innerText.toLowerCase());
      selected.setAttribute("value", this.innerText.toLowerCase());
      selected.innerText = this.innerText;
      icon.classList.remove("dropdown-icon-rotate");
      menu.classList.remove("menu-open");
      populatePokemons({
        forceLoad: false,
        from: 1,
        to: 500,
      });
      items.forEach((item) => {
        item.classList.remove("menu-item-selected");
      });
      this.classList.add("menu-item-selected");
    });
  });
});

let rangeSearchBtn = document.querySelector("#search-range-btn");
rangeSearchBtn.addEventListener("click", () => {
  let minValue = document.querySelector("#from").value;
  let maxValue = document.querySelector("#to").value;
  if (minValue < 1) {
    document.querySelector("#from").value = 1;
    minValue = 1;
  }
  if (maxValue < minValue) {
    maxValue = minValue;
    document.querySelector("#to").value = maxValue;
  }
  //alert(minValue);
  populatePokemons({
    forceLoad: true,
    from: minValue,
    to: maxValue,
  });
});

populatePokemons({
  forceLoad: true,
  from: 1,
  to: 50,
});
resetBtn.addEventListener("click", () => {
  typeFilter.innerText = "Type";
  weaknessFilter.innerText = "Weakness";
  abilityFilter.innerText = "Ability";

  typeFilter.setAttribute("value", "");
  weaknessFilter.setAttribute("value", "");
  abilityFilter.setAttribute("value", "");

  populatePokemons({
    forceLoad: false,
    from: 1,
    to: 500,
  });
});
search.addEventListener("input", function () {
  populatePokemons({
    forceLoad: false,
    from: 1,
    to: 500,
  });
});
async function generateInformationCard(pokemonIndex) {
  let pokemonObject = getPokemonFromArray(pokemonIndex);
  let flavorText = "";
  await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`)
    .then((res) => res.json())
    .then((data) => {
      const enFlavors = data["flavor_text_entries"].filter((element) => {
        return element.language.name == "en";
      });

      flavorText =
        enFlavors[Math.floor(Math.random() * (enFlavors.length - 1))][
          "flavor_text"
        ];
    });
  let badges = ``;
  let abilities = ``;

  pokemonObject.types.forEach((type) => {
    let badgeHTML = `<span class="custom-badge ms-1 ${type.type.name} rounded">${type.type.name}</span>`;
    badges += badgeHTML;
  });
  pokemonObject.abilities.forEach((ability) => {
    let abilityHTML = `<div
    class="stat-background border-secondary col-5 rounded-pill py-1 text-center"
  >
    <p class="stat-text capitalize">${ability.ability.name}</p>
  </div>`;
    abilities += abilityHTML;
  });
  let innerDiv = document.createElement("div");
  //innerDiv.classList.add("sticky-top");
  innerDiv.innerHTML = `
    <div class="mt-4 pokemon-splash d-flex  justify-content-center">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonIndex}.png"
              alt=""
              width="200"
              height="200"
            />
          </div>
          <div>
            <p
              class="fw-bold text-center number-font fs-5 mt-3"
              style="color: #959ca7"
            >
              #${pokemonIndex}
            </p>
            <p class="fw-bold text-center roboto fs-4 capitalize">${
              pokemonObject.name
            }</p>
            <p class="text-center mt-1">
              ${badges}
            </p>
            <p class="flavor-text text-center fs-6 p-0"></p>
            <p class="text-center fs-6 fw-bold roboto mb-1">ABILITIES</p>
            <div id="abilities" class="row justify-content-evenly row-gap-2">
              ${abilities}
            </div>
            <div id="info" class="row justify-content-evenly mt-4">
              <div class="col-5 left px-0">
                <p class="text-center fw-bold roboto stat-title mb-1">HEIGHT</p>
                <div
                  class="stat-background border border-0 rounded-pill py-1 mb-3 text-center w-100"
                >
                  <p class="stat-text roboto">${pokemonObject.height}m</p>
                </div>
                <p class="text-center fw-bold roboto stat-title mb-1">
                  WEAKNESESS
                </p>
                <div
                  class="stat-background border border-0 rounded-pill py-1 text-center w-100"
                >
                  <p class="stat-text roboto">Lorem</p>
                </div>
              </div>
              <div class="col-5 right px-0">
                <p class="text-center fw-bold roboto stat-title mb-1">WEIGHT</p>
                <div
                  class="stat-background border border-0 rounded-pill mb-3 py-1 text-center"
                >
                  <p class="stat-text roboto">${pokemonObject.weight}Kg</p>
                </div>
                <p class="text-center fw-bold roboto stat-title mb-1">
                  BASE EXP
                </p>
                <div
                  class="stat-background border border-0 rounded-pill py-1 text-center w-100"
                >
                  <p class="stat-text roboto">${
                    pokemonObject.base_experience
                  }</p>
                </div>
              </div>
            </div>
            <div id="stats" class="my-4">
              <p class="text-center fw-bold roboto stat-title mb-1">STATS</p>
              <div class="d-flex justify-content-center gap-1 px-3 flex-wrap">
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-hp rounded-circle text-light fw-bold roboto"
                  >
                    <div>HP</div>
                  </div>
                  <p class="roboto mb-0 mt-1">${
                    pokemonObject.stats[0].base_stat
                  }</p>
                </div>
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-atk rounded-circle text-light fw-bold roboto"
                  >
                    <div>ATK</div>
                  </div>
                  <p class="roboto mb-0 mt-1">${
                    pokemonObject.stats[1].base_stat
                  }</p>
                </div>
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-def rounded-circle text-light fw-bold roboto"
                  >
                    <div>DEF</div>
                  </div>
                  <p class="roboto mb-0 mt-1">${
                    pokemonObject.stats[2].base_stat
                  }</p>
                </div>
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-spa rounded-circle text-light fw-bold roboto"
                  >
                    <div>SpA</div>
                  </div>
                  <p class="roboto mb-0 mt-1">${
                    pokemonObject.stats[3].base_stat
                  }</p>
                </div>
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-spd rounded-circle text-light fw-bold roboto"
                  >
                    <div>SpD</div>
                  </div>
                  <p class="roboto mb-0 mt-1">${
                    pokemonObject.stats[4].base_stat
                  }</p>
                </div>
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-speed rounded-circle text-light fw-bold roboto"
                  >
                    <div>SPD</div>
                  </div>
                  <p class="roboto mb-0 mt-1">${
                    pokemonObject.stats[5].base_stat
                  }</p>
                </div>
                <div
                  class="text-center rounded-pill stat-background stat-pill"
                  style="background-color: #8fb1ff"
                >
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-tot rounded-circle text-light fw-bold roboto"
                  >
                    <div>TOT</div>
                  </div>
                  <p class="roboto mb-0 mt-1">${Math.floor(
                    pokemonObject.stats[0].base_stat +
                      pokemonObject.stats[1].base_stat +
                      pokemonObject.stats[2].base_stat +
                      pokemonObject.stats[3].base_stat +
                      pokemonObject.stats[4].base_stat +
                      pokemonObject.stats[5].base_stat
                  )}</p>
                </div>
              </div>
            </div>
          </div>
    `;
  mainRight.innerHTML = innerDiv.outerHTML;
  const flavor = document.querySelector(".flavor-text");
  flavor.innerText = flavorText;
}

{
  /* <div class="mt-4 pokemon-splash d-flex justify-content-center">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/24.png"
              alt=""
              width="200"
              height="200"
            />
          </div>
          <div>
            <p
              class="fw-bold text-center number-font fs-5 mt-3"
              style="color: #959ca7"
            >
              #395
            </p>
            <p class="fw-bold text-center roboto fs-4">Empoleon</p>
            <p class="text-center mt-1">
              <span class="custom-badge grass rounded">Grass</span>
              <span class="custom-badge fire rounded">Fire</span>
            </p>
            <p class="flavor-text text-center fs-6 p-0"></p>
            <p class="text-center fs-6 fw-bold roboto mb-1">ABILITIES</p>
            <div id="abilities" class="row justify-content-evenly">
              <div
                class="stat-background border-secondary col-5 rounded-pill py-1 text-center"
              >
                <p class="stat-text">torrent</p>
              </div>
              <div
                class="stat-background border-secondary col-5 rounded-pill py-1 text-center"
              >
                <p class="stat-text">competitive</p>
              </div>
            </div>
            <div id="info" class="row justify-content-evenly mt-4">
              <div class="col-5 left px-0">
                <p class="text-center fw-bold roboto stat-title mb-1">HEIGHT</p>
                <div
                  class="stat-background border border-0 rounded-pill py-1 mb-3 text-center w-100"
                >
                  <p class="stat-text roboto">1.7m</p>
                </div>
                <p class="text-center fw-bold roboto stat-title mb-1">
                  WEAKNESESS
                </p>
                <div
                  class="stat-background border border-0 rounded-pill py-1 text-center w-100"
                >
                  <p class="stat-text roboto">1.7m</p>
                </div>
              </div>
              <div class="col-5 right px-0">
                <p class="text-center fw-bold roboto stat-title mb-1">WEIGHT</p>
                <div
                  class="stat-background border border-0 rounded-pill mb-3 py-1 text-center"
                >
                  <p class="stat-text roboto">84.5Kg</p>
                </div>
                <p class="text-center fw-bold roboto stat-title mb-1">
                  BASE EXP
                </p>
                <div
                  class="stat-background border border-0 rounded-pill py-1 text-center w-100"
                >
                  <p class="stat-text roboto">239</p>
                </div>
              </div>
            </div>
            <div id="stats" class="mt-3">
              <p class="text-center fw-bold roboto stat-title mb-1">STATS</p>
              <div class="d-flex justify-content-between px-3">
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-hp rounded-circle text-light fw-bold roboto"
                  >
                    <div>HP</div>
                  </div>
                  <p class="roboto mb-0 mt-1">84</p>
                </div>
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-atk rounded-circle text-light fw-bold roboto"
                  >
                    <div>ATK</div>
                  </div>
                  <p class="roboto mb-0 mt-1">86</p>
                </div>
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-def rounded-circle text-light fw-bold roboto"
                  >
                    <div>DEF</div>
                  </div>
                  <p class="roboto mb-0 mt-1">88</p>
                </div>
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-spa rounded-circle text-light fw-bold roboto"
                  >
                    <div>SpA</div>
                  </div>
                  <p class="roboto mb-0 mt-1">111</p>
                </div>
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-spd rounded-circle text-light fw-bold roboto"
                  >
                    <div>SpD</div>
                  </div>
                  <p class="roboto mb-0 mt-1">101</p>
                </div>
                <div class="text-center rounded-pill stat-background stat-pill">
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-speed rounded-circle text-light fw-bold roboto"
                  >
                    <div>SPD</div>
                  </div>
                  <p class="roboto mb-0 mt-1">60</p>
                </div>
                <div
                  class="text-center rounded-pill stat-background stat-pill"
                  style="background-color: #8fb1ff"
                >
                  <div
                    class="stat-icon d-flex justify-content-center align-items-center stat-tot rounded-circle text-light fw-bold roboto"
                  >
                    <div>TOT</div>
                  </div>
                  <p class="roboto mb-0 mt-1">530</p>
                </div>
              </div>
            </div>
          </div> */
}

// fetch("https://pokeapi.co/api/v2/pokemon-species/25/")
//   .then((res) => res.json())
//   .then((data) => {
//     const enFlavors = data["flavor_text_entries"].filter((element) => {
//       return element.language.name == "en";
//     });

//     const flavor = document.querySelector(".flavor-text");
//     const flavorText =
//       enFlavors[Math.floor(Math.random() * (enFlavors.length - 1))][
//         "flavor_text"
//       ];
//     // console.log(flavorText);
//     flavor.innerText = flavorText;
//   });

//EXAMPLE POKEMON CARD

/* <div class="p-2 col rounded pokemon-card">
              <div class="pokemon-card-inner bg-light rounded-4">
                <div class="pokemon-gif">
                  <img
                    src="https://raw.githubusercontent.com/geekygreek7/animated-pokemon-gifs/master/26.gif"
                    alt=""
                  />
                </div>
                <p
                  class="mt-3 text-center fw-bold number-font"
                  style="color: #959ca7"
                >
                  <i class="fa-solid fa-hashtag fa-xs"></i>19
                </p>
                <p class="text-center pokemon-name mb-2">Turtwig</p>
                <div class="w-100 d-flex justify-content-center">
                  <p class="text-center">
                    <span class="custom-badge ground rounded">Ground</span>
                    <span class="custom-badge grass rounded">Grass</span>
                    <span class="custom-badge fire rounded">Fire</span>
                  </p>
                </div>
              </div>
            </div> */

//https://raw.githubusercontent.com/geekygreek7/animated-pokemon-gifs/master/${i}.gif ANIMATED
//https://pokeapi.co/api/v2/pokemon/ Pokemon Database
