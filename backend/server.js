import connectDB from './db/index.js';
import { app } from './app.js';
connectDB()
    .then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on http://localhost:${process.env.PORT}`);
    });
    app.on("error", (error) => {
        console.error("ERROR in server CONNECTION", error);
        process.exit(1);
    });
})
    .catch((err) => {
    console.log("MONGODB CONNECTION FAILED !!!", err);
});
//# sourceMappingURL=server.js.map