import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'
import { mount } from 'cypress/react18'

addMatchImageSnapshotCommand({
  failureThreshold: 0.2,
  failureThresholdType: 'percent',
  capture: 'runner',
})
Cypress.Commands.add('mount', mount)
