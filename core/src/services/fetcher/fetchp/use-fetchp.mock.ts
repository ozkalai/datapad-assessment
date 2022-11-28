import { FetchpStatus, useFetchpBuilder } from "./use-fetchp";
import { fetchp } from "./fetchp.mock";

const useFetchpMock = useFetchpBuilder(fetchp);

export {
  FetchpStatus,
  useFetchpBuilder,
  useFetchpMock as default,
  useFetchpMock as useFetchp,
};
