#!/usr/bin/env node

import { program } from "commander";
import colors from "colors";
import download from "download-git-repo";
import signale from "signale";
import fs from "node:fs";

let proName = "";

program.arguments("[name]").action((name) => {
  proName = name;
});

program.parse(process.argv);

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
  download("chanceyliu/basic-react-template", proName, (err: any) => {
    if (err) {
      signale.error(err);
    } else {

      const fileRoad = `${proName}/package.json`
      let oldContent = fs.readFileSync(fileRoad).toString()
      let newContent = {
        ...JSON.parse(oldContent),
        name: proName,
        version: '1.0.0'
      }

      fs.writeFileSync(fileRoad, JSON.stringify(newContent, null, '\t'))

      signale.success(`${proName} 创建成功`);
    }
  });
}


