import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';
import { mount } from 'cypress/react';

addMatchImageSnapshotCommand({
  failureThreshold: 0.2,
  failureThresholdType: 'percent',
  capture: 'runner',
});
Cypress.Commands.add('mount', mount);
