import distMatrixInit from "./array";
import floydWarshall from "./floyd";

interface Path {
  route: string;
  cost: number;
}

interface DistanceIndex {
  d: number;
  i: number;
}

// Na variável array temos somente a distância dos vértices conectados,
// neste caso usa-se o algoritmo de Floyd-Warshall para criar um grafo completo
// onde o peso das arestas é a distância mínima de um vértice até o outro.
const distMatrix = floydWarshall(distMatrixInit);

let paths: Path[] = [];

// Executamos a heurística do vizinho mais próximo (Bellmore Nemhau),
// iniciando em cada um dos vértices do grafo.
for (let start = 0; start < distMatrix.length; start++) {
  // Escolher o vértice inicial e adicioná-lo à estrutura de dados.
  // Para representar o caminho usa-se um array contendo o vértice e a distância percorrida
  // pra chegar nele partindo do vértice anterior do grafo.
  let path: DistanceIndex[] = [{ d: 0, i: start }];

  do {
    // Vi representa o vértice atual.
    const vi = path[path.length - 1].i;

    // Encontrar o vértice vk mais próximo do vértice atual vi
    // e que já não esteja inserido no caminho.
    const vk = distMatrix[vi].reduce(
      (prev: DistanceIndex, curr, index): DistanceIndex => {
        const podeInserir = path.findIndex(x => x.i === index) === -1;
        if (index !== vi && curr < prev.d && podeInserir)
          return { d: curr, i: index };
        else return prev;
      },
      { d: Infinity, i: start }
    );

    // Inserir vk após o último vértice do caminho
    path.push(vk);

    // Se o último vértice for igual ao primeiro, completou o caminho e pode sair do loop.
  } while (path[0].i !== path[path.length - 1].i);

  // Devido a um detalhe de implementação o último passo do grafo fica com distância infinita.
  // Corrige-se o erro colocando a distância do penúltimo vértice do caminho até o vértice inicial.
  path[path.length - 1].d =
    distMatrix[path[path.length - 2].i][path[path.length - 1].i];

  // Coloca o custo e a rota deste caminho no array de caminhos.
  paths.push({
    route: path.map(x => x.i).join(" => "),
    cost: path.map(x => x.d).reduce((prev, curr) => prev + curr, 0)
  });
}

// Acha o menor dos caminhos.
const menor = paths.reduce(
  (prev, curr) => (curr.cost < prev.cost ? curr : prev),
  { route: "", cost: Infinity }
);

// Mostra ele no console.
console.log(menor);
