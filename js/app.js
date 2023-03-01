// elements of view
const themeSwitcherBtn = document.getElementById('themeSwitcherBtn');
const themeIconImg = document.getElementById('themeIconImg');
const themeTitleDiv = document.getElementById('themeTitleDiv');
const searchInputTxt = document.getElementById('searchInputTxt');
const cardsSection = document.getElementById('cardSection');
const regionSelect = document.getElementById('regionSelect');



// data
let countries;
let regions;

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
	setNextTheme(defaultTheme);
}

function setNextTheme(defaultTheme=undefined) {
	let currentTheme, nextTheme;
	for (let cls of document.body.classList) {
		currentTheme = themes.find( element => element.name === cls );
		if (currentTheme) break;
	}
	if (currentTheme === undefined) {
		// if no default theme had been passed in, then default is 1st in themese list
		// and check if defaultTheme is in themes
		if (defaultTheme && themes.find( theme => theme === defaultTheme ))
			nextTheme = defaultTheme;
		else
			nextTheme = themes[0];
		// set initial theme
	} else {
		// get the next theme in list cyclically
		let indexOfCurrentTheme = themes.indexOf(currentTheme);
		let nextThemeIndex = (indexOfCurrentTheme + 1) % themes.length;
		// turn off previous theme, turn on the next theme
		nextTheme = themes[nextThemeIndex];
	}
	// remove all themes from body's class list
	themes.forEach( theme => { document.body.classList.remove(theme.name); });
	// add the next theme class to body's class list
	document.body.classList.add(nextTheme.name);
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
			console.log('fetching data from REST API');
			storeData(responseData);
			showList();
		});
}

function storeData(fetchedCountries) {
	countries = fetchedCountries
	initRegions();
}

function showList() {
	console.log(regionSelect.value);
	// filter countries by region filter
	let filteredCountries = countries;
	console.log('quantity of fetched countries', countries.length);
	if (regionSelect.value) {
		filteredCountries = countries.filter( element => element.region === regionSelect.value ); 
	}
	console.log(10);
	console.log(filteredCountries.length);
	
	// filter countries by search string
	let searchString =  searchInputTxt.value.toLowerCase();
	console.log('search by', searchString);
	filteredCountries = filteredCountries.filter( element => element.name.common.toLowerCase().includes(searchString) );
	console.log('search result', filteredCountries);

	// show memes
	cardsSection.innerHTML = "";
	filteredCountries.forEach( country => {
		showCard(country);
	});
}

function showCard(country) {
	const {flags, name: {common:commonName}, population, region, capital} = country
	cardsSection.innerHTML += `
		<div class="card">
			<div class="flag">
				<img src="${flags.png}" alt="${flags.alt}">
			</div>
			<div class="info">
				<h3 class="name">${commonName}</h3>
				<p><span class="label">Population:</span> ${population} 81,770,900</p>
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

/* data fetching ---------------------------END */

/* event handlers -------------------------BEGIN */
themeSwitcherBtn.addEventListener('click', e => {
	setNextTheme();
});

document.addEventListener('DOMContentLoaded', e => {
	fetchData();
});

searchInputTxt.addEventListener('keyup', e => {
	showList();
});

regionSelect.addEventListener('change', e => {
	showList();
});
/* event handlers -------------------------END */

let defaultTheme = themes.find( element => element.name === 'theme-light');
initThemes(defaultTheme);

