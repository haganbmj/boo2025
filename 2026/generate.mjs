import fs from 'fs';

const folder = './img';

const remaps = {
    ancestral: { name: 'ancestral' },
    dapper: { name: 'Jamie Stone' },
    kerby: { name: 'Kerby' },
    haganbmj: { name: 'haganbmj' },
    taytay: { name: 'All Day Tay' },
    mystery: { name: 'Mystery Contributors' },
}

const blocks = fs.readdirSync(folder, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(dir => {
        console.log('Traversing subdirectory: ', dir.name);
        const cards = fs.readdirSync(`${folder}/${dir.name}`)
            .filter(file => {
                const ext = file.split('.').pop().toLowerCase();
                return ['jpg', 'jpeg', 'png'].includes(ext);
            })
            .map(file => {
                return `
                    <div class="card">
                        <span class="hidden-label" aria-hidden="true">${file}</span>
                        <img src="./img/${dir.name + '/' + file}" alt="${file}" loading="lazy" />
                    </div>
                `;
            }).join('\n');

        return `
            <section id="${dir.name}">
                <h2>${remaps[dir.name].name}</h2>
                <div class="cards">
                    ${cards}
                </div>
            </section>
        `;
    });

fs.writeFileSync('./generated.html', blocks.join('\n').replace(/^\s*\n/gm, ''));
