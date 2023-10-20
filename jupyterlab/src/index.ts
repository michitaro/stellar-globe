import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab-stellar-globe extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-stellar-globe:plugin',
  description: '',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-stellar-globe is activated!');
  }
};

export default plugin;
