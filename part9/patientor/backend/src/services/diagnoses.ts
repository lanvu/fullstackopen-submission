import diagnoseData from "../../data/diagnoses";
import { Diagnosis } from "../types";

const getAll = (): Diagnosis[] => {
  return diagnoseData;
};

export default {
  getAll,
};
