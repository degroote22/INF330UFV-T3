"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("./array");
const floyd_1 = require("./floyd");
// Na variável array temos somente a distância dos vértices conectados,
// neste caso usa-se o algoritmo de Floyd-Warshall para criar um grafo completo
// onde o peso das arestas é a distância mínima de um vértice até o outro.
const distances = floyd_1.default(array_1.default);
let paths = [];
// Executamos o algoritmo do vizinho mais próximo, iniciando em cada um dos vértices do grafo.
for (let start = 0; start < distances.length; start++) {
    // Escolher o vértice inicial e adicioná-lo à estrutura de dados.
    let path = [{ d: 0, i: start }];
    do {
        const vi = path[path.length - 1].i;
        //encontrar o vk mais proximo do ultimo inserido
        const vk = distances[vi].reduce((prev, curr, index) => {
            const podeInserir = path.findIndex(x => x.i === index) === -1;
            if (index !== vi && curr < prev.d && podeInserir)
                return { d: curr, i: index };
            else
                return prev;
        }, { d: Infinity, i: start });
        //inserir vk apos o ultimo
        path.push(vk);
        //se nao formou ciclo volta ao passo 2
    } while (path[0].i !== path[path.length - 1].i);
    path[path.length - 1].d =
        distances[path[path.length - 2].i][path[path.length - 1].i];
    paths.push({
        route: path.map(x => x.i).join(" => "),
        cost: path.map(x => x.d).reduce((prev, curr) => prev + curr, 0)
    });
}
const menor = paths.reduce((prev, curr) => (curr.cost < prev.cost ? curr : prev), { route: "", cost: Infinity });
console.log(menor);
