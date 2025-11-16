import { AppDataSource } from "../config/configdb.js";
import { Electivo } from "../entities/electivo.entity.js";

const electivoRepository = AppDataSource.getRepository(Electivo);

export async function createElectivoService(data) {
  const newElectivo = electivoRepository.create(data);
  return await electivoRepository.save(newElectivo);
}

export async function getElectivosService() {
  return await electivoRepository.find();
}