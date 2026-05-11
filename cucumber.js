module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/support/**/*.ts', 'step-definitions/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: ['progress', 'html:reports/report.html'],
  },
};
