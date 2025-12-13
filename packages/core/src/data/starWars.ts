export async function getLukeSkywalker() {
  const res = await fetch('https://swapi.dev/api/people/1');

  const data = await res.json();

  return data;
}

export async function getR2() {
  const res = await fetch('https://swapi.dev/api/people/3');

  const data = await res.json();

  return data;
}

export async function getC3p0() {
  const res = await fetch('https://swapi.dev/api/people/2');

  const data = await res.json();

  return data;
}

export async function getVader() {
  const res = await fetch('https://swapi.dev/api/people/6');

  const data = await res.json();

  return data;
}
