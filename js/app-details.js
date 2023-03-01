// elements of view
const themeSwitcherBtn = document.getElementById('themeSwitcherBtn');
const themeIconImg = document.getElementById('themeIconImg');
const themeTitleDiv = document.getElementById('themeTitleDiv');
const detailsSection = document.getElementById('detailsSection');

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

function fetchData(ccn3) {
	fetch(`https://restcountries.com/v3.1/alpha/${ccn3}`)
		.then(response => response.json())
		.then(responseData => {
			console.log('fetching data from REST API');
			storeData(responseData);
			showDetails();
		});
}

function storeData(fetchedCountries) {
	country = fetchedCountries[0];
	console.log(country);
}

function showDetails() {
	const {flags, name: {common:commonName}, population, region, capital, ccn3} = country;
	/*
	detailsSection.innerHTML += `
		<div class="card">
			<div class="flag">
				<a href="details.html?ccn3=${ccn3}">
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
	*/

}

/* data fetching ---------------------------END */

/* event handlers -------------------------BEGIN */
themeSwitcherBtn.addEventListener('click', e => {
	setNextTheme();
});

document.addEventListener('DOMContentLoaded', e => {
	let currentUrlStr = window.location.href;
	let currentUrl = new URL(currentUrlStr);
	const countryCcn3 = currentUrl.searchParams.get("ccn3");
	fetchData(countryCcn3);
});

/* event handlers -------------------------END */

let defaultTheme = themes.find( element => element.name === 'theme-light');
initThemes(defaultTheme);
