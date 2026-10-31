import MCR from 'monocart-coverage-reports';
import { coverageOptions } from './coverage-options';

export default async function globalSetup() {
  MCR(coverageOptions).cleanCache();
}
