/* global module */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-feature-to-feature",
      severity: "error",
      from: { path: "^src/features/([^/]+)/" },
      to: { path: "^src/features/", pathNot: "^src/features/$1/" },
    },
    {
      name: "no-ui-to-app",
      severity: "error",
      from: { path: "^src/components/ui/" },
      to: { path: "^src/", pathNot: "^src/components/ui/" },
    },
    {
      name: "no-icons-to-app",
      severity: "error",
      from: { path: "^src/components/icons/" },
      to: { path: "^src/", pathNot: "^src/components/icons/" },
    },
    {
      name: "no-feature-to-routes",
      severity: "error",
      from: { path: "^src/features/" },
      to: { path: "^src/(routes/|routeTree\\.gen\\.ts$|main\\.tsx$)" },
    },
    {
      name: "no-stores-to-app",
      severity: "error",
      from: { path: "^src/stores/" },
      to: { path: "^src/", pathNot: "^src/(stores|data|styles|theme|lib)/" },
    },
    {
      name: "no-mocks-outside-entry",
      severity: "error",
      from: {
        path: "^src/(features|routes|layouts|components|stores|data|lib|styles|theme|api|i18n)/",
      },
      to: { path: "^src/mocks/" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
  },
};
