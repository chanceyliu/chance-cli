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
let proName = "";
commander_1.program.arguments("[name]").action((name) => {
    proName = name;
});
commander_1.program.parse(process.argv);
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
    (0, download_git_repo_1.default)("chanceyliu/basic-react-template", proName, (err) => {
        if (err) {
            signale_1.default.error(err);
        }
        else {
            const fileRoad = `${proName}/package.json`;
            let oldContent = node_fs_1.default.readFileSync(fileRoad).toString();
            let newContent = {
                ...JSON.parse(oldContent),
                name: proName,
                version: '1.0.0'
            };
            node_fs_1.default.writeFileSync(fileRoad, JSON.stringify(newContent, null, '\t'));
            signale_1.default.success(`${proName} 创建成功`);
        }
    });
}
