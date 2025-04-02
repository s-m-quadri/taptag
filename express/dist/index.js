"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const genericRes = __importStar(require("./controllers/generic.controller"));
const db_config_1 = __importDefault(require("./configurations/db.config"));
const env_config_1 = __importDefault(require("./configurations/env.config"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const reader_router_1 = __importDefault(require("./routes/reader.router"));
const tag_router_1 = __importDefault(require("./routes/tag.router"));
const http_1 = require("http");
// Express app
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Middlewares
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
// Routes
app.get("/", (_, res) => res.status(200).json({ msg: `Server is live in ${env_config_1.default.ENV}!` }));
app.use("/auth", auth_router_1.default);
app.use("/user", user_router_1.default);
app.use("/reader", reader_router_1.default);
app.use("/tag", tag_router_1.default);
app.all("*", (req, res) => genericRes.pageNotFound(req, res));
// Driver function
async function main() {
    await (0, db_config_1.default)();
    server.listen(env_config_1.default.PORT, () => console.info(`[success] Done! ${env_config_1.default.ENV} environment at port "${env_config_1.default.PORT}".`));
}
// Start the server
main();
