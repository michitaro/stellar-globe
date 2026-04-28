module.exports = {
  resolve: {
    alias: {
      'process/browser$': require.resolve('process/browser'),
      'react$': require.resolve('react'),
      'react-dom$': require.resolve('react-dom'),
      'react-dom/client$': require.resolve('react-dom/client'),
      'react/jsx-runtime$': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime$': require.resolve('react/jsx-dev-runtime'),
    },
  },
}
