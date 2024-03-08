import Koa from "koa";
const app = new Koa();
app.use(async (ctx) => {
  ctx.body = "Change Me and Refresh to see HMR!!!";
});
{
  app.listen(3e3);
  console.log("running on http://localhost:3000");
}
const viteNodeApp = app;
export {
  viteNodeApp
};
