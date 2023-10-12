#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const colors_1 = __importDefault(require("colors"));
const download_git_repo_1 = __importDefault(require("download-git-repo"));
const signale_1 = __importDefault(require("signale"));
const node_fs_1 = __importDefault(require("node:fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
let proName = "";
// 当前路径
let dest;
commander_1.program.arguments("[name]").action((name) => {
    proName = name;
    dest = node_path_1.default.resolve(process.cwd(), proName);
});
commander_1.program.parse(process.argv);
const run = async () => {
    if (!proName) {
        signale_1.default.warn(`请填写项目名称: ${colors_1.default.green("create-app <project-directory>")}`);
        process.exit(1);
    }
    if (node_fs_1.default.existsSync(proName)) {
        signale_1.default.warn(`${proName} 项目已存在，请检查`);
        process.exit(1);
    }
    else {
        signale_1.default.pending("创建中");
        await (0, download_git_repo_1.default)("chanceyliu/basic-react-template", proName, (err) => {
            if (err) {
                signale_1.default.error(err);
            }
            else {
                const fileRoad = `${proName}/package.json`;
                let oldContent = node_fs_1.default.readFileSync(fileRoad).toString();
                let newContent = {
                    ...JSON.parse(oldContent),
                    name: proName,
                    version: "1.0.0",
                };
                node_fs_1.default.writeFileSync(fileRoad, JSON.stringify(newContent, null, "\t"));
            }
        });
        await inquirer_1.default
            .prompt([
            {
                type: "confirm",
                name: "install",
                message: "是否安装依赖",
            },
        ])
            .then((res) => {
            if (res.install) {
                signale_1.default.pending("Installing 📦 \n");
                const isWin32 = process.platform === "win32";
                const subProcess = (0, node_child_process_1.spawnSync)(isWin32 ? "npm.cmd" : "npm", ["install", "--legacy-peer-deps"], {
                    stdio: "inherit",
                    cwd: dest,
                });
                if (subProcess.status === 1) {
                    signale_1.default.error("😕  安装依赖出错, 请自行安装依赖");
                }
                else {
                    signale_1.default.success("安装完成 👨‍💻‍!!!");
                }
            }
        });
        signale_1.default.success(`${proName} 创建成功`);
    }
};
run();
