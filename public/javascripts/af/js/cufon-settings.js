function initCufon() {
	Cufon.replace('#header .logo strong, .start + .button', {fontFamily: 'Cantarell-Bold'});
	Cufon.replace('.logo span, #header .call', { fontFamily: 'MarketingScript'});
	Cufon.replace('#header .phone, #nav a, .tags h3, #main table h3', { textShadow: '0 1px 0 rgba(255,255,255,0.5)',fontFamily: 'HelveticaNeue Bold'});
	Cufon.replace('#main h2', { textShadow: '#fff 0 1px, #fff 0 1px', fontFamily: 'Cantarell-Bold'});
	Cufon.replace('.block h3 strong', {textShadow: '0 1px 0 rgba(255,255,255,0.3)', fontFamily: 'Cantarell-Bold'});
	Cufon.replace('.block h3 span', {textShadow: '0 1px 0 rgba(255,255,255,0.3)', fontFamily: 'MarketingScript'});
	Cufon.replace('.start + .button', {textShadow: '0 1px 0 rgba(0,0,0,0.3)'});
}

initCufon();