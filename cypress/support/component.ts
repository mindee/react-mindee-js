import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command'
import { mount } from 'cypress/react18'

addMatchImageSnapshotCommand()
Cypress.Commands.add('mount', mount)
