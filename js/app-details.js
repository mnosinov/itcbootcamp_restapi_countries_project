// elements of view
const themeSwitcherBtn = document.getElementById('themeSwitcherBtn');
const themeIconImg = document.getElementById('themeIconImg');
const themeTitleDiv = document.getElementById('themeTitleDiv');
const detailsSection = document.getElementById('detailsSection');
const backBtn = document.getElementById('backBtn');

// data
let country;

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

async function showCountry(countryCcn3) {
	let responseData;
	await fetchData(countryCcn3).then( data => {
		responseData = data;
	});
	storeData(responseData);
	showDetails();
}

async function fetchData(cca3) {
	return fetch(`https://restcountries.com/v3.1/alpha/${cca3}`)
		.then(response => response.json())
		.then(responseData => {
			console.log('fetching data from REST API');
			console.log(responseData);
			return responseData;
		});
}

function storeData(fetchedCountries) {
	country = fetchedCountries[0];
}

async function showDetails() {
	const {
		flags, name, population, region, subregion, capital, tld, currencies,
		languages, borders
	} = country;
	let nativeNames = Object.keys(name.nativeName).map( key => name.nativeName[key].official);
	let currenciesNames = Object.keys(currencies).map( key => currencies[key].name);
	let languagesNames = Object.keys(languages).map( key => languages[key]);
	let borderCountriesUl = await fetchBorderCountries(borders);

	detailsSection.innerHTML = `
		<div class="flag-div">
			<img src="${flags.png}" alt="${flags.alt}">
		</div>
		<div class="info">
			<h2>${name.common}</h2>
			<div class="details-info info">
				<div class="first-part">
					<p><span class="label">Native Name:</span> ${nativeNames}</p>
					<p><span class="label">Population:</span> ${population.toLocaleString('en-US')}</p>
					<p><span class="label">Region:</span> ${region}</p>
					<p><span class="label">Sub Region:</span> ${subregion}</p>
					<p><span class="label">Capital:</span> ${capital}</p>
				</div>
				<div class="second-part">
					<p><span class="label">Top Level Domain:</span> ${tld}</p>
					<p><span class="label">Currencies:</span> ${currenciesNames}</p>
					<p><span class="label">Languages:</span> ${languagesNames}</p>
				</div>
			</div>
			<div class="border-countries">
				<p class="label">Border Countries:</p> 
				<ul>${borderCountriesUl}</ul>
			</div>
		</div>
	`;
	// set page title
	document.title = name.common;
}

async function fetchBorderCountries(borders) {
	if (!borders) return "";
	let resultLiList = "";
	for (let borderCountryCc3a of borders) {
		let borderCountry;
		await fetchData(borderCountryCc3a).then( data => {
			borderCountry = data[0];
		});
		resultLiList += `
			<li>
				<a href="?cca3=${borderCountry.cca3}">
					<button class="clickable-btn">${borderCountry.name.common}</button>
				</a>
			</li>
		`;
	}
	return resultLiList;
}

/* data fetching ---------------------------END */

/* event handlers -------------------------BEGIN */
themeSwitcherBtn.addEventListener('click', e => {
	setNextTheme();
});

document.addEventListener('DOMContentLoaded', e => {
	let currentUrlStr = window.location.href;
	let currentUrl = new URL(currentUrlStr);
	const countryCcn3 = currentUrl.searchParams.get("cca3");
	showCountry(countryCcn3);
});

backBtn.addEventListener('click', e => {
	window.location.href = 'index.html';
});
/* event handlers -------------------------END */

let defaultTheme = themes.find( element => element.name === 'theme-light');
initThemes(defaultTheme);
