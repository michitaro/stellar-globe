import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the @stellarglobe/jupyterlab extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@stellarglobe/jupyterlab:plugin',
  description: 'A JupyterLab extension for StellarGlobe.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension @stellarglobe/jupyterlab is activated!');
  }
};

export default plugin;
