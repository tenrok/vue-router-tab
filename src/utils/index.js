// Loading page components asynchronously
export const importPage = view => () => import(/* webpackChunkName: "p-[request]" */ '../views/' + view + '.vue')
