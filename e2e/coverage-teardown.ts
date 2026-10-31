import MCR from 'monocart-coverage-reports';
import { coverageOptions } from './coverage-options';

export default async function globalTeardown() {
  await MCR(coverageOptions).generate();
}
