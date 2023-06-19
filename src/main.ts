import { exec as execSync } from "node:child_process"
import { resolve } from "node:path"
import { promisify } from "node:util"

const exec = promisify(execSync)

export const getRepoUrl = (repo: string) => {
  if (repo.startsWith("git@")) return repo
  if (repo.startsWith("https://") || repo.startsWith("http://")) return repo
  if (repo.startsWith("github:")) return repo.replace(/^github:/, "https://github.com/")
  if (repo.startsWith("gitlab:")) return repo.replace(/^gitlab:/, "https://gitlab.org/")

  const parts = repo.split("/")
  if (parts.length === 2) return `https://github.com/${parts[0]}/${parts[1]}`

  throw new Error(`Invalid repo url: ${repo}`)
}

export const templl = async () => {
  const args = process.argv.slice(2)
  if (args.length !== 2) {
    console.error(`Usage: templl <src> <dst>`)
    process.exit(1)
  }

  const [src, dst = "."] = args
  const repo = getRepoUrl(src)

  const cmds = [
    `git clone --depth 1 ${repo} ${dst}`,
    `rm -rf ${resolve(dst, ".git")}`,
    `cd ${dst} && git init`,
  ]

  for (const cmd of cmds) {
    console.log(`> ${cmd}`)
    const { stdout, stderr } = await exec(cmd)
    console.log(`${stdout}${stderr}`)
  }

  console.log(`Done! Now run:\n\n  cd ${dst}`)
}
