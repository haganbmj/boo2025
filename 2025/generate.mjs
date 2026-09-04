import fs from 'fs';

const folder = './img';

const remaps = {
    ancestral: {
        name: 'ancestral',
    },
    aufbau: {
        name: 'Aufbau',
    },
    darthpinkhippo: {
        name: 'DarthPinkHippo',
    },
    finmint: {
        name: 'FinMint',
    },
    gnolan: {
        name: 'Gnolan',
    },
    haganbmj: {
        name: 'haganbmj',
    },
    iammoonslice: {
        name: 'iammoonslice',
    },
    ianbraverman: {
        name: 'IanBraverman',
    },
    jamiestone: {
        name: 'Jamie Stone',
    },
    kyleferguson: {
        name: 'Kyle Ferguson',
    },
    thelamesauce: {
        name: 'TheLameSauce',
    }
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
