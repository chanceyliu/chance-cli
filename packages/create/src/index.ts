#!/usr/bin/env node

import { program } from "commander";
import colors from "colors";
import download from "download-git-repo";
import signale from "signale";
import fs from "node:fs";
import inquirer from "inquirer";
import { spawnSync } from "node:child_process";
import path from "node:path";

let proName = "";
// 当前路径
let dest: string;

program.arguments("[name]").action((name) => {
  proName = name;
  dest = path.resolve(process.cwd(), proName);
});

program.parse(process.argv);

const run = async () => {
  if (!proName) {
    signale.warn(
      `请填写项目名称: ${colors.green("create-app <project-directory>")}`
    );
    process.exit(1);
  }

  if (fs.existsSync(proName)) {
    signale.warn(`${proName} 项目已存在，请检查`);
    process.exit(1);
  } else {
    signale.pending("创建中");

    await download("chanceyliu/basic-react-template", proName, (err: any) => {
      if (err) {
        signale.error(err);
      } else {
        const fileRoad = `${proName}/package.json`;
        let oldContent = fs.readFileSync(fileRoad).toString();
        let newContent = {
          ...JSON.parse(oldContent),
          name: proName,
          version: "1.0.0",
        };

        fs.writeFileSync(fileRoad, JSON.stringify(newContent, null, "\t"));
      }
    });

    await inquirer
      .prompt([
        {
          type: "confirm",
          name: "install",
          message: "是否安装依赖",
        },
      ])
      .then((res) => {
        if (res.install) {
          signale.pending("Installing 📦 \n");

          const isWin32 = process.platform === "win32";
          const subProcess = spawnSync(
            isWin32 ? "npm.cmd" : "npm",
            ["install", "--legacy-peer-deps"],
            {
              stdio: "inherit",
              cwd: dest,
            }
          );

          if (subProcess.status === 1) {
            signale.error("😕  安装依赖出错, 请自行安装依赖");
          } else {
            signale.success("安装完成 👨‍💻‍!!!");
          }
        }
      });

    signale.success(`${proName} 创建成功`);
  }
};

run();
