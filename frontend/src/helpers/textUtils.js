export const normalizarTexto = (texto) =>
  texto.trim().toLowerCase().split(/\s+/);

export const quitarTildes = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");