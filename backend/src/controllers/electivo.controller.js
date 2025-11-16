import { createElectivoService, getElectivosService } from "../services/electivo.service.js";
import { electivoBodyValidation } from "../validations/electivo.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function createElectivo(req, res) {
  try {
    const { error, value } = electivoBodyValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

    const newElectivo = await createElectivoService(value);
    handleSuccess(res, 201, "Electivo creado exitosamente", newElectivo);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getElectivos(req, res) {
  try {
    const electivos = await getElectivosService();
    handleSuccess(res, 200, "Lista de electivos", electivos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}