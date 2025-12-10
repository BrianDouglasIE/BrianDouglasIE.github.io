const header = document.querySelector('.post header');
const headerTags = document.querySelectorAll('.post .body h2, .post .body h3')

const anchors = []

let currentH2;
let tagCount = 0;

for(const tag of headerTags)
{
	tag.setAttribute('id', (tagCount++).toString())
	const text = tag.textContent.trim()
	if(tag.tagName === 'H2')
	{
		currentH2 = text;
	}

	const a = document.createElement('a')
	a.innerText = text
	a.setAttribute('href', '#' + tag.getAttribute('id'))

	if(tag.tagName === 'H3')
	{
		a.classList.add('subheader')
	}

	anchors.push(a)
}

if(anchors.length) {
	const skipToSection = document.createElement('div')
	skipToSection.classList.add('skip-to-section')
	for(const a of anchors)
	{
		skipToSection.appendChild(a)
	}
	header.appendChild(skipToSection)
}
