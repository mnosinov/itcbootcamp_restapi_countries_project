// elements of view
const themeSwitcherBtn = document.getElementById('themeSwitcherBtn');
const themeIconImg = document.getElementById('themeIconImg');
const themeTitleDiv = document.getElementById('themeTitleDiv');
const searchInputTxt = document.getElementById('searchInputTxt');
const cardsSection = document.getElementById('cardSection');
const regionSelect = document.getElementById('regionSelect');
const totalCountriesSpan = document.getElementById('totalCountriesSpan');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const sortingDefaultA = document.getElementById('sortingDefaultA');
const sortingByNameA = document.getElementById('sortingByNameA');
const sortingByPopulationA = document.getElementById('sortingByPopulationA');

// data
let countries;
let regions;
let currentPage = 1;
let currentSortingBy = 'default';	//in undefined then it means sort by default;
let currentSortingDirection;

/* style themes ----------------------------BEGIN */
let themes = [
	{ name: 'theme-light', cssFile: 'css/style-theme-light.css', themeIcon: 'images/icon-theme-light.svg', title: 'Light Mode' },
	{ name: 'theme-dark', cssFile: 'css/style-theme-dark.css', themeIcon: 'images/icon-theme-dark.svg', title: 'Dark Mode'  }
];

function initThemes(defaultTheme) { // should be called once on page load.
	// add css files of all themes
	let head  = document.getElementsByTagName('head')[0];
	themes.forEach( theme => {
		let link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = theme.cssFile;
		head.appendChild(link);
	});
	// set default theme
	let currentTheme = getCurrentTheme(defaultTheme); 
	// remove all themes from body's class list
	removeAllThemesFromBodyClasses();
	// add the next theme class to body's class list
	setThemeToBodyClasses(currentTheme);
	// set current theme switcher label
	setCurrentThemeSwitcherLabel(currentTheme);
}

function getCurrentTheme(defaultTheme=undefined) {
	let currentTheme;
	for (let cls of document.body.classList) {
		currentTheme = themes.find( element => element.name === cls );
		if (currentTheme) return currentTheme;
	}
	// theme is not set
	// if no default theme had been passed in, then default is 1st in themese list
	// and check if defaultTheme is in themes
	if (defaultTheme && themes.find( theme => theme === defaultTheme ))
		currentTheme = defaultTheme;
	else
		currentTheme = themes[0];
	// set initial theme
	return currentTheme;
}

// add the next theme class to body's class list
function setThemeToBodyClasses(theme) {
	document.body.classList.add(theme.name);
}

// remove all themes from body's class list
function removeAllThemesFromBodyClasses() {
	themes.forEach( theme => { document.body.classList.remove(theme.name); });
}

function getNextTheme(currentTheme) {
	// get the next theme in list cyclically
	let indexOfCurrentTheme = themes.indexOf(currentTheme);
	let nextThemeIndex = (indexOfCurrentTheme + 1) % themes.length;
	let nextTheme = themes[nextThemeIndex];
	return nextTheme;
}

function setNextTheme(defaultTheme=undefined) {
	let currentTheme = getCurrentTheme(defaultTheme); 
	
	let nextTheme = getNextTheme(currentTheme);
	// remove all themes from body's class list
	removeAllThemesFromBodyClasses();
	// add the next theme class to body's class list
	setThemeToBodyClasses(nextTheme);
	// set current theme switcher label
	setCurrentThemeSwitcherLabel(nextTheme);
}

function setCurrentThemeSwitcherLabel(theme) {
	if (theme) {
		// get the next theme icon and label
		let nextThemeIndex = (themes.indexOf(theme) + 1) % themes.length;
		let nextTheme = themes[nextThemeIndex];
		themeIconImg.src = nextTheme.themeIcon;
		themeIconImg.alt = `${nextTheme.title} Icon`;
		themeTitleDiv.innerHTML = nextTheme.title;
	}
}
/* style themes ----------------------------END */

/* data fetching ---------------------------BEGIN */

function fetchData() {
	fetch(`https://restcountries.com/v3.1/all`)
		.then(response => response.json())
		.then(responseData => {
			storeData(responseData);
			showList();
		});
}

function storeData(fetchedCountries) {
	countries = fetchedCountries
	initRegions();
}

function gotoPage(pageNumber) {
	currentPage = pageNumber;
	showList();
}

function applySorting(items) {
	if (currentSortingBy === 'default') return items.slice();
	if (currentSortingBy === 'name') {
		let result = items.slice();
		result.sort( (a, b) => {
			if (currentSortingDirection === 'asc') {
				return a.name.common.toLowerCase().localeCompare(b.name.common.toLowerCase());
			} else {
				return b.name.common.toLowerCase().localeCompare(a.name.common.toLowerCase());
			}
		});
		console.log(result);
		return result;
	}
	if (currentSortingBy === 'population') {
		console.log(103);
		return items.slice().sort( (a, b) => {
			if (currentSortingDirection === 'asc')
				return a.population - b.population;
			else
				return b.population - a.population;
		});
	}
}

function applyPagination(items) {
	let pageSize = +pageSizeSelect.value;
	let totalQnt = items.length;
	let pagesQnt = totalQnt / pageSize;
	if (pagesQnt !== Math.trunc(pagesQnt)) {
		// add 1 page
		pagesQnt = Math.trunc(pagesQnt) + 1;
	}
	let itemsToShowStartIndex = pageSize * (currentPage - 1);
	// display pagination nav
	let paginationNav;
	if (items.length === 0) {
		paginationNav = "";
	} else {
		paginationNav = `
			<button class="pagination-nav-btn" ${ currentPage === 1 ? "disabled": ""}
				onclick="gotoPage(1)"
			>
				First
			</button>
			<button class="pagination-nav-btn" ${ currentPage === 1 ? "disabled": ""}
				onclick="gotoPage(${currentPage - 1})"
			>
				Prev
			</button>
			<span class="current-page">${currentPage}</span>
			<button class="pagination-nav-btn" ${ currentPage === pagesQnt ? "disabled": ""}
				onclick="gotoPage(${currentPage + 1})"
			>
				Next
			</button>
			<button class="pagination-nav-btn" ${ currentPage === pagesQnt ? "disabled": ""}
				onclick="gotoPage(${pagesQnt})"
			>
				Last
			</button>
		`;
	}
	let paginationNavDivs = document.querySelectorAll('.pagination-nav');
	paginationNavDivs.forEach( div => {
		div.innerHTML = paginationNav;
	});
	return items.slice(itemsToShowStartIndex, itemsToShowStartIndex + pageSize);
}

function showList() {
	// filter countries by region filter
	let filteredCountries = countries;
	if (regionSelect.value) {
		filteredCountries = countries.filter( element => element.region === regionSelect.value ); 
	}
	
	// filter countries by search string
	let searchString =  searchInputTxt.value.toLowerCase();
	filteredCountries = filteredCountries.filter( element => element.name.common.toLowerCase().includes(searchString) );

	// apply sorting
	let filtredSortedCountries = applySorting(filteredCountries);
	console.log(filtredSortedCountries);

	// set up pagination
	let pageItems = applyPagination(filtredSortedCountries);

	// show countries cards
	cardsSection.innerHTML = "";
	pageItems.forEach( country => {
		showCard(country);
	});
	// show total info
	totalCountriesSpan.innerHTML = filteredCountries.length;
}

function gotoDetailsPage(cca3) {
	window.location.href = `details.html?cca3=${cca3}&theme=${getCurrentTheme().name}`;
}

function showCard(country) {
	const {flags, name: {common:commonName}, population, region, capital, cca3} = country;
	cardsSection.innerHTML += `
		<div class="card">
			<div class="flag">
				<a href="javascript:gotoDetailsPage('${cca3}');">
					<img src="${flags.png}" alt="${flags.alt}">
				</a>
			</div>
			<div class="info">
				<h3 class="name">${commonName}</h3>
				<p><span class="label">Population:</span> ${population.toLocaleString('en-US')}</p>
				<p><span class="label">Region:</span> ${region}</p>
				<p><span class="label">Capital:</span> ${capital}</p>
			</div>
		</div>
	`;

}

function initRegions() {
	// fill in regions array
	regions = [];
	countries.forEach( country => {
		let region = country.region;
		if (!regions.includes(region)) regions.push(region);
	});
	// init select of regions
	regionSelect.innerHTML = '<option value="">Filter by Region</option>';
	regions.forEach( region => {
		regionSelect.innerHTML += `<option value=${region}>${region}</option>`;
	});
}

function setSorting(newSortBy) {
	// change sorting variables: by and direction
	if (currentSortingBy !== newSortBy) {
		currentSortingBy = newSortBy;
		currentSortingDirection = 'asc';
	} else {
		currentSortingDirection = currentSortingDirection === 'asc' ? 'desc': 'asc';
	}
	// setup sorting element on page
	let sortingDirectionSymbol = currentSortingDirection === 'asc' ? '&uarr;' : '&darr';
	sortingDefaultA.style.fontWeight = currentSortingBy === 'default' ? 'bold' : 'normal';
	// reset the rest sorting elements
	sortingByNameA.innerHTML = 'Name&uarr;';
	sortingByNameA.style.fontWeight = 'normal';
	sortingByPopulationA.innerHTML = 'Population&uarr;'
	sortingByPopulationA.style.fontWeight = 'normal';
	switch (currentSortingBy) {
		case 'name':
			sortingByNameA.style.fontWeight = 'bold'
			if (currentSortingDirection === 'desc') {
				sortingByNameA.innerHTML = 'Name&darr;';
			}
			break;
		case 'population':
			sortingByPopulationA.style.fontWeight = 'bold';
			if (currentSortingDirection === 'desc') {
				sortingByPopulationA.innerHTML = 'Population&darr;';
			}
			break;
	}
}
/* data fetching ---------------------------END */

/* event handlers -------------------------BEGIN */
themeSwitcherBtn.addEventListener('click', e => {
	setNextTheme();
});

document.addEventListener('DOMContentLoaded', e => {
	let currentUrlStr = window.location.href;
	let currentUrl = new URL(currentUrlStr);
	let countryCcn3 = currentUrl.searchParams.get("cca3");
	let currentThemeName = currentUrl.searchParams.get("theme");
	let currentTheme;
	if (currentThemeName) {
		currentTheme = themes.find( element => element.name === currentThemeName );
	} else {
		currentTheme = getCurrentTheme(defaultTheme); 
	}

	// remove all themes from body's class list
	removeAllThemesFromBodyClasses();
	// add the next theme class to body's class list
	setThemeToBodyClasses(currentTheme);
	// set current theme switcher label
	setCurrentThemeSwitcherLabel(currentTheme);

	fetchData();
});

searchInputTxt.addEventListener('keyup', e => {
	currentPage = 1;
	showList();
});

regionSelect.addEventListener('change', e => {
	currentPage = 1;
	showList();
});

pageSizeSelect.addEventListener('change', e => {
	currentPage = 1;
	showList();
});

sortingDefaultA.addEventListener('click', e => {
	e.preventDefault();
	setSorting('default');
	showList();
});
sortingByNameA.addEventListener('click', e => {
	e.preventDefault();
	setSorting('name');
	showList();
});
sortingByPopulationA.addEventListener('click', e => {
	e.preventDefault();
	setSorting('population');
	showList();
});


/* event handlers -------------------------END */

let defaultTheme = themes.find( element => element.name === 'theme-light');
initThemes(defaultTheme);
setSorting(currentSortingBy);
