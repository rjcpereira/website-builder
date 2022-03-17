let counter = 0;

module.exports = db => {
    counter++;
    let r = db;
    if(counter > 1) r = {
        title: 'cenas',
        body: 'conteudos!!!',
        items: [
            { title: 'okdfa' },
            { title: 54 }
        ],
        articles: [
            { "highlighted": 1, "title": "Imagens de satélite mostram a destruição de apartamentos nos arredores de Kiev, na invasão da Rússia", "path": "/atualidade/artigos/kiev" },
            { "title": "Ucrânia: Número de refugiados ultrapassa barreira dos 2,8 milhões", "path": "/atualidade/artigos/em-direto" }
        ]
    };
    if(counter > 2) r = {
        articles: [
            { "highlighted": 1, "title": "China nega que Rússia tenha pedido apoio militar e acusa EUA de “desinformação”", "path": "/noticias/atualidade" },
            { "highlighted": 1, "title": "Imagens de satélite mostram a destruição de apartamentos nos arredores de Kiev, na invasão da Rússia", "path": "/atualidade/artigos/kiev" },
            { "title": "Ucrânia: Número de refugiados ultrapassa barreira dos 2,8 milhões", "path": "/atualidade/artigos/em-direto" }
        ]
    };
    if(counter > 3) r = {
        articles: [
            { "highlighted": 1, "title": "Ucrânia vai exigir retirada das forças russas na nova ronda negocial. Ataque atinge edifício residencial em Kiev e ajuda a Mariupol ainda bloqueada", "url": "https://google.com/" },
            { "highlighted": 1, "title": "China nega que Rússia tenha pedido apoio militar e acusa EUA de “desinformação”", "path": "/noticias/atualidade" },
            { "highlighted": 1, "title": "Imagens de satélite mostram a destruição de apartamentos nos arredores de Kiev, na invasão da Rússia", "path": "/atualidade/artigos/kiev" },
            { "title": "Ucrânia: Número de refugiados ultrapassa barreira dos 2,8 milhões", "path": "/atualidade/artigos/em-direto" }
        ]
    };
    if(counter > 5) r.articles.push({ "title": "true red year, 2002, color BF1932 pantone_value -1664", "path": "/atualidade/artigos/pantone_value"});
    if(counter > 6) r.articles.push({ "title": "aqua sky year, 2003, color 7BC4C4 pantone_value -4811", "path": "/atualidade/artigos/aqua"});
    if(counter > 7) r.articles.unshift({ "highlighted": 1, "title": "tigerlily year, 2004, color E2583E pantone_value -1456", "path": "/atualidade/artigos/tigerlily"});
    if(counter > 8) r.articles.unshift({ "highlighted": 1, "title": "blue turquoise year, 2005, color 53B0AE pantone_value -5217"});
    if(counter > 9) r.articles.push({  "title": "“A destruição da nossa civilização” só será evitada se Putin e Xi Jinping forem derrubados do poder, diz Soros" });
    if(counter > 10) r.articles.unshift({ "highlighted": 1, "title": "cerulean year, 2000, color 98B2D1 pantone_value -4020"});
    if(counter > 11) r.articles.unshift({ "highlighted": 1, "title": "fuchsia rose year, 2001, color C74375 pantone_value -2031"});
    if(counter > 12) counter = 0; 
    return r;
}