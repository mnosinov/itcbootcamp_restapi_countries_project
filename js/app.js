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
	let currentTheme;
	for (let cls of document.body.classList) {
		if (themes.includes(cls)) {
			currentTheme = cls;
			break;
		}
	}
	if (currentTheme === undefined) {
		// if no default theme had been passed in, then default is 1st in themese list
		// and check if defaultTheme is in themes
		if (defaultTheme && themes.find( theme => theme === defaultTheme )) {
			currentTheme = defaultTheme;
		} else {
			currentTheme = themes[0];
		}
		// set initial theme
		let indexOfCurrentTheme = themes.indexOf(currentTheme);
		document.body.classList.add(themes[indexOfCurrentTheme].name);
	} else {
		// get the next theme in list cyclically
		let indexOfCurrentTheme = themes.indexOf(currentTheme);
		let nextThemeIndex = (indexOfCurrentTheme + 1) % themes.length;
		// turn off previous theme, turn on the next theme
		document.body.classList.remove(themes[indexOfCurrentTheme].name);
		document.body.classList.add(themes[nextThemeIndex].name);
	}
}

/* style themes ----------------------------END */
let defaultTheme = themes.find( element => element.name === 'theme-dark');
initThemes(defaultTheme);

console.log("hello!!!");
